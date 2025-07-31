// components/roadmap/TopicNode.tsx
import { Handle, Position, NodeProps } from '@xyflow/react';
import { BookOpen } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from 'react';

// Định nghĩa kiểu dữ liệu cho data
interface TopicNodeData {
  name: string;
  description: string;
}

const TopicNode: React.FC<NodeProps> = ({ data: rawData }) => {
  // Ép kiểu qua `unknown` trước để tuân thủ quy tắc của TypeScript
  const data = rawData as unknown as TopicNodeData;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center p-3 border rounded-lg shadow-md bg-slate-800/80 backdrop-blur-md border-primary/50 w-52 cursor-pointer">
            <Handle type="target" position={Position.Left} className="!bg-primary" />
            <BookOpen className="w-5 h-5 mr-3 text-primary" />
            <p className="text-sm font-medium text-foreground truncate">{data.name}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="font-bold">{data.name}</p>
          <p>{data.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TopicNode;