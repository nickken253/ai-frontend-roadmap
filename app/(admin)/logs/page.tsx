// app/(admin)/logs/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { columns, Log } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      
      {/* Giao diện Desktop */}
      <div className="hidden md:block">
        <DataTable 
          columns={columns} 
          data={logs || []} 
          onRowClick={(log) => setSelectedLog(log)}
        />
      </div>

      {/* Giao diện Mobile */}
      <div className="block md:hidden space-y-4">
        {(logs || []).map((log) => (
          <Card key={log._id} onClick={() => setSelectedLog(log)}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{log.log_type}</CardTitle>
                  <CardDescription>
                    {new Date(log.createdAt).toLocaleString('vi-VN')}
                  </CardDescription>
                </div>
                <Badge variant={log.status === 'SUCCESS' ? 'default' : 'destructive'}>
                  {log.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Người dùng:</span>
                <span className="font-medium truncate">{log.user_id?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thời gian:</span>
                <span className="font-medium">{log.duration_ms} ms</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog xem chi tiết (dùng chung cho cả 2 giao diện) */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chi tiết Log</DialogTitle>
            <DialogDescription>ID: {selectedLog?._id}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4 text-sm max-h-[70vh] overflow-y-auto">
            <div><strong>Prompt đã gửi:</strong><pre className="p-2 mt-1 text-xs whitespace-pre-wrap bg-muted rounded-md font-mono">{selectedLog?.prompt_sent}</pre></div>
            <div><strong>Phản hồi gốc:</strong><pre className="p-2 mt-1 text-xs whitespace-pre-wrap bg-muted rounded-md font-mono">{selectedLog?.raw_response}</pre></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
