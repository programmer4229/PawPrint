const { Client } = require('pg');
const bcrypt = require('bcrypt');
const fs = require('fs');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // Reject unauthorized SSL certificates
    // ca: fs.readFileSync('./us-east-2-bundle.pem').toString(), // Read the downloaded certificate
  },
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error', err.stack));


const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  return jwt.sign({ id: userId }, secret, { expiresIn: '1h' });
};

async function registerUser(req, res, next) {
  try {
      const passwordHash = await bcrypt.hash(req.body.password, 10);
      
      const user = await User.create(
          {
              name: req.body.name,
              email: req.body.email,
              password: passwordHash,
              phone: req.body.phone,
              address: req.body.address,
              type: req.body.userType
          },
          { fields: ['name', 'email', 'password', 'phone', 'address', 'type'] }
      );

      res.json({ message: 'User registered successfully' });
  } catch (err) {
      console.error("Error registering user:", err);
      res.status(500).json({ message: err.message });
  }
}

async function loginUser(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = generateToken(user.id);
      res.json({
        userId: user.id,
        userName: user.name,
        userType: user.type,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
  
module.exports = {
  registerUser,
  loginUser,
};
