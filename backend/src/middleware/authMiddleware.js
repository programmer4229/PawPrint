const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Expect a "Bearer <token>" format
    // console.log("req.headers.authorization?.split(' ')", req.headers.authorization?.split(' '));

    if (!token) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        // console.log("Decoded token:", decoded);
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        console.error("Token error:", error.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
