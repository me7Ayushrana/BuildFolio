"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail, Lock, User, Github, ArrowRight,
    Loader2, Eye, EyeOff, AlertCircle, CheckCircle2, Sparkles
} from "lucide-react";
import Link from "next/link";

type AuthMode = "signin" | "signup" | "forgot";

export default function AuthPage() {
    const { loginWithGoogle, loginWithGitHub, loginWithEmail, signUpWithEmail, resetPassword, loginAsDev, user } = useAuth();
    const router = useRouter();

    const [mode, setMode] = useState<AuthMode>("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // If user is already authenticated, redirect
    if (user) {
        const redirect = typeof window !== "undefined" ? sessionStorage.getItem("bf_redirect") : null;
        router.replace(redirect || "/");
        sessionStorage.removeItem("bf_redirect");
        return null;
    }

    const getFirebaseErrorMessage = (code: string): string => {
        const messages: Record<string, string> = {
            "auth/user-not-found": "No account found with this email",
            "auth/wrong-password": "Incorrect password",
            "auth/email-already-in-use": "An account already exists with this email",
            "auth/weak-password": "Password must be at least 6 characters",
            "auth/invalid-email": "Please enter a valid email address",
            "auth/too-many-requests": "Too many attempts. Please try again later",
            "auth/popup-closed-by-user": "Sign-in popup was closed",
            "auth/account-exists-with-different-credential": "An account already exists with this email using a different sign-in method",
            "auth/invalid-credential": "Invalid email or password",
        };
        return messages[code] || "Something went wrong. Please try again.";
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            if (mode === "signin") {
                await loginWithEmail(email, password);
            } else if (mode === "signup") {
                if (!displayName.trim()) {
                    setError("Please enter your name");
                    setLoading(false);
                    return;
                }
                await signUpWithEmail(email, password, displayName);
            } else if (mode === "forgot") {
                await resetPassword(email);
                setSuccess("Password reset email sent! Check your inbox.");
                setLoading(false);
                return;
            }
            // On success, onAuthStateChanged will handle redirect
        } catch (err: any) {
            setError(getFirebaseErrorMessage(err.code));
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: "google" | "github") => {
        setLoading(true);
        setError("");
        try {
            if (provider === "google") {
                await loginWithGoogle();
            } else {
                await loginWithGitHub();
            }
        } catch (err: any) {
            setError(getFirebaseErrorMessage(err.code));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block">
                        <h1 className="text-4xl font-black tracking-tighter text-white">
                            Build<span className="text-zinc-600">folio</span>
                        </h1>
                    </Link>
                    <p className="text-zinc-600 text-xs font-medium mt-2 tracking-wide">
                        Where engineers showcase their craft
                    </p>
                </div>

                {/* Auth Card */}
                <motion.div
                    layout
                    className="rounded-3xl border border-white/5 bg-zinc-900/80 backdrop-blur-xl shadow-2xl overflow-hidden"
                >
                    {/* Tab Switcher */}
                    {mode !== "forgot" && (
                        <div className="flex border-b border-white/5">
                            {(["signin", "signup"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { setMode(tab); setError(""); setSuccess(""); }}
                                    className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${mode === tab ? "text-white" : "text-zinc-600 hover:text-zinc-400"
                                        }`}
                                >
                                    {tab === "signin" ? "Sign In" : "Create Account"}
                                    {mode === tab && (
                                        <motion.div
                                            layoutId="auth-tab-indicator"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mode}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {mode === "forgot" && (
                                    <div className="mb-6">
                                        <button
                                            onClick={() => { setMode("signin"); setError(""); setSuccess(""); }}
                                            className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1 mb-4"
                                        >
                                            ← Back to Sign In
                                        </button>
                                        <h2 className="text-xl font-bold text-white">Reset Password</h2>
                                        <p className="text-zinc-500 text-sm mt-1">Enter your email and we&apos;ll send a reset link.</p>
                                    </div>
                                )}

                                {/* Social Buttons */}
                                {mode !== "forgot" && (
                                    <div className="space-y-3 mb-6">
                                        <button
                                            onClick={() => handleSocialLogin("google")}
                                            disabled={loading}
                                            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-white/5 bg-zinc-950 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50"
                                        >
                                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                            </svg>
                                            Continue with Google
                                        </button>

                                        <button
                                            onClick={() => handleSocialLogin("github")}
                                            disabled={loading}
                                            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-white/5 bg-zinc-950 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50"
                                        >
                                            <Github size={20} />
                                            Continue with GitHub
                                        </button>
                                    </div>
                                )}

                                {/* Divider */}
                                {mode !== "forgot" && (
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex-1 h-px bg-white/5" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">or</span>
                                        <div className="flex-1 h-px bg-white/5" />
                                    </div>
                                )}

                                {/* Email Form */}
                                <form onSubmit={handleEmailAuth} className="space-y-4">
                                    {mode === "signup" && (
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="text"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                placeholder="Full Name"
                                                className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                                            />
                                        </div>
                                    )}

                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email address"
                                            required
                                            className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                                        />
                                    </div>

                                    {mode !== "forgot" && (
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Password"
                                                required
                                                minLength={6}
                                                className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3 pl-11 pr-12 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    )}

                                    {mode === "signin" && (
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => { setMode("forgot"); setError(""); }}
                                                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                    )}

                                    {/* Error/Success Messages */}
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
                                            >
                                                <AlertCircle size={14} className="shrink-0" /> {error}
                                            </motion.div>
                                        )}
                                        {success && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs"
                                            >
                                                <CheckCircle2 size={14} className="shrink-0" /> {success}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 rounded-2xl bg-white text-black font-bold text-sm hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-xl shadow-white/5 flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <>
                                                {mode === "signin" && "Sign In"}
                                                {mode === "signup" && "Create Account"}
                                                {mode === "forgot" && "Send Reset Link"}
                                                <ArrowRight size={16} />
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Dev Access */}
                                {process.env.NODE_ENV === "development" && mode !== "forgot" && (
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <button
                                            onClick={() => loginAsDev()}
                                            className="w-full text-center text-[10px] font-black uppercase tracking-[0.2em] text-yellow-600 hover:text-yellow-500 transition-colors py-2"
                                        >
                                            ⚡ Dev Access (Skip Auth)
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Footer */}
                <p className="text-center text-[10px] text-zinc-700 mt-8 tracking-wide">
                    By continuing, you agree to Buildfolio&apos;s Terms of Service & Privacy Policy
                </p>
            </div>
        </div>
    );
}
