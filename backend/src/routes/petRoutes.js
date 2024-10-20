const express = require('express');
const router = express.Router();
const petControllers = require('../controllers/petControllers');


router.post('/create', petControllers.createPet);
router.get('/', petControllers.getPets);
router.patch('/profile/:id', petControllers.updatePet);
router.delete('/profile/:id', petControllers.deletePet);

module.exports = router;