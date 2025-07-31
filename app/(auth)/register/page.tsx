// app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import api from '@/lib/api';

// Schema validation với logic kiểm tra mật khẩu trùng khớp
const formSchema = z
  .object({
    email: z.string().email('Email không hợp lệ.'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp.',
    path: ['confirmPassword'], // Gán lỗi vào trường confirmPassword
  });

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Gọi API đăng ký, không cần gửi confirmPassword
      await api.post('/auth/register', {
        email: values.email,
        password: values.password,
      });

      toast.success('Đăng ký thành công!', {
        description: 'Vui lòng kiểm tra email để xác thực tài khoản.',
      });

      // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
      router.push('/login');

    } catch (error: any) {
      toast.error('Đăng ký thất bại', {
        description: error.response?.data?.message || 'Email này có thể đã tồn tại.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-shadow-glow">
      <Card className="w-full max-w-md shadow-soft">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-text">Tạo tài khoản</CardTitle>
          <CardDescription>Bắt đầu hành trình học tập của bạn ngay hôm nay.</CardDescription>
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
                    <FormControl><Input placeholder="user@example.com" {...field} disabled={isLoading} /></FormControl>
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
                    <FormControl><Input type="password" placeholder="••••••••" {...field} disabled={isLoading} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} disabled={isLoading} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary-hover" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Đăng ký
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-sm text-center">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Đăng nhập
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}