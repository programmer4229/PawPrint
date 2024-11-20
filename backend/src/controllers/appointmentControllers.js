const Appointment = require('../models/Appointments');
const PetWeight = require('../models/PetWeight');
const { Vaccination, Medication } = require('../models/MedicalHistory');
const { Sequelize } = require('sequelize');


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
    console.log('petId:', petId);
    console.log('vetName:', vetName); 
    
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

        console.log("lastAppointment:", lastAppointment);
        
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

        console.log("weights:", weights);
        console.log("vaccinations:", vaccinations);
        console.log("medications:", medications);

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

module.exports = { createAppointment, getAppointments, updateAppointment, deleteAppointment, getLastVisitData };