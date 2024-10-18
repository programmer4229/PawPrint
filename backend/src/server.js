const express = require('express');
const { Client } = require('pg');
const { registerUser, loginUser } = require('./auth');
const app = express();
const PORT = process.env.PORT || 51007;

// PostgreSQL client setup
const client = new Client({
    host: 'database-1.cd6ky6cymg3c.us-east-2.rds.amazonaws.com',
    user: 'admin_test',
    password: 'AlmostFullAdmin07?',
    database: 'testdb',
    port: 54327,
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect();

// Middleware to parse JSON bodies
app.use(express.json());

// Route to get dogs
app.get('/api/dogs', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM "Dogs"'); // Adjust table name as necessary
        console.log(result.rows); // Log the result to see the data
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// route to handle user registration
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        await registerUser(username, password);
        res.status(200).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// route to authenticate a user
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const isValidUser = await loginUser(username, password);
        if (isValidUser) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
