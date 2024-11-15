const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointment, deleteAppointment } = require('../controllers/appointmentControllers');

router.post('/create', createAppointment);
router.get('/get', getAppointments);
router.patch('/profile/:id', updateAppointment);
router.delete('/profile/:id', deleteAppointment);

module.exports = router;