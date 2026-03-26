"use client";

import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Github, MoreHorizontal, User, BadgeCheck, Send, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import FollowButton from './FollowButton';

interface Comment {
    _id?: string;
    userId: {
        _id: string;
        username: string;
        displayName: string;
        photoURL?: string;
    };
    text: string;
    createdAt: string;
}

interface ProjectFeedCardProps {
    project: {
        _id: string;
        userId: any;
        title: string;
        description: string;
        techStack: string[];
        imageUrl?: string;
        githubLink?: string;
        isLiked?: boolean;
        isSaved?: boolean;
        likesCount?: number;
        commentsCount?: number;
        comments?: Comment[];
        createdAt: string;
    };
}

const isIconicDeveloper = (id: string) => {
    const iconicIds = ["u1", "u2", "u3", "u4", "u5", "u6", "u7", "u8"];
    return iconicIds.includes(id);
};

export default function ProjectFeedCard({ project: initialProject }: ProjectFeedCardProps) {
    const [project, setProject] = useState(initialProject);
    const [isLiked, setIsLiked] = useState(initialProject.isLiked || false);
    const [likesCount, setLikesCount] = useState(initialProject.likesCount || 0);
    const [isSaved, setIsSaved] = useState(initialProject.isSaved || false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [localComments, setLocalComments] = useState<Comment[]>(initialProject.comments || []);
    const { user, token } = useAuth();

    const toggleLike = async () => {
        if (!token) return;

        // Optimistic UI
        const prevLiked = isLiked;
        const prevCount = likesCount;
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/social-actions/projects/${project._id}/like`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsLiked(res.data.isLiked);
            setLikesCount(res.data.likesCount);
        } catch (err) {
            console.error('Error liking:', err);
            setIsLiked(prevLiked);
            setLikesCount(prevCount);
        }
    };

    const toggleSave = async () => {
        if (!token) return;
        const prevSaved = isSaved;
        setIsSaved(!isSaved);

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/social-actions/projects/${project._id}/save`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsSaved(res.data.isSaved);
        } catch (err) {
            console.error('Error saving:', err);
            setIsSaved(prevSaved);
        }
    };

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !commentText.trim()) return;

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/social-actions/projects/${project._id}/comment`,
                { text: commentText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setLocalComments(res.data.comments);
            setCommentText('');
        } catch (err) {
            console.error('Error posting comment:', err);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!token) return;
        try {
            const res = await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/social-actions/projects/${project._id}/comments/${commentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setLocalComments(res.data.comments);
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    const authorId = typeof project.userId === 'object' ? project.userId?._id : project.userId;
    const authorUsername = typeof project.userId === 'object' ? project.userId?.username : 'dev';
    const authorDisplayName = typeof project.userId === 'object' ? project.userId?.displayName : 'Elite Developer';
    const authorPhoto = typeof project.userId === 'object' ? project.userId?.photoURL : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="bg-slate-900/40 border border-slate-800/60 rounded-2xl overflow-hidden backdrop-blur-sm group hover:border-blue-500/30 hover:bg-slate-900/60 transition-all duration-300"
        >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-800/10">
                <Link href={`/profile/${authorUsername}`} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700 relative group-hover:border-blue-500/50 transition-colors">
                        {authorPhoto ? (
                            <Image
                                src={authorPhoto}
                                alt={authorDisplayName}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <User size={20} className="text-slate-400" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                                {authorDisplayName}
                            </span>
                            {isIconicDeveloper(authorId) && (
                                <BadgeCheck size={14} className="text-blue-500 fill-current" />
                            )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                            @{authorUsername}
                        </span>
                    </div>
                </Link>
                <div className="flex items-center gap-3">
                    <FollowButton targetUserId={authorId} initialIsFollowing={false} variant="mini" />
                    <button className="text-slate-400 hover:text-white transition-colors">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>

            {/* Media Content */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                <Image
                    src={project.imageUrl || 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1000&auto=format&fit=crop'}
                    alt={project.title}
                    width={1000}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            {/* Interactions Bar */}
            <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={toggleLike}
                            className={`${isLiked ? 'text-red-500' : 'text-slate-300'} hover:text-red-500 transition-colors flex items-center gap-2 group/btn font-mono text-xs`}
                        >
                            <Heart
                                size={22}
                                className={`${isLiked ? 'fill-current scale-110' : ''} group-hover/btn:scale-120 transition-transform`}
                            />
                            <span className="font-bold">{likesCount}</span>
                        </button>
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="text-slate-300 hover:text-blue-500 transition-colors flex items-center gap-2 group/btn font-mono text-xs"
                        >
                            <MessageCircle size={22} className="group-hover/btn:scale-120 transition-transform" />
                            <span className="font-bold">{localComments.length}</span>
                        </button>
                        <button className="text-slate-300 hover:text-green-500 transition-colors group/btn">
                            <Share2 size={22} className="group-hover/btn:scale-120 transition-transform" />
                        </button>
                    </div>
                    <button
                        onClick={toggleSave}
                        className={`${isSaved ? 'text-blue-500' : 'text-slate-300'} hover:text-blue-500 transition-colors group/btn`}
                    >
                        <Bookmark size={22} className={`${isSaved ? 'fill-current scale-110' : ''} group-hover/btn:scale-120 transition-transform`} />
                    </button>
                </div>

                {/* Text Content */}
                <div className="space-y-1">
                    <h3 className="text-xl font-black tracking-tighter text-white group-hover:text-blue-400 transition-colors">{project.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium line-clamp-2">{project.description}</p>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 pt-2">
                    {project.techStack.map((tech) => (
                        <span
                            key={tech}
                            className="px-2 py-0.5 rounded bg-blue-500/5 text-blue-400/80 border border-blue-500/10 text-[9px] font-black uppercase tracking-widest"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                    {showComments && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-slate-800/40 mt-4 pt-4"
                        >
                            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {localComments.map((comment, i) => (
                                    <div key={comment._id || i} className="flex gap-3 items-start group/comment">
                                        <div className="w-6 h-6 rounded-full bg-slate-800 shrink-0 overflow-hidden relative">
                                            {comment.userId?.photoURL ? (
                                                <Image src={comment.userId.photoURL} alt="User" fill className="object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-[8px] font-bold">
                                                    {comment.userId?.displayName?.[0] || 'U'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black text-slate-300 lowercase">@{comment.userId?.username || 'dev'}</span>
                                                {user && (user.uid === comment.userId?._id || user.uid === authorId) && (
                                                    <button
                                                        onClick={() => handleDeleteComment(comment._id!)}
                                                        className="opacity-0 group-hover/comment:opacity-100 text-slate-600 hover:text-red-500 transition-all"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400 font-medium leading-relaxed">{comment.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {localComments.length === 0 && (
                                    <p className="text-center text-[10px] text-slate-600 font-black uppercase tracking-widest py-4">No discussions yet</p>
                                )}
                            </div>

                            {/* Comment Input */}
                            {user && (
                                <form onSubmit={handlePostComment} className="flex gap-3 mt-4 items-center">
                                    <div className="flex-1 bg-slate-950/50 rounded-full border border-slate-800 px-4 py-2 flex items-center gap-3">
                                        <input
                                            type="text"
                                            placeholder="Add a technical insight..."
                                            className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-600 w-full"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                        />
                                        <button type="submit" className="text-blue-500 hover:text-blue-400 transition-colors">
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-950/40 border-t border-slate-800/40 flex items-center justify-between">
                <Link
                    href={project.githubLink || '#'}
                    target="_blank"
                    className="text-[10px] flex items-center gap-2 text-blue-500 hover:text-blue-300 transition-colors font-black tracking-widest uppercase"
                >
                    <Github size={14} />
                    Source Code
                </Link>
                <span className="text-[9px] text-slate-600 font-bold">
                    {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
            </div>
        </motion.div>
    );
}
