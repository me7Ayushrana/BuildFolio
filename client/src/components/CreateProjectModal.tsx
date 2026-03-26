"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Github, Globe, Code2, Plus, Loader2, X, Image as ImageIcon } from "lucide-react";

export default function CreateProjectModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { token } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [techStack, setTechStack] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [githubLink, setGithubLink] = useState("");
    const [liveLink, setLiveLink] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            await axios.post(
                `${API_URL}/projects`,
                {
                    title,
                    description,
                    techStack: techStack.split(",").map(s => s.trim()),
                    imageUrl,
                    githubLink,
                    liveLink
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onClose();
            // Clear form
            setTitle("");
            setDescription("");
            setTechStack("");
            setImageUrl("");
            setGithubLink("");
            setLiveLink("");
            window.location.reload(); // Refresh to show new project
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create project");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl my-auto"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                                        <Rocket size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white tracking-tight">Share Your Build</h2>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                    <X size={20} className="text-zinc-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        {/* Title */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Project Title</label>
                                            <input
                                                type="text"
                                                required
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="e.g. ChatGPT-5 Architecture"
                                                className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3 px-4 text-zinc-200 placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-light"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Breakdown</label>
                                            <textarea
                                                required
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="What technical challenges did you solve?"
                                                rows={4}
                                                className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3 px-4 text-zinc-200 placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-light resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Image URL */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Hero Image URL</label>
                                            <div className="relative group">
                                                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    type="url"
                                                    value={imageUrl}
                                                    onChange={(e) => setImageUrl(e.target.value)}
                                                    placeholder="Unsplash or Cloudinary link"
                                                    className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-zinc-200 placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-light"
                                                />
                                            </div>
                                        </div>

                                        {/* Tech Stack */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Core Stack (comma separated)</label>
                                            <div className="relative group">
                                                <Code2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    value={techStack}
                                                    onChange={(e) => setTechStack(e.target.value)}
                                                    placeholder="PyTorch, Next.js, CUDA"
                                                    className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-zinc-200 placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-light"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Github */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Source Code (Optional)</label>
                                        <div className="relative group">
                                            <Github className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="url"
                                                value={githubLink}
                                                onChange={(e) => setGithubLink(e.target.value)}
                                                placeholder="github.com/..."
                                                className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-zinc-200 placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-light"
                                            />
                                        </div>
                                    </div>

                                    {/* Live Link */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Live Demo (Optional)</label>
                                        <div className="relative group">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="url"
                                                value={liveLink}
                                                onChange={(e) => setLiveLink(e.target.value)}
                                                placeholder="https://..."
                                                className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-zinc-200 placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-light"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                                        <X size={16} /> {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !title || !description}
                                    className="w-full py-4 rounded-2xl bg-white text-black font-extrabold text-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-2xl shadow-white/5 flex items-center justify-center gap-3 mt-4"
                                >
                                    {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : (
                                        <>
                                            <Plus size={24} /> Deploy to Feed
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
