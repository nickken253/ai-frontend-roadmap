// components/roadmap/RoadmapFlowChart.tsx
'use client';
import ReactFlow, { Background, Controls, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';

interface RoadmapFlowChartProps {
  nodes: Node[];
  edges: Edge[];
}

export default function RoadmapFlowChart({ nodes, edges }: RoadmapFlowChartProps) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      fitView
      proOptions={{ hideAttribution: true }} // Ẩn logo của React Flow
      nodesDraggable={false} // Không cho kéo node
      nodesConnectable={false} // Không cho kết nối node
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}