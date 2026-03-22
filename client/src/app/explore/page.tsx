"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Search, Filter, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ExplorePage() {
    const [projects, setProjects] = useState([]);
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
            setProjects(res.data.projects);
        } catch (error) {
            console.error("Error fetching projects:", error);
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

            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Explore Projects</h1>
                        <p className="mt-2 text-zinc-500">Discover what other developers are building.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-sm focus:border-zinc-500 outline-none transition-colors w-64"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <select
                                value={techFilter}
                                onChange={(e) => setTechFilter(e.target.value)}
                                className="pl-10 pr-8 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-sm focus:border-zinc-500 outline-none appearance-none transition-colors cursor-pointer"
                            >
                                <option value="">All Tech</option>
                                <option value="React">React</option>
                                <option value="Next.js">Next.js</option>
                                <option value="Node.js">Node.js</option>
                                <option value="TypeScript">TypeScript</option>
                                <option value="Tailwind">Tailwind</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-80 rounded-3xl bg-zinc-900/50 animate-pulse border border-zinc-800"></div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProjects.map((project: any) => (
                                <Link
                                    key={project._id}
                                    href={`/profile/${project.userId.username}`}
                                    className="group relative flex flex-col rounded-3xl border border-zinc-800 bg-zinc-900/20 p-6 hover:border-zinc-700 transition-all hover:bg-zinc-900/40 shadow-xl"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <img
                                            src={project.userId.photoURL}
                                            alt={project.userId.displayName}
                                            className="h-8 w-8 rounded-full border border-zinc-800"
                                        />
                                        <span className="text-xs font-medium text-zinc-400">@{project.userId.username}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                                    <p className="text-sm text-zinc-500 line-clamp-2 mb-6 flex-1">{project.description}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            {project.techStack.slice(0, 2).map((tech: string) => (
                                                <span key={tech} className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-400 border border-zinc-700">{tech}</span>
                                            ))}
                                            {project.techStack.length > 2 && (
                                                <span className="text-[10px] text-zinc-600 self-center">+{project.techStack.length - 2}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                                            View Profile <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {filteredProjects.length === 0 && (
                            <div className="py-24 text-center">
                                <p className="text-zinc-500">No projects found matching your criteria.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
