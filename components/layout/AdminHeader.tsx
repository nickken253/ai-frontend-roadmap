// components/layout/AdminHeader.tsx
'use client';

import Link from 'next/link';
import { Menu, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
// NEW: Import thêm các component con của Sheet
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { AdminSidebarContent } from './AdminSidebar';

export function AdminHeader() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Mở menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-full max-w-xs">
            {/* NEW: Thêm Header cho Sheet để đảm bảo accessibility */}
            <SheetHeader className="sr-only">
              <SheetTitle>Admin Menu</SheetTitle>
              <SheetDescription>
                Menu điều hướng cho khu vực quản trị.
              </SheetDescription>
            </SheetHeader>
            
            {/* Nội dung sidebar vẫn được tái sử dụng */}
            <AdminSidebarContent />
        </SheetContent>
      </Sheet>
      
      <div className="flex-1 text-center">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold justify-center">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="text-lg">Admin</span>
        </Link>
      </div>
    </header>
  );
}
