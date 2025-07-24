// app/(auth)/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';
import AuthHeader from '@/components/layout/AuthHeader';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, user } = useAuthStore(); // Lấy thêm `user`
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const isVerificationPage = pathname?.startsWith('/verify-email/');

        if (isAuthenticated && !isVerificationPage) {
            // NEW: Logic chuyển hướng thông minh hơn
            // Kiểm tra vai trò của user và chuyển hướng cho đúng
            if (user?.role === 'admin') {
                router.push('/dashboard'); // Đã sửa lại theo ý bạn
            } else {
                router.push('/generate');
            }
        }
        setIsChecking(false);

        // Thêm `user` vào dependency array
    }, [isAuthenticated, user, router, pathname]);

    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <AuthHeader />
            <main>{children}</main>
        </div>
    );
}