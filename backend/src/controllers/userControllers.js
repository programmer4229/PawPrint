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
                u.address AS owner_address
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
            { replacements: { vetId }, type: sequelize.QueryTypes.SELECT }
        );
        res.json(owners);
    } catch (err) {
        console.error('Error fetching owners:', err);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        await sequelize.close(); // Ensure connection is closed
    }
}

module.exports = { getUser, updateUser, deleteUser, getOwnersForVet };




