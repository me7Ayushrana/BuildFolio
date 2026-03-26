"use client";

import { X, Copy, Check, ExternalLink, FileCode } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";

interface CodePreviewSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    fileName: string;
    content: string;
    isLoading: boolean;
    repoUrl?: string;
}

export default function CodePreviewSidebar({ isOpen, onClose, fileName, content, isLoading, repoUrl }: CodePreviewSidebarProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getLanguage = (filename: string) => {
        const ext = filename.split(".").pop()?.toLowerCase();
        switch (ext) {
            case "js":
            case "jsx": return "javascript";
            case "ts":
            case "tsx": return "typescript";
            case "py": return "python";
            case "rb": return "ruby";
            case "go": return "go";
            case "rs": return "rust";
            case "md": return "markdown";
            case "json": return "json";
            case "css": return "css";
            case "html": return "html";
            default: return "text";
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-2xl bg-zinc-950 border-l border-zinc-900 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md sticky top-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                                    <FileCode size={20} className="text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-tight text-white truncate max-w-[200px]">{fileName}</h3>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{getLanguage(fileName)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCopy}
                                    className="p-2.5 rounded-xl hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all"
                                    title="Copy Code"
                                >
                                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                </button>
                                {repoUrl && (
                                    <a
                                        href={repoUrl}
                                        target="_blank"
                                        className="p-2.5 rounded-xl hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all"
                                        title="View on GitHub"
                                    >
                                        <ExternalLink size={18} />
                                    </a>
                                )}
                                <div className="w-[1px] h-6 bg-zinc-900 mx-2" />
                                <button
                                    onClick={onClose}
                                    className="p-2.5 rounded-xl hover:bg-red-500/10 text-zinc-400 hover:text-red-500 transition-all font-black uppercase tracking-widest text-[10px]"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-auto p-0 bg-[#0d0d0d]">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-600">
                                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Hydrating Source...</p>
                                </div>
                            ) : (
                                <SyntaxHighlighter
                                    language={getLanguage(fileName)}
                                    style={atomDark}
                                    customStyle={{
                                        margin: 0,
                                        padding: "24px",
                                        background: "transparent",
                                        fontSize: "13px",
                                        lineHeight: "1.6",
                                        height: "100%",
                                    }}
                                    showLineNumbers
                                >
                                    {content || "// Empty file"}
                                </SyntaxHighlighter>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-zinc-900 bg-zinc-900/30 flex justify-between items-center px-8">
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                                {content?.split("\n").length || 0} Lines
                            </p>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                                UTF-8 Encoding
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
