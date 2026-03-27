"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Plus, Trash2, Github, Globe, Save, X } from "lucide-react";
import { UserProfile, Project } from "@/types";
import { toast } from "react-hot-toast";

export default function Dashboard() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isAddingProject, setIsAddingProject] = useState(false);
    const [newProject, setNewProject] = useState({
        title: "",
        description: "",
        techStack: "",
        githubLink: "",
        liveLink: "",
        imageUrl: ""
    });

    const [editProfile, setEditProfile] = useState({
        displayName: "",
        bio: "",
        skills: "",
        githubUsername: ""
    });

    const fetchProfile = async (username: string) => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${username}`);
            setProfile(res.data);
            setEditProfile({
                displayName: res.data.displayName || "",
                bio: res.data.bio || "",
                skills: res.data.skills?.join(", ") || "",
                githubUsername: res.data.githubUsername || ""
            });

            const projRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/user/${username}`);
            setProjects(projRes.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    useEffect(() => {
        if (user?.email) {
            const username = user.email.split('@')[0];
            fetchProfile(username);
        }
    }, [user]);

    const handleUpdateProfile = async () => {
        try {
            const token = await user?.getIdToken();
            await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile`,
                {
                    ...editProfile,
                    skills: editProfile.skills.split(",").map(s => s.trim()).filter(s => s !== "")
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Profile updated successfully!");
            if (user?.email) fetchProfile(user.email.split('@')[0]);
        } catch (error) {
            toast.error("Failed to update profile.");
        }
    };

    const handleAddProject = async () => {
        try {
            const token = await user?.getIdToken();
            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects`,
                {
                    ...newProject,
                    techStack: newProject.techStack.split(",").map(s => s.trim()).filter(s => s !== "")
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Project added!");
            setIsAddingProject(false);
            setNewProject({ title: "", description: "", techStack: "", githubLink: "", liveLink: "", imageUrl: "" });
            if (user?.email) fetchProfile(user.email.split('@')[0]);
        } catch (error) {
            toast.error("Failed to add project.");
        }
    };

    const handleDeleteProject = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            const token = await user?.getIdToken();
            await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Project deleted.");
            if (user?.email) fetchProfile(user.email.split('@')[0]);
        } catch (error) {
            toast.error("Failed to delete project.");
        }
    };

    if (!user) return (
        <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
            <Navbar />
            <div className="flex flex-1 items-center justify-center">
                <h1 className="text-xl">Please log in to access your dashboard.</h1>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-24">
            <Navbar />

            <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Sidebar: Profile Settings */}
                    <div className="space-y-8">
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                            <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 block">Display Name</label>
                                    <input
                                        type="text"
                                        value={editProfile.displayName}
                                        onChange={(e) => setEditProfile({ ...editProfile, displayName: e.target.value })}
                                        className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm focus:border-zinc-500 outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 block">Bio</label>
                                    <textarea
                                        value={editProfile.bio}
                                        onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                                        rows={3}
                                        className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm focus:border-zinc-500 outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 block">Skills (comma separated)</label>
                                    <input
                                        type="text"
                                        value={editProfile.skills}
                                        onChange={(e) => setEditProfile({ ...editProfile, skills: e.target.value })}
                                        placeholder="React, Node.js, TypeScript"
                                        className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm focus:border-zinc-500 outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 block">GitHub Username</label>
                                    <input
                                        type="text"
                                        value={editProfile.githubUsername}
                                        onChange={(e) => setEditProfile({ ...editProfile, githubUsername: e.target.value })}
                                        className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm focus:border-zinc-500 outline-none transition-colors"
                                    />
                                </div>
                                <button
                                    onClick={handleUpdateProfile}
                                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-white py-2 text-sm font-bold text-black hover:bg-zinc-200 transition-colors mt-4"
                                >
                                    <Save size={16} /> Save Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Projects Management */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Manage Projects</h2>
                            <button
                                onClick={() => setIsAddingProject(true)}
                                className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs font-medium hover:bg-zinc-800 transition-colors"
                            >
                                <Plus size={14} /> Add Project
                            </button>
                        </div>

                        {isAddingProject && (
                            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 animate-in fade-in zoom-in duration-200">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold">New Project Showcase</h3>
                                    <button onClick={() => setIsAddingProject(false)}><X size={18} className="text-zinc-500 hover:text-white" /></button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1 block">Title</label>
                                        <input
                                            type="text"
                                            value={newProject.title}
                                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                            className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1 block">Description</label>
                                        <textarea
                                            value={newProject.description}
                                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                            className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1 block">GitHub Link</label>
                                        <input
                                            type="text"
                                            value={newProject.githubLink}
                                            onChange={(e) => setNewProject({ ...newProject, githubLink: e.target.value })}
                                            className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1 block">Live Demo Link</label>
                                        <input
                                            type="text"
                                            value={newProject.liveLink}
                                            onChange={(e) => setNewProject({ ...newProject, liveLink: e.target.value })}
                                            className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1 block">Tech Stack (comma separated)</label>
                                        <input
                                            type="text"
                                            value={newProject.techStack}
                                            onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                                            placeholder="React, Three.js, Tailwind"
                                            className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm outline-none"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddProject}
                                    className="w-full rounded-lg bg-white py-2 text-sm font-bold text-black hover:bg-zinc-200 transition-colors mt-6"
                                >
                                    Create Project
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {projects.map((project: Project) => (
                                <div key={project._id} className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-white">{project.title}</h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleDeleteProject(project._id)}
                                                className="p-1.5 rounded-md hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-zinc-400 line-clamp-2">{project.description}</p>
                                    <div className="mt-auto flex justify-between items-center">
                                        <div className="flex gap-3">
                                            <Github size={16} className="text-zinc-600" />
                                            <Globe size={16} className="text-zinc-600" />
                                        </div>
                                        <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-tighter">
                                            {project.techStack.length} Technologies
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {projects.length === 0 && !isAddingProject && (
                                <div className="col-span-2 py-24 text-center border border-dashed border-zinc-800 rounded-3xl">
                                    <p className="text-zinc-500">Your showcase is empty. Start by adding your first project.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
