const { Client } = require('pg');
const bcrypt = require('bcrypt');
const fs = require('fs');
const express = require('express');
const router = express.Router();

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('./us-east-2-bundle.pem').toString(),
  },
});
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error', err.stack));

export const registerUser = async ({ username, password }) => {
  try {
    
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    console.log('Inside auth.js/registerUser');
    const query = 'INSERT INTO "Owners" ("username", "email", "salt", "passhash") VALUES ($1, $2, $3, $4) RETURNING "id"';
    const values = [username, email, salt, passwordHash];    

    await client.query(query, values);
    console.log('User registered with ID:', res.rows[0].id);
    return true;
  } catch (err) {
    console.error('Error registering user:', err);
    return false;
  }
}

export const loginUser = async ({ username, password }) => {
    try {
      console.log('Inside auth.js/loginUser')
      const query = 'SELECT "passhash" FROM "Owners" WHERE "username" = $1';
      const values = [username];
  
      const res = await client.query(query, values);
      console.log(res)
  
      if (res.rows.length === 0) {
        console.log('User not found');
        return false;
      }
  
      const passwordHash = res.rows[0].passhash;
      console.log(passwordHash)
      console.log(password)
  
      // const isMatch = await bcrypt.compare(password, passwordHash);
      const isMatch = password === passwordHash;  // test value
      
      if (isMatch) {
        console.log('Login successful');
        return true;
      } else {
        console.log('Invalid password');
        return false;
      }
    
    } catch (err) {
      console.error('Error logging in user:', err);
      return false;
    }
  }
  
  router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const result = await registerUser({ username, password });
    if (result) {
      res.status(201).send('User registered successfully');
    } else {
      res.status(500).send('Error registering user');
    }
  });
  
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const result = await loginUser({ username, password });
    if (result) {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid username or password');
    }
  });
  
  module.exports = { router, loginUser, registerUser };
// registerUser('chrispark2003', '123456');
// loginUser('chrispark2003', '12345'); 