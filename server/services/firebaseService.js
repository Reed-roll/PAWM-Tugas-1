const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccountKey.json');

let db;

try {
    // Check if Firebase is already initialized
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }

    db = admin.firestore();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error; // Let the application handle the error instead of forcing exit
}

// Export both the database instance and admin for flexibility
module.exports = {
    db,
    admin
};