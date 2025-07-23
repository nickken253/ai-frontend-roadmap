// app/(user)/history/page.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Trash2, ChevronRight, History } from 'lucide-react';

import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Định nghĩa kiểu dữ liệu cho một roadmap trong danh sách
interface HistoryRoadmap {
  roadmap_id: string;
  created_at: string;
  career_goal: string;
}

// Hàm gọi API để lấy lịch sử
const fetchRoadmaps = async (): Promise<HistoryRoadmap[]> => {
  const { data } = await api.get('/roadmaps');
  return Array.isArray(data) ? data : [];
};

export default function HistoryPage() {
  const queryClient = useQueryClient();
  const [roadmapToDelete, setRoadmapToDelete] = useState<string | null>(null);

  // Sử dụng useQuery để lấy và cache dữ liệu
  const { data: roadmaps, isLoading, isError } = useQuery({
    queryKey: ['roadmaps'],
    queryFn: fetchRoadmaps,
  });

  // Sử dụng useMutation để xử lý việc xóa
  const deleteMutation = useMutation({
    mutationFn: (roadmapId: string) => api.delete(`/roadmaps/${roadmapId}`),
    onSuccess: () => {
      toast.success("Đã xóa lộ trình thành công!");
      // Làm mới lại query 'roadmaps' để cập nhật danh sách
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
    },
    onError: () => {
      toast.error("Xóa lộ trình thất bại.");
    },
  });

  const handleDelete = () => {
    if (roadmapToDelete) {
      deleteMutation.mutate(roadmapToDelete);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500">Lỗi khi tải lịch sử.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Lịch sử Lộ trình</CardTitle>
          <CardDescription>Xem lại tất cả các lộ trình bạn đã tạo.</CardDescription>
        </CardHeader>
        <CardContent>
          {roadmaps && roadmaps.length > 0 ? (
            <ul className="space-y-3">
              {roadmaps.map((roadmap) => (
                <li key={roadmap.roadmap_id} className="flex items-center justify-between p-4 transition-colors border rounded-lg hover:bg-muted/50">
                  <Link href={`/roadmaps/${roadmap.roadmap_id}`} className="flex-grow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-primary">{roadmap.career_goal}</p>
                        <p className="text-sm text-muted-foreground">
                          Tạo ngày: {new Date(roadmap.created_at).toLocaleDateString('vi-VN', {
                            day: '2-digit', month: '2-digit', year: 'numeric'
                          })}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button 
                          variant="ghost" 
                          size="icon" 
                          className="ml-4 text-red-500 hover:text-red-700"
                          onClick={() => setRoadmapToDelete(roadmap.roadmap_id)}
                        >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Hành động này không thể được hoàn tác. Lộ trình này sẽ bị xóa vĩnh viễn khỏi tài khoản của bạn.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                          Vẫn xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center p-10 text-center border-2 border-dashed rounded-lg">
              <History className="w-12 h-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-semibold">Chưa có lộ trình nào</p>
              <p className="text-muted-foreground">Hãy bắt đầu tạo lộ trình đầu tiên của bạn!</p>
              <Link href="/generate">
                <Button className="mt-4">Tạo Lộ trình mới</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}