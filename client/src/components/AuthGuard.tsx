"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            // Store intended destination for post-login redirect
            if (typeof window !== "undefined") {
                sessionStorage.setItem("bf_redirect", pathname);
            }
            router.replace("/auth");
        }
    }, [user, loading, router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="h-12 w-12 animate-spin rounded-full border-2 border-zinc-800 border-t-blue-500" />
                        <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border border-blue-500/20" />
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Authenticating</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return <>{children}</>;
}
