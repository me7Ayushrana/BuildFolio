"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { User, AtSign, Check, X, Loader2, Sparkles, Rocket, Target, Code2, Heart, Zap } from "lucide-react";

const ROLES = [
    "Frontend Developer", "Backend Developer", "Fullstack Engineer",
    "AI / ML Researcher", "UI/UX Designer", "DevOps Engineer", "Mobile Developer"
];

const GOALS = [
    "Build Portfolio", "Network with Engineers", "Find Co-founders",
    "Showcase Side Projects", "Learn from Top Devs"
];

const SUGGESTED_SKILLS = [
    "React", "Next.js", "TypeScript", "Node.js", "Python", "Rust",
    "Go", "TailwindCSS", "Framer Motion", "Three.js", "PyTorch", "Docker"
];

export default function OnboardingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { user, dbUser, token } = useAuth();
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [role, setRole] = useState("");
    const [goals, setGoals] = useState<string[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState("");

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
            setRole(dbUser.role || "");
            setGoals(dbUser.goals || []);
            setSkills(dbUser.skills || []);
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
                await axios.get(`${API_URL}/users/${username}`);
                setIsAvailable(false);
            } catch (err: any) {
                if (err.response?.status === 404) {
                    setIsAvailable(true);
                }
            } finally {
                setIsChecking(false);
            }
        };

        const timeoutId = setTimeout(checkUsername, 500);
        return () => clearTimeout(timeoutId);
    }, [username, dbUser]);

    const handleGoalToggle = (goal: string) => {
        setGoals(prev => prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]);
    };

    const handleAddSkill = (skill: string) => {
        const s = skill.trim();
        if (s && !skills.includes(s)) {
            setSkills([...skills, s]);
            setSkillInput("");
        }
    };

    const handleRemoveSkill = (skill: string) => {
        setSkills(skills.filter(s => s !== skill));
    };

    const handleSubmit = async () => {
        if (!isAvailable && (dbUser && username !== dbUser.username)) return;

        setIsSubmitting(true);
        setError("");

        try {
            await axios.put(
                `${API_URL}/users/profile`,
                {
                    username,
                    displayName,
                    bio,
                    role,
                    goals,
                    skills,
                    onboarded: true
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onClose();
            window.location.reload();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to sync profile. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/95 backdrop-blur-xl"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 40 }}
                    className="relative w-full max-w-6xl h-[85vh] rounded-[3rem] border border-white/5 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col md:flex-row"
                >
                    {/* Progress Bar Top */}
                    <div className="absolute top-0 left-0 right-0 h-1 flex">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`flex-1 transition-all duration-700 ${step >= i ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-zinc-900'}`} />
                        ))}
                    </div>

                    {/* Left: Form Content */}
                    <div className="flex-1 p-8 md:p-14 overflow-y-auto custom-scrollbar relative z-10">
                        <div className="mb-12">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-2 block">Phase {step} of 3</span>
                            <h2 className="text-4xl font-black text-white tracking-tighter">
                                {step === 1 && "Identity Protocol"}
                                {step === 2 && "The Aspiration"}
                                {step === 3 && "Core Toolkit"}
                            </h2>
                            <p className="text-zinc-500 mt-2 font-medium">
                                {step === 1 && "Establish your presence in the builder ecosystem."}
                                {step === 2 && "What drives your craft and where are you heading?"}
                                {step === 3 && "The technologies that power your breakthroughs."}
                            </p>
                        </div>

                        <div className="space-y-10">
                            {step === 1 && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Universal Username</label>
                                        <div className="relative group">
                                            <AtSign className={`absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${isAvailable === true ? 'text-green-500' : isAvailable === false ? 'text-red-500' : 'text-zinc-600'}`} />
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                                                placeholder="username"
                                                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 pl-12 pr-12 text-xl text-white placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-black"
                                            />
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                                {isChecking ? <Loader2 className="animate-spin text-blue-500" size={18} /> :
                                                    isAvailable === true ? <Check className="text-green-500" size={20} /> :
                                                        isAvailable === false ? <X className="text-red-500" size={20} /> : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Public Moniker</label>
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            placeholder="Display Name"
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 px-6 text-xl text-white placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-black"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Mission Statement (Bio)</label>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            placeholder="Describe your architectural breakthroughs..."
                                            rows={3}
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 px-6 text-zinc-300 placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all resize-none font-medium leading-relaxed"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Primary Specialization</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {ROLES.map(r => (
                                                <button
                                                    key={r}
                                                    onClick={() => setRole(r)}
                                                    className={`px-4 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${role === r ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-white/20'}`}
                                                >
                                                    {r}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Network Goals</label>
                                        <div className="flex flex-wrap gap-3">
                                            {GOALS.map(g => (
                                                <button
                                                    key={g}
                                                    onClick={() => handleGoalToggle(g)}
                                                    className={`px-5 py-3 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 ${goals.includes(g) ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-white/20'}`}
                                                >
                                                    {goals.includes(g) ? <Check size={14} /> : <Target size={14} />}
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Active Tech Stack</label>
                                        <div className="relative group">
                                            <Code2 className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-blue-500" />
                                            <input
                                                type="text"
                                                value={skillInput}
                                                onChange={(e) => setSkillInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(skillInput)}
                                                placeholder="Add technology (e.g. CUDA, GPT-4, Rust)..."
                                                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 pl-12 pr-6 text-white placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-bold"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map(s => (
                                                <div key={s} className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                    {s}
                                                    <button onClick={() => handleRemoveSkill(s)} className="hover:text-white"><X size={12} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Suggested</label>
                                        <div className="flex flex-wrap gap-2">
                                            {SUGGESTED_SKILLS.filter(s => !skills.includes(s)).slice(0, 10).map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => handleAddSkill(s)}
                                                    className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/5 text-[10px] text-zinc-500 font-black uppercase tracking-widest hover:border-white/20 hover:text-white transition-all"
                                                >
                                                    + {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {error && <p className="text-red-400 text-xs font-black uppercase tracking-widest">{error}</p>}
                                </motion.div>
                            )}
                        </div>

                        <div className="mt-16 flex items-center gap-4">
                            {step > 1 && (
                                <button onClick={prevStep} className="px-10 py-5 rounded-2xl border border-white/5 text-zinc-500 hover:text-white hover:bg-white/5 transition-all text-sm font-black uppercase tracking-widest">
                                    Previous
                                </button>
                            )}
                            {step < 3 ? (
                                <button
                                    onClick={nextStep}
                                    disabled={step === 1 && (!username || !displayName || isAvailable === false)}
                                    className="flex-1 py-5 rounded-2xl bg-blue-600 text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-500 disabled:opacity-30 transition-all active:scale-95 shadow-xl shadow-blue-500/20"
                                >
                                    Proceed to Phase {step + 1}
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || skills.length === 0}
                                    className="flex-1 py-5 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all active:scale-95 shadow-2xl shadow-white/10 flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><Rocket size={20} /> Synchronize Profile</>}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: Live Card Preview (Consistency with Project Modal) */}
                    <div className="hidden md:flex flex-1 p-14 items-center justify-center bg-zinc-900/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-blue-500/20 transition-colors duration-1000" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -ml-64 -mb-64 group-hover:bg-purple-500/20 transition-colors duration-1000" />

                        <div className="w-full max-w-sm relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 block mb-8 text-center">Identity Hologram</span>

                            {/* Profile Card Mockup */}
                            <div className="bg-zinc-950/80 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl relative">
                                <div className="absolute top-6 right-6">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <Zap size={18} className="text-blue-500" />
                                    </div>
                                </div>

                                <div className="p-10 space-y-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-blue-500 to-purple-600 p-0.5">
                                            <div className="w-full h-full rounded-[1.4rem] bg-zinc-950 flex items-center justify-center overflow-hidden">
                                                {dbUser?.photoURL || user?.photoURL ? (
                                                    <img src={dbUser?.photoURL || user?.photoURL || ""} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={32} className="text-zinc-700" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-black text-white leading-none tracking-tighter">{displayName || "Anonymous Builder"}</h3>
                                            <p className="text-blue-500 text-xs font-black uppercase tracking-widest">@{username || "handle"}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {role && (
                                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 inline-block text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                                {role}
                                            </div>
                                        )}

                                        <p className="text-sm text-zinc-400 font-medium leading-relaxed italic">
                                            "{bio || "Your technical mission statement will reflect here..."}"
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {skills.length > 0 ? (
                                                skills.slice(0, 6).map(s => (
                                                    <div key={s} className="px-2 py-1 rounded-lg bg-zinc-900 border border-white/5 text-[8px] font-black text-zinc-500 uppercase tracking-widest">{s}</div>
                                                ))
                                            ) : (
                                                <div className="text-[10px] text-zinc-800 font-black uppercase tracking-widest">Awaiting Toolkit...</div>
                                            )}
                                        </div>

                                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-zinc-950 bg-zinc-800" />)}
                                            </div>
                                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Protocol Verified</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Simple close just in case */}
                    {!dbUser?.onboarded && (
                        <button onClick={onClose} className="absolute top-8 right-8 p-2 text-zinc-600 hover:text-white transition-colors z-[110]">
                            <X size={24} />
                        </button>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
