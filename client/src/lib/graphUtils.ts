import dagre from "dagre";
import { Node, Edge } from "reactflow";

export interface FileTreeNode {
    path: string;
    type: "blob" | "tree";
    sha: string;
    size?: number;
}

export const generateGraphData = (tree: FileTreeNode[]) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Add root node
    nodes.push({
        id: "root",
        type: "folder",
        data: { label: "root", path: "" },
        position: { x: 0, y: 0 },
    });

    const pathMap = new Map<string, string>();
    pathMap.set("", "root");

    // Sort by path depth to ensure parents are created before children
    const sortedTree = [...tree].sort((a, b) => a.path.split("/").length - b.path.split("/").length);

    sortedTree.forEach((item) => {
        const parts = item.path.split("/");
        const name = parts[parts.length - 1];
        const parentPath = parts.slice(0, -1).join("/");
        const parentId = pathMap.get(parentPath) || "root";

        const nodeId = item.sha || item.path;
        pathMap.set(item.path, nodeId);

        nodes.push({
            id: nodeId,
            type: item.type === "tree" ? "folder" : "file",
            data: { label: name, path: item.path },
            position: { x: 0, y: 0 },
        });

        edges.push({
            id: `e-${parentId}-${nodeId}`,
            source: parentId,
            target: nodeId,
            animated: item.type === "tree",
            style: { stroke: "#52525b", strokeWidth: 1.5, opacity: 0.5 },
        });
    });

    // Layouting with Dagre
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: "LR", ranksep: 200, nodesep: 50 });
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach((node) => {
        g.setNode(node.id, { width: 150, height: 40 });
    });

    edges.forEach((edge) => {
        g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    const layoutedNodes = nodes.map((node) => {
        const n = g.node(node.id);
        return {
            ...node,
            position: { x: n.x - 75, y: n.y - 20 },
        };
    });

    return { nodes: layoutedNodes, edges };
};
