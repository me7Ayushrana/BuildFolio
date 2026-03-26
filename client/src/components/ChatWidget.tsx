"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    limit
} from "firebase/firestore";
import { Send, X, MessageSquare, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: string;
    senderId: string;
    text: string;
    createdAt: any;
}

export default function ChatWidget({ currentUser, targetUser }: { currentUser: any, targetUser: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const chatId = [currentUser.uid, targetUser._id].sort().join("_");

    useEffect(() => {
        if (!isOpen) return;

        const q = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("createdAt", "asc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Message[];
            setMessages(msgs);
            setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        });

        return () => unsubscribe();
    }, [isOpen, chatId]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        const msg = message;
        setMessage("");

        await addDoc(collection(db, "chats", chatId, "messages"), {
            senderId: currentUser.uid,
            text: msg,
            createdAt: serverTimestamp()
        });
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 p-4">
                            <div className="flex items-center gap-3">
                                <img src={targetUser.photoURL || "https://avatar.vercel.sh/guest"} className="h-8 w-8 rounded-full" />
                                <div>
                                    <h4 className="text-sm font-bold text-white">{targetUser.displayName}</h4>
                                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.senderId === currentUser.uid ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.senderId === currentUser.uid
                                            ? "bg-blue-600 text-white rounded-br-none"
                                            : "bg-zinc-800 text-zinc-200 rounded-bl-none"
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={scrollRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={sendMessage} className="p-4 bg-zinc-900/50 border-t border-zinc-800">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-2 text-sm outline-none focus:border-zinc-500 transition-colors"
                                />
                                <button type="submit" className="rounded-xl bg-white p-2 text-black hover:bg-zinc-200 transition-colors">
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-xl transition-shadow hover:shadow-2xl"
                    >
                        <MessageSquare size={24} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
