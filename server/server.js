// server/server.js
const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const authRoutes = require('./routes/authRoutes');

// Serve static files from client/public directory
app.use(express.static(path.join(__dirname, '../client/public')));

// Parse JSON bodies
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/register.html'));
});

app.get('/lab', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/views/lab.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
