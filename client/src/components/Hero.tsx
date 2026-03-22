"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Hero() {
    const { loginWithGoogle } = useAuth();

    return (
        <div className="relative isolate overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
                <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
                    <div className="mt-24 sm:mt-32 lg:mt-16">
                        <a href="#" className="inline-flex space-x-6">
                            <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold leading-6 text-zinc-400 ring-1 ring-inset ring-zinc-800">
                                New: GitHub Integration v2
                            </span>
                        </a>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl"
                    >
                        Showcase your code like never before.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-6 text-lg leading-8 text-zinc-400"
                    >
                        Buildfolio is the premium platform for developers to showcase their projects, sync their GitHub repositories, and build a professional portfolio in minutes.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-10 flex items-center gap-x-6"
                    >
                        <button
                            onClick={loginWithGoogle}
                            className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all flex items-center gap-2 group"
                        >
                            Start Building <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <a href="/explore" className="text-sm font-semibold leading-6 text-white flex items-center gap-2">
                            Explore Projects <span aria-hidden="true">→</span>
                        </a>
                    </motion.div>
                </div>

                <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
                    <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                        {/* Mockup or Graphic could go here */}
                        <div className="rounded-xl bg-zinc-900/50 p-2 ring-1 ring-inset ring-white/10 backdrop-blur-sm">
                            <div className="rounded-lg bg-zinc-950 px-4 py-8 shadow-2xl overflow-hidden relative group">
                                <div className="flex gap-4 mb-6">
                                    <div className="h-3 w-3 rounded-full bg-red-500/50"></div>
                                    <div className="h-3 w-3 rounded-full bg-yellow-500/50"></div>
                                    <div className="h-3 w-3 rounded-full bg-green-500/50"></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-8 w-48 bg-zinc-900 rounded-md"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-zinc-900 rounded-md"></div>
                                        <div className="h-4 w-2/3 bg-zinc-900 rounded-md"></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div className="h-32 bg-zinc-900 rounded-xl border border-zinc-800"></div>
                                        <div className="h-32 bg-zinc-900 rounded-xl border border-zinc-800"></div>
                                    </div>
                                </div>
                                {/* Glowing effect */}
                                <div className="absolute -inset-px bg-gradient-to-r from-zinc-800 via-zinc-400/10 to-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
