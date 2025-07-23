// components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User, Rocket } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const emailInitial = user?.email ? user.email.charAt(0).toUpperCase() : '?';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Sử dụng justify-between để đẩy 2 nhóm phần tử ra 2 bên */}
      <div className="container mx-auto flex h-14 items-center justify-between">
        
        {/* Nhóm bên trái: Logo và các link điều hướng */}
        <div className="flex items-center space-x-6">
          <Link href="/generate" className="flex items-center space-x-2">
            <Rocket className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold">AI Roadmap</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4 text-sm font-medium">
            <Link href="/generate" className="transition-colors hover:text-primary">Tạo Lộ trình</Link>
            <Link href="/history" className="text-muted-foreground transition-colors hover:text-primary">Lịch sử</Link>
            <Link href="/suggestions" className="text-muted-foreground transition-colors hover:text-primary">Gợi ý Kỹ năng</Link>
          </nav>
        </div>

        {/* Nhóm bên phải: Menu người dùng */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative w-8 h-8 rounded-full">
                <Avatar className="w-8 h-8">
                  {/* <AvatarImage src="/avatars/01.png" alt="Avatar" /> */}
                  <AvatarFallback className="bg-primary text-primary-foreground">{emailInitial}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || 'Tài khoản'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <User className="w-4 h-4 mr-2" />
                  <span>Hồ sơ</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  );
}