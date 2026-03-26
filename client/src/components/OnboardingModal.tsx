"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { User, AtSign, Check, X, Loader2, Sparkles } from "lucide-react";

export default function OnboardingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { user, dbUser, token } = useAuth();
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';

    useEffect(() => {
        if (dbUser) {
            setDisplayName(dbUser.displayName || user?.displayName || "");
            setUsername(dbUser.username || user?.email?.split("@")[0] || "");
            setBio(dbUser.bio || "");
        }
    }, [dbUser, user]);

    useEffect(() => {
        const checkUsername = async () => {
            if (username.length < 3) {
                setIsAvailable(null);
                return;
            }
            if (dbUser && username === dbUser.username) {
                setIsAvailable(true);
                return;
            }

            setIsChecking(true);
            try {
                // We use the profile search/get to check existence
                const res = await axios.get(`${API_URL}/users/${username}`);
                setIsAvailable(false);
            } catch (err: any) {
                if (err.response?.status === 404) {
                    setIsAvailable(true);
                } else {
                    console.error(err);
                }
            } finally {
                setIsChecking(false);
            }
        };

        const timeoutId = setTimeout(checkUsername, 500);
        return () => clearTimeout(timeoutId);
    }, [username, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAvailable && (dbUser && username !== dbUser.username)) return;

        setIsSubmitting(true);
        setError("");

        try {
            await axios.put(
                `${API_URL}/users/profile`,
                { username, displayName, bio },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onClose();
            window.location.reload(); // Refresh to update all UI
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                                    <Sparkles size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Complete Your Profile</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Username */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center justify-between">
                                        <span>Pick a unique username</span>
                                        {isChecking && <Loader2 size={12} className="animate-spin text-blue-500" />}
                                    </label>
                                    <div className="relative group">
                                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                                            placeholder="username"
                                            className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3 pl-11 pr-12 text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-light"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            {isAvailable === true && <Check size={18} className="text-green-500" />}
                                            {isAvailable === false && <X size={18} className="text-red-500" />}
                                        </div>
                                    </div>
                                    {isAvailable === false && (
                                        <p className="text-[10px] text-red-500 font-medium">This username is already claimed.</p>
                                    )}
                                </div>

                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Public Display Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            placeholder="Engineering Leader"
                                            className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-light"
                                        />
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Professional Bio</label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Building the future of X at Y..."
                                        rows={3}
                                        className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3 px-4 text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-light resize-none"
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                                        <X size={14} /> {error}
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 py-3 px-6 rounded-2xl border border-white/5 text-zinc-400 font-medium hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || (isAvailable === false && (dbUser && username !== dbUser.username)) || username.length < 3}
                                        className="flex-1 py-3 px-6 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-xl shadow-white/5 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Save Profile"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
