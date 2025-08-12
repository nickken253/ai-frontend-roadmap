// app/(user)/profile/page.tsx
'use client';

import { useState } from 'react';
import { useAuthStore } from "@/store/authStore";
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

import { ProfileView } from '@/components/profile/ProfileView';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import { ChangePasswordForm } from '@/components/forms/ChangePasswordForm';
import api from '@/lib/api';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  if (!user) return null;

  const emailInitial = user.fullname ? user.fullname.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : '?');

  const handleResendVerification = async () => {
    setIsSendingVerification(true);
    try {
      await api.post('/auth/send-verification');
      toast.success("Đã gửi lại email xác thực!", {
        description: "Vui lòng kiểm tra hộp thư của bạn."
      });
    } catch (error) {
      toast.error("Gửi email thất bại", {
        description: "Vui lòng thử lại sau."
      });
    } finally {
      setIsSendingVerification(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 text-shadow-glow">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user.avatar} alt={user.fullname} />
          <AvatarFallback className="text-3xl">{emailInitial}</AvatarFallback>
        </Avatar>
        <div className="flex items-center space-x-2">
          <div>
            <h1 className="text-3xl font-bold">{user.fullname || user.email}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          {user.is_verified && (
            <Badge variant="secondary" className="border-green-300 bg-green-100 text-green-800">
              <CheckCircle className="w-4 h-4 mr-1" />
              Đã xác thực
            </Badge>
          )}
        </div>
      </div>

      <Card>
        {/* <CardHeader>
          <CardTitle>Thông tin chung</CardTitle>
          <CardDescription>Quản lý thông tin cá nhân và các tùy chọn của bạn.</CardDescription>
        </CardHeader> */}
        {isEditing ? (
          <ProfileEditForm 
            user={user} 
            onSaveSuccess={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ProfileView 
            user={user} 
            onEditClick={() => setIsEditing(true)}
            onChangePasswordClick={() => setIsPasswordModalOpen(true)}
          />
        )}
      </Card>

      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
            <DialogDescription>
              Nhập mật khẩu hiện tại và mật khẩu mới của bạn.
            </DialogDescription>
          </DialogHeader>
          <ChangePasswordForm onSuccess={() => setIsPasswordModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}