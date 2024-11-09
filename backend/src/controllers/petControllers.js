const Pet = require('../models/Pets');
const User = require('../models/Users');
const { AdoptionInfo, Vaccination, Medication } = require('../models/MedicalHistory');

async function createPet(req, res, next) {
    try {
        const pet = await Pet.create(req.body);
        res.json("Pet created!");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

async function getPets(req, res, next) {
    const email = req.query.email; // use query parameters for GET requests
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const pets = await Pet.findAll({ where: { userid: user.id } });
        res.json(pets);
    } catch (err) {
        console.error('Error fetching pets:', err);
        res.status(500).json({ message: "Could not find pets for user" });
    }
}


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

async function getPetById(req, res, next) {
    // console.log("Fetching pet by ID:", req.params.id);
    try {
        const pet = await Pet.findByPk(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }
        res.json(pet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function sharePetProfile(req, res) {
    const { petId, targetEmail } = req.body;
    
    try {
        // Find the target user by email
        const targetUser = await User.findOne({ where: { email: targetEmail } });
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Find the pet
        const pet = await Pet.findByPk(petId);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        // Add the pet to the target user's shared pets
        await targetUser.addPet(pet); // Assuming a many-to-many association exists

        res.json({ message: `Pet profile shared with ${targetEmail}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getAdoptionInfo(req, res) {
    // console.log("Fetching pet adoption info by ID:", req.params.id);
    try {
        const adoptionInfo = await AdoptionInfo.findOne({ where: { petId: req.params.id } });
        // console.log(adoptionInfo);
        if (!adoptionInfo) return res.status(404).json({ message: "No adoption info found" });
        res.json(adoptionInfo);
    } catch (error) {
        console.error('Error fetching adoption info:', error);
        res.status(500).json({ message: error.message });
    }
}

async function getVaccinations(req, res) {
    // console.log("Fetching pet vaccination history by ID:", req.params.id);
    try {
        const vaccinations = await Vaccination.findAll({ where: { petId: req.params.id } });
        // console.log(vaccinations);
        if (!vaccinations.length) return res.status(404).json({ message: "No vaccinations found" });
        res.json(vaccinations);
    } catch (error) {
        console.error('Error fetching vaccinations:', error);
        res.status(500).json({ message: error.message });
    }
}

async function getMedications(req, res) {
    console.log("Fetching pet medications by ID:", req.params.id);
    try {
        const medications = await Medication.findAll({ where: { petId: req.params.id } });
        console.log(medications);
        if (!medications.length) return res.status(404).json({ message: "No medications found" });
        res.json(medications);
    } catch (error) {
        console.error('Error fetching medications:', error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { 
    createPet, 
    getPets, 
    updatePet, 
    deletePet, 
    getPetById, 
    sharePetProfile,
    getAdoptionInfo,
    getVaccinations,
    getMedications
};
