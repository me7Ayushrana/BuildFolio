"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Github, Globe, Code2, Plus, Loader2, X, Image as ImageIcon } from "lucide-react";


export default function CreateProjectModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { token, dbUser } = useAuth();
    const [step, setStep] = useState(1);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [techStack, setTechStack] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [githubLink, setGithubLink] = useState("");
    const [liveLink, setLiveLink] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError("");

        try {
            await axios.post(
                `${API_URL}/projects`,
                {
                    title,
                    description,
                    techStack: techStack.split(",").map(s => s.trim()).filter(s => s),
                    imageUrl,
                    githubLink,
                    liveLink
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Success animation/feedback would go here
            setTimeout(() => {
                onClose();
                // Reset
                setStep(1);
                setTitle("");
                setDescription("");
                setTechStack("");
                setImageUrl("");
                setGithubLink("");
                setLiveLink("");
                window.location.reload();
            }, 1000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Launch Aborted: Technical Error");
            setIsSubmitting(false);
        }
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 3));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        className="relative w-full max-w-5xl h-[85vh] rounded-[2.5rem] border border-white/5 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col md:flex-row"
                    >
                        {/* Left Side: Form */}
                        <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar border-r border-white/5 bg-zinc-950">
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-6 bg-blue-500' : 'w-2 bg-zinc-800'}`} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-2">Step {step} of 3</span>
                                </div>
                                <h2 className="text-3xl font-black text-white tracking-tighter">
                                    {step === 1 && "The Concept"}
                                    {step === 2 && "The Visuals"}
                                    {step === 3 && "Final Mission Check"}
                                </h2>
                            </div>

                            <div className="space-y-8">
                                {step === 1 && (
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Project Mission Title</label>
                                            <input
                                                autoFocus
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="e.g. Neural Nexus Engine"
                                                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 px-5 text-xl text-white placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-black tracking-tight"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Technical Breakdown</label>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Describe the architectural breakthrough..."
                                                rows={5}
                                                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 px-5 text-zinc-300 placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all resize-none font-medium leading-relaxed"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Hero Image URL</label>
                                            <input
                                                type="url"
                                                value={imageUrl}
                                                onChange={(e) => setImageUrl(e.target.value)}
                                                placeholder="Unsplash / Cloudinary / GitHub raw"
                                                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 px-5 text-zinc-200 placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-mono text-xs"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Core Tech Stack (Comma Separated)</label>
                                            <input
                                                type="text"
                                                value={techStack}
                                                onChange={(e) => setTechStack(e.target.value)}
                                                placeholder="Rust, CUDA, PyTorch, Go..."
                                                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 px-5 text-zinc-200 placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-black tracking-widest uppercase text-xs"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">GitHub</label>
                                                <input
                                                    type="url"
                                                    value={githubLink}
                                                    onChange={(e) => setGithubLink(e.target.value)}
                                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-3 px-4 text-xs text-zinc-400 font-mono"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Live Demo</label>
                                                <input
                                                    type="url"
                                                    value={liveLink}
                                                    onChange={(e) => setLiveLink(e.target.value)}
                                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-3 px-4 text-xs text-zinc-400 font-mono"
                                                />
                                            </div>
                                        </div>
                                        {error && <p className="text-red-400 text-xs font-black uppercase tracking-widest">{error}</p>}
                                    </motion.div>
                                )}
                            </div>

                            <div className="mt-12 flex items-center gap-4">
                                {step > 1 && (
                                    <button onClick={prevStep} className="px-8 py-4 rounded-2xl border border-white/5 text-zinc-500 hover:text-white hover:bg-white/5 transition-all text-sm font-black uppercase tracking-widest">
                                        Back
                                    </button>
                                )}
                                {step < 3 ? (
                                    <button
                                        onClick={nextStep}
                                        disabled={step === 1 && (!title || !description)}
                                        className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-500 disabled:opacity-30 transition-all active:scale-95"
                                    >
                                        Next Phase
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="flex-1 py-4 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all active:scale-95 shadow-2xl shadow-white/10 flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <><Rocket size={20} /> Initiate Launch</>}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Live Preview */}
                        <div className="hidden md:flex flex-1 p-12 items-center justify-center bg-zinc-900/50 relative overflow-hidden group">
                            {/* Animated Background Gradients */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-blue-500/20 transition-colors duration-1000" />
                            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -ml-64 -mb-64 group-hover:bg-purple-500/20 transition-colors duration-1000" />

                            <div className="w-full max-w-sm relative z-10">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 block mb-6 text-center">Live Holographic Preview</span>

                                {/* Card Mockup */}
                                <div className="bg-zinc-950/80 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
                                    <div className="p-4 border-b border-white/5 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-800" />
                                        <div className="h-2 w-24 bg-zinc-800 rounded" />
                                    </div>
                                    <div className="aspect-[16/10] bg-zinc-900 relative overflow-hidden">
                                        {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-zinc-800 font-black uppercase tracking-widest text-[10px]">No Media Connection</div>}
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="space-y-2">
                                            <h4 className="text-xl font-black text-white leading-none tracking-tight">{title || "Launch Target Alpha"}</h4>
                                            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{description || "The technical details of your breakthrough development will appear here..."}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {(techStack || "Buildfolio").split(",").map((t, i) => (
                                                <div key={i} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 text-[8px] font-black text-zinc-500 uppercase tracking-widest">{t.trim() || "?"}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Close Button */}
                        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-zinc-600 hover:text-white transition-colors z-[110]">
                            <X size={24} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
