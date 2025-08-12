// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner'; // <-- Thay đổi import ở đây

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

import { FaGithub, FaGoogle } from 'react-icons/fa';

const formSchema = z.object({
    email: z.string().email('Email không hợp lệ.'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
});

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: '', password: '' },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            // BƯỚC 1: Gọi API login để lấy token
            const loginResponse = await api.post('/auth/login', values);
            const { token } = loginResponse.data;

            if (!token) {
                throw new Error("Không nhận được token từ server.");
            }

            // BƯỚC 2: Lưu token vào localStorage ngay lập tức
            // để các request sau được tự động xác thực
            localStorage.setItem('authToken', token);

            // BƯỚC 3: Gọi API /auth/me để lấy thông tin user
            const userResponse = await api.get('/auth/me');
            const user = userResponse.data;

            if (!user.is_active) {
                toast.error("Tài khoản đã bị khóa", {
                    description: "Vui lòng liên hệ quản trị viên để biết thêm chi tiết."
                });
                localStorage.removeItem('authToken'); // Dọn dẹp token
                setIsLoading(false);
                return; // Dừng quá trình đăng nhập tại đây
            }

            login(user, token);

            toast.success('Đăng nhập thành công!', {
                description: `Chào mừng trở lại, ${user.username || user.email}`,
            });

        } catch (error: any) {
            // Xử lý lỗi
            localStorage.removeItem('authToken'); // Dọn dẹp token nếu có lỗi xảy ra
            toast.error('Đăng nhập thất bại', {
                description: error.response?.data?.message || "Sai email hoặc mật khẩu.",
            });
        } finally {
            setIsLoading(false);
        }
    }
    const handleSocialLogin = (provider: 'google' | 'github') => {
        window.location.href = `https://ai-backend-roadmap.onrender.com/api/v1/auth/${provider}`;
    };

    return (
        <div className="flex items-center justify-center min-h-screen text-white text-shadow-glow">
            <Card className="w-full max-w-md shadow-soft ">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-text ">Chào mừng trở lại!</CardTitle>
                    <CardDescription>Đăng nhập để tạo lộ trình học tập của bạn.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="user@example.com" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mật khẩu</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full bg-primary hover:bg-primary-hover" disabled={isLoading}>
                                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Đăng nhập
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-sm text-center">
                        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                            Quên mật khẩu?
                        </Link>
                    </div>
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Hoặc tiếp tục với
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" onClick={() => handleSocialLogin('google')}>
                            <FaGoogle className="mr-2 h-4 w-4" />
                            Google
                        </Button>
                        <Button variant="outline" onClick={() => handleSocialLogin('github')}>
                            <FaGithub className="mr-2 h-4 w-4" />
                            GitHub
                        </Button>
                    </div>
                    <div className="mt-6 text-center text-sm">
                        <p className="mt-2">
                            Chưa có tài khoản?{' '}
                            <Link href="/register" className="font-semibold text-primary hover:underline">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}