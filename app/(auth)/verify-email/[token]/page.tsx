// app/(auth)/verify-email/[token]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, CircleCheck, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Đang xác thực tài khoản của bạn...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token xác thực không được tìm thấy.');
      return;
    }

    const verifyToken = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);
        setStatus('success');
        setMessage('Xác thực tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md text-center shadow-soft">
        <CardHeader>
          <CardTitle className="text-2xl">Trạng thái Xác thực Email</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          {status === 'loading' && <Loader2 className="w-12 h-12 text-primary animate-spin" />}
          {status === 'success' && <CircleCheck className="w-12 h-12 text-green-500" />}
          {status === 'error' && <AlertTriangle className="w-12 h-12 text-red-500" />}
          <p className="text-lg">{message}</p>
          {status !== 'loading' && (
            <Button onClick={() => router.push('/login')} className="bg-primary hover:bg-primary-hover">
              Tới trang Đăng nhập
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}