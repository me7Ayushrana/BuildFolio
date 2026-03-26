"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface FollowButtonProps {
    targetUserId: string;
    initialIsFollowing?: boolean;
    onStatusChange?: (isFollowing: boolean) => void;
    variant?: 'primary' | 'ghost' | 'mini';
}

export default function FollowButton({
    targetUserId,
    initialIsFollowing = false,
    onStatusChange,
    variant = 'primary'
}: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [loading, setLoading] = useState(false);
    const { user, token } = useAuth();

    // Sync state if initialIsFollowing changes
    useEffect(() => {
        setIsFollowing(initialIsFollowing);
    }, [initialIsFollowing]);

    const handleFollow = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user || !token) {
            // Potentially trigger login modal or redirect
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/social/follow/${targetUserId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const newStatus = res.data.isFollowing;
            setIsFollowing(newStatus);
            if (onStatusChange) onStatusChange(newStatus);
        } catch (err) {
            console.error('Error following user:', err);
        } finally {
            setLoading(false);
        }
    };

    if (user?.uid && user.uid === targetUserId) return null; // Don't follow self

    const getStyles = () => {
        if (variant === 'mini') {
            return isFollowing
                ? "bg-slate-800 text-slate-400 border-slate-700"
                : "bg-blue-600/20 text-blue-400 border-blue-500/30";
        }

        if (isFollowing) {
            return "bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 group";
        }

        return "bg-blue-600 text-white border-blue-500 hover:bg-blue-500 shadow-lg shadow-blue-500/20";
    };

    return (
        <button
            onClick={handleFollow}
            disabled={loading}
            className={`
                relative flex items-center justify-center gap-2 px-4 py-1.5 rounded-full 
                text-xs font-black uppercase tracking-widest border transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                ${getStyles()}
            `}
        >
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, rotate: 0 }}
                        animate={{ opacity: 1, rotate: 360 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                    >
                        <Loader2 size={14} />
                    </motion.div>
                ) : (
                    <motion.div
                        key={isFollowing ? 'following' : 'follow'}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2"
                    >
                        {isFollowing ? (
                            <>
                                <span className="group-hover:hidden">Following</span>
                                <span className="hidden group-hover:block">Unfollow</span>
                            </>
                        ) : (
                            <>
                                <UserPlus size={14} />
                                <span>Follow</span>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}
