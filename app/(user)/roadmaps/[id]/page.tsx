// app/(user)/roadmaps/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { ReactFlowProvider } from 'reactflow';

import RoadmapFlowChart from '@/components/roadmap/RoadmapFlowChart';
import RoadmapDetailView from '@/components/roadmap/RoadmapDetailView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Hàm để fetch dữ liệu
const fetchRoadmapById = async (id: string) => {
    const { data } = await api.get(`/roadmaps/${id}`);
    return data; // Chỉ lấy phần result như bạn đã mô tả
};

export default function RoadmapDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const { data, isLoading, isError, error } = useQuery({ // <-- Đổi tên biến thành `data`
        queryKey: ['roadmap', id],
        queryFn: () => fetchRoadmapById(id),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return <div className="text-center text-red-500">Lỗi khi tải lộ trình: {error.message}</div>;
    }

    if (!data) return null;

    const { roadmap_details, reactFlowData } = data;

    return (
        <div className="container mx-auto">
            {/* Tiêu đề và tóm tắt */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold">Mục tiêu: {roadmap_details.career_goal}</h1>
                <p className="mt-2 text-lg text-muted-foreground">{roadmap_details.skill_gap_summary}</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                {/* Cột trái: Chi tiết lộ trình */}
                <div className="lg:col-span-3">
                    <RoadmapDetailView roadmap={roadmap_details.roadmap} />
                </div>

                {/* Cột phải: Biểu đồ React Flow */}
                <div className="lg:col-span-2">
                    <Card className="sticky top-20 shadow-soft">
                        <CardHeader>
                            <CardTitle>Sơ đồ Lộ trình</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[600px]">
                            <ReactFlowProvider>
                                <RoadmapFlowChart nodes={reactFlowData.nodes} edges={reactFlowData.edges} />
                            </ReactFlowProvider>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}