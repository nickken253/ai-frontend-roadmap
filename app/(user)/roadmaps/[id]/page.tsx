// app/(user)/roadmaps/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Loader2, Download, PlusCircle } from 'lucide-react';
import { ReactFlowProvider } from 'reactflow';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { useRef, useState } from 'react';

import RoadmapFlowChart from '@/components/roadmap/RoadmapFlowChart';
import RoadmapDetailView from '@/components/roadmap/RoadmapDetailView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Hàm để fetch dữ liệu
const fetchRoadmapById = async (id: string) => {
    const { data } = await api.get(`/roadmaps/${id}`);
    return data; // Chỉ lấy phần result như bạn đã mô tả
};

export default function RoadmapDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const printRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const { data, isLoading, isError, error } = useQuery({ // <-- Đổi tên biến thành `data`
        queryKey: ['roadmap', id],
        queryFn: () => fetchRoadmapById(id),
        enabled: !!id,
    });

    const handleDownloadPdf = async () => {
        const element = printRef.current;
        if (!element) return;

        setIsDownloading(true);
        toast.info("Đang chuẩn bị file PDF, vui lòng đợi...");

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#020817'
            });
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`roadmap-${data?.roadmap_details?.career_goal.replace(/\s/g, '-') || 'download'}.pdf`);
            toast.success("Tải PDF thành công!");
        } catch (e) {
            console.error("Lỗi khi tạo PDF:", e); // Thêm log lỗi chi tiết
            toast.error("Đã có lỗi xảy ra khi tạo file PDF.");
        } finally {
            setIsDownloading(false);
        }
    };

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
            {/* <div className="mb-8">
                <h1 className="text-4xl font-bold">Mục tiêu: {roadmap_details.career_goal}</h1>
                <p className="mt-2 text-lg text-muted-foreground">{roadmap_details.skill_gap_summary}</p>
            </div> */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-4xl font-bold">Mục tiêu: {roadmap_details.career_goal}</h1>
                    <p className="mt-2 text-lg text-muted-foreground">{roadmap_details.skill_gap_summary}</p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                    <Button variant="outline" onClick={() => router.push('/generate')}>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Tạo Lộ trình mới
                    </Button>
                    <Button onClick={handleDownloadPdf} disabled={isDownloading}>
                        {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                        Tải về PDF
                    </Button>
                </div>
            </div>

            <div >
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-5" >
                    {/* Cột trái: Chi tiết lộ trình */}
                    <div className="lg:col-span-3" >
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
                                    {/* <RoadmapFlowChart nodes={reactFlowData.nodes} edges={reactFlowData.edges} /> */}
                                    <RoadmapFlowChart roadmapDetails={roadmap_details} />
                                </ReactFlowProvider>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <div className="absolute left-[-9999px]" ref={printRef}>
                <div className="container mx-auto p-8 w-[1200px] bg-background">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5" >
                        {/* Cột trái: Chi tiết lộ trình */}
                        <div className="lg:col-span-3" >
                            <RoadmapDetailView roadmap={roadmap_details.roadmap} forceOpenAll />
                        </div>

                        {/* Cột phải: Biểu đồ React Flow */}
                        <div className="lg:col-span-2">
                            <Card className="sticky top-20 shadow-soft">
                                <CardHeader>
                                    <CardTitle>Sơ đồ Lộ trình</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[600px]">
                                    <ReactFlowProvider>
                                        {/* <RoadmapFlowChart nodes={reactFlowData.nodes} edges={reactFlowData.edges} /> */}
                                        <RoadmapFlowChart roadmapDetails={roadmap_details} />
                                    </ReactFlowProvider>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}