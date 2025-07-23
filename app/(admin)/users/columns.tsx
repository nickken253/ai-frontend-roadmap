// app/(admin)/users/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

export type User = {
    _id: string;
    email: string;
    role: 'user' | 'admin';
    is_active: boolean;
    is_verified: boolean;
    createdAt: string;
};

const StatusToggle = ({ user }: { user: User }) => {
    const { user: currentUser } = useAuthStore();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (newStatus: boolean) => api.put(`/admin/users/${user._id}/status`, { is_active: newStatus }),
        onSuccess: () => {
            toast.success("Cập nhật trạng thái thành công.");
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
        onError: () => toast.error("Cập nhật trạng thái thất bại.")
    });
    const isSelf = currentUser?.id === user._id;

    return <Switch checked={user.is_active} onCheckedChange={(val) => mutation.mutate(val)} disabled={isSelf} />;
};

const RoleSelector = ({ user }: { user: User }) => {
    const { user: currentUser } = useAuthStore();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (newRole: string) => api.put(`/admin/users/${user._id}/role`, { role: newRole }),
        onSuccess: () => {
            toast.success("Cập nhật vai trò thành công.");
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
        onError: () => toast.error("Cập nhật vai trò thất bại.")
    });

    const isSelf = currentUser?.id === user._id;
    return (
        <Select defaultValue={user.role} onValueChange={(val) => mutation.mutate(val)} disabled={isSelf}>
            <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
            <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
        </Select>
    );
};

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Email <ArrowUpDown className="w-4 h-4 ml-2" />
            </Button>
        ),
    },
    { accessorKey: 'role', header: 'Vai trò', cell: ({ row }) => <RoleSelector user={row.original} /> },
    { accessorKey: 'is_active', header: 'Trạng thái', cell: ({ row }) => <StatusToggle user={row.original} /> },
    { accessorKey: 'is_verified', header: 'Đã xác thực', cell: ({ row }) => <Badge variant={row.original.is_verified ? "default" : "outline"}>{row.original.is_verified ? "Yes" : "No"}</Badge> },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Ngày tạo <ArrowUpDown className="w-4 h-4 ml-2" />
            </Button>
        ),
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('vi-VN')
    },
];