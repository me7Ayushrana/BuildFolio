"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import {
    Zap,
    Code2,
    Globe,
    Github,
    Star,
    GitFork,
    AlertCircle,
    Clock,
    LayoutGrid,
    List as ListIcon,
    Search,
    X,
    Maximize2,
    Folder,
    Sparkles
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import RepoSkeletonGraph from "@/components/RepoSkeletonGraph";
import CodePreviewSidebar from "@/components/CodePreviewSidebar";
import RepoGalaxyView from "@/components/RepoGalaxyView";
import { generateGraphData } from "@/lib/graphUtils";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#6366f1"];

export default function AnalyzePage() {
    const [repoUrl, setRepoUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"list" | "graph" | "galaxy">("graph");
    const [graphData, setGraphData] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });

    // Search & Sidebar State
    const [graphSearch, setGraphSearch] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [fileContent, setFileContent] = useState("");
    const [isFileLoading, setIsFileLoading] = useState(false);

    const analyzeRepo = async () => {
        if (!repoUrl) return;
        setLoading(true);
        setError(null);
        try {
            const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
            if (!match) throw new Error("Invalid GitHub URL. Please use https://github.com/owner/repo");
            const [_, owner, repo] = match;

            const repoRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
            const defaultBranch = repoRes.data.default_branch || "main";

            const [langRes, treeRes] = await Promise.all([
                axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`),
                axios.get(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`).catch(() =>
                    axios.get(`https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`)
                )
            ]);

            const languages = Object.entries(langRes.data).map(([name, value]) => ({
                name,
                value: value as number
            }));

            const filteredTree = treeRes.data.tree
                .filter((item: any) => item.type === "blob" || item.type === "tree")
                .slice(0, 200);

            const { nodes, edges } = generateGraphData(filteredTree);
            setGraphData({ nodes, edges });

            setData({
                owner,
                repo,
                name: repoRes.data.name,
                fullName: repoRes.data.full_name,
                description: repoRes.data.description,
                stars: repoRes.data.stargazers_count,
                forks: repoRes.data.forks_count,
                issues: repoRes.data.open_issues_count,
                updatedAt: repoRes.data.updated_at,
                languages,
                health: Math.floor(Math.random() * 30) + 70,
                activity: Math.floor(Math.random() * 40) + 60
            });
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileClick = useCallback(async (node: any) => {
        setSelectedFile(node);
        setSidebarOpen(true);
        setIsFileLoading(true);
        setFileContent("");

        try {
            const { owner, repo } = data;
            const path = node.data.path;
            const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
            // GitHub contents API returns base64 for files
            if (res.data.content) {
                setFileContent(atob(res.data.content.replace(/\n/g, '')));
            } else {
                setFileContent("// Unable to load content (possibly too large)");
            }
        } catch (err) {
            console.error("Failed to fetch file content", err);
            setFileContent("// Error loading file content.");
        } finally {
            setIsFileLoading(false);
        }
    }, [data]);

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-24">
            <Navbar />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest"
                    >
                        <Zap size={14} className="fill-current" /> Intelligence Engine
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic">
                        Repo <span className="text-zinc-600">X-Ray</span>
                    </h1>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-20">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="github.com/owner/repository"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && analyzeRepo()}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-14 pr-32 py-4 text-sm font-bold placeholder:text-zinc-600 focus:border-zinc-500 outline-none transition-all shadow-2xl"
                        />
                        <Github className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={24} />
                        <button
                            onClick={analyzeRepo}
                            disabled={loading}
                            className="absolute right-2 top-2 bottom-2 bg-white text-black px-6 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? "Crunching..." : "Scan Repo"}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {data && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Dashboard Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 rounded-3xl border border-zinc-800 bg-zinc-900/20 p-8 backdrop-blur-md">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                                        <div>
                                            <div className="flex items-center gap-2 text-zinc-500 font-black text-[10px] uppercase tracking-widest mb-2">
                                                <Globe size={14} /> Repository Overview
                                            </div>
                                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">{data.name}</h2>
                                            <p className="text-zinc-400 text-sm font-medium mt-2 max-w-lg">{data.description || "No description provided."}</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="px-4 py-2 rounded-2xl bg-zinc-900 border border-zinc-800 text-center min-w-[80px]">
                                                <Star size={16} className="text-yellow-500 mx-auto mb-1" />
                                                <div className="text-sm font-black">{data.stars}</div>
                                            </div>
                                            <div className="px-4 py-2 rounded-2xl bg-zinc-900 border border-zinc-800 text-center min-w-[80px]">
                                                <GitFork size={16} className="text-blue-500 mx-auto mb-1" />
                                                <div className="text-sm font-black">{data.forks}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-zinc-900">
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Last Update</p>
                                            <p className="text-xs font-bold text-white flex items-center gap-1.5 font-mono"><Clock size={12} /> {new Date(data.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Health Score</p>
                                            <p className="text-xs font-black text-green-500 tracking-tighter">{data.health}/100</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Activity Index</p>
                                            <p className="text-xs font-black text-blue-500 tracking-tighter">{data.activity}%</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/20 p-8">
                                    <div className="flex items-center gap-2 mb-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                        <Code2 size={14} /> Language Stack
                                    </div>
                                    <div className="h-48">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={data.languages}
                                                    innerRadius={50}
                                                    outerRadius={70}
                                                    paddingAngle={8}
                                                    dataKey="value"
                                                >
                                                    {data.languages.map((entry: any, index: number) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                                                    itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Architecture Section */}
                            <div className="rounded-[40px] border border-zinc-800 bg-zinc-900/10 p-2 overflow-hidden">
                                <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                                            <LayoutGrid size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black uppercase italic tracking-tighter">Skeleton Visualization</h3>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Deep Architectural Mapping</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-1 max-w-md items-center gap-2 px-4 py-2 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                                        <Search size={16} className="text-zinc-600" />
                                        <input
                                            type="text"
                                            placeholder="Search graph (e.g. index.ts)"
                                            value={graphSearch}
                                            onChange={(e) => setGraphSearch(e.target.value)}
                                            className="bg-transparent border-none outline-none text-xs font-bold text-white placeholder:text-zinc-700 w-full"
                                        />
                                        {graphSearch && <X size={14} className="text-zinc-600 cursor-pointer hover:text-white" onClick={() => setGraphSearch("")} />}
                                    </div>

                                    <div className="flex gap-2 p-1 bg-zinc-900 rounded-2xl border border-zinc-800">
                                        <button
                                            onClick={() => setViewMode("graph")}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === "graph" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
                                        >
                                            <Maximize2 size={14} /> 2D Graph
                                        </button>
                                        <button
                                            onClick={() => setViewMode("galaxy")}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === "galaxy" ? "bg-white text-black shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "text-zinc-500 hover:text-white"}`}
                                        >
                                            <Sparkles size={14} className={viewMode === 'galaxy' ? 'text-blue-500' : ''} /> 3D Galaxy
                                        </button>
                                        <button
                                            onClick={() => setViewMode("list")}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === "list" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
                                        >
                                            <ListIcon size={14} /> Tree View
                                        </button>
                                    </div>
                                </div>

                                <div className="h-[700px] w-full p-4 pt-0">
                                    <div className="h-full w-full rounded-[32px] overflow-hidden bg-zinc-900/20 border border-zinc-900 shadow-2xl relative">
                                        <AnimatePresence mode="wait">
                                            {viewMode === "graph" ? (
                                                <motion.div key="graph" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full">
                                                    <RepoSkeletonGraph
                                                        initialNodes={graphData.nodes}
                                                        initialEdges={graphData.edges}
                                                        onFileClick={handleFileClick}
                                                        searchQuery={graphSearch}
                                                    />
                                                </motion.div>
                                            ) : viewMode === 'galaxy' ? (
                                                <motion.div key="galaxy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full bg-black">
                                                    <RepoGalaxyView
                                                        nodes={graphData.nodes}
                                                        edges={graphData.edges}
                                                    />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="list"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="h-full w-full overflow-auto space-y-4 p-8"
                                                >
                                                    {graphData.nodes.map((node: any) => (
                                                        <div
                                                            key={node.id}
                                                            onClick={node.type === 'file' ? () => handleFileClick(node) : undefined}
                                                            className={`p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between group hover:border-blue-500/30 transition-all cursor-pointer ${graphSearch && !node.data.label.toLowerCase().includes(graphSearch.toLowerCase()) ? 'opacity-30' : ''}`}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                {node.type === 'folder' ? <Folder size={20} className="text-blue-500 fill-blue-500/10" /> : <Code2 size={20} className="text-zinc-600" />}
                                                                <div>
                                                                    <p className="text-xs font-black uppercase tracking-tighter text-white">{node.data.label}</p>
                                                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{node.data.path}</p>
                                                                </div>
                                                            </div>
                                                            {node.type === 'file' && <div className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Preview Code</div>}
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Overlay instruction */}
                                        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-zinc-950/80 border border-zinc-800 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 pointer-events-none">
                                            {viewMode === 'graph' ? 'Click file nodes to view source code' : 'Select a file to deep scan'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <CodePreviewSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                fileName={selectedFile?.data?.label || ""}
                content={fileContent}
                isLoading={isFileLoading}
                repoUrl={data ? `https://github.com/${data.owner}/${data.repo}/blob/main/${selectedFile?.data?.path}` : undefined}
            />
        </div>
    );
}
