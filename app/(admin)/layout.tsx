// app/(admin)/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/authStore';
import { AdminSidebar } from '@/components/layout/AdminSidebar'; 
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => { setIsHydrated(true); }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // KIỂM TRA QUYỀN ADMIN
    if (user?.role !== 'admin') {
      toast.error("Truy cập bị từ chối", { description: "Bạn không có quyền truy cập khu vực này."});
      router.push('/generate'); // Đẩy người dùng thường về trang của họ
    }
  }, [isAuthenticated, isHydrated, user, router]);

  // Hiển thị loading trong khi chờ kiểm tra
  if (!isHydrated || user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Nếu là admin, hiển thị layout quản trị
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-muted/40">
        {children}
      </main>
    </div>
  );
}