// app/(user)/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

import { useAuthStore } from '@/store/authStore';
import Header from '@/components/layout/Header';
import { Loader2 } from 'lucide-react';
import VerificationBanner from '@/components/layout/VerificationBanner';

const fetchCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const queryClient = useQueryClient(); // Lấy queryClient instance
    const { isAuthenticated, user, logout, setUser } = useAuthStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const { data: freshUser, isError } = useQuery({
        queryKey: ['currentUser'],
        queryFn: fetchCurrentUser,
        enabled: isHydrated && isAuthenticated,
        refetchOnWindowFocus: false, // Tắt tính năng tự động để chúng ta tự quản lý
        retry: 1,
    });
    
    // NEW: Tự lắng nghe sự kiện focus để làm mới dữ liệu
    useEffect(() => {
        const handleFocus = () => {
            // Invalidate query 'currentUser', buộc nó phải fetch lại
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        };

        window.addEventListener('focus', handleFocus);

        // Dọn dẹp listener khi component unmount
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [queryClient]);


    useEffect(() => {
        if (freshUser) {
            setUser(freshUser);
        }
    }, [freshUser, setUser]);

    useEffect(() => {
        if (!isHydrated) return;
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        if (isError) {
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            logout();
            return;
        }
        if (user && !user.is_active) {
            toast.error("Tài khoản của bạn đã bị khóa.");
            logout();
        }
    }, [isAuthenticated, isHydrated, user, isError, logout, router]);

    if (!isHydrated || !isAuthenticated || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-text">
            <Header />
            <main className="p-4 sm:p-6 md:p-8">
                {user && !user.is_verified && <VerificationBanner />}
                {children}
            </main>
        </div>
    );
}