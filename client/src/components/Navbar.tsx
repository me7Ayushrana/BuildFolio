"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types";
import { User, LogOut, LayoutDashboard, Zap, Bell, MessageCircle, Sparkles, Rocket, BadgeCheck } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingModal from "./OnboardingModal";
import CreateProjectModal from "./CreateProjectModal";
import { Upload } from "lucide-react";

export default function Navbar() {
    const { user, dbUser, logout, loginAsDev } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const searchUsers = async () => {
            if (searchQuery.length < 2) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const res = await axios.get(`${API_URL}/users/search?query=${searchQuery}`);
                setSearchResults(res.data);
                setShowResults(true);
            } catch (err) {
                console.error(err);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(searchUsers, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, API_URL]);

    // Auto-trigger Onboarding Flow
    useEffect(() => {
        if (dbUser && !dbUser.onboarded) {
            setIsOnboardingOpen(true);
        }
    }, [dbUser]);

    return (
        <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-8">
                    {/* Left Side: Logo + Search */}
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        {process.env.NODE_ENV === 'development' && !user && (
                            <button
                                onClick={() => loginAsDev()}
                                className="text-[9px] font-black uppercase tracking-widest text-yellow-500 border border-yellow-500/30 px-3 py-1 rounded-full hover:bg-yellow-500/10 transition-all shrink-0"
                            >
                                Dev Access
                            </button>
                        )}
                        <Link href="/" className="group flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-lg shadow-blue-500/20">
                                <Rocket size={18} className="text-white" />
                            </div>
                            <h1 className="text-xl font-black tracking-tighter text-white">
                                Build<span className="text-zinc-500">folio</span>
                            </h1>
                        </Link>

                        {/* Search Bar */}
                        <div className="relative flex-1 hidden md:block" ref={searchRef}>
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search engineering leaders..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-full py-1.5 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:bg-zinc-900 transition-all font-light"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    {isSearching ? (
                                        <Loader2 className="h-3 w-3 text-zinc-500 animate-spin" />
                                    ) : (
                                        <kbd className="hidden sm:block px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-zinc-600 font-black">
                                            ⌘K
                                        </kbd>
                                    )}
                                </div>
                            </div>

                            <AnimatePresence>
                                {showResults && searchResults.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full mt-2 w-full bg-zinc-900/95 border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl z-50 overflow-hidden"
                                    >
                                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                            {searchResults.map((result) => (
                                                <Link
                                                    key={result._id}
                                                    href={`/profile/${result.username}`}
                                                    onClick={() => setShowResults(false)}
                                                    className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors group"
                                                >
                                                    <img src={result.photoURL || `https://ui-avatars.com/api/?name=${result.displayName}&background=random`} alt="" className="w-10 h-10 rounded-xl border border-white/5 object-cover" />
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-sm font-black text-zinc-100 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{result.displayName}</span>
                                                            <BadgeCheck size={12} className="text-blue-500" />
                                                        </div>
                                                        <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">@{result.username} • ENGINEER</span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Side: Links + Auth */}
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center space-x-6">
                            <Link href="/explore" className="text-sm font-light text-zinc-400 hover:text-white transition-colors">
                                Social Feed
                            </Link>
                            <Link href="/analyze" className="flex items-center gap-1.5 text-sm font-light text-zinc-400 hover:text-blue-400 transition-colors group">
                                <Zap size={14} className="text-blue-500 group-hover:animate-pulse" />
                                Analyze Repo
                            </Link>
                        </div>

                        <div className="flex items-center gap-3 text-zinc-400">
                            {user ? (
                                <>
                                    <button className="p-2 hover:text-white transition-colors relative">
                                        <Bell size={20} />
                                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600 border border-zinc-950"></span>
                                    </button>
                                    <Link href="/explore" className="p-2 hover:text-white transition-colors mr-2">
                                        <MessageCircle size={20} />
                                    </Link>

                                    {/* Upload Button */}
                                    <button
                                        onClick={() => setIsCreateProjectOpen(true)}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                                    >
                                        <Upload size={14} /> Post Build
                                    </button>

                                    <div className="relative">
                                        <button
                                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                                            className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-zinc-800 bg-zinc-900 shadow-sm transition-transform active:scale-95"
                                        >
                                            <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="Profile" className="h-full w-full object-cover" />
                                        </button>
                                        <AnimatePresence>
                                            {isMenuOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute right-0 mt-3 w-48 origin-top-right rounded-2xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                                                >
                                                    <Link
                                                        href={`/profile/${dbUser?.username || user?.email?.split("@")[0]}`}
                                                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        <User size={16} /> Profile
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            setIsOnboardingOpen(true);
                                                            setIsMenuOpen(false);
                                                        }}
                                                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                                                    >
                                                        <Sparkles size={16} className="text-blue-500" /> Edit Profile
                                                    </button>
                                                    <Link
                                                        href="/dashboard"
                                                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        <LayoutDashboard size={16} /> Dashboard
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            logout();
                                                            setIsMenuOpen(false);
                                                        }}
                                                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                                                    >
                                                        <LogOut size={16} /> Sign out
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </>
                            ) : (
                                <Link
                                    href="/auth"
                                    className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/5"
                                >
                                    Sign in
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
            <CreateProjectModal isOpen={isCreateProjectOpen} onClose={() => setIsCreateProjectOpen(false)} />
        </nav>
    );
}
