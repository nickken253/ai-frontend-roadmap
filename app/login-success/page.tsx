'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function LoginSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, logout } = useAuthStore();

    useEffect(() => {
        const token = searchParams.get('token');

        const handleTokenSuccess = async (authToken: string) => {
            try {

                localStorage.setItem('authToken', authToken);

                // BƯỚC 3: Gọi API /auth/me để lấy thông tin user
                const userResponse = await api.get('/auth/me');
                const user = userResponse.data;

                if (!user.is_active) {
                    toast.error("Tài khoản đã bị khóa", {
                        description: "Vui lòng liên hệ quản trị viên để biết thêm chi tiết."
                    });
                    logout();
                    router.push('/login');
                    // setIsLoading(false);
                    return; // Dừng quá trình đăng nhập tại đây
                }

                login(user, authToken);
                toast.success('Đăng nhập thành công!', {
                    description: `Chào mừng trở lại, ${user.name || user.email}`,
                });
                // Chuyển hướng đến trang generate sau khi đăng nhập
                router.push('/generate');
            } catch (error: any) {
                toast.error('Xác thực thất bại', {
                    description: error.response?.data?.message || "Không thể lấy thông tin người dùng.",
                });
                logout();
                router.push('/login');
            }
        }
        if (token) {
            handleTokenSuccess(token);
        } else {
            // Nếu không có token, báo lỗi và chuyển về trang đăng nhập
            toast.error('Xác thực thất bại. Vui lòng thử lại.');
            router.push('/login');
        }
    }, [router, searchParams, login]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-semibold mb-4">Đang xử lý đăng nhập...</h1>
                <p>Vui lòng chờ trong giây lát, chúng tôi đang chuyển hướng bạn.</p>
                {/* You can add a spinner here */}
                <div className="mt-4 animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        </div>
    );
}