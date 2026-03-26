"use client";

import ReactFlow, {
    Background,
    Controls,
    Node,
    Edge,
    MiniMap,
    useNodesState,
    useEdgesState,
    Panel
} from "reactflow";
import "reactflow/dist/style.css";
import { useEffect, useCallback, useState } from "react";
import { Folder, FileCode, Search, Maximize2, Zap, ArrowRight, Layers } from "lucide-react";

const nodeTypes = {
    folder: ({ data }: any) => (
        <div className={`px-4 py-2 rounded-xl bg-zinc-900 border ${data.selected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-blue-500/30'} text-white min-w-[140px] shadow-2xl flex items-center justify-between gap-2 group transition-all`}>
            <div className="flex items-center gap-2 overflow-hidden">
                <Folder size={16} className={`transition-colors ${data.selected ? 'text-blue-400' : 'text-blue-500 fill-blue-500/10'}`} />
                <span className="text-[10px] font-black uppercase tracking-tight truncate">{data.label}</span>
            </div>
            {data.hasChildren && <ArrowRight size={10} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />}
        </div>
    ),
    file: ({ data }: any) => (
        <div className={`px-4 py-2 rounded-xl bg-zinc-900 border ${data.selected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-zinc-800'} text-zinc-400 min-w-[140px] shadow-lg flex items-center gap-2 group transition-all hover:border-zinc-700`}>
            <FileCode size={16} className={`transition-colors ${data.selected ? 'text-blue-400' : 'text-zinc-600'}`} />
            <span className={`text-[10px] truncate transition-colors ${data.selected ? 'text-white font-black' : 'font-bold'}`}>{data.label}</span>
        </div>
    ),
};

interface RepoSkeletonGraphProps {
    initialNodes: Node[];
    initialEdges: Edge[];
    onFileClick: (node: any) => void;
    searchQuery: string;
}

export default function RepoSkeletonGraph({ initialNodes, initialEdges, onFileClick, searchQuery }: RepoSkeletonGraphProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    useEffect(() => {
        setNodes(initialNodes.map(node => ({
            ...node,
            data: {
                ...node.data,
                selected: searchQuery && node.data.label.toLowerCase().includes(searchQuery.toLowerCase())
            }
        })));
    }, [initialNodes, searchQuery, setNodes]);

    const onNodeMouseEnter = useCallback((_: any, node: Node) => {
        setHoveredNode(node.id);
    }, []);

    const onNodeMouseLeave = useCallback(() => {
        setHoveredNode(null);
    }, []);

    const onNodeClick = useCallback((_: any, node: Node) => {
        if (node.type === 'file') {
            onFileClick(node);
        }
    }, [onFileClick]);

    // Highlight edges connected to hovered node
    const styledEdges = edges.map(edge => {
        const isConnected = hoveredNode && (edge.source === hoveredNode || edge.target === hoveredNode);
        return {
            ...edge,
            animated: isConnected || edge.animated,
            style: {
                ...edge.style,
                stroke: isConnected ? '#3b82f6' : '#27272a',
                strokeWidth: isConnected ? 2 : 1.5,
                opacity: isConnected ? 1 : 0.4,
            }
        };
    });

    return (
        <div className="h-full w-full bg-[#050505] rounded-[32px] overflow-hidden relative border border-zinc-900 shadow-inner">
            <ReactFlow
                nodes={nodes}
                edges={styledEdges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onNodeMouseEnter={onNodeMouseEnter}
                onNodeMouseLeave={onNodeMouseLeave}
                fitView
                proOptions={{ hideAttribution: true }}
                minZoom={0.1}
                maxZoom={2}
            >
                <Background color="#18181b" gap={30} size={1} />
                <Controls className="!bg-zinc-900 !border-zinc-800 !rounded-xl overflow-hidden [&>button]:!bg-zinc-900 [&>button]:!border-zinc-800 [&>button:hover]:!bg-zinc-800 [&>svg]:!fill-white" />

                <Panel position="top-right" className="m-4">
                    <div className="flex gap-2">
                        <div className="px-4 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md flex items-center gap-2">
                            <Layers size={14} className="text-blue-500" />
                            <span className="text-[10px] font-black uppercase text-zinc-300 tracking-widest">{nodes.length} Nodes</span>
                        </div>
                    </div>
                </Panel>

                <Panel position="bottom-left" className="m-6 flex flex-col gap-3">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Directory</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                            <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">File</span>
                        </div>
                    </div>
                </Panel>

                <MiniMap
                    style={{ background: '#09090b', borderRadius: '16px', border: '1px solid #27272a' }}
                    maskColor="rgba(0, 0, 0, 0.4)"
                    nodeColor={(n) => n.type === 'folder' ? '#3b82f6' : '#27272a'}
                />
            </ReactFlow>

            {/* Hover Tooltip */}
            {hoveredNode && (
                <div className="absolute bottom-6 right-6 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-500 animate-in fade-in slide-in-from-bottom-2">
                    Hovering: <span className="text-white">{nodes.find(n => n.id === hoveredNode)?.data.label}</span>
                </div>
            )}
        </div>
    );
}
