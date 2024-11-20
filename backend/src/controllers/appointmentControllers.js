const Appointment = require('../models/Appointments');
const PetWeight = require('../models/PetWeight');
const { Vaccination, Medication } = require('../models/MedicalHistory');
const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');


async function createAppointment(req, res, next) {
    try {
        const appointment = await Appointment.create(req.body);
        res.json(appointment);
    } catch (err) {
        res.status(500).json( 'Failed to create' );
    }
};

async function getAppointments(req, res, next) {
    try {
        //return all appointments
        const appointments = await Appointment.findAll();
        res.json(appointments);
    } catch (err) {
        res.status(500).json("No appointments found for pet" + req.body.petId);
    }
};

async function updateAppointment(req, res, next) {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        if (appointment) {
            await appointment.update(req.body);
            res.json({ message: 'Appointment updated' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

async function deleteAppointment(req, res, next) {
    try {
        const appointment = await Appointment.findByPk(req.body.id);
        if (appointment) {
            await appointment.destroy();
            res.json({ message: 'Appointment deleted' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

async function getLastVisitData(req, res) {
    const { petId, vetName } = req.query;
    // console.log('petId:', petId);
    // console.log('vetName:', vetName); 
    
    if (!petId || !vetName) {
        return res.status(400).json({ message: 'Missing petId or vetName in request' });
    }

    try {
        const lastAppointment = await Appointment.findOne({
            where: {
                petId,
                [Sequelize.Op.and]: Sequelize.literal(
                    `(caretaker::jsonb @> :vetNameCondition)`
                ),
            },
            replacements: {
                vetNameCondition: JSON.stringify({ name: vetName }),
            },
            attributes: ['id', 'date', 'time', 'reason', 'petId', 'careTaker', 'notes'],
            order: [['date', 'DESC']],
        });

        // console.log("lastAppointment:", lastAppointment);
        
        if (!lastAppointment) {
            console.log('No matching appointment found for query:', { petId, vetName });
            return res.status(404).json({ message: 'No appointments found for this pet and vet.' });
        }

        const { date: appointmentDate } = lastAppointment;

        const weights = await PetWeight.findAll({
            where: {
                petId,
                date: appointmentDate,
            },
        });

        const vaccinations = await Vaccination.findAll({
            where: {
                petId,
                vaccinationdate: appointmentDate,
            },
        });

        const medications = await Medication.findAll({
            where: {
                petId,
                medicationdate: appointmentDate,
            },
        });

        // console.log("weights:", weights);
        // console.log("vaccinations:", vaccinations);
        // console.log("medications:", medications);

        res.status(200).json({
            appointment: lastAppointment,
            weights,
            vaccinations,
            medications,
        });
    } catch (error) {
        console.error('Error fetching last visit data:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}

async function updateVisitData(req, res) {
    const { petId, vetName, date, reason, weight, medications, vaccinations, notes } = req.body;

    try {
        // Start a transaction
        const transaction = await sequelize.transaction();

        // Create or update the appointment
        const appointment = await Appointment.create(
            {
                petId,
                careTaker: { name: vetName },
                date,
                time: new Date().toTimeString().split(' ')[0], // Current local time
                reason,
                notes,
            },
            { transaction }
        );

        // Update PetWeight
        if (weight) {
            await PetWeight.create(
                {
                    petId,
                    date,
                    weight,
                },
                { transaction }
            );
        }

        // Update Vaccinations if provided and valid
        if (Array.isArray(vaccinations) && vaccinations.length > 0) {
            await Promise.all(
                vaccinations.map((vaccine) =>
                    Vaccination.create(
                        {
                            petId,
                            vaccinationName: vaccine.name,
                            vaccinationDate: date,
                            vetName,
                            dueDate: vaccine.dueDate || null,
                        },
                        { transaction }
                    )
                )
            );
        }

        // Update Medications if provided and valid
        if (Array.isArray(medications) && medications.length > 0) {
            await Promise.all(
                medications.map((medication) =>
                    Medication.create(
                        {
                            petId,
                            medicationName: medication.name,
                            medicationDate: date,
                            vetName,
                            dosage: medication.dosage || null,
                            frequency: medication.frequency || null,
                            notes: medication.notes || null,
                            dueDate: medication.dueDate || null,
                        },
                        { transaction }
                    )
                )
            );
        }

        // Commit the transaction
        await transaction.commit();
        res.status(200).json({ message: 'Visit data updated successfully' });
    } catch (error) {
        console.error('Error updating visit data:', error);
        res.status(500).json({ message: 'Failed to update visit data', error });
    }
}

async function getPreviousAppointments(req, res) {
    const { petId, vetName } = req.query;

    try {
        // Fetch the last visit
        const lastAppointment = await Appointment.findOne({
            where: {
                petId,
                [Sequelize.Op.and]: Sequelize.literal(
                    `(caretaker::jsonb @> :vetNameCondition)`
                ),
            },
            replacements: {
                vetNameCondition: JSON.stringify({ name: vetName }),
            },
            attributes: ['date'], // Only need the date of the last visit
            order: [['date', 'DESC']],
        });

        // If no last appointment found, fetch all previous visits
        const excludeDate = lastAppointment ? lastAppointment.date : null;

        // Fetch previous appointments (excluding the last visit)
        const appointments = await Appointment.findAll({
            where: {
                petId,
                [Sequelize.Op.and]: Sequelize.literal(
                    `(caretaker::jsonb @> :vetNameCondition)`
                ),
                ...(excludeDate && { date: { [Sequelize.Op.lt]: excludeDate } }), // Exclude last visit's date
            },
            replacements: {
                vetNameCondition: JSON.stringify({ name: vetName }),
            },
            attributes: ['id', 'date', 'time', 'reason', 'petId', 'careTaker', 'notes'],
            order: [['date', 'DESC']],
        });

        // Fetch additional details for each appointment
        const appointmentsWithDetails = await Promise.all(
            appointments.map(async (appointment) => {
                const { id, date } = appointment;

                const weights = await PetWeight.findAll({ where: { petId, date } });
                const vaccinations = await Vaccination.findAll({ where: { petId, vaccinationdate: date } });
                const medications = await Medication.findAll({ where: { petId, medicationdate: date } });

                return {
                    ...appointment.toJSON(),
                    weights,
                    vaccinations,
                    medications,
                };
            })
        );

        res.status(200).json(appointmentsWithDetails);
    } catch (error) {
        console.error('Error fetching previous appointments:', error);
        res.status(500).json({ message: 'Failed to fetch previous appointments', error });
    }
}

module.exports = { createAppointment, getAppointments, updateAppointment, deleteAppointment, getLastVisitData, updateVisitData, getPreviousAppointments };