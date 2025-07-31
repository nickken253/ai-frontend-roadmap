// app/(admin)/dashboard/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, FileText, LineChart } from "lucide-react";
import { Loader2 } from 'lucide-react';
import { GoalsDonutChart } from '@/components/admin/GoalsDonutChart';
import { SkillsBarChart } from '@/components/admin/SkillsBarChart';

// Hàm gọi API, bỏ phần logs và thêm popular-skills
const fetchDashboardStats = async () => {
    const [dashboard, popularGoals, popularSkills] = await Promise.all([
        api.get('/admin/stats/dashboard'),
        api.get('/admin/stats/popular-goals'),
        api.get('/admin/stats/popular-skills'),
    ]);
    return {
        dashboard: dashboard.data,
        popularGoals: popularGoals.data,
        popularSkills: popularSkills.data,
    };
};

export default function AdminDashboardPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['admin-dashboard-stats-v3'],
        queryFn: fetchDashboardStats,
    });

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Bảng điều khiển</h1>

            {/* SỬA LỖI Ở ĐÂY: Thay đổi grid layout */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                        <Users className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.dashboard.total_users}</div>
                        <p className="text-xs text-muted-foreground">Tổng số tài khoản</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Người dùng mới</CardTitle>
                        <Users className="w-4 h-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{data?.dashboard.new_users_today}</div>
                        <p className="text-xs text-muted-foreground">trong hôm nay</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Lộ trình đã tạo</CardTitle>
                        <LineChart className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{data?.dashboard.roadmaps_generated_today}</div>
                        <p className="text-xs text-muted-foreground">trong hôm nay</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Lỗi API</CardTitle>
                        <FileText className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{data?.dashboard.failed_api_calls_today}</div>
                        <p className="text-xs text-muted-foreground">trong hôm nay</p>
                    </CardContent>
                </Card>
            </div>

            {/* Hàng 2: Hai biểu đồ mới */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Phân bổ Mục tiêu</CardTitle>
                        <CardDescription>
                            Tỷ lệ các mục tiêu nghề nghiệp được người dùng lựa chọn.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <GoalsDonutChart data={data?.popularGoals || []} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Kỹ năng Phổ biến</CardTitle>
                        <CardDescription>
                            Các kỹ năng được người dùng nhập vào nhiều nhất.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SkillsBarChart data={data?.popularSkills || []} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}