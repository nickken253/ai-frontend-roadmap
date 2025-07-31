// app/(admin)/users/page.tsx
'use client';
    
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
// Import thêm StatusToggle và RoleSelector
import { columns, User, StatusToggle, RoleSelector } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const fetchUsers = async (): Promise<User[]> => {
  const { data } = await api.get('/admin/users');
  return data;
};

export default function AdminUsersPage() {
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
      
      {/* Giao diện Desktop: Ẩn trên mobile */}
      <div className="hidden md:block">
        <DataTable columns={columns} data={users || []} />
      </div>

      {/* Giao diện Mobile: Chỉ hiển thị trên mobile */}
      <div className="block md:hidden space-y-4">
        {(users || []).map((user) => (
          <Card key={user._id}>
            <CardHeader>
              <CardTitle className="text-base truncate">{user.email}</CardTitle>
              <CardDescription>
                Ngày tạo: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Vai trò</span>
                <RoleSelector user={user} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Trạng thái</span>
                <StatusToggle user={user} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Đã xác thực</span>
                <Badge variant={user.is_verified ? "default" : "outline"}>
                  {user.is_verified ? "Yes" : "No"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
