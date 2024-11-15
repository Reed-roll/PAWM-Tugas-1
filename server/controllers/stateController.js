const { db } = require('../services/firebaseService');

exports.saveState = async (req, res) => {
    const { name, mass, gravity, force, angle, friction, position, velocity, acceleration } = req.body;
    const username = req.user.username;

    try {
        const stateData = {
            name,
            mass,
            gravity,
            force,
            angle,
            friction,
            position,
            velocity,
            acceleration,
            createdAt: new Date().toISOString()
        };

        await db.collection('users').doc(username).collection('states').doc(name).set(stateData);

        console.log(`State ${name} saved for user ${username}`);

        return res.status(201).json({
            success: true,
            message: 'State saved successfully',
            state: stateData
        });

    } catch (error) {
        console.error('Error saving state:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.getSavedStates = async (req, res) => {
    const username = req.user.username;

    try {
        const statesSnapshot = await db.collection('users').doc(username).collection('states').get();
        const savedStates = statesSnapshot.docs.map(doc => doc.data());

        return res.status(200).json(savedStates);
    } catch (error) {
        console.error('Error fetching saved states:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};