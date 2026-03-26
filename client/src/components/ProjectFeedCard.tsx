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
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative group bg-slate-900/30 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-md hover:border-blue-500/20 hover:bg-slate-900/50 transition-all duration-500 shadow-2xl shadow-black/40"
        >
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-white/5 relative z-10">
                <Link href={`/profile/${authorUsername}`} className="flex items-center gap-3 group/author">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center overflow-hidden border border-white/5 relative group-hover/author:border-blue-500/40 transition-all duration-300 scale-95 group-hover/author:scale-100">
                        {authorPhoto ? (
                            <Image src={authorPhoto} alt={authorDisplayName} fill className="object-cover" />
                        ) : (
                            <User size={24} className="text-slate-500" />
                        )}
                        <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover/author:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="font-black text-sm text-zinc-100 group-hover/author:text-blue-400 transition-colors uppercase tracking-tight">
                                {authorDisplayName}
                            </span>
                            {isIconicDeveloper(authorId) && (
                                <BadgeCheck size={14} className="text-blue-400 fill-current" />
                            )}
                        </div>
                        <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest opacity-60">
                            @{authorUsername}
                        </span>
                    </div>
                </Link>
                <div className="flex items-center gap-3">
                    <FollowButton targetUserId={authorId} initialIsFollowing={false} variant="mini" />
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>

            {/* Media Content */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950/50 group-hover:shadow-[0_0_50px_rgba(59,130,246,0.1)] transition-shadow duration-500">
                <Image
                    src={project.imageUrl || 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1000&auto=format&fit=crop'}
                    alt={project.title}
                    width={1000}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 blur-[0.5px] group-hover:blur-0"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                {/* Explore Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 pointer-events-none">
                    <div className="px-6 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                        Technical Deep Dive
                    </div>
                </div>
            </div>

            {/* Interactions Bar */}
            <div className="p-6 flex flex-col gap-6 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={toggleLike}
                            className={`${isLiked ? 'text-blue-500' : 'text-zinc-500'} hover:text-blue-400 transition-all flex items-center gap-2 group/btn font-black text-[10px] tracking-widest uppercase`}
                        >
                            <Heart
                                size={22}
                                className={`${isLiked ? 'fill-current' : 'fill-none'} transition-transform duration-300`}
                            />
                            <span>{likesCount}</span>
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => setShowComments(!showComments)}
                            className="text-zinc-500 hover:text-blue-400 transition-all flex items-center gap-2 group/btn font-black text-[10px] tracking-widest uppercase"
                        >
                            <MessageCircle size={22} className="group-hover:scale-110 transition-transform" />
                            <span>{localComments.length}</span>
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.8 }}
                            className="text-zinc-500 hover:text-green-500 transition-all group/btn"
                        >
                            <Share2 size={22} className="group-hover:rotate-12 transition-transform" />
                        </motion.button>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={toggleSave}
                        className={`${isSaved ? 'text-yellow-500' : 'text-zinc-500'} hover:text-yellow-400 transition-all group/btn`}
                    >
                        <Bookmark size={22} className={`${isSaved ? 'fill-current' : 'fill-none'} transition-transform`} />
                    </motion.button>
                </div>

                {/* Text Content */}
                <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tighter text-white group-hover:text-blue-400 transition-colors leading-none">
                        {project.title}
                    </h3>
                    <p className="text-sm text-zinc-500 leading-relaxed font-medium line-clamp-2 selection:bg-blue-500/20">
                        {project.description}
                    </p>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                        <span
                            key={tech}
                            className="px-3 py-1 rounded-xl bg-zinc-950 border border-white/5 text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:border-blue-500/30 hover:text-white transition-all cursor-default"
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
