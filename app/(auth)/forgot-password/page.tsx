// app/(auth)/forgot-password/page.tsx
'use client';

import { useState } from 'react';
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

const formSchema = z.object({
  email: z.string().email('Email không hợp lệ.'),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', values);

      toast.info('Yêu cầu đã được gửi', {
        description: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được một link đặt lại mật khẩu.',
      });

    } catch (error: any) {
      // Vẫn hiển thị thông báo thành công để bảo mật, tránh lộ thông tin email nào đã đăng ký
      toast.info('Yêu cầu đã được gửi', {
        description: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được một link đặt lại mật khẩu.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-soft">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-text">Quên mật khẩu?</CardTitle>
          <CardDescription>Nhập email của bạn để nhận link đặt lại mật khẩu.</CardDescription>
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
              <Button type="submit" className="w-full bg-primary hover:bg-primary-hover" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Gửi yêu cầu
              </Button>
            </form>
          </Form>
           <p className="mt-4 text-sm text-center">
            Nhớ ra mật khẩu rồi?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Đăng nhập
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}