"use client";

import { useAuth } from "@/context/AuthContext";

export default function AuthGate({ children }: { children: React.ReactNode }) {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="fixed inset-0 z-[200] bg-zinc-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-8">
                    {/* Animated Logo */}
                    <div className="relative flex items-center justify-center">
                        <div className="absolute h-24 w-24 rounded-full border border-blue-500/10 animate-ping" />
                        <div className="absolute h-16 w-16 rounded-full border border-blue-500/20 animate-pulse" />
                        <div className="relative z-10 text-3xl font-black tracking-tighter text-white">
                            B<span className="text-zinc-600">f</span>
                        </div>
                    </div>

                    {/* Loading Bar */}
                    <div className="w-48 h-0.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 rounded-full animate-loading-bar" />
                    </div>

                    <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">
                        Initializing Secure Session
                    </p>
                </div>

                <style jsx>{`
                    @keyframes loading-bar {
                        0% { width: 0%; margin-left: 0%; }
                        50% { width: 60%; margin-left: 20%; }
                        100% { width: 0%; margin-left: 100%; }
                    }
                    .animate-loading-bar {
                        animation: loading-bar 1.5s ease-in-out infinite;
                    }
                `}</style>
            </div>
        );
    }

    return <>{children}</>;
}
