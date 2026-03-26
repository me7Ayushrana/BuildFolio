import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = Router();

// @route   POST /api/social-actions/projects/:id/like
// @desc    Like/Unlike a project
router.post('/projects/:id/like', authenticate, async (req: any, res: any) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const user = await User.findOne({ firebaseId: req.user.uid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const likeIndex = project.likes.indexOf(user._id as any);
        if (likeIndex > -1) {
            // Unlike
            project.likes.splice(likeIndex, 1);
            await project.save();
            return res.status(200).json({ message: 'Unliked', likesCount: project.likes.length, isLiked: false });
        } else {
            // Like
            project.likes.push(user._id as any);
            await project.save();
            return res.status(200).json({ message: 'Liked', likesCount: project.likes.length, isLiked: true });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// @route   POST /api/social-actions/projects/:id/comment
// @desc    Comment on a project
router.post('/projects/:id/comment', authenticate, async (req: any, res: any) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Comment text is required' });

        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const user = await User.findOne({ firebaseId: req.user.uid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const newComment = {
            userId: user._id as any,
            text,
            createdAt: new Date()
        };

        project.comments.push(newComment);
        await project.save();

        const populatedProject = await Project.findById(project._id).populate('comments.userId', 'username displayName photoURL');

        res.status(201).json({ message: 'Comment added', comments: populatedProject?.comments });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// @route   DELETE /api/social-actions/projects/:id/comments/:commentId
// @desc    Delete a comment
router.delete('/projects/:id/comments/:commentId', authenticate, async (req: any, res: any) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const user = await User.findOne({ firebaseId: req.user.uid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const comment = project.comments.find(c => c._id?.toString() === req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        // Only comment author or project owner can delete
        if (comment.userId.toString() !== user._id.toString() && project.userId.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this comment' });
        }

        project.comments = project.comments.filter(c => c._id?.toString() !== req.params.commentId) as any;
        await project.save();

        res.status(200).json({ message: 'Comment deleted', comments: project.comments });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// @route   POST /api/social-actions/projects/:id/save
// @desc    Save/Unsave a project
router.post('/projects/:id/save', authenticate, async (req: any, res: any) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const user = await User.findOne({ firebaseId: req.user.uid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const saveIndex = user.savedProjects.indexOf(project._id as any);
        if (saveIndex > -1) {
            // Unsave
            user.savedProjects.splice(saveIndex, 1);
            await user.save();
            return res.status(200).json({ message: 'Unsaved', isSaved: false });
        } else {
            // Save
            user.savedProjects.push(project._id as any);
            await user.save();
            return res.status(200).json({ message: 'Saved', isSaved: true });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

export default router;
