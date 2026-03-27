"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { X, User as UserIcon, BadgeCheck, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import FollowButton from './FollowButton';
import { UserProfile } from '@/types';

interface UserListModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    userId: string;
    type: 'followers' | 'following';
}

export default function UserListModal({ isOpen, onClose, title, userId, type }: UserListModalProps) {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/social/${type}/${userId}`);
            setUsers(res.data);
        } catch (err) {
            console.error(`Error fetching ${type}:`, err);
        } finally {
            setLoading(false);
        }
    }, [userId, type]);

    useEffect(() => {
        if (isOpen && userId) {
            fetchUsers();
        }
    }, [isOpen, userId, fetchUsers]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">{title}</h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 size={32} className="text-blue-500 animate-spin" />
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accessing Network...</p>
                                </div>
                            ) : users.length > 0 ? (
                                <div className="space-y-1">
                                    {users.map((user) => (
                                        <div key={user._id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-800/50 transition-colors group">
                                            <Link
                                                href={`/profile/${user.username}`}
                                                onClick={onClose}
                                                className="flex items-center gap-3 overflow-hidden"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-slate-800 flex-shrink-0 relative overflow-hidden border border-slate-700 group-hover:border-blue-500/50 transition-colors">
                                                    {user.photoURL ? (
                                                        <Image src={user.photoURL} alt={user.displayName} fill className="object-cover" />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full"><UserIcon size={16} /></div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-xs font-black text-white truncate uppercase tracking-tight">{user.displayName}</span>
                                                        <BadgeCheck size={12} className="text-blue-500 fill-current" />
                                                    </div>
                                                    <span className="text-[10px] text-slate-500 font-mono truncate">@{user.username}</span>
                                                </div>
                                            </Link>
                                            <FollowButton targetUserId={user._id || ''} variant="mini" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 bg-slate-950/20">
                                    <UserIcon size={40} className="text-slate-800 mb-2" />
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No connections yet</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
