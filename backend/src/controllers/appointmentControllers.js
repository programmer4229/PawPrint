const Appointment = require('../models/Appointments');

async function createAppointment(req, res, next) {
    try {
        const appointment = await Appointment.create(req.body);
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

async function getAppointments(req, res, next) {
    try {
        const appointments = await Appointment.findAll(pk = req.params.id);
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
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
        const appointment = await Appointment.findByPk(req.params.id);
        if (appointment) {
            await appointment.destroy();
            res.json({ message: 'Appointment deleted' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createAppointment, getAppointments, updateAppointment, deleteAppointment };