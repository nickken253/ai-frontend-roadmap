// components/profile/ProfileEditForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const profileSchema = z.object({
  name: z.string().min(1, "Họ tên không được để trống."),
  learning_style: z.string(),
  weekly_goal: z.string(),
});

export function ProfileEditForm({ user, onSaveSuccess, onCancel }: { user: any, onSaveSuccess: () => void, onCancel: () => void }) {
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      learning_style: user?.profile?.learning_style || 'practical',
      weekly_goal: user?.profile?.weekly_goal || 'serious',
    },
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);
    try {
      // Giả sử API chấp nhận cả name và profile
      const payload = { ...values }; 
      const response = await api.put('/auth/me/profile', payload);
      setUser({ ...useAuthStore.getState().user, ...payload, profile: response.data.profile });
      toast.success("Cập nhật profile thành công!");
      onSaveSuccess(); // Gọi hàm callback để chuyển về chế độ xem
    } catch (error: any) {
      toast.error("Cập nhật thất bại", { description: error.response?.data?.message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <FormField name="name" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>Họ và tên</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField name="learning_style" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>Phong cách học</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
              <SelectItem value="visual">Visual (Hình ảnh)</SelectItem>
              <SelectItem value="practical">Practical (Thực hành)</SelectItem>
            </SelectContent></Select></FormItem>
          )} />
          <FormField name="weekly_goal" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>Cường độ học</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
              <SelectItem value="casual">Casual (Thoải mái)</SelectItem>
              <SelectItem value="serious">Serious (Nghiêm túc)</SelectItem>
            </SelectContent></Select></FormItem>
          )} />
        </CardContent>
        <CardFooter className="justify-end space-x-2">
          <Button type="button" variant="ghost" onClick={onCancel}>Hủy</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Lưu
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}