const User = require('../models/Users');
const sequelize = require('../config/database');


const getUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const updateUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.update(req.body);
            res.json({ message: 'User updated' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.json({ message: 'User deleted' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

async function getOwnersForVet(req, res, next) {
    const vetId = req.user.id; // Get vet's ID from authMiddleware

    try {
        const owners = await sequelize.query(
            `
            SELECT DISTINCT
                u.id AS owner_id,
                u.name AS owner_name,
                u.email AS owner_email,
                u.phone AS owner_phone,
                u.address AS owner_address,
                p.id AS pet_id,
                p.name AS pet_name,
                p.type AS pet_type,
                p.breed AS pet_breed,
                p.dateOfBirth AS pet_dob,
                p.image AS pet_image
            FROM                        
                Users u
            JOIN                   
                Pets p ON u.id = p.ownerId
            JOIN                          
                Appointments a ON p.id = a.petId
            WHERE                               
                u.type = 'Owner'                            
                AND a.careTaker->>'name' = (
                    SELECT CONCAT(name) FROM Users WHERE id = :vetId
                );
            `,
            {
                replacements: { vetId },
                type: sequelize.QueryTypes.SELECT
            }
        );

        const groupedOwners = owners.reduce((acc, row) => {
            const ownerId = row.owner_id;
            if (!acc[ownerId]) {
                acc[ownerId] = {
                    owner_id: row.owner_id,
                    owner_name: row.owner_name,
                    owner_email: row.owner_email,
                    owner_phone: row.owner_phone,
                    owner_address: row.owner_address,
                    pets: [],
                };
            }

            // Convert image to base64 if it exists
            const petImage = row.pet_image
                ? `data:image/png;base64,${Buffer.from(row.pet_image, 'binary').toString('base64')}`
                : null;

            // console.log("Pets:", acc[ownerId].pets);
            acc[ownerId].pets.push({
                pet_id: row.pet_id,
                pet_name: row.pet_name,
                pet_type: row.pet_type,
                pet_breed: row.pet_breed,
                pet_dob: row.pet_dob,
                pet_image: petImage,
            });
            return acc;
        }, {});

        // debug output to log a simplified version of owners and their pets
        // console.log(
        //     "Owner and Pets Mapping:",
        //     Object.values(groupedOwners).map((owner) => ({
        //       ...owner,
        //       pets: owner.pets.map((pet) => ({
        //         pet_id: pet.pet_id,
        //         pet_name: pet.pet_name,
        //         pet_breed: pet.pet_breed,
        //       })),
        //     }))
        // );

        res.json(Object.values(groupedOwners));
    } catch (err) {
        console.error('Error fetching owners:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getUser, updateUser, deleteUser, getOwnersForVet };




