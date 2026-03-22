import express from 'express';
import Project from '../models/Project.js';

const router = express.Router();

// Get all projects for exploration (paginated)
router.get('/', async (req, res) => {
    const { tech, page = 1, limit = 10 } = req.query;
    const query: any = {};

    if (tech) {
        query.techStack = { $in: [tech] };
    }

    try {
        const projects = await Project.find(query)
            .populate('userId', 'username displayName photoURL')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Project.countDocuments(query);

        return res.status(200).json({
            projects,
            total,
            pages: Math.ceil(total / Number(limit)),
        });
    } catch (error) {
        console.error('Error in explore projects:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
