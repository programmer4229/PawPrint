const Pet = require('../models/Pets');

async function createPet(req, res, next) {
    try {
        const pet = await Pet.create(req.body);
        res.json("Pet created!");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

async function getPets(req, res, next) {
    try {
        const pets = await Pet.findAll(pk = req.params.id);
        res.json(pets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

async function updatePet(req, res, next) {
    try {
        const pet = await Pet.findByPk(req.params.id);
        if (pet) {
            await pet.update(req.body);
            res.json({ message: 'Pet updated' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

async function deletePet(req, res) {
    try {
        const pet = await Pet.findByPk(req.params.id);
        if (pet) {
            await pet.destroy();
            res.json({ message: 'Pet deleted' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createPet, getPets, updatePet, deletePet };