const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const apptControllers = require('../controllers/appointmentControllers');

router.post('/create/', apptControllers.createAppointment);
router.get('/get', apptControllers.getAppointments);
router.get('/last-visit', authMiddleware, apptControllers.getLastVisitData);
router.get('/previous-visits', authMiddleware, apptControllers.getPreviousAppointments);
router.patch('/profile/:id', apptControllers.updateAppointment);
router.delete('/profile', apptControllers.deleteAppointment);
router.post('/update', apptControllers.updateVisitData);

module.exports = router;