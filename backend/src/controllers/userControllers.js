const User = require('../models/Users');

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

module.exports = { getUser, updateUser, deleteUser };




