const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv/lib/main');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/public')));

// Routes
app.use('/api/auth', authRoutes);

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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;