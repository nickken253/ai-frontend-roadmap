// components/forms/ChangePasswordForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Mật khẩu hiện tại không được để trống."),
  newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự."),
}).refine(
  (data) => data.newPassword !== data.currentPassword, 
  {
    message: "Mật khẩu mới không được trùng với mật khẩu hiện tại.",
    path: ["newPassword"], // Gán thông báo lỗi vào trường Mật khẩu mới
  }
);

// NEW: Thêm prop onSuccess vào component
export function ChangePasswordForm({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  async function onSubmit(values: z.infer<typeof passwordSchema>) {
    setIsLoading(true);
    try {
      await api.put('/auth/me/password', values);
      toast.success("Đổi mật khẩu thành công!");
      form.reset();
      onSuccess(); // NEW: Gọi hàm callback sau khi thành công
    } catch (error: any) {
      toast.error("Đổi mật khẩu thất bại", {
        description: error.response?.data?.message || "Mật khẩu hiện tại không đúng."
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    // Giao diện giữ nguyên, không cần thay đổi
    <CardContent className="pt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu hiện tại</FormLabel>
                <FormControl><Input type="password" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
               <FormItem>
                <FormLabel>Mật khẩu mới</FormLabel>
                <FormControl><Input type="password" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading}>
               {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Cập nhật mật khẩu
            </Button>
          </div>
        </form>
      </Form>
    </CardContent>
  );
}