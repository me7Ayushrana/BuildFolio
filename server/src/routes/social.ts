import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Follow/Unfollow a user
router.post('/follow/:id', authenticate, async (req: AuthRequest, res) => {
    const currentFirebaseId = req.user.uid;
    const targetUserId = req.params.id;

    try {
        const currentUser = await User.findOne({ firebaseId: currentFirebaseId });
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (currentUser._id.toString() === targetUserId) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }

        const isFollowing = currentUser.following.includes(targetUser._id as any);

        if (isFollowing) {
            // Unfollow
            currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
            targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUser._id.toString());
            await currentUser.save();
            await targetUser.save();
            return res.status(200).json({ message: 'Unfollowed successfully', isFollowing: false });
        } else {
            // Follow
            currentUser.following.push(targetUser._id as any);
            targetUser.followers.push(currentUser._id as any);
            await currentUser.save();
            await targetUser.save();
            return res.status(200).json({ message: 'Followed successfully', isFollowing: true });
        }
    } catch (error) {
        console.error('Error in follow/unfollow:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Get follow status
router.get('/status/:id', authenticate, async (req: AuthRequest, res) => {
    try {
        const currentUser = await User.findOne({ firebaseId: req.user.uid });
        if (!currentUser) return res.status(404).json({ message: 'User not found' });

        const isFollowing = currentUser.following.includes(req.params.id as any);
        return res.status(200).json({ isFollowing });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Get followers list
router.get('/followers/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('followers', 'username displayName photoURL bio');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user.followers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get following list
router.get('/following/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('following', 'username displayName photoURL bio');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user.following);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get personalized feed (projects from people I follow)
router.get('/feed/following', authenticate, async (req: AuthRequest, res) => {
    try {
        const currentUser = await User.findOne({ firebaseId: req.user.uid });
        if (!currentUser) return res.status(404).json({ message: 'User not found' });

        const followingIds = currentUser.following;

        // Import Project model dynamically if needed, or ensure it's available
        // For now, I'll assume it's imported at the top if I adding it there
        const Project = (await import('../models/Project.js')).default;

        const projects = await Project.find({ userId: { $in: followingIds } })
            .populate('userId', 'username displayName photoURL')
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

export default router;
