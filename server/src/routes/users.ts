import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get trending users for suggestion
router.get('/trending', async (req, res) => {
    try {
        const users = await User.find()
            .sort({ followers: -1 })
            .limit(5);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get trending builders (Discovery Hub)
router.get('/trending-builders', async (req, res) => {
    try {
        const builders = await User.find({
            $or: [
                { role: { $exists: true, $ne: "" } },
                { bio: { $exists: true, $ne: "" } }
            ]
        })
            .sort({ followers: -1 })
            .limit(10);
        res.status(200).json(builders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Search users
router.get('/search', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(200).json([]);

    try {
        const users = await User.find(
            { $text: { $search: query as string } },
            { score: { $meta: 'textScore' } }
        )
            .sort({ score: { $meta: 'textScore' } })
            .limit(10);

        // Also try regex for partial matches if text search doesn't return enough
        if (users.length < 5) {
            const regexUsers = await User.find({
                $or: [
                    { username: { $regex: query as string, $options: 'i' } },
                    { displayName: { $regex: query as string, $options: 'i' } }
                ],
                _id: { $nin: users.map(u => u._id) }
            }).limit(10 - users.length);
            return res.status(200).json([...users, ...regexUsers]);
        }

        res.status(200).json(users);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

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
    const { username, displayName, bio, skills, githubUsername, photoURL, role, goals, onboarded } = req.body;

    try {
        const existingUser = await User.findOne({ firebaseId: firebaseUser.uid });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check username uniqueness if it's changing
        if (username && username !== existingUser.username) {
            const collision = await User.findOne({ username });
            if (collision) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            existingUser.username = username;
        }

        if (displayName !== undefined) existingUser.displayName = displayName;
        if (bio !== undefined) existingUser.bio = bio;
        if (skills !== undefined) existingUser.skills = skills;
        if (githubUsername !== undefined) existingUser.githubUsername = githubUsername;
        if (photoURL !== undefined) existingUser.photoURL = photoURL;
        if (role !== undefined) existingUser.role = role;
        if (goals !== undefined) existingUser.goals = goals;
        if (onboarded !== undefined) existingUser.onboarded = onboarded;

        await existingUser.save();
        return res.status(200).json({ message: 'Profile updated', user: existingUser });
    } catch (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
