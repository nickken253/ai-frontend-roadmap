// components/profile/ProfileView.tsx
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FaGoogle, FaGithub } from "react-icons/fa";

// Component nhỏ hiển thị từng trường thông tin
const ProfileField = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <div className="grid grid-cols-3 gap-4">
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
    <span className="col-span-2 text-sm">{value}</span>
  </div>
);

export function ProfileView({
  user,
  onEditClick,
  onChangePasswordClick,
}: {
  user: any;
  onEditClick: () => void;
  onChangePasswordClick: () => void;
}) {
  return (
    <>
      {/* Header hồ sơ */}
      {/* <CardHeader className="flex flex-col items-center text-center space-y-2">
        <Avatar className="w-24 h-24">
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>{user.fullname?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl">{user.fullname}</CardTitle>
          <CardDescription>@{user.username}</CardDescription>
        </div>
      </CardHeader> */}

      <CardContent className="space-y-8">
        {/* Thông tin tài khoản */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Thông tin tài khoản</h3>
          <div className="space-y-2">
            <ProfileField label="Email" value={user.email} />
            <ProfileField
              label="Ngày tham gia"
              value={new Date(user.created_at).toLocaleDateString("vi-VN")}
            />
            <ProfileField
              label="Trạng thái"
              value={
                user.is_verified ? (
                  <Badge variant="secondary">Đã xác thực</Badge>
                ) : (
                  <Badge variant="destructive">Chưa xác thực</Badge>
                )
              }
            />
          </div>
        </div>

        {/* Tài khoản liên kết */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Tài khoản liên kết</h3>
          <div className="flex flex-wrap gap-3">
            <Badge
              variant={user.googleId ? "secondary" : "outline"}
              className="gap-2"
            >
              <FaGoogle /> Google {user.googleId ? "Đã liên kết" : "Chưa liên kết"}
            </Badge>
            <Badge
              variant={user.githubId ? "secondary" : "outline"}
              className="gap-2"
            >
              <FaGithub /> GitHub {user.githubId ? "Đã liên kết" : "Chưa liên kết"}
            </Badge>
          </div>
        </div>

        {/* Tùy chỉnh học tập */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Tùy chỉnh học tập</h3>
          <div className="space-y-2">
            <ProfileField
              label="Ngôn ngữ ưu tiên"
              value={
                (() => {
                  const langMap: Record<string, string> = {
                    Vietnamese: "Tiếng Việt",
                    English: "Tiếng Anh",
                  };
                  const firstLang = user.profile?.preferred_languages;
                  console.log(user)
                  return langMap[firstLang] || "—";
                })()
              }
            />
            <ProfileField
              label="Phong cách học"
              value={
                (() => {
                  const stylegMap: Record<string, string> = {
                    practical: "Thực hành",
                    theoretical: "Lý thuyết",
                    visual: "Trực quan",
                  };

                  const style = user.profile?.learning_style;
                  return stylegMap[style] || "—";
                })()
              }
            />
            <ProfileField
              label="Mục tiêu hàng tuần"
              value={
                (() => {
                  const goalMap: Record<string, string> = {
                    casual: "Thông thường (1-3 giờ/tuần)",
                    regular: "Thường xuyên (3-5 giờ/tuần)",
                    serious: "Nghiêm túc (5+ giờ/tuần)",
                  };

                  const goal = user.profile?.weekly_goal;
                  return goalMap[goal] || "—";
                })()
              }
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-end flex gap-2">
        <Button variant="outline" onClick={onChangePasswordClick}>Đổi mật khẩu</Button>
        <Button onClick={onEditClick}>Chỉnh sửa hồ sơ</Button>
      </CardFooter>
    </>
  );
}
