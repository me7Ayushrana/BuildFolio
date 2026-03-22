import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get public profile by username
router.get('/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Update own profile
router.put('/profile', authenticate, async (req: AuthRequest, res) => {
    const firebaseUser = req.user;
    const { displayName, bio, skills, githubUsername, photoURL } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { firebaseId: firebaseUser.uid },
            {
                displayName,
                bio,
                skills,
                githubUsername,
                photoURL
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'Profile updated', user });
    } catch (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
