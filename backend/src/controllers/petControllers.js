const Pet = require('../models/Pets');
const User = require('../models/Users');
const { AdoptionInfo, VetInfo, Vaccination, Medication } = require('../models/MedicalHistory');
const SharedPets = require('../models/SharedPets');
const PetWeight = require('../models/PetWeight');
const sequelize = require('../config/database');


async function createPet(req, res, next) {
    try {
        const { ownerId, userId, ...rest } = req.body;
        let imageBuffer = null;
    
        if (req.file) {
          imageBuffer = req.file.buffer;
        }
    
        const pet = await Pet.create({
          ...rest,
          ownerId,
          userId,
          image: imageBuffer,
        });
    
        // Convert binary image data to Base64
        if (pet.image) {
          pet.image = pet.image.toString('base64');
        }
    
        res.status(201).json({ message: "Pet created!", pet });
    } catch (err) {
    console.error("Error creating pet:", err);
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

        // convert image field to Base64
        pets.forEach(pet => {
            if (pet.image) {
                pet.image = pet.image.toString('base64');
            }
        });
        
        res.json(pets);
    } catch (err) {
        console.error('Error fetching pets:', err);
        res.status(500).json({ message: "Could not find pets for user" });
    }
}


async function updatePet(req, res, next) {
    // console.log("req:", req);
    // console.log("res:", res);
    const { id, name, type, breed, dateOfBirth, careInstructions } = req.body; // Ensure 'id' is included in the request body
    console.log("name:", name);
    console.log("type:", type);
    console.log("breed:", breed);
    console.log("dateOfBirth:", dateOfBirth);
    console.log("careInstructions:", careInstructions);
    
    try {
        // Start a transaction
        const transaction = await sequelize.transaction();

        // Update the pet record
        const [affectedRows] = await Pet.update(
            {
                name,
                type,
                breed,
                dateOfBirth,
                careInstructions,
            },
            {
                where: { id }, // Specify which pet to update
                transaction,
            }
        );

        if (affectedRows === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: "Pet not found or no changes made" });
        }

        // Commit the transaction
        await transaction.commit();
        res.status(200).json({ message: 'Pet updated successfully' });
    } catch (error) {
        console.error('Error updating pet data:', error);
        res.status(500).json({ message: 'Failed to update pet data', error });
    }
};

async function deletePet(req, res) {
    try {
        const pet = await Pet.findByPk(req.params.id);
        if (pet) {
            await pet.destroy();
            res.json({ message: 'Pet deleted' });
        } else {
            res.status(404).json({ message: 'Pet not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

async function getPetById(req, res, next) {
    const userId = req.headers.userid; // Read userId from headers
    // console.log("User ID (from headers):", userId);
    try {
        const pet = await Pet.findByPk(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        // Determine if the logged-in user is the owner of the pet
        const isOwner = pet.ownerId === userId;
        // console.log("pet.ownerid:", pet.ownerId);
        // console.log("userId:", userId);
        // console.log("isOwner:", isOwner);

        // convert binary data to Base64 string if image exists
        if (pet.image) {
            pet.image = pet.image.toString('base64');
        }

        res.json({
            ...pet.toJSON(),
            isOwner: isOwner
        });
    } catch (err) {
        console.error("Error fetching pet profile by ID:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getAdoptionInfo(req, res) {
    const { petId } = req.params;
    // console.log("Fetching pet adoption info by ID:", req.params.id);
    try {
        const adoptionInfo = await AdoptionInfo.findOne({ where: { petId } });
        // console.log(adoptionInfo);

        // pass empty data to avoid null info
        if (!adoptionInfo) {
            return res.status(200).json({
                shelterName: 'N/A',
                shelterAddress: 'N/A',
                phoneNumber: 'N/A',
                adoptionDate: 'N/A',
            });
        }

        res.json(adoptionInfo);
    } catch (error) {
        console.error('Error fetching adoption info:', error);
        res.status(500).json({ message: error.message });
    }
}

async function updateAdoptionInfo(req, res) {
    const { petId } = req.params;
    const { shelterName, shelterAddress, phoneNumber, adoptionDate } = req.body;
    console.log("Details about rew.parmas and req.body:",
        "\npetID:", petId,
        "\nshelterName:", shelterName,
        "\nshelterAddress:", shelterAddress,
        "\nphoneNumber:", phoneNumber,
        "\nadoptionDate:", adoptionDate,
    );

    try {
        const adoptionInfo = await AdoptionInfo.findOne({ where: { petId } });

        if (!adoptionInfo) {
            // create entry in adoption info table if it doesnt exist
            const newAdoptionInfo = await AdoptionInfo.create({
                petId,
                shelterName,
                shelterAddress,
                phoneNumber,
                adoptionDate
            });
            return res.status(201).json({ message: 'Adoption info created successfully.', newAdoptionInfo });
        }

        // create entry in table if it doesnt exist
        await adoptionInfo.update({
            shelterName,
            shelterAddress,
            phoneNumber,
            adoptionDate
        });

        res.status(200).json({ message: 'Adoption info updated successfully.' });
    } catch (err) {
        console.error('Error updating adoption info:', err);
        res.status(500).json({ message: 'Failed to update adoption info', error: err });
    }
}

// Fetch vet info
async function getVetInfo(req, res) {
    // console.log("Pet ID using req.params:", req.params.id);

    try {
        const vetInfo = await VetInfo.findOne({ where: { petId: req.params.petId } });
        
        if (!vetInfo) {
            return res.status(200).json({
                vetName: 'N/A',
                phoneNumber: 'N/A',
                officeAddress: 'N/A',
            });
        }

        res.status(200).json(vetInfo);
    } catch (err) {
        console.error('Error fetching vet info:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Update vet info
async function updateVetInfo(req, res) {
    const { petId } = req.params;
    const { vetName, phoneNumber, officeAddress } = req.body;

    // console.log('Received petId:', petId);

    try {
        const vetInfo = await VetInfo.findOne({ where: { petId } });

        // create entry in vet info table if it doesnt exist
        if (!vetInfo) {
            const newVetInfo = await VetInfo.create({
                petId,
                vetName,
                phoneNumber,
                officeAddress,
            });
            return res.status(201).json({ message: 'Vet info created successfully.', newVetInfo });
        }

        await vetInfo.update({
            vetName,
            phoneNumber,
            officeAddress,
        });

        res.status(200).json({ message: 'Vet info updated successfully.' });
    } catch (error) {
        console.error('Error updating vet info:', error);
        res.status(500).json({ message: 'Failed to update vet info', error });
    }
}

async function getVaccinations(req, res) {
    // console.log("Fetching pet vaccination history by ID:", req.params.id);
    try {
        const vaccinations = await Vaccination.findAll({ where: { petId: req.params.id } });
        // console.log(vaccinations);

        // pass empty data to avoid null info
        if (!vaccinations) {
            return res.status(200).json({
                vaccinationName: 'N/A',
                vaccinationDate: 'N/A',
                vetName: 'N/A',
                dueDate: 'N/A',
            });
        }
        
        res.json(vaccinations);
    } catch (error) {
        console.error('Error fetching vaccinations:', error);
        res.status(500).json({ message: error.message });
    }
}

async function getMedications(req, res) {
    // console.log("Fetching pet medications by ID:", req.params.id);
    try {
        const medications = await Medication.findAll({ where: { petId: req.params.id } });
        // console.log(medications);
        
        // pass empty data to avoid null info
        if (!medications) {
            return res.status(200).json({
                medicationName: 'N/A',
                medicationDate: 'N/A',
                vetName: 'N/A',
                dueDate: 'N/A',
                dosage: 'N/A',
                frequency: 'N/A',
                notes: 'N/A',
            });
        }
        
        res.json(medications);
    } catch (error) {
        console.error('Error fetching medications:', error);
        res.status(500).json({ message: error.message });
    }
}

async function sharePetProfile(req, res) {
    // console.log("Fetching pet adoption info by email");
    const { petId, targetEmail } = req.body;
    try {
        // Find the target user by email
        const targetUser = await User.findOne({ where: { email: targetEmail } });
        // console.log("Associations available on User model:", User.associations);
        
        // console.log("Target user:", targetUser);
        // console.log("Target email:", targetEmail);
        // Log all available methods on targetUser to verify method names
        // console.log("Available methods on targetUser:", Object.keys(targetUser.__proto__));

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Find the pet by petID
        const pet = await Pet.findByPk(petId);
        // console.log("Find pet by petID:", petId);
        // console.log("Found pet:", pet);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        // Share the pet profile with the target user (read-only)
        await targetUser.addSharedPets(pet, { through: { readOnly: true } });

        res.json({ message: `${pet.name}'s pet profile shared with ${targetEmail}` });
    } catch (err) {
        console.error('Error sharing pet profile:', err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getSharedPetProfiles(req, res) {
    const userId = req.headers.userid; // Read userId from headers
    // console.log("User ID (from headers):", userId);

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const sharedPets = await SharedPets.findAll({
            where: { userId: userId, readOnly: true },
            include: [{
                model: Pet,
                attributes: ['id', 'name', 'type', 'breed', 'dateOfBirth', 'careInstructions', 'image', 'adoptionStatus', 'weights']
            }]
        });
        // console.log("Retrieved sharedPets:", sharedPets);

        const petProfiles = sharedPets.map(shared => {
            const pet = shared.Pet;
            if (pet.image) {
                pet.image = pet.image.toString('base64');
            }
            return pet;
        });
        // console.log("Pet profiles mapped from sharedPets:", petProfiles);
        res.json(petProfiles);
    } catch (err) {
        console.error('Error fetching shared pets:', err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function uploadPetImage(req, res) {
    const petId = req.params.id;
    const imageBuffer = req.file.buffer; // The binary data of the uploaded image

    try {
        const pet = await Pet.findByPk(petId);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        // Update the image field in the database
        await pet.update({ image: imageBuffer });

        // Convert the updated image to Base64
        const imagePath = imageBuffer.toString('base64');

        res.json({
            message: "Pet profile picture updated successfully!",
            imagePath: imagePath // Return the updated image as Base64 (to update image as soon as its uploaded)
        });
    } catch (err) {
        console.error("Error updating pet image:", err);
        res.status(500).json({ message: "Failed to update pet profile picture" });
    }
}

async function getPetWeights(req, res) {
    const petId = req.params.id;
    // console.log("Pet ID:", petId);

    try {
        const weights = await PetWeight.findAll({
            where: { petId: petId },
            order: [['date', 'ASC']],  //  ascending order
        });

        if (!weights) {
            return res.status(404).json({ message: 'No weights found for this pet' });
        }

        res.json(weights);
    } catch (error) {
        console.error('Error fetching pet weights:', error);
        res.status(500).json({ message: 'Could not retrieve weights' });
    }
}

async function addPetWeight(req, res) {
    const { id: petId } = req.params;
    const { weight, date } = req.body;
    // console.log("Pet ID:", petId);
    // console.log("Pet weight:", weight);
    // console.log("Weight date:", date);

    try {
        const pet = await Pet.findByPk(petId);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        // Check if user is the owner
        if (pet.ownerId !== req.user.id) {
            return res.status(403).json({ message: "You do not have permission to add a weight to this pet" });
        }
        // console.log("pet.ownerid:", pet.ownerId);
        // console.log("userId:", req.user.id);

        const newWeight = await PetWeight.create({ petId, weight, date });
        res.status(201).json(newWeight);
    } catch (err) {
        console.error("Error adding weight:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = { 
    createPet, 
    getPets, 
    updatePet, 
    deletePet, 
    getPetById, 
    getAdoptionInfo,
    updateAdoptionInfo,
    getVetInfo,
    updateVetInfo,
    getVaccinations,
    getMedications,
    sharePetProfile,
    getSharedPetProfiles,
    uploadPetImage,
    getPetWeights,
    addPetWeight
};
