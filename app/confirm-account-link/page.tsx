'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api'; // Import instance api và getProfile

export default function ConfirmAccountLinkPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, logout } = useAuthStore();
    const [mergeToken, setMergeToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            setMergeToken(token);
        } else {
            toast.error('Thiếu thông tin để liên kết tài khoản.');
            router.push('/login');
        }
    }, [searchParams, router]);

    const handleLinkAccount = async () => {
        if (!mergeToken) return;

        setIsLoading(true);
        try {
            // Bước 1: Gọi API để liên kết tài khoản và nhận lại token xác thực mới
            const response = await api.post('/auth/link-account', { token: mergeToken });
            const { token: newAuthToken } = response.data;

            if (!newAuthToken) {
                throw new Error("Không nhận được token sau khi liên kết.");
            }

            // Bước 2: Thực hiện luồng đăng nhập tương tự trang login-success
            localStorage.setItem('authToken', newAuthToken);
            useAuthStore.setState({ token: newAuthToken, isAuthenticated: true });

            const userResponse = await api.get('/auth/me');
            const user = userResponse.data;

            if (!user.is_active) {
                toast.error("Tài khoản đã bị khóa");
                logout();
                router.push('/login');
                return;
            }

            // Bước 3: Hoàn tất đăng nhập với đủ 2 tham số
            login(user, newAuthToken);
            toast.success('Tài khoản đã được liên kết thành công!');
            router.push('/generate');

        } catch (error: any) {
            toast.error('Không thể liên kết tài khoản.', {
                description: error.response?.data?.message || 'Đã có lỗi xảy ra.',
            });
            logout();
            router.push('/login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/login');
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <AlertDialog open={!!mergeToken}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận liên kết tài khoản?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Chúng tôi tìm thấy một tài khoản đã tồn tại với email được liên kết với tài khoản mạng xã hội của bạn. Bạn có muốn liên kết chúng lại với nhau không?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLinkAccount} disabled={isLoading}>
                            {isLoading ? 'Đang liên kết...' : 'Liên kết'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}