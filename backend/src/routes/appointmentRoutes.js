const express = require('express');
const router = express.Router();
const apptControllers = require('../controllers/appointmentControllers');

router.post('/create/', apptControllers.createAppointment);
router.get('/get', apptControllers.getAppointments);
router.patch('/profile/:id', apptControllers.updateAppointment);
router.delete('/profile', apptControllers.deleteAppointment);

module.exports = router;