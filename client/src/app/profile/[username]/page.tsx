"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import RepoCard from "@/components/RepoCard";
import ProjectFeedCard from "@/components/ProjectFeedCard";
import { fetchGitHubRepos as getRepos } from "@/lib/github";
import axios from "axios";
import {
    Github,
    Grid,
    Layers,
    Bookmark,
    Settings,
    Zap,
    MessageCircle,
    BadgeCheck,
    Users,
    UserPlus,
    X,
    Maximize2,
    Sparkles
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import FollowButton from "@/components/FollowButton";
import UserListModal from "@/components/UserListModal";
import RepoGalaxyView from "@/components/RepoGalaxyView";
import { generateGraphData } from "@/lib/graphUtils";
import Image from "next/image";

export default function ProfilePage() {
    const { username } = useParams();
    const { user: authUser, dbUser, token } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [repos, setRepos] = useState<any[]>([]);
    const [savedProjects, setSavedProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ followers: 0, following: 0, projects: 0 });
    const [activeTab, setActiveTab] = useState("projects");

    // Modal state
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [listModalType, setListModalType] = useState<'followers' | 'following'>('followers');
    const [isGalaxyOpen, setIsGalaxyOpen] = useState(false);
    const [galaxyData, setGalaxyData] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
    const [isGalaxyLoading, setIsGalaxyLoading] = useState(false);

    useEffect(() => {
        if (username) fetchProfileData();
    }, [username, authUser]);

    const fetchProfileData = async () => {
        setLoading(true);
        try {
            // Fetch User Profile
            const userRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${username}`);
            const userData = userRes.data;
            setProfile(userData);

            setStats({
                followers: userData.followers?.length || 0,
                following: userData.following?.length || 0,
                projects: 0
            });

            // Fetch User Projects
            const projectsRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/user/${username}`);
            setProjects(projectsRes.data);
            setStats(prev => ({ ...prev, projects: projectsRes.data.length }));

            // Fetch GitHub Repos if username present
            if (userData.githubUsername) {
                const githubRepos = await getRepos(userData.githubUsername);
                setRepos(githubRepos);
            }

            // If it's the current user's profile, fetch saved projects
            if (dbUser && (dbUser.username === username || dbUser.firebaseId === profile?.firebaseId)) {
                // Actually, let's just fetch all projects and filter by likes/saves for simplicity if we don't have a dedicated endpoint yet
                // Or better, we can assume the user model has the saved IDs
                if (userData.savedProjects?.length > 0) {
                    const allProjectsRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects`, {
                        headers: token ? { Authorization: `Bearer ${token}` } : {}
                    });
                    setSavedProjects(allProjectsRes.data.filter((p: any) => p.isSaved));
                }
            }

        } catch (error) {
            console.error("Error fetching profile data:", error);
        } finally {
            setLoading(false);
        }
    };

    const openListModal = (type: 'followers' | 'following') => {
        setListModalType(type);
        setIsListModalOpen(true);
    };

    const toggleGalaxy = async () => {
        if (isGalaxyOpen) {
            setIsGalaxyOpen(false);
            return;
        }

        if (repos.length === 0) {
            toast.error("No repositories found to visualize");
            return;
        }

        setIsGalaxyOpen(true);
        if (galaxyData.nodes.length > 0) return;

        setIsGalaxyLoading(true);
        try {
            const primaryRepo = repos[0];
            const defaultBranch = primaryRepo.default_branch || "main";
            const treeRes = await axios.get(`https://api.github.com/repos/${profile.githubUsername}/${primaryRepo.name}/git/trees/${defaultBranch}?recursive=1`);

            const filteredTree = treeRes.data.tree
                .filter((item: any) => item.type === "blob" || item.type === "tree")
                .slice(0, 200);

            const { nodes, edges } = generateGraphData(filteredTree);
            setGalaxyData({ nodes, edges });
        } catch (err) {
            console.error(err);
            toast.error("Interlink failed: Unable to fetch repository mapping");
            setIsGalaxyOpen(false);
        } finally {
            setIsGalaxyLoading(false);
        }
    };

    const isOwnProfile = dbUser && (dbUser.username === username || dbUser.firebaseId === profile?.firebaseId);

    // Skeleton Component
    const ProfileSkeleton = () => (
        <div className="min-h-screen bg-slate-950 text-white pb-24 animate-pulse">
            <Navbar />
            <div className="mx-auto max-w-5xl px-4 pt-28">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-20 mb-20 bg-slate-900/10 p-8 rounded-[40px] border border-white/5">
                    <div className="h-40 w-40 md:h-52 md:w-52 rounded-full bg-zinc-900" />
                    <div className="flex-1 space-y-6 pt-4 w-full">
                        <div className="h-10 w-48 bg-zinc-900 rounded-xl" />
                        <div className="flex gap-8">
                            <div className="h-12 w-20 bg-zinc-900 rounded-lg" />
                            <div className="h-12 w-20 bg-zinc-900 rounded-lg" />
                            <div className="h-12 w-20 bg-zinc-900 rounded-lg" />
                        </div>
                        <div className="h-4 w-full max-w-md bg-zinc-900 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading && !profile) return <ProfileSkeleton />;

    if (!profile && !loading) return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-800">Decryption Failed</h1>
                    <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest">Profile not found in secure archives</p>
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-slate-950 text-white pb-24"
        >
            <Navbar />

            <div className="mx-auto max-w-5xl px-4 pt-28">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-20 mb-20 bg-slate-900/10 p-8 rounded-[40px] border border-slate-800/40 backdrop-blur-sm">
                    <div className="relative group shrink-0">
                        <div className="h-40 w-40 md:h-52 md:w-52 rounded-full p-1.5 bg-gradient-to-tr from-blue-600 via-blue-400 to-indigo-600 shadow-2xl shadow-blue-500/20 group-hover:scale-105 transition-transform duration-500">
                            <div className="h-full w-full rounded-full border-4 border-slate-950 bg-slate-900 overflow-hidden relative">
                                {profile.photoURL ? (
                                    <Image src={profile.photoURL} alt={profile.displayName} fill className="object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-4xl font-black text-slate-800 uppercase">
                                        {profile.username?.[0]}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center md:items-start space-y-8 pt-4">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black tracking-tighter uppercase text-white">{profile.username}</h1>
                                <BadgeCheck size={24} className="text-blue-500 fill-current" />
                            </div>
                            <div className="flex gap-3">
                                {isOwnProfile ? (
                                    <>
                                        <button className="rounded-full bg-slate-800 border border-slate-700 px-6 py-2 text-[10px] font-black hover:bg-slate-700 transition-all uppercase tracking-widest">Manage Intel</button>
                                        <button className="rounded-full bg-slate-800 border border-slate-700 p-2.5 hover:bg-slate-700"><Settings size={18} /></button>
                                    </>
                                ) : (
                                    <>
                                        <FollowButton targetUserId={profile._id} initialIsFollowing={false} onStatusChange={(s) => setStats(prev => ({ ...prev, followers: s ? prev.followers + 1 : prev.followers - 1 }))} />
                                        <button className="rounded-full bg-slate-800 border border-slate-700 px-6 py-2 text-[10px] font-black hover:bg-slate-700 uppercase tracking-widest">Secure Comms</button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Engagement Bar */}
                        <div className="flex gap-12 border-y md:border-none border-slate-900/50 py-6 md:py-0 w-full md:w-auto overflow-x-auto">
                            <div className="flex flex-col items-center md:items-start group cursor-default">
                                <span className="font-black text-2xl tracking-tighter text-white">{stats.projects}</span>
                                <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] group-hover:text-blue-400 transition-colors">Spotlights</span>
                            </div>
                            <button
                                onClick={() => openListModal('followers')}
                                className="flex flex-col items-center md:items-start group transition-all"
                            >
                                <span className="font-black text-2xl tracking-tighter text-white group-hover:text-blue-400">{stats.followers}</span>
                                <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] group-hover:text-blue-300">Agents</span>
                            </button>
                            <button
                                onClick={() => openListModal('following')}
                                className="flex flex-col items-center md:items-start group transition-all"
                            >
                                <span className="font-black text-2xl tracking-tighter text-white group-hover:text-blue-400">{stats.following}</span>
                                <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] group-hover:text-blue-300">Tracking</span>
                            </button>
                        </div>

                        <div className="space-y-3 text-center md:text-left max-w-lg">
                            <p className="font-black text-sm tracking-tight text-blue-400/80 uppercase">{profile.displayName}</p>
                            <p className="text-sm text-slate-400 leading-relaxed font-medium">{profile.bio || "No bio decrypted yet. Operating in stealth mode."}</p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                                {profile.githubUsername && (
                                    <a href={`https://github.com/${profile.githubUsername}`} target="_blank" className="flex items-center gap-2 text-[10px] font-black text-white bg-slate-900 px-4 py-2 rounded-full border border-slate-800 hover:border-blue-500/50 transition-all group">
                                        <Github size={14} className="group-hover:rotate-12 transition-transform" />
                                        GITHUB.COM/{profile.githubUsername.toUpperCase()}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Production Tabs Navigation */}
                <div className="flex justify-center border-b border-slate-900/60 sticky top-[72px] bg-slate-950/80 backdrop-blur-md z-10 px-4">
                    <div className="flex gap-8 md:gap-20">
                        {[
                            { id: "projects", icon: Grid, label: "Spotlights" },
                            { id: "repos", icon: Layers, label: "Archives" },
                            { id: "saved", icon: Bookmark, label: "Intel Core" }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2.5 py-5 border-b-2 transition-all uppercase tracking-[0.2em] text-[10px] font-black ${activeTab === tab.id ? "border-blue-500 text-blue-400" : "border-transparent text-slate-600 hover:text-slate-400"}`}
                            >
                                <tab.icon size={14} className={activeTab === tab.id ? "text-blue-500" : ""} />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="mt-12">
                    <AnimatePresence mode="wait">
                        {activeTab === "projects" && (
                            <motion.div
                                key="projects"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {projects.length > 0 ? projects.map((project: any) => (
                                    <ProjectFeedCard key={project._id} project={project} />
                                )) : (
                                    <div className="col-span-full py-40 text-center border-2 border-dashed border-slate-900 rounded-[40px] bg-slate-900/10 backdrop-blur-sm">
                                        <Zap size={48} className="text-slate-800 mx-auto mb-4" />
                                        <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-xs">No active spotlights broadcasted</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === "repos" && (
                            <motion.div
                                key="repos"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {repos.length > 0 ? repos.map((repo) => (
                                    <RepoCard key={repo.id} repo={repo} />
                                )) : (
                                    <div className="col-span-full py-40 text-center border-2 border-dashed border-slate-900 rounded-[40px]">
                                        <Github size={48} className="text-slate-800 mx-auto mb-4" />
                                        <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-xs">Repository Archives Offline</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === "saved" && (
                            <motion.div
                                key="saved"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {savedProjects.length > 0 ? savedProjects.map((project: any) => (
                                    <ProjectFeedCard key={project._id} project={project} />
                                )) : (
                                    <div className="col-span-full py-40 text-center border-2 border-dashed border-slate-900 rounded-[40px]">
                                        <Bookmark size={48} className="text-slate-800 mx-auto mb-4" />
                                        <p className="text-slate-600 font-black uppercase tracking-[0.2em] text-xs">No saved intel in the core</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Modals */}
            <UserListModal
                isOpen={isListModalOpen}
                onClose={() => setIsListModalOpen(false)}
                title={listModalType === 'followers' ? 'Active Agents (Followers)' : 'Tracking Intelligence (Following)'}
                userId={profile._id}
                type={listModalType}
            />

            {/* Immersive Galaxy Overlay */}
            <AnimatePresence>
                {isGalaxyOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                                    <Sparkles size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-sm font-black uppercase italic tracking-tighter text-white">Neural Repository Mapping</h3>
                                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Visualizing {repos[0]?.name || "Archive"}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsGalaxyOpen(false)}
                                className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all ring-1 ring-white/10"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 relative">
                            {isGalaxyLoading ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-zinc-950">
                                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 animate-pulse">Syncing Neural Nodes</p>
                                        <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-2">Deep Architectural Scan in Progress</p>
                                    </div>
                                </div>
                            ) : (
                                <RepoGalaxyView nodes={galaxyData.nodes} edges={galaxyData.edges} />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Immersive Toggle */}
            {profile.githubUsername && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleGalaxy}
                    className="fixed bottom-10 right-10 z-40 flex items-center gap-3 pl-4 pr-6 py-4 rounded-full bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest shadow-[0_20px_50px_rgba(37,99,235,0.4)] hover:shadow-[0_25px_60px_rgba(37,99,235,0.6)] transition-all ring-4 ring-slate-950 group"
                >
                    <div className="p-1.5 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
                        <Sparkles size={16} className="fill-current" />
                    </div>
                    <span>Immersive View</span>
                </motion.button>
            )}
        </motion.div>
    );
}
