"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { User, LogOut, LayoutDashboard, Globe } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const { user, logout, loginWithGoogle } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-xl font-bold tracking-tight text-white">
                            Build<span className="text-zinc-500">folio</span>
                        </Link>
                        <div className="hidden md:block">
                            <div className="flex items-baseline space-x-4">
                                <Link href="/explore" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                                    Explore
                                </Link>
                                <Link href="/showcase" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                                    Showcase
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-800 p-1 pr-3 hover:bg-zinc-800 transition-colors"
                                >
                                    <img
                                        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
                                        alt="Profile"
                                        className="h-7 w-7 rounded-full"
                                    />
                                    <span className="text-xs font-medium text-white">{user.displayName?.split(' ')[0]}</span>
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-zinc-800 bg-zinc-900 p-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <Link
                                            href={`/profile/${user.email?.split('@')[0]}`} // Fallback for testing, will use actual username
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <User size={16} /> Profile
                                        </Link>
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <LayoutDashboard size={16} /> Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-800 rounded-md transition-colors"
                                        >
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={loginWithGoogle}
                                className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black hover:bg-zinc-200 transition-colors"
                            >
                                Get Started
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
