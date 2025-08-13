'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { cn } from '@/lib/utils'; // Giả sử bạn có hàm tiện ích này từ shadcn

// Định nghĩa kiểu dữ liệu cho profile
interface Profile {
    fullname: string;
    avatar: string;
}

interface ProfileData {
    existingProfile: Profile;
    socialProfile: Profile;
}

// Component bọc Suspense để tránh lỗi khi dùng useSearchParams ở cấp cao nhất
export default function ConfirmAccountLinkPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Đang tải...</div>}>
            <ConfirmAccountLinkInner />
        </Suspense>
    );
}

// Component chính chứa toàn bộ logic
function ConfirmAccountLinkInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, logout } = useAuthStore();

    // State quản lý
    const [mergeToken, setMergeToken] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [choices, setChoices] = useState({ fullname: 'existing', avatar: 'existing' });
    const [isLoading, setIsLoading] = useState(true);
    const [isCompleting, setIsCompleting] = useState(false);

    // Effect để lấy token và fetch thông tin profile
    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            toast.error('Thiếu thông tin để liên kết tài khoản.');
            router.push('/login');
            return;
        }
        setMergeToken(token);

        const fetchProfileDetails = async () => {
            setIsLoading(true);
            try {
                const response = await api.post('/auth/link/details', { token });
                setProfileData(response.data);
            } catch (error: any) {
                toast.error('Không thể lấy thông tin liên kết.', {
                    description: error.response?.data?.message || 'Vui lòng thử đăng nhập lại.',
                });
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileDetails();
    }, [searchParams, router]);

    // Hàm xử lý khi hoàn tất liên kết
    const handleCompleteLink = async () => {
        if (!mergeToken) return;

        setIsCompleting(true);
        try {
            // 1. Gọi API để hoàn tất việc liên kết với các lựa chọn
            const completeResponse = await api.post('/auth/link/complete', {
                token: mergeToken,
                choices,
            });

            const { token: newAuthToken } = completeResponse.data;
            if (!newAuthToken) {
                throw new Error("Không nhận được token sau khi liên kết.");
            }

            // 2. Lưu token mới và cập nhật store
            localStorage.setItem('authToken', newAuthToken);
            useAuthStore.setState({ token: newAuthToken, isAuthenticated: true });

            // 3. Lấy thông tin người dùng đã được hợp nhất
            const userResponse = await api.get('/auth/me');
            const user = userResponse.data;

            if (!user.is_active) {
                toast.error("Tài khoản của bạn đã bị khóa.");
                logout();
                router.push('/login');
                return;
            }

            // 4. Hoàn tất login và chuyển hướng
            login(user, newAuthToken);
            toast.success('Tài khoản đã được liên kết thành công!');
            router.push('/generate');

        } catch (error: any) {
            toast.error('Không thể hoàn tất liên kết tài khoản.', {
                description: error.response?.data?.message || 'Đã có lỗi xảy ra.',
            });
            logout();
            router.push('/login');
        } finally {
            setIsCompleting(false);
        }
    };

    // Render UI
    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Đang lấy thông tin liên kết...</div>;
    }

    if (!profileData) {
        return <div className="flex items-center justify-center min-h-screen">Không có thông tin để hiển thị.</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen dark:bg-gray-900 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl">Hợp nhất thông tin tài khoản</CardTitle>
                    <CardDescription>
                        Chúng tôi tìm thấy tài khoản mạng xã hội của bạn đã được liên kết trước đó. Để tránh xung đột, vui lòng chọn thông tin bạn muốn giữ lại.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Phần chọn Tên hiển thị */}
                    <div className="space-y-2">
                        <h3 className="font-semibold">Chọn Tên hiển thị</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                onClick={() => setChoices({ ...choices, fullname: 'existing' })}
                                className={cn(
                                    'p-4 border rounded-lg cursor-pointer transition-all',
                                    choices.fullname === 'existing' ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300 dark:border-gray-700'
                                )}
                            >
                                <p className="font-medium">{profileData.existingProfile.fullname}</p>
                                {/* <p className="text-sm text-gray-500">Tài khoản hiện tại</p> */}
                            </div>
                            <div
                                onClick={() => setChoices({ ...choices, fullname: 'social' })}
                                className={cn(
                                    'p-4 border rounded-lg cursor-pointer transition-all',
                                    choices.fullname === 'social' ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300 dark:border-gray-700'
                                )}
                            >
                                <p className="font-medium">{profileData.socialProfile.fullname}</p>
                                {/* <p className="text-sm text-gray-500">Tài khoản mạng xã hội</p> */}
                            </div>
                        </div>
                    </div>

                    {/* Phần chọn Ảnh đại diện */}
                    <div className="space-y-2">
                        <h3 className="font-semibold">Chọn Ảnh đại diện</h3>
                        <div className="flex justify-center md:justify-start items-center gap-8">
                            <div className="text-center space-y-2">
                                <Image
                                    src={profileData.existingProfile.avatar || '/default-avatar.png'}
                                    alt="Existing Avatar"
                                    width={100}
                                    height={100}
                                    onClick={() => setChoices({ ...choices, avatar: 'existing' })}
                                    className={cn(
                                        'rounded-full cursor-pointer transition-all mx-auto',
                                        choices.avatar === 'existing' ? 'ring-4 ring-blue-500' : 'ring-2 ring-transparent'
                                    )}
                                />
                                <p className="text-sm text-gray-500">Ảnh 1</p>
                            </div>
                            <div className="text-center space-y-2">
                                <Image
                                    src={profileData.socialProfile.avatar || '/default-avatar.png'}
                                    alt="Social Avatar"
                                    width={100}
                                    height={100}
                                    onClick={() => setChoices({ ...choices, avatar: 'social' })}
                                    className={cn(
                                        'rounded-full cursor-pointer transition-all mx-auto',
                                        choices.avatar === 'social' ? 'ring-4 ring-blue-500' : 'ring-2 ring-transparent'
                                    )}
                                />
                                <p className="text-sm text-gray-500">Ảnh 2</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => router.push('/login')} disabled={isCompleting}>
                        Hủy
                    </Button>
                    <Button onClick={handleCompleteLink} disabled={isCompleting}>
                        {isCompleting ? 'Đang xử lý...' : 'Hoàn tất liên kết'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
