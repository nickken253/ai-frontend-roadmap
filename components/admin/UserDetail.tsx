// components/admin/UserDetail.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RoadmapDetailView from '@/components/roadmap/RoadmapDetailView';

const fetchUserById = async (userId: string) => {
    const { data } = await api.get(`/admin/users/${userId}`);
    return data;
};

const DetailRow = ({ label, value }: { label: string, value: any }) => (
    <div className="py-3 border-b grid grid-cols-3 items-start">
        <dt className="font-medium text-muted-foreground">{label}</dt>
        <dd className="col-span-2">{value}</dd>
    </div>
);

export default function UserDetail({ userId }: { userId: string }) {
    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['admin-user-detail', userId],
        queryFn: () => fetchUserById(userId),
        enabled: !!userId,
    });

    const [viewingRoadmap, setViewingRoadmap] = useState<any | null>(null);

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;
    if (isError) return <div className="text-red-500">Không thể tải dữ liệu người dùng.</div>;

    return (
        <>
            <div className="max-h-[75vh] overflow-y-auto pr-2">
                <dl>
                    <DetailRow label="ID" value={<span className="font-mono text-xs">{user._id}</span>} />
                    <DetailRow label="Email" value={user.email} />
                    <DetailRow label="Vai trò" value={<Badge>{user.role}</Badge>} />
                    <DetailRow label="Trạng thái" value={user.is_active ? "Hoạt động" : "Bị khóa"} />
                    <DetailRow label="Đã xác thực" value={user.is_verified ? "Đã xác thực" : "Chưa"} />
                    <DetailRow label="Ngày tham gia" value={new Date(user.createdAt).toLocaleString('vi-VN')} />
                </dl>

                {/* NEW: Hiển thị lịch sử lộ trình một cách chi tiết hơn */}
                <div className="mt-4">
                    <h4 className="font-medium text-muted-foreground mb-2">Lịch sử Lộ trình ({user.roadmaps_history?.length || 0})</h4>
                    <div className="space-y-2">
                        {user.roadmaps_history && user.roadmaps_history.length > 0 ? (
                            user.roadmaps_history.map((roadmap: any) => (
                                <button
                                    key={roadmap._id}
                                    onClick={() => setViewingRoadmap(roadmap)}
                                    className="w-full flex items-center justify-between p-2 text-sm border rounded-md hover:bg-muted text-left"
                                >
                                    <div>
                                        <p className="font-semibold">{roadmap.result?.roadmap_details?.career_goal || 'Chưa có mục tiêu'}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Tạo lúc: {new Date(roadmap.created_at).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                </button>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">Người dùng này chưa tạo lộ trình nào.</p>
                        )}
                    </div>
                </div>
            </div>
            <Dialog open={!!viewingRoadmap} onOpenChange={() => setViewingRoadmap(null)}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Chi tiết Lộ trình của: {user.email}</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[80vh] overflow-y-auto pr-4">
                        {/* Tái sử dụng component đã tạo cho người dùng */}
                        {viewingRoadmap && <RoadmapDetailView roadmap={viewingRoadmap.result.roadmap_details.roadmap} />}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}