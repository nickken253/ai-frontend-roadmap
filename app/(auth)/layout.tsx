// app/(auth)/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore(); // Lấy thêm `user`
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      // NEW: Logic chuyển hướng thông minh hơn
      // Kiểm tra vai trò của user và chuyển hướng cho đúng
      if (user?.role === 'admin') {
        router.push('/dashboard'); // Đã sửa lại theo ý bạn
      } else {
        router.push('/generate');
      }
    } else {
      setIsChecking(false);
    }
    // Thêm `user` vào dependency array
  }, [isAuthenticated, user, router]);

  if (isChecking || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}