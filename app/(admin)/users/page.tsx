// app/(admin)/users/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { columns, User } from './columns';
import { DataTable } from '@/components/ui/data-table'; // Sẽ tạo ở bước sau
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UserDetail from '@/components/admin/UserDetail';

const fetchUsers = async (): Promise<User[]> => {
    const { data } = await api.get('/admin/users');
    return data;
};

export default function AdminUsersPage() {
    const [viewingUserId, setViewingUserId] = useState<string | null>(null);
    const { data: users, isLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: fetchUsers,
    });

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Quản lý Người dùng</h1>
            <DataTable
                columns={columns}
                data={users || []}
                // NEW: Truyền sự kiện click vào
                onRowClick={(user) => setViewingUserId(user._id)}
            />

            {/* NEW: Dialog để xem chi tiết */}
            <Dialog open={!!viewingUserId} onOpenChange={() => setViewingUserId(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Chi tiết Người dùng</DialogTitle>
                    </DialogHeader>
                    {viewingUserId && <UserDetail userId={viewingUserId} />}
                </DialogContent>
            </Dialog>
        </div>
    );
}