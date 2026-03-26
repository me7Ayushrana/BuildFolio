"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Search, Filter, Heart, MessageCircle, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { PREMIUM_PROJECTS } from "@/lib/premiumData";

export default function ExplorePage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [techFilter, setTechFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchProjects();
    }, [techFilter]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/explore`, {
                params: { tech: techFilter }
            });
            if (res.data.projects && res.data.projects.length > 0) {
                setProjects(res.data.projects);
            } else {
                setProjects(PREMIUM_PROJECTS);
            }
        } catch (error) {
            console.error("Error fetching projects, showing premium fallback:", error);
            setProjects(PREMIUM_PROJECTS);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter((p: any) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Navbar />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Search & Filter Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search tools & projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm focus:border-zinc-500 outline-none transition-all placeholder:text-zinc-600"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                        {["React", "Next.js", "Node.js", "TypeScript", "Tailwind"].map(tech => (
                            <button
                                key={tech}
                                onClick={() => setTechFilter(techFilter === tech ? "" : tech)}
                                className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${tech === techFilter
                                    ? "bg-white text-black border-white"
                                    : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-white"
                                    }`}
                            >
                                {tech}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="aspect-square rounded-2xl bg-zinc-900/50 animate-pulse border border-zinc-800"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProjects.map((project: any) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="group relative aspect-square overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800"
                            >
                                <Link href={`/profile/${project.userId.username}`}>
                                    {project.imageUrl ? (
                                        <img src={project.imageUrl} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-zinc-900">
                                            <Zap size={32} className="text-zinc-800" />
                                        </div>
                                    )}
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                                        <div className="flex gap-6 text-white font-bold">
                                            <div className="flex items-center gap-1.5">
                                                <Heart size={20} fill="white" />
                                                <span>{project.likes?.length || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MessageCircle size={20} fill="white" />
                                                <span>{project.comments?.length || 0}</span>
                                            </div>
                                        </div>
                                        <div className="text-[10px] uppercase font-black tracking-tighter text-zinc-400">
                                            by @{project.userId.username}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!loading && filteredProjects.length === 0 && (
                    <div className="py-24 text-center">
                        <p className="text-zinc-500 font-bold uppercase tracking-widest">No matching spotlights found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
