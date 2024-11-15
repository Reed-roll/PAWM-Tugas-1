const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../services/firebaseService');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const userDoc = await db.collection('users').doc(username).get();
        if (userDoc.exists) {
            return res.status(409).json({
                success: false,
                message: 'Username already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            username,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        await db.collection('users').doc(username).set(userData);

        console.log(`User ${username} registered successfully`);

        const token = jwt.sign(
            { username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: userData
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {   
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        const userDoc = await db.collection('users').doc(username).get();
        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const userData = userDoc.data();
        const isMatch = await bcrypt.compare(password, userData.password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        console.log(`User ${username} logged in successfully`);

        const token = jwt.sign(
            { username }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                username: userData.username,
                email: userData.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};