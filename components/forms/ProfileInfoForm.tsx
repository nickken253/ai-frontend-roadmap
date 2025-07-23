// components/forms/ProfileInfoForm.tsx
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const profileSchema = z.object({
  learning_style: z.string(),
  weekly_goal: z.string(),
});

export function ProfileInfoForm({ userProfile }: { userProfile: any }) {
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      learning_style: userProfile?.learning_style || 'practical',
      weekly_goal: userProfile?.weekly_goal || 'serious',
    },
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);
    try {
      const response = await api.put('/auth/me/profile', values);
      // Cập nhật lại user trong global state với profile mới
      setUser({ ...useAuthStore.getState().user, profile: response.data.profile });
      toast.success("Cập nhật profile thành công!");
    } catch (error: any) {
      toast.error("Cập nhật thất bại", {
        description: error.response?.data?.message || "Đã có lỗi xảy ra."
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="learning_style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phong cách học</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="visual">Visual (Hình ảnh)</SelectItem>
                    <SelectItem value="practical">Practical (Thực hành)</SelectItem>
                    <SelectItem value="reading">Reading (Đọc/Viết)</SelectItem>
                    <SelectItem value="auditory">Auditory (Nghe)</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weekly_goal"
            render={({ field }) => (
               <FormItem>
                <FormLabel>Cường độ học mỗi tuần</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="casual">Casual (Thoải mái)</SelectItem>
                    <SelectItem value="serious">Serious (Nghiêm túc)</SelectItem>
                    <SelectItem value="intensive">Intensive (Cường độ cao)</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
               {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </Form>
    </CardContent>
  );
}