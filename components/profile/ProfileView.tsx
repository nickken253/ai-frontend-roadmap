// components/profile/ProfileView.tsx
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";

// Một component nhỏ để hiển thị từng trường thông tin cho gọn
const ProfileField = ({ label, value }: { label: string, value: string }) => (
  <div className="grid grid-cols-3 gap-4">
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
    <span className="col-span-2 text-sm">{value}</span>
  </div>
);

export function ProfileView({ user, onEditClick, onChangePasswordClick }: { user: any, onEditClick: () => void, onChangePasswordClick: () => void }) {
  const profileMappings = {
    learning_style: {
      label: 'Phong cách học',
      values: { visual: 'Visual (Hình ảnh)', practical: 'Practical (Thực hành)', reading: 'Reading (Đọc/Viết)', auditory: 'Auditory (Nghe)'}
    },
    weekly_goal: {
      label: 'Cường độ học',
      values: { casual: 'Casual (Thoải mái)', serious: 'Serious (Nghiêm túc)', intensive: 'Intensive (Cường độ cao)'}
    }
  };

  return (
    <>
      <CardContent className="space-y-4">
        <ProfileField label="Họ và tên" value={user.name || 'Chưa cập nhật'} />
        <ProfileField label="Email" value={user.email} />
        <ProfileField 
          label={profileMappings.learning_style.label}
          value={profileMappings.learning_style.values[
            user.profile.learning_style as keyof typeof profileMappings.learning_style.values
          ] || 'Chưa cập nhật'} 
        />
        <ProfileField 
          label={profileMappings.weekly_goal.label} 
          value={profileMappings.weekly_goal.values[
            user.profile.weekly_goal as keyof typeof profileMappings.weekly_goal.values
          ] || 'Chưa cập nhật'}
        />
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline" onClick={onChangePasswordClick}>Đổi mật khẩu</Button>
        <Button onClick={onEditClick}>Chỉnh sửa Profile</Button>
      </CardFooter>
    </>
  );
}