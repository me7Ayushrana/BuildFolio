import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Synchronize Firebase user with MongoDB
router.post('/sync', authenticate, async (req: AuthRequest, res) => {
    const firebaseUser = req.user;

    try {
        let user = await User.findOne({ firebaseId: firebaseUser.uid });

        if (!user) {
            // Create new user if they don't exist
            // Generate a unique username from email or name
            const baseUsername = firebaseUser.email?.split('@')[0] || `user_${firebaseUser.uid.substring(0, 5)}`;
            let username = baseUsername;

            // Check for collisions
            let collision = await User.findOne({ username });
            let counter = 1;
            while (collision) {
                username = `${baseUsername}${counter}`;
                collision = await User.findOne({ username });
                counter++;
            }

            user = new User({
                firebaseId: firebaseUser.uid,
                email: firebaseUser.email,
                username: username,
                displayName: firebaseUser.name || '',
                photoURL: firebaseUser.picture || '',
                skills: [],
                goals: [],
                onboarded: false,
            });

            await user.save();
            return res.status(201).json({ message: 'User created and synced', user });
        }

        return res.status(200).json({ message: 'User already synced', user });
    } catch (error) {
        console.error('Error in auth sync:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
