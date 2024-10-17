const { Client } = require('pg');
const bcrypt = require('bcrypt');
const fs = require('fs');

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

async function registerUser(username, password) {
  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const query = 'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id';
    const values = [username, passwordHash];

    const res = await client.query(query, values);
    console.log('User registered with ID:', res.rows[0].id);
  } catch (err) {
    console.error('Error registering user:', err);
  }
}

async function loginUser(username, password) {
    try {
      const query = 'SELECT password_hash FROM users WHERE username = $1';
      const values = [username];
  
      const res = await client.query(query, values);
  
      if (res.rows.length === 0) {
        console.log('User not found');
        return false;
      }
  
      const passwordHash = res.rows[0].password_hash;
  
      const isMatch = await bcrypt.compare(password, passwordHash);
  
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
  
module.exports = {
  registerUser,
  loginUser,
};
// registerUser('chrispark2003', '123456');
// loginUser('chrispark2003', '12345'); 
