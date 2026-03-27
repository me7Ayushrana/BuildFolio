"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Loader2, X, Upload, CheckCircle2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


export default function CreateProjectModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { token } = useAuth();
    const [step, setStep] = useState(1);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [techStack, setTechStack] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [githubLink, setGithubLink] = useState("");
    const [liveLink, setLiveLink] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
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
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Launch Aborted: Technical Error");
            } else {
                setError("Launch Aborted: Technical Error");
            }
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
                                <h2 className="text-4xl font-black text-white tracking-tighter italic">
                                    {step === 1 && "The Genesis"}
                                    {step === 2 && "Visual Synchronization"}
                                    {step === 3 && "Final Trajectory Check"}
                                </h2>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
                                    {step === 1 && "Define the core architectural breakthrough."}
                                    {step === 2 && "Establish the visual identity for global discovery."}
                                    {step === 3 && "Finalize metadata and initiate deployment."}
                                </p>
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
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Project Visual Identity</label>

                                            <div className="relative group/upload">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id="project-media-upload"
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        setIsUploading(true);
                                                        setUploadProgress(0);

                                                        try {
                                                            const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
                                                            const uploadTask = uploadBytesResumable(storageRef, file);

                                                            uploadTask.on('state_changed',
                                                                (snapshot) => {
                                                                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                                                    setUploadProgress(progress);
                                                                },
                                                                (err) => {
                                                                    console.error(err);
                                                                    setError("Media Uplink Failed");
                                                                    setIsUploading(false);
                                                                },
                                                                async () => {
                                                                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                                                    setImageUrl(downloadURL);
                                                                    setIsUploading(false);
                                                                    toast.success("Media Uplink Established");
                                                                }
                                                            );
                                                        } catch (err) {
                                                            console.error(err);
                                                            setError("Interlink Malfunction");
                                                            toast.error("Peripheral storage connection lost");
                                                            setIsUploading(false);
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor="project-media-upload"
                                                    className={`flex flex-col items-center justify-center w-full aspect-video rounded-[2rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden relative group/btn ${imageUrl ? 'border-blue-500/50 bg-blue-500/5' : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-600 hover:bg-zinc-900/50'}`}
                                                >
                                                    {isUploading ? (
                                                        <div className="flex flex-col items-center gap-4 text-center">
                                                            <div className="relative w-20 h-20">
                                                                <svg className="w-full h-full -rotate-90">
                                                                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-zinc-800" />
                                                                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="226.2" strokeDashoffset={226.2 - (226.2 * uploadProgress) / 100} className="text-blue-500 transition-all duration-300" />
                                                                </svg>
                                                                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">{Math.round(uploadProgress)}%</div>
                                                            </div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 animate-pulse">Syncing Neural Memory...</p>
                                                        </div>
                                                    ) : imageUrl ? (
                                                        <>
                                                            <Image src={imageUrl} alt="Preview" fill className="object-cover opacity-40 group-hover/btn:opacity-60 transition-opacity" />
                                                            <div className="relative z-10 flex flex-col items-center gap-2">
                                                                <CheckCircle2 size={32} className="text-blue-500" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 px-4 py-1.5 rounded-full shadow-lg">Change Media</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-4 group-hover/btn:translate-y-[-4px] transition-transform duration-500">
                                                            <div className="p-4 rounded-3xl bg-zinc-900 border border-white/5 shadow-2xl">
                                                                <Upload size={32} className="text-zinc-400" />
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-sm font-black text-white uppercase tracking-tight">Drop architectural assets</p>
                                                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">PNG, JPG or RAW (.webp)</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Or Provide Remote URL</label>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700">
                                                        <ImageIcon size={16} />
                                                    </div>
                                                    <input
                                                        type="url"
                                                        value={imageUrl}
                                                        onChange={(e) => setImageUrl(e.target.value)}
                                                        placeholder="Unsplash / Cloudinary / GitHub raw"
                                                        className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-5 text-zinc-200 placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-mono text-xs"
                                                    />
                                                </div>
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
                        <div className="hidden md:flex flex-1 p-12 items-center justify-center bg-zinc-900/10 relative overflow-hidden group">
                            {/* Animated Background Gradients */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-blue-500/20 transition-colors duration-1000" />
                            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -ml-64 -mb-64 group-hover:bg-purple-500/20 transition-colors duration-1000" />

                            <div className="w-full max-w-sm relative z-10">
                                <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full -z-10 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500/60 block mb-8 text-center animate-pulse">Holographic Preview Rendering</span>

                                {/* Card Mockup - Premium Overhaul */}
                                <motion.div
                                    layout
                                    className="bg-zinc-950/40 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] group/card hover:border-blue-500/30 transition-all duration-700"
                                >
                                    <div className="p-5 border-b border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20" />
                                            <div className="space-y-1">
                                                <div className="h-1.5 w-20 bg-zinc-800 rounded-full overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2, repeat: Infinity }} className="h-full bg-blue-500" />
                                                </div>
                                                <div className="h-1 w-12 bg-zinc-900 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                            <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                            <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                        </div>
                                    </div>

                                    <div className="aspect-[16/10] bg-black relative overflow-hidden">
                                        {imageUrl ? (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
                                                <Image
                                                    src={imageUrl}
                                                    alt={title || "Project Preview"}
                                                    fill
                                                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-[2s]"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                            </motion.div>
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                {/* Holographic Pulse Empty State */}
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                                                    <div className="w-24 h-24 rounded-full border border-blue-500/30 flex items-center justify-center relative">
                                                        <div className="absolute inset-0 border-t border-blue-400 rounded-full animate-spin duration-[3s]" />
                                                        <Rocket size={32} className="text-blue-500 animate-bounce" />
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-8 left-0 right-0 text-center">
                                                    <p className="text-[9px] font-black text-blue-500/50 uppercase tracking-[0.3em]">No Visual Connection</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Dynamic Scan Line */}
                                        <div className="absolute left-0 right-0 h-[1px] bg-blue-500/30 top-0 animate-scan pointer-events-none shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                    </div>

                                    <div className="p-8 space-y-6">
                                        <div className="space-y-3">
                                            <h4 className="text-2xl font-black text-white leading-tight tracking-tighter uppercase italic group-hover/card:text-blue-400 transition-colors">
                                                {title || "Target Alpha"}
                                            </h4>
                                            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed font-medium italic">
                                                {description || "Awaiting architectural input..."}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {(techStack || "???, ???, ???").split(",").map((t, i) => (
                                                <div key={i} className="px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10 text-[8px] font-black text-blue-500/80 uppercase tracking-widest">{t.trim() || "?"}</div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bottom Decorative Element */}
                                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                                </motion.div>
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
