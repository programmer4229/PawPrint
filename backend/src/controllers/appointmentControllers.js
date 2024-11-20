const Appointment = require('../models/Appointments');
const Pets = require('../models/Pets');

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

module.exports = { createAppointment, getAppointments, updateAppointment, deleteAppointment };