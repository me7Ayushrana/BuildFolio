"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    User,
    signOut as firebaseSignOut,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "@/lib/firebase";
import axios from "axios";

interface AuthContextType {
    user: User | null;
    dbUser: any | null;
    token: string | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    loginWithGitHub: () => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    loginAsDev: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [dbUser, setDbUser] = useState<any | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Sync firebase user with backend on auth state change
    const syncUserWithBackend = async (firebaseUser: User) => {
        try {
            const idToken = await firebaseUser.getIdToken();
            setToken(idToken);

            // Save to localStorage for cross-tab persistence
            if (typeof window !== "undefined") {
                localStorage.setItem("bf_token", idToken);
            }

            const res = await axios.post(
                `${API_URL}/auth/sync`,
                {},
                { headers: { Authorization: `Bearer ${idToken}` } }
            );
            setDbUser(res.data.user);
            setUser(firebaseUser);
        } catch (error) {
            console.error("Error syncing user with backend:", error);
            setUser(firebaseUser);
            const idToken = await firebaseUser.getIdToken();
            setToken(idToken);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                await syncUserWithBackend(firebaseUser);
            } else {
                setUser(null);
                setDbUser(null);
                setToken(null);
                if (typeof window !== "undefined") {
                    localStorage.removeItem("bf_token");
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Silently refresh token every 50 minutes (tokens expire after 60)
    useEffect(() => {
        if (!user) return;

        const interval = setInterval(async () => {
            try {
                const newToken = await user.getIdToken(true); // force refresh
                setToken(newToken);
                if (typeof window !== "undefined") {
                    localStorage.setItem("bf_token", newToken);
                }
            } catch (err) {
                console.error("Token refresh failed:", err);
            }
        }, 50 * 60 * 1000); // 50 minutes

        return () => clearInterval(interval);
    }, [user]);

    // ────────────── Auth Methods ──────────────

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Google login failed:", error);
            throw error;
        }
    };

    const loginWithGitHub = async () => {
        try {
            await signInWithPopup(auth, githubProvider);
        } catch (error) {
            console.error("GitHub login failed:", error);
            throw error;
        }
    };

    const loginWithEmail = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Email login failed:", error);
            throw error;
        }
    };

    const signUpWithEmail = async (email: string, password: string, displayName: string) => {
        try {
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            // Set displayName on Firebase profile
            await updateProfile(credential.user, { displayName });
        } catch (error) {
            console.error("Email signup failed:", error);
            throw error;
        }
    };

    const resetPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            console.error("Password reset failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await firebaseSignOut(auth);
            setToken(null);
            setDbUser(null);
            if (typeof window !== "undefined") {
                localStorage.removeItem("bf_token");
            }
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    };

    const loginAsDev = async () => {
        setLoading(true);
        const devToken = "dev-token";
        setToken(devToken);

        try {
            const res = await axios.get(`${API_URL}/users/dev`, {
                headers: { Authorization: `Bearer ${devToken}` }
            });
            setDbUser(res.data);
            setUser({
                uid: "dev-uid",
                email: "dev@buildfolio.com",
                displayName: res.data.displayName || "Dev Engineer",
                photoURL: res.data.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop"
            } as any);
        } catch (err) {
            console.error("Dev login fetch failed:", err);
            setDbUser({ username: "dev", displayName: "Dev Engineer" });
            setUser({
                uid: "dev-uid",
                email: "dev@buildfolio.com",
                displayName: "Dev Engineer",
                photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop"
            } as any);
        }
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{
            user, dbUser, token, loading,
            loginWithGoogle, loginWithGitHub, loginWithEmail,
            signUpWithEmail, resetPassword, loginAsDev, logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
