"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Search, Filter, Heart, MessageCircle, Zap, User, BadgeCheck, Sparkles, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PREMIUM_PROJECTS } from "@/lib/premiumData";
import { Project, UserProfile } from "@/types";
import Image from "next/image";

const ROLES = ["Frontend", "Backend", "Fullstack", "AI / ML", "UI/UX", "Mobile", "DevOps"];
const TECH = ["React", "Next.js", "Node.js", "TypeScript", "Tailwind", "Rust", "Go", "Python"];

export default function ExplorePage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [builders, setBuilders] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [techFilter, setTechFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';

    useEffect(() => {
        fetchTrendingBuilders();
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [techFilter, roleFilter]);

    const fetchTrendingBuilders = async () => {
        try {
            const res = await axios.get(`${API_URL}/users/trending-builders`);
            setBuilders(res.data);
        } catch (error) {
            console.error("Error fetching builders:", error);
        }
    };

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/explore`, {
                params: { tech: techFilter, role: roleFilter }
            });
            if (res.data.projects && res.data.projects.length > 0) {
                setProjects(res.data.projects);
            } else {
                setProjects(PREMIUM_PROJECTS as unknown as Project[]);
            }
        } catch (error) {
            console.error("Error fetching projects, showing premium fallback:", error);
            setProjects(PREMIUM_PROJECTS as unknown as Project[]);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter((p: Project) =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-24">
            <Navbar />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                {/* Discovery Header */}
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-8"
                    >
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                                <Sparkles size={12} className="fill-current" /> Discovery Protocol
                            </div>
                            <h1 className="text-5xl font-black tracking-tighter uppercase italic">
                                Discovery <span className="text-zinc-700">Hub</span>
                            </h1>
                            <p className="text-zinc-500 font-medium max-w-lg">
                                Scout the most advanced technological breakthroughs and the engineers who built them.
                            </p>
                        </div>

                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Scan blueprints & projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-sm font-bold focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-zinc-700"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Trending Builders Section */}
                <div className="mb-20">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <TrendingUp size={20} className="text-blue-500" />
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Trending Builders</h2>
                        </div>
                        <Link href="/explore/builders" className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors flex items-center gap-1">
                            Registry <ChevronRight size={12} />
                        </Link>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar snap-x">
                        {builders.length > 0 ? builders.map((builder) => (
                            <motion.div
                                key={builder._id}
                                whileHover={{ y: -5 }}
                                className="flex-shrink-0 w-64 snap-start p-6 rounded-[2rem] bg-zinc-900 border border-white/5 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Link href={`/profile/${builder.username}`} className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-2xl p-0.5 bg-gradient-to-tr from-blue-500 to-indigo-600 mb-4 ring-4 ring-zinc-950">
                                        <div className="w-full h-full rounded-2xl bg-zinc-900 overflow-hidden relative">
                                            {builder.photoURL ? (
                                                <Image
                                                    src={builder.photoURL}
                                                    alt={builder.displayName || builder.username}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-800 font-black text-2xl uppercase">{builder.username?.[0]}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <h3 className="text-sm font-black text-white hover:text-blue-400 transition-colors uppercase tracking-tight">{builder.displayName || builder.username}</h3>
                                        <BadgeCheck size={14} className="text-blue-500 fill-blue-500/10" />
                                    </div>
                                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-4">@{builder.username}</p>
                                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">
                                        {builder.role || "Builder"}
                                    </div>
                                </Link>
                            </motion.div>
                        )) : (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="flex-shrink-0 w-64 h-60 rounded-[2rem] bg-zinc-900/50 border border-white/5 animate-pulse" />
                            ))
                        )}
                    </div>
                </div>

                {/* Filters Section */}
                <div className="mb-12 space-y-8">
                    {/* Role Filter */}
                    <div className="flex flex-wrap gap-2">
                        {ROLES.map(role => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(roleFilter === role ? "" : role)}
                                className={`px-5 py-2.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${role === roleFilter
                                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20"
                                    : "bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/10 hover:text-white"
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>

                    {/* Tech Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-t border-white/5 pt-8">
                        {TECH.map(tech => (
                            <button
                                key={tech}
                                onClick={() => setTechFilter(techFilter === tech ? "" : tech)}
                                className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${tech === techFilter
                                    ? "bg-white text-black border-white"
                                    : "bg-zinc-900/50 text-zinc-600 border-white/5 hover:border-white/10 hover:text-white"
                                    }`}
                            >
                                {tech}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Grid */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-zinc-900/50 animate-pulse border border-white/5" />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {filteredProjects.map((project: any) => (
                                <motion.div
                                    key={project._id}
                                    layout
                                    className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-white/5"
                                >
                                    <Link href={`/profile/${project.userId?.username}`}>
                                        <div className="absolute inset-0 bg-zinc-950">
                                            {project.imageUrl ? (
                                                <Image
                                                    src={project.imageUrl}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <Zap size={48} className="text-zinc-900 fill-zinc-900" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Premium Glass Overlay */}
                                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pt-20">
                                            <div className="space-y-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <h3 className="text-xl font-black text-white leading-none tracking-tighter uppercase italic">{project.title}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">by @{project.userId?.username}</span>
                                                    <BadgeCheck size={12} className="text-blue-500" />
                                                </div>

                                                <div className="flex items-center gap-4 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                                    <div className="flex items-center gap-1.5 text-white">
                                                        <Heart size={14} className="fill-blue-500 text-blue-500" />
                                                        <span className="text-xs font-black">{project.likes?.length || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-white">
                                                        <MessageCircle size={14} className="text-zinc-400" />
                                                        <span className="text-xs font-black text-zinc-400">{project.comments?.length || 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {!loading && filteredProjects.length === 0 && (
                    <div className="py-40 text-center space-y-4 border-2 border-dashed border-white/5 rounded-[3rem]">
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto">
                            <Search className="text-zinc-700" size={32} />
                        </div>
                        <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-xs">No matching blueprints detected</p>
                    </div>
                )}
            </div>
        </div>
    );
}
