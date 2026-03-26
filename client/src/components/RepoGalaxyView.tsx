"use client";

import { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Stars, Float, MeshDistortMaterial, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { Node, Edge } from 'reactflow';

function Connection({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
    const points = useMemo(() => [
        new THREE.Vector3(...start),
        new THREE.Vector3(...end)
    ], [start, end]);

    const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

    return (
        // @ts-ignore — Three.js <line> conflicts with SVG <line> in JSX types
        <line geometry={lineGeometry}>
            <lineBasicMaterial attach="material" color="#3b82f6" opacity={0.2} transparent linewidth={1} />
        </line>
    );
}

function NodeMesh({ node, position }: { node: Node; position: [number, number, number] }) {
    const mesh = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.x += delta * 0.2;
            mesh.current.rotation.y += delta * 0.2;
        }
    });

    const isFolder = node.type === 'folder';
    const color = isFolder ? (hovered ? '#60a5fa' : '#3b82f6') : (hovered ? '#a1a1aa' : '#52525b');
    const size = isFolder ? 8 : 4;

    return (
        <group position={position}>
            <mesh
                ref={mesh}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                {isFolder ? (
                    <octahedronGeometry args={[size, 0]} />
                ) : (
                    <boxGeometry args={[size, size, size]} />
                )}
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={hovered ? 2 : 0.5}
                    wireframe={!hovered}
                />
            </mesh>
            <Text
                position={[0, -size - 5, 0]}
                fontSize={3}
                color="white"
                anchorX="center"
                anchorY="middle"
                font="/fonts/Inter-Bold.ttf"
            >
                {node.data.label}
            </Text>
        </group>
    );
}

export default function RepoGalaxyView({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
    // 3D Scaling factor (ReactFlow positions are large)
    const scale = 0.5;
    const offsetNodes = useMemo(() => {
        if (nodes.length === 0) return [];
        const xs = nodes.map(n => n.position.x);
        const ys = nodes.map(n => n.position.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        return nodes.map(n => ({
            ...n,
            p3: [(n.position.x - centerX) * scale, (-(n.position.y - centerY)) * scale, 0] as [number, number, number]
        }));
    }, [nodes]);

    return (
        <div className="h-full w-full bg-zinc-950 rounded-3xl overflow-hidden relative border border-zinc-900 shadow-2xl">
            <Canvas camera={{ position: [0, 0, 500], fov: 60 }}>
                <color attach="background" args={['#09090b']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[100, 100, 100]} intensity={1} />
                <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <OrbitControls enableDamping dampingFactor={0.05} />

                <Suspense fallback={null}>
                    <group>
                        {edges.map(edge => {
                            const source = offsetNodes.find(n => n.id === edge.source);
                            const target = offsetNodes.find(n => n.id === edge.target);
                            if (!source || !target) return null;
                            return (
                                <Connection
                                    key={edge.id}
                                    start={source.p3}
                                    end={target.p3}
                                />
                            );
                        })}

                        {offsetNodes.map(node => (
                            <NodeMesh
                                key={node.id}
                                node={node}
                                position={node.p3}
                            />
                        ))}
                    </group>
                </Suspense>
            </Canvas>

            <div className="absolute bottom-6 left-6 text-[9px] font-black uppercase text-zinc-600 tracking-widest pointer-events-none flex flex-col gap-1">
                <p>Drag to rotate • Scroll to zoom</p>
                <p>Right-click to pan</p>
            </div>

            <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                3D Immersion Active
            </div>
        </div>
    );
}
