"use client";

import { useState, useRef } from "react";
import { X, Upload, Plus, Trash2, Github, Globe, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setFormData({ ...formData, imageUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
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
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-900 p-6">
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">Create New Showcase</h2>
                    <button onClick={onClose} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-900 hover:text-white transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
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
                                <div className="text-center p-8">
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
                                    />
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
                            className="flex-1 rounded-2xl border border-zinc-800 px-6 py-4 text-sm font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] rounded-2xl bg-white px-6 py-4 text-sm font-black text-black hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Publish Showcase"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
