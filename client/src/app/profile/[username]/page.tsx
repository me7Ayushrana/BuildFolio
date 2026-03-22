"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import RepoCard from "@/components/RepoCard";
import { fetchGitHubRepos, GitHubRepo } from "@/lib/github";
import axios from "axios";
import { Github, Globe, Mail, MapPin, Twitter } from "lucide-react";

export default function ProfilePage() {
    const { username } = useParams();
    const [user, setUser] = useState<any>(null);
    const [projects, setProjects] = useState([]);
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user data from backend
                const userRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${username}`);
                setUser(userRes.data);

                // Fetch projects
                const projectsRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/user/${username}`);
                setProjects(projectsRes.data);

                // Fetch GitHub repos
                if (userRes.data.githubUsername) {
                    const githubRepos = await fetchGitHubRepos(userRes.data.githubUsername);
                    setRepos(githubRepos);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (username) fetchData();
    }, [username]);

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-800 border-t-white"></div>
        </div>
    );

    if (!user) return (
        <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
            <Navbar />
            <div className="flex flex-1 items-center justify-center">
                <h1 className="text-2xl font-bold">User Not Found</h1>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Navbar />

            {/* Profile Header */}
            <div className="border-b border-zinc-900 bg-zinc-900/10 py-12">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <img
                            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
                            alt={user.displayName}
                            className="h-32 w-32 rounded-3xl border-2 border-zinc-800 shadow-xl"
                        />
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl font-bold tracking-tight text-white">{user.displayName}</h1>
                            <p className="mt-2 text-zinc-400 font-medium">@{user.username}</p>
                            <p className="mt-4 max-w-2xl text-zinc-500 leading-relaxed">{user.bio || "No bio yet."}</p>

                            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-zinc-400">
                                <div className="flex items-center gap-1.5"><Mail size={14} /> {user.email}</div>
                                {user.githubUsername && (
                                    <a href={`https://github.com/${user.githubUsername}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                                        <Github size={14} /> {user.githubUsername}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content: Projects */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold mb-8">Projects</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {projects.length > 0 ? projects.map((project: any) => (
                                    <div key={project._id} className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 transition-all">
                                        <div className="aspect-video w-full bg-zinc-800 relative">
                                            {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="h-full w-full object-cover" />}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                                            <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{project.description}</p>
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {project.techStack.map((tech: string) => (
                                                    <span key={tech} className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-300 border border-zinc-700">{tech}</span>
                                                ))}
                                            </div>
                                            <div className="flex gap-4">
                                                <a href={project.githubLink} className="text-zinc-500 hover:text-white transition-colors"><Github size={18} /></a>
                                                {project.liveLink && <a href={project.liveLink} className="text-zinc-500 hover:text-white transition-colors"><Globe size={18} /></a>}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-2 py-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                                        No projects showcased yet.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar: Repos & Skills */}
                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                                GitHub Repos <span className="text-xs font-normal text-zinc-500 bg-zinc-900 px-2 py-1 rounded-full">{repos.length}</span>
                            </h2>
                            <div className="space-y-4">
                                {repos.length > 0 ? repos.map((repo) => (
                                    <RepoCard key={repo.id} repo={repo} />
                                )) : (
                                    <div className="py-8 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                                        No public repositories found.
                                    </div>
                                )}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-6">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {user.skills.length > 0 ? user.skills.map((skill: string) => (
                                    <span key={skill} className="px-3 py-1 rounded-full bg-zinc-900 text-sm font-medium border border-zinc-800">{skill}</span>
                                )) : (
                                    <div className="text-zinc-500 text-sm">No skills listed yet.</div>
                                )}
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
}
