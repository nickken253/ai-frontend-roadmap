// // components/roadmap/RoadmapFlowChart.tsx
// 'use client';
// import ReactFlow, { Background, Controls, Edge, Node } from 'reactflow';
// import 'reactflow/dist/style.css';

// interface RoadmapFlowChartProps {
//   nodes: Node[];
//   edges: Edge[];
// }

// export default function RoadmapFlowChart({ nodes, edges }: RoadmapFlowChartProps) {
//   return (
//     <ReactFlow
//       nodes={nodes}
//       edges={edges}
//       fitView
//       proOptions={{ hideAttribution: true }} // Ẩn logo của React Flow
//       nodesDraggable={false} // Không cho kéo node
//       nodesConnectable={false} // Không cho kết nối node
//     >
//       <Background />
//       <Controls />
//     </ReactFlow>
//   );
// }

// components/roadmap/RoadmapFlowChart.tsx
'use client';

import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import PhaseNode from './PhaseNode';
import TopicNode from './TopicNode';

// Đăng ký các loại node tùy chỉnh
const nodeTypes = {
  phase: PhaseNode,
  topic: TopicNode,
};

// Hàm tạo layout động
const generateLayout = (roadmapDetails: any) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let yOffset = 100;

  // Node Bắt đầu
  nodes.push({
    id: 'start',
    position: { x: 50, y: yOffset + 150 },
    data: { label: 'Bắt đầu' },
    type: 'input',
    style: {
      background: 'var(--muted)',
      color: 'var(--foreground)',
      borderColor: 'var(--primary)',
      borderWidth: 2,
    }
  });

  let lastPhaseId = 'start';
  let xPosition = 350;

  roadmapDetails.roadmap.forEach((phase: any, phaseIndex: number) => {
    const phaseId = `phase-${phase.phase}`;

    nodes.push({
      id: phaseId,
      type: 'phase',
      position: { x: xPosition, y: yOffset },
      data: phase,
      style: { stroke: 'var(--primary)', strokeWidth: 2 },
    });

    // Kết nối với giai đoạn trước
    edges.push({
      id: `edge-${lastPhaseId}-to-${phaseId}`,
      source: lastPhaseId,
      target: phaseId,
      type: 'smoothstep',
      animated: true,
      style: { stroke: 'var(--secondary)', strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--secondary)' },
    });

    // Tạo các node chủ đề phân nhánh
    phase.topics.forEach((topic: any, topicIndex: number) => {
      const topicId = `topic-${phase.phase}-${topicIndex}`;
      nodes.push({
        id: topicId,
        type: 'topic',
        position: { x: xPosition + 350, y: yOffset - 50 + topicIndex * 80 },
        data: topic,
      });

      edges.push({
        id: `edge-${phaseId}-to-${topicId}`,
        source: phaseId,
        target: topicId,
        type: 'smoothstep',
        style: { stroke: 'var(--primary)', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--primary)' },
      });
    });

    yOffset += 300; // Tăng khoảng cách cho giai đoạn tiếp theo
    lastPhaseId = phaseId;
  });

  // Node Mục tiêu
  nodes.push({
    id: 'goal',
    position: { x: xPosition, y: yOffset },
    data: { label: roadmapDetails.career_goal },
    style: {
      background: 'var(--muted)',
      color: 'var(--foreground)',
      borderColor: 'var(--primary)',
      borderWidth: 2,
    },
    type: 'output',
  });

  edges.push({
    id: `edge-${lastPhaseId}-to-goal`,
    source: lastPhaseId,
    target: 'goal',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'var(--secondary)', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--secondary)' },
  });

  return { initialNodes: nodes, initialEdges: edges };
};


export default function RoadmapFlowChart({ roadmapDetails }: { roadmapDetails: any }) {
  const { initialNodes, initialEdges } = useMemo(() => generateLayout(roadmapDetails), [roadmapDetails]);

  return (
    <ReactFlow
      nodes={initialNodes}
      edges={initialEdges}
      nodeTypes={nodeTypes}
      fitView
      proOptions={{ hideAttribution: true }}
    >
      <Background gap={20} size={1} color="var(--primary) / 0.1" />
      {/* <Controls className="bg-slate-800/50 border [backdrop-filter:blur(4px)] border-slate-700 rounded-lg" /> */}
      {/* <MiniMap
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden"
        nodeColor={(node) => {
          if (node.type === 'phase') return 'var(--secondary)';
          if (node.type === 'topic') return 'var(--primary)';
          return '#ccc';
        }}
        nodeStrokeWidth={3}
        pannable
        maskColor="var(--background) / 0.8"
      /> */}
    </ReactFlow>
  );
}