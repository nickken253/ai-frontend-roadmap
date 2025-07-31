// components/roadmap/PhaseNode.tsx
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Clock, Zap } from 'lucide-react';
import React from 'react';

// Định nghĩa kiểu dữ liệu cho data
interface PhaseNodeData {
  phase: number;
  title: string;
  duration: string;
}

// Sửa lại: Bỏ generic ở đây và cast `data` ở bên trong để giải quyết lỗi TypeScript
const PhaseNode: React.FC<NodeProps> = ({ data: rawData }) => {
  // SỬA Ở ĐÂY: Ép kiểu qua `unknown` trước để tuân thủ quy tắc của TypeScript
  const data = rawData as unknown as PhaseNodeData;

  return (
    <div className="relative p-5 border-2 rounded-xl shadow-lg bg-slate-900/80 backdrop-blur-md border-secondary/50 w-64">
      <Handle type="target" position={Position.Left} className="!bg-secondary" />
      <div className="flex items-center mb-2">
        <div className="p-2 mr-3 rounded-lg bg-secondary/20 text-secondary">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-secondary">Giai đoạn {data.phase}</p>
          <h3 className="text-lg font-bold text-foreground">{data.title}</h3>
        </div>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <Clock className="w-4 h-4 mr-2" />
        <span>{data.duration}</span>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-secondary" />
    </div>
  );
};

export default PhaseNode;