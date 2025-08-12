'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Book, Link as LinkIcon, Video } from "lucide-react";

interface Resource {
  type: string;
  title: string;
  url: string;
}

interface NodeData {
  name: string;
  description: string;
  resources?: Resource[];
  duration?: string;
}

interface NodeDetailSheetProps {
  nodeData: NodeData | null;
  isOpen: boolean;
  onClose: () => void;
}

const getIconForResourceType = (type: string) => {
  const lowerCaseType = type.toLowerCase();
  if (lowerCaseType.includes('sách') || lowerCaseType.includes('book'))
    return <Book className="w-5 h-5 text-muted-foreground" />;
  if (
    lowerCaseType.includes('khóa học') ||
    lowerCaseType.includes('course') ||
    lowerCaseType.includes('video')
  )
    return <Video className="w-5 h-5 text-muted-foreground" />;
  return <LinkIcon className="w-5 h-5 text-muted-foreground" />;
};

export default function NodeDetailSheet({ nodeData, isOpen, onClose }: NodeDetailSheetProps) {
  if (!nodeData) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-5">
        {/* Header */}
        <SheetHeader className="space-y-2">
          <div className="flex flex-col gap-2">
            <SheetTitle className="text-2xl font-bold leading-tight">
              {nodeData.name || 'Chi tiết'}
            </SheetTitle>
            {nodeData.duration && (
              <Badge variant="outline" className="self-start">
                Thời lượng: {nodeData.duration}
              </Badge>
            )}
          </div>
          {nodeData.description && (
            <SheetDescription className="text-base leading-relaxed">
              {nodeData.description}
            </SheetDescription>
          )}
        </SheetHeader>

        {/* Tài nguyên */}
        {nodeData.resources && nodeData.resources.length > 0 && (
          <div className="mt-6">
            <h4 className="mb-3 font-semibold text-lg">Tài nguyên đề xuất</h4>
            <ul className="space-y-3">
              {nodeData.resources.map((resource, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-md border bg-muted/40 hover:bg-muted/60 transition"
                >
                  <div className="mt-1 flex-shrink-0">{getIconForResourceType(resource.type)}</div>
                  <div className="min-w-0">
                    <p className="font-medium">{resource.title}</p>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline break-words line-clamp-2"
                    >
                      {resource.url}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
