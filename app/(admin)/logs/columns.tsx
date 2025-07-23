// app/(admin)/logs/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"



export type Log = {
    _id: string;
    user_id: {
        _id: string;
        email: string;
    };
    log_type: string;
    status: 'SUCCESS' | 'FAILED';
    duration_ms: number;
    createdAt: string;
    prompt_sent?: string;
    raw_response?: string;
};

export const columns: ColumnDef<Log>[] = [
    {
        accessorKey: 'user_id', // Giờ đây chúng ta truy cập cả object user_id
        header: 'Người dùng',
        // Dùng `cell` để tùy chỉnh cách hiển thị
        cell: ({ row }) => {
            const user = row.original.user_id;

            if (!user || !user._id) return <span className="text-muted-foreground">Không rõ</span>;

            // Rút gọn ID chỉ hiển thị 6 ký tự cuối
            const shortId = `...${user._id.slice(-6)}`;

            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            {/* Dùng div để bọc nội dung cho Tooltip */}
                            <div className="flex flex-col cursor-pointer">
                                <span className="font-medium">{user.email || 'N/A'}</span>
                                <span className="text-xs text-muted-foreground">{shortId}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>ID đầy đủ: {user._id}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    },
    // { accessorKey: 'user_id.email', header: 'Email' },
    {
        accessorKey: 'log_type',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Loại Log <ArrowUpDown className="w-4 h-4 ml-2" />
            </Button>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => <Badge variant={row.original.status === 'SUCCESS' ? 'default' : 'destructive'}>{row.original.status}</Badge>
    },
    {
        accessorKey: 'duration_ms',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Thời gian (ms) <ArrowUpDown className="w-4 h-4 ml-2" />
            </Button>
        ),
        cell: ({ row }) => `${row.original.duration_ms} ms`
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Thời điểm <ArrowUpDown className="w-4 h-4 ml-2" />
            </Button>
        ),
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleString('vi-VN')
    },
];