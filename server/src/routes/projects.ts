import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

const router = express.Router();

// Get all projects for a specific user
router.get('/user/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const projects = await Project.find({ userId: user._id });
        return res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching user projects:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Create new project
router.post('/', authenticate, async (req: AuthRequest, res) => {
    const firebaseUser = req.user;
    const { title, description, techStack, imageUrl, githubLink, liveLink } = req.body;

    try {
        const user = await User.findOne({ firebaseId: firebaseUser.uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const project = new Project({
            userId: user._id,
            title,
            description,
            techStack,
            imageUrl,
            githubLink,
            liveLink,
        });

        await project.save();
        return res.status(201).json({ message: 'Project created', project });
    } catch (error) {
        console.error('Error creating project:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete project
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
    const firebaseUser = req.user;
    try {
        const user = await User.findOne({ firebaseId: firebaseUser.uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const project = await Project.findOneAndDelete({ _id: req.params.id, userId: user._id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found or unauthorized' });
        }

        return res.status(200).json({ message: 'Project deleted' });
    } catch (error) {
        console.error('Error deleting project:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
