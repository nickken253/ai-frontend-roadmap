'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LoginFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    const errorMessage = error ? decodeURIComponent(error) : 'Đã có lỗi không xác định xảy ra.';
    toast.error(`Đăng nhập thất bại: ${errorMessage}`);
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Đăng nhập thất bại</h1>
      <p className="mb-6">Đã có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.</p>
      <Button asChild>
        <Link href="/login">Quay lại trang đăng nhập</Link>
      </Button>
    </div>
  );
}