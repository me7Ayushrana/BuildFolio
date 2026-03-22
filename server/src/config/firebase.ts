import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

let adminApp;

if (!admin.apps.length) {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

    if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        adminApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } else {
        console.warn('Firebase Admin SDK: Service account file not found. Token verification will fail unless provided via environment variables.');
        // Note: You can also use individual environment variables for configuration
        adminApp = admin.initializeApp({
            credential: admin.credential.applicationDefault(), // Fallback
        });
    }
} else {
    adminApp = admin.app();
}

export const authAdmin = admin.auth();
export default adminApp;
