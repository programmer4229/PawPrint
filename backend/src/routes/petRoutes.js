// import router and controllers
const express = require('express');
const router = express.Router();
const petControllers = require('../controllers/petControllers');

// existing routes
router.post('/create', petControllers.createPet);
router.get('/get', petControllers.getPets);
router.patch('/profile/:id', petControllers.updatePet);
router.delete('/profile/:id', petControllers.deletePet);

// route to get pet profile by ID
router.get('/profile/:id', petControllers.getPetById);

// routes to get medical info
router.get('/profile/:id/adoption', petControllers.getAdoptionInfo);
router.get('/profile/:id/vaccination', petControllers.getVaccinations);
router.get('/profile/:id/medication', petControllers.getMedications);

// route to share pet profile with another user by email
router.post('/share', petControllers.sharePetProfile);


module.exports = router;
