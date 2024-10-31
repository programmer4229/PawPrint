const Pet = require('../models/Pets');
const User = require('../models/Users');

async function createPet(req, res, next) {
    try {
        const pet = await Pet.create(req.body);
        res.json("Pet created!");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

async function getPets(req, res, next) {
    const email = req.body.email;
    const user = await User.findOne({ where: { email } });
    try {
        const pets = await Pet.findAll({ where: { ownerId: user.id } });
        res.json(pets);
    } catch (err) {
        res.status(500).json({ message: "Could not find pets for user" });
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