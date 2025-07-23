// app/(admin)/logs/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { columns, Log } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const fetchLogs = async (): Promise<Log[]> => {
  const { data } = await api.get('/admin/logs');
  return Array.isArray(data) ? data : [];
};

export default function AdminLogsPage() {
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const { data: logs, isLoading } = useQuery({
    queryKey: ['admin-logs'],
    queryFn: fetchLogs,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Logs hệ thống</h1>
      <DataTable 
        columns={columns} 
        data={logs || []} 
        onRowClick={(log) => setSelectedLog(log)}
      />

      {/* Dialog để xem chi tiết log */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chi tiết Log</DialogTitle>
            <DialogDescription>ID: {selectedLog?._id}</DialogDescription>
          </DialogHeader>
          {/* API /admin/logs trả về đủ thông tin nên không cần gọi API chi tiết nữa */}
          <div className="mt-4 space-y-4 text-sm max-h-[70vh] overflow-y-auto">
            <div><strong>Prompt đã gửi:</strong><pre className="p-2 mt-1 text-xs whitespace-pre-wrap bg-muted rounded-md font-mono">{selectedLog?.prompt_sent}</pre></div>
            <div><strong>Phản hồi gốc:</strong><pre className="p-2 mt-1 text-xs whitespace-pre-wrap bg-muted rounded-md font-mono">{selectedLog?.raw_response}</pre></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}