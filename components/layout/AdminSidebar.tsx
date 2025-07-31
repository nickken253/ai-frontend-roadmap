// components/layout/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, LogOut, Rocket } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Component này chứa nội dung của sidebar, có thể tái sử dụng
export const AdminSidebarContent = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  const navItems = [
    { href: '/dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
    { href: '/users', label: 'Quản lý Người dùng', icon: Users },
    { href: '/logs', label: 'Logs hệ thống', icon: FileText },
  ];

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="">Admin Panel</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === item.href && "bg-muted text-primary"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start">
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );
};

// Component sidebar chính, chỉ hiển thị trên desktop
export function AdminSidebar() {
  return (
    <aside className="hidden border-r bg-muted/40 md:block">
      <AdminSidebarContent />
    </aside>
  );
}