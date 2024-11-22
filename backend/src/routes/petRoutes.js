const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const petControllers = require('../controllers/petControllers');
const authMiddleware = require('../middleware/authMiddleware');
const sequelize = require('../config/database');


// existing routes
router.post('/create', authMiddleware, upload.single('image'), petControllers.createPet);
router.post('/update', authMiddleware, upload.single('image'), petControllers.updatePet);
router.get('/get', authMiddleware, petControllers.getPets);
router.patch('/profile/:id', authMiddleware, petControllers.updatePet);
router.delete('/profile/:id', authMiddleware, petControllers.deletePet);

// route to get pet profile by pet ID
router.get('/profile/:id', authMiddleware, petControllers.getPetById);

// route to get pet by owner ID
router.get('/owner/:ownerId', authMiddleware, async (req, res) => {
    const { ownerId } = req.params;

    try {
        const pets = await sequelize.query(
            `
            SELECT
                id, name, type, breed, image
            FROM
                Pets
            WHERE
                ownerId = :ownerId;
            `,
            { replacements: { ownerId }, type: sequelize.QueryTypes.SELECT }
        );
        res.json(pets);
    } catch (err) {
        console.error('Error fetching pets:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// routes to get medical info
router.get('/adoption/:petId', authMiddleware, petControllers.getAdoptionInfo);
router.put('/adoption/:petId', authMiddleware, petControllers.updateAdoptionInfo);
router.get('/profile/:id/vaccination', authMiddleware, petControllers.getVaccinations);
router.get('/profile/:id/medication', authMiddleware, petControllers.getMedications);
router.get('/vet/:petId', authMiddleware, petControllers.getVetInfo);
router.put('/vet/:petId', authMiddleware, petControllers.updateVetInfo);

// route to get weights for a specific pet
router.get('/profile/:id/weights', authMiddleware, petControllers.getPetWeights);
// pet route to add pet weights
router.post('/profile/:id/add-weight', authMiddleware, petControllers.addPetWeight);

// route to share pet profile with another user by email
router.post('/share', authMiddleware, petControllers.sharePetProfile);

// route for fetching pet profiles shared with non-owner user
router.get('/shared', authMiddleware, petControllers.getSharedPetProfiles);

// route to upload pet image
router.post('/:id/upload', upload.single('image'), petControllers.uploadPetImage);


module.exports = router;
