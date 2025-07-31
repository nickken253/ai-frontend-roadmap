// app/(admin)/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/authStore';
import { AdminSidebar } from '@/components/layout/AdminSidebar'; 
import { AdminHeader } from '@/components/layout/AdminHeader'; // Import header mới
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

    if (user?.role !== 'admin') {
      toast.error("Truy cập bị từ chối", { description: "Bạn không có quyền truy cập khu vực này."});
      router.push('/generate');
    }
  }, [isAuthenticated, isHydrated, user, router]);

  if (!isHydrated || user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Sử dụng Grid layout để tạo bố cục responsive
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar này chỉ hiển thị trên desktop */}
      <AdminSidebar />
      <div className="flex flex-col">
        {/* Header này chỉ hiển thị trên mobile */}
        <AdminHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
