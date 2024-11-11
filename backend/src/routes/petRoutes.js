const express = require('express');
const router = express.Router();
const multer = require('multer');
const petControllers = require('../controllers/petControllers');
const authMiddleware = require('../middleware/authMiddleware');

// existing routes
router.post('/create', authMiddleware, petControllers.createPet);
router.get('/get', authMiddleware, petControllers.getPets);
router.patch('/profile/:id', authMiddleware, petControllers.updatePet);
router.delete('/profile/:id', authMiddleware, petControllers.deletePet);

// route to get pet profile by ID
router.get('/profile/:id', authMiddleware, petControllers.getPetById);

// routes to get medical info
router.get('/profile/:id/adoption', authMiddleware, petControllers.getAdoptionInfo);
router.get('/profile/:id/vaccination', authMiddleware, petControllers.getVaccinations);
router.get('/profile/:id/medication', authMiddleware, petControllers.getMedications);

// route to get weights for a specific pet
router.get('/profile/:id/weights', authMiddleware, petControllers.getPetWeights);
// pet route to add pet weights
router.post('/profile/:id/add-weight', authMiddleware, petControllers.addPetWeight);

// route to share pet profile with another user by email
router.post('/share', authMiddleware, petControllers.sharePetProfile);

// route for fetching pet profiles shared with non-owner user
router.get('/shared', authMiddleware, petControllers.getSharedPetProfiles);

// configure Multer to store image in memory
const storage = multer.memoryStorage(); // Set up memory storage
const upload = multer({ storage: storage });

// route to upload pet image
router.post('/:id/upload', upload.single('image'), petControllers.uploadPetImage);


module.exports = router;
