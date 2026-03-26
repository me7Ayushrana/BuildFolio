"use client";

import React from 'react';
import Image from 'next/image';
import { PREMIUM_USERS } from '@/lib/premiumData';
import { BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StoriesBar() {
    return (
        <div className="w-full overflow-hidden mb-6">
            <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
                {PREMIUM_USERS.map((user, idx) => (
                    <motion.div
                        key={user._id}
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.4, ease: "easeOut" }}
                        className="flex flex-col items-center gap-1 cursor-pointer group min-w-[70px]"
                    >
                        <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 group-hover:scale-105 transition-transform duration-300">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-950 bg-slate-900">
                                <Image
                                    src={user.photoURL || '/images/default-avatar.png'}
                                    alt={user.displayName}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {idx < 4 && (
                                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-slate-950">
                                    <BadgeCheck size={12} className="text-white fill-current" />
                                </div>
                            )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium truncate max-w-[64px] group-hover:text-blue-400 transition-colors">
                            {user.username}
                        </span>
                    </motion.div>
                ))}
                {/* Placeholder for 'Add Story' if user is logged in, but for seed we just show iconic */}
            </div>
        </div>
    );
}
