// components/layout/LandingHeader.tsx
'use client';

import Link from 'next/link';
import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* - `container`: Giới hạn chiều rộng tối đa của nội dung.
        - `mx-auto`: Tự động căn giữa container này theo chiều ngang.
        - `flex items-center`: Căn các phần tử con theo chiều dọc.
        - `justify-between`: Đẩy logo sang trái và các nút sang phải.
      */}
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Phần bên trái: Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Rocket className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold">AI Roadmap</span>
        </Link>
        
        {/* Phần bên phải: Các nút */}
        <nav className="flex items-center space-x-2">
          <Link href="/login">
            <Button variant="ghost">Đăng nhập</Button>
          </Link>
          <Link href="/register">
            <Button>Bắt đầu Ngay</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}