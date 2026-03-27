"use client";

import { useState, useRef } from "react";
import { X, Upload, Plus, Trash2, Github, Globe, Loader2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated: () => void;
}

export default function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        techStack: "",
        githubLink: "",
        liveLink: "",
        imageUrl: ""
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (err) => {
                    console.error(err);
                    toast.error("Media synchronization failed");
                    setIsUploading(false);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setImagePreview(downloadURL);
                    setFormData({ ...formData, imageUrl: downloadURL });
                    setIsUploading(false);
                    toast.success("Media Uplink Established");
                }
            );
        } catch (err) {
            console.error("Storage Error:", err);
            toast.error("Peripheral storage connection lost");
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            const token = await user.getIdToken();
            const techArray = formData.techStack.split(",").map(s => s.trim()).filter(Boolean);

            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects`, {
                ...formData,
                techStack: techArray
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Post created successfully!");
            onPostCreated();
            onClose();
            // Reset form
            setFormData({
                title: "",
                description: "",
                techStack: "",
                githubLink: "",
                liveLink: "",
                imageUrl: ""
            });
            setImagePreview(null);
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
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
                            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                                <Plus size={16} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">New Transmission</span>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">Create Showcase</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Image Upload Area */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Project Preview</label>
                            <div
                                className={`relative aspect-video w-full rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/40 flex flex-col items-center justify-center overflow-hidden group transition-all hover:border-zinc-600 ${imagePreview ? "border-solid" : ""}`}
                            >
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => { setImagePreview(null); setFormData({ ...formData, imageUrl: "" }); }}
                                            className="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center p-8 w-full h-full flex flex-col items-center justify-center">
                                        {isUploading ? (
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="relative w-16 h-16">
                                                    <svg className="w-full h-full -rotate-90">
                                                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-zinc-800" />
                                                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * uploadProgress) / 100} className="text-blue-500 transition-all duration-300" />
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">{Math.round(uploadProgress)}%</div>
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 animate-pulse">Syncing Neural Memory...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="mx-auto h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                                                    <Upload size={24} className="text-zinc-400" />
                                                </div>
                                                <p className="text-sm font-bold text-zinc-400">Click to upload image</p>
                                                <p className="text-xs text-zinc-600 mt-1 uppercase tracking-tighter">JPG, PNG or GIF (Max 5MB)</p>
                                                <input
                                                    type="file"
                                                    onChange={handleImageChange}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    accept="image/*"
                                                    disabled={isUploading}
                                                />
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Project Title</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="E.g. Buildfolio Social"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-zinc-600 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Tech Stack (Comma Separated)</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Next.js, Tailwind, MongoDB"
                                    value={formData.techStack}
                                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-zinc-600 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Description</label>
                            <textarea
                                required
                                rows={4}
                                placeholder="What makes this project special?"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-zinc-600 transition-colors resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                    <Github size={12} /> GitHub Repository Link
                                </label>
                                <input
                                    required
                                    type="url"
                                    placeholder="https://github.com/..."
                                    value={formData.githubLink}
                                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-zinc-600 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                    <Globe size={12} /> Live Demo Link (Optional)
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={formData.liveLink}
                                    onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-zinc-600 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 rounded-2xl border border-white/5 px-6 py-4 text-xs font-black text-zinc-500 hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest"
                            >
                                Abort
                            </button>
                            <button
                                type="submit"
                                disabled={loading || isUploading}
                                className="flex-[2] rounded-2xl bg-white px-6 py-4 text-xs font-black text-black hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest shadow-2xl shadow-white/10"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : "Publish Transmission"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Side: Live Preview */}
                <div className="hidden md:flex flex-1 p-12 items-center justify-center bg-zinc-900/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-blue-500/20 transition-colors duration-1000" />

                    <div className="w-full max-w-sm relative z-10">
                        <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full -z-10 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500/60 block mb-8 text-center animate-pulse">Neural Thread Preview</span>

                        {/* Card Mockup */}
                        <motion.div
                            layout
                            className="bg-zinc-950/40 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] group/card hover:border-blue-500/30 transition-all duration-700"
                        >
                            <div className="p-5 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg" />
                                    <div className="space-y-1">
                                        <div className="h-1.5 w-20 bg-zinc-800 rounded-full overflow-hidden" />
                                        <div className="h-1 w-12 bg-zinc-900 rounded-full" />
                                    </div>
                                </div>
                            </div>

                            <div className="aspect-[16/10] bg-black relative overflow-hidden">
                                {imagePreview ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-[2s]"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    </motion.div>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                                            <div className="w-24 h-24 rounded-full border border-indigo-500/30 flex items-center justify-center relative">
                                                <div className="absolute inset-0 border-t border-indigo-400 rounded-full animate-spin duration-[3s]" />
                                                <ImageIcon size={32} className="text-indigo-500" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute left-0 right-0 h-[1px] bg-blue-500/30 top-0 animate-scan pointer-events-none" />
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-3">
                                    <h4 className="text-2xl font-black text-white leading-tight tracking-tighter uppercase italic">
                                        {formData.title || "Display Identity"}
                                    </h4>
                                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed font-medium italic">
                                        {formData.description || "Synthesizing architectural narrative..."}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(formData.techStack || "???").split(",").map((t, i) => (
                                        <div key={i} className="px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10 text-[8px] font-black text-blue-500/80 uppercase tracking-widest">{t.trim() || "?"}</div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Top Close Button */}
                <button onClick={onClose} className="absolute top-6 right-6 p-2 text-zinc-600 hover:text-white transition-colors z-[110]">
                    <X size={24} />
                </button>
            </motion.div>
        </div>
    );
}
