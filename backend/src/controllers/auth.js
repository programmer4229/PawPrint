const { Client } = require('pg');
const bcrypt = require('bcrypt');
const fs = require('fs');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');

const client = new Client({
  host: 'database-1.cd6ky6cymg3c.us-east-2.rds.amazonaws.com',
  user: 'admin_test',
  password: 'AlmostFullAdmin07?',
  database: 'testdb',
  port: 54327,
  ssl: {
    rejectUnauthorized: true, // Reject unauthorized SSL certificates
    ca: fs.readFileSync('./us-east-2-bundle.pem').toString(), // Read the downloaded certificate
  },
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error', err.stack));


const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  return jwt.sign({ id: userId }, secret, { expiresIn: '24h' });
};

async function registerUser(req, res, next) {
  const user = User.build({ ...req.body });
  const passwordHash = await bcrypt.hash(user.password, 10);
  user.password = passwordHash;
  try {
    await user.save();
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// async function registerUser(username, password) {
//   try {
//     const saltRounds = 10;
//     const passwordHash = await bcrypt.hash(password, saltRounds);

//     const query = 'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id';
//     const values = [username, passwordHash];

//     const res = await client.query(query, values);
//     console.log('User registered with ID:', res.rows[0].id);
//   } catch (err) {
//     console.error('Error registering user:', err);
//   }
// }


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
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
// async function loginUser(username, password) {
//     try {
//       const query = 'SELECT password_hash FROM users WHERE username = $1';
//       const values = [username];
  
//       const res = await client.query(query, values);
  
//       if (res.rows.length === 0) {
//         console.log('User not found');
//         return false;
//       }
  
//       const passwordHash = res.rows[0].password_hash;
  
//       const isMatch = await bcrypt.compare(password, passwordHash);
  
//       if (isMatch) {
//         console.log('Login successful');
//         return true;
//       } else {
//         console.log('Invalid password');
//         return false;
//       }
//     } catch (err) {
//       console.error('Error logging in user:', err);
//       return false;
//     }
//   }
  
module.exports = {
  registerUser,
  loginUser,
};
// registerUser('chrispark2003', '123456');
// loginUser('chrispark2003', '12345'); 
