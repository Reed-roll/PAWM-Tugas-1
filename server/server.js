const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const stateRoutes = require('./routes/stateRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../client/public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/states', stateRoutes);

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/index.html'));
});

app.get('/lab', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/lab.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/register.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;