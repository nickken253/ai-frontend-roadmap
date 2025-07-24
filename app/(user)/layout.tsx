// app/(user)/layout.tsx
'use client';

import { useEffect, useState } from 'react'; // Thêm useState
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/layout/Header';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import VerificationBanner from '@/components/layout/VerificationBanner';

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated, user, logout } = useAuthStore();

    // State để theo dõi quá trình phục hồi của Zustand từ localStorage
    const [isHydrated, setIsHydrated] = useState(false);

    // useEffect này chỉ chạy một lần để đánh dấu là quá trình phục hồi đã xong
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // useEffect này để kiểm tra và chuyển hướng, nhưng chỉ sau khi đã phục hồi
    useEffect(() => {
        // Nếu chưa phục hồi xong thì không làm gì cả
        if (!isHydrated) {
            return;
        }
        // Nếu đã phục hồi và user chưa đăng nhập, chuyển hướng về login
        if (!isAuthenticated) {
            router.push('/login');
        }
        if (user && !user.is_active) {
            toast.error("Tài khoản của bạn đã bị khóa.");
            logout(); // Xóa state và token
            // router.push('/login') sẽ được kích hoạt ở lần render sau vì isAuthenticated = false
        }
    }, [isAuthenticated, isHydrated, user, logout, router]);

    // Trong khi chờ phục hồi, hiển thị một màn hình loading
    if (!isHydrated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Nếu đã phục hồi và user đã đăng nhập, hiển thị nội dung
    // Nếu chưa đăng nhập, nó sẽ bị chuyển hướng bởi useEffect ở trên
    return isAuthenticated ? (
        <div className="min-h-screen bg-background text-text">
            <Header />
            <main className="p-4 sm:p-6 md:p-8">
                {user && !user.is_verified && <VerificationBanner />}
                {children}
            </main>
        </div>
    ) : (
        // Hiển thị loading trong lúc chờ chuyển hướng để tránh "nháy" màn hình
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
}