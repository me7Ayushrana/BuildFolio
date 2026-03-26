"use client";

import Navbar from '@/components/Navbar';
import ProjectFeedCard from '@/components/ProjectFeedCard';
import StoriesBar from '@/components/StoriesBar';
import CreateProjectModal from "@/components/CreateProjectModal";
import OnboardingModal from "@/components/OnboardingModal";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BadgeCheck, Rocket, TrendingUp, Users, Plus, Globe, UserCheck, Layout, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PREMIUM_PROJECTS, PREMIUM_USERS } from '@/lib/premiumData';
import { useAuth } from '@/context/AuthContext';
import CreatePostModal from '@/components/CreatePostModal'; // This import will be removed later, but keeping for now as it's in the original
import FollowButton from '@/components/FollowButton';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'global' | 'following'>('global');
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const { user, token, dbUser } = useAuth();

  const fetchProjects = async (tab: 'global' | 'following') => {
    setLoading(true);
    try {
      const endpoint = tab === 'global'
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/social/feed/following`;

      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get(endpoint, config);

      if (res.data && res.data.length > 0) {
        setProjects(res.data);
      } else {
        // Fallback to premium data with derived counts
        setProjects(tab === 'global' ? PREMIUM_PROJECTS.map(p => ({
          ...p,
          likesCount: p.likes?.length || 0,
          commentsCount: p.comments?.length || 0,
        })) : []);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setProjects(tab === 'global' ? PREMIUM_PROJECTS.map(p => ({
        ...p,
        likesCount: p.likes?.length || 0,
        commentsCount: p.comments?.length || 0,
      })) : []);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggested = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/trending`);
      setSuggestedUsers(res.data.length > 0 ? res.data : PREMIUM_USERS.slice(0, 5));
    } catch (err) {
      setSuggestedUsers(PREMIUM_USERS.slice(0, 5));
    }
  };

  useEffect(() => {
    fetchProjects(activeTab);
    fetchSuggested();
  }, [activeTab, token]);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12 flex gap-8">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-64 fixed left-[max(16px,calc(50%-640px))] top-24 bottom-0 overflow-y-auto">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/20 p-6 backdrop-blur-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Internal Links</h3>
              <div className="space-y-4">
                <Link href="/explore" className="flex items-center gap-3 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                  Explore Hub
                </Link>
                <Link href="/analyze" className="flex items-center gap-3 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                  Repo X-Ray
                </Link>
                <Link href="/profile" className="flex items-center gap-3 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                  My Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Center Content - Feed */}
        <div className="flex-1 lg:ml-72 lg:mr-80 max-w-2xl mx-auto">
          <StoriesBar />

          {/* Profile Completion Nudge */}
          {user && dbUser && dbUser.username.startsWith('user_') && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Claim your engineering handle</p>
                  <p className="text-xs text-blue-300/70 font-light">Your current username is temporary: @{dbUser.username}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95"
              >
                Customize <ArrowRight size={14} />
              </button>
            </motion.div>
          )}

          {/* Create Post Entry */}
          {user && (
            <div className="mb-8 rounded-3xl border border-white/5 bg-zinc-900/50 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
                  className="h-10 w-10 rounded-full border border-white/10"
                  alt=""
                />
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex-1 rounded-2xl bg-zinc-950 border border-white/5 px-6 py-3 text-left text-zinc-500 text-sm hover:bg-zinc-900 transition-colors flex items-center justify-between group"
                >
                  <span>What engine are you building today, {dbUser?.displayName?.split(' ')[0] || 'Engineer'}?</span>
                  <Plus size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* Feed Header & Tabs */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6 px-2">
              <div>
                <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">
                  <Rocket className="text-blue-500 w-6 h-6" />
                  Engineering Feed
                </h1>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Sourced from the global elite</p>
              </div>
              {user && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-all hover:scale-110 shadow-lg shadow-blue-500/20"
                >
                  <Plus size={24} />
                </button>
              )}
            </div>

            {/* Production Tabs */}
            <div className="flex gap-1 border-b border-slate-800/60 p-1 mb-8">
              <button
                onClick={() => setActiveTab('global')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${activeTab === 'global' ? 'bg-slate-900 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Globe size={14} />
                Global Access
              </button>
              <button
                onClick={() => setActiveTab('following')}
                disabled={!user}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${!user ? 'opacity-30 cursor-not-allowed' : ''} ${activeTab === 'following' ? 'bg-slate-900 text-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <UserCheck size={14} />
                Following
              </button>
            </div>
          </div>

          <div className="space-y-12">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading-skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-12"
                >
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-slate-900/50 animate-pulse h-[450px] rounded-2xl border border-slate-800" />
                  ))}
                </motion.div>
              ) : projects.length > 0 ? (
                <motion.div
                  key={`${activeTab}-projects`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-12"
                >
                  {projects.map((project) => (
                    <ProjectFeedCard key={project._id} project={project} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl"
                >
                  <Users size={48} className="text-slate-800 mb-4" />
                  <h3 className="text-xl font-black tracking-tight text-slate-400 mb-2">No Intel Found</h3>
                  <p className="text-sm text-slate-600 font-bold uppercase tracking-widest text-center max-w-xs">Follow elite engineers to populate your personalized feed.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Sidebar - Trending & Suggested */}
        <div className="hidden xl:block w-80 fixed right-[max(16px,calc(50%-640px))] top-24 bottom-0 overflow-y-auto pr-4">
          <div className="space-y-8">
            {/* Trending */}
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={18} className="text-blue-400" />
                <h2 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Trending Tech</h2>
              </div>
              <div className="space-y-5">
                {[
                  { tag: '#AGI', trend: '+12% Intelligence' },
                  { tag: '#SpatialComputing', trend: '+24% Vision' },
                  { tag: '#OpenWeb5', trend: '+18% Freedom' }
                ].map((item) => (
                  <div key={item.tag} className="group cursor-pointer">
                    <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors block mb-1">{item.tag}</span>
                    <span className="text-[9px] text-green-400 font-black uppercase tracking-widest">{item.trend}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Engineers */}
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-6">
                <Users size={18} className="text-purple-400" />
                <h2 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Suggested Engineers</h2>
              </div>
              <div className="space-y-6">
                {suggestedUsers.map((u) => (
                  <div key={u._id} className="flex flex-col gap-3 p-4 rounded-xl bg-slate-950/40 border border-slate-800/40 hover:border-slate-700/60 transition-colors">
                    <Link href={`/profile/${u.username}`} className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-800 group-hover:border-blue-500/50 transition-colors relative">
                        <Image
                          src={u.photoURL || '/images/default-avatar.png'}
                          alt={u.displayName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-white group-hover:text-blue-400 truncate uppercase tracking-tight">{u.displayName}</span>
                          <BadgeCheck size={12} className="text-blue-500 fill-current flex-shrink-0" />
                        </div>
                        <span className="text-[10px] text-slate-500 truncate font-mono">@{u.username}</span>
                      </div>
                    </Link>
                    <FollowButton targetUserId={u._id} variant="mini" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <CreateProjectModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
    </div>
  );
}
