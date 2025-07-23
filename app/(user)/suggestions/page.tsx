// app/(user)/suggestions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2, Lightbulb, Check } from 'lucide-react';

import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SuggestionsPage() {
  const [goals, setGoals] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [skills, setSkills] = useState<string[]>([]);
  const [isGoalsLoading, setIsGoalsLoading] = useState(true);
  const [isSkillsLoading, setIsSkillsLoading] = useState(false);

  // 1. Tải danh sách các mục tiêu nghề nghiệp khi trang được mở
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await api.get('/suggestions/goals');
        // API trả về { goals: [...] }, nên chúng ta cần lấy `response.data.goals`
        if (response.data && Array.isArray(response.data.goals)) {
          setGoals(response.data.goals);
        }
      } catch (error) {
        toast.error("Không thể tải danh sách mục tiêu.");
      } finally {
        setIsGoalsLoading(false);
      }
    };
    fetchGoals();
  }, []);

  // 2. Gọi API gợi ý kỹ năng khi người dùng chọn một mục tiêu
  const handleGoalChange = async (goal: string) => {
    setSelectedGoal(goal);
    setSkills([]); // Xóa danh sách kỹ năng cũ
    setIsSkillsLoading(true);
    try {
      const response = await api.get(`/suggestions/skills?goal=${goal}`);
      // API trả về { skills: [...] }, nên chúng ta cần lấy `response.data.skills`
      if (response.data && Array.isArray(response.data.skills)) {
        setSkills(response.data.skills);
      }
    } catch (error) {
      toast.error("Lỗi khi gợi ý kỹ năng", {
        description: "Vui lòng thử lại sau."
      });
    } finally {
      setIsSkillsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Khám phá Kỹ năng</CardTitle>
          <CardDescription>
            Chọn một mục tiêu nghề nghiệp để xem các kỹ năng cần thiết do AI gợi ý.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dropdown chọn mục tiêu */}
          <div>
            <label className="block mb-2 text-sm font-medium">Mục tiêu nghề nghiệp</label>
            <Select onValueChange={handleGoalChange} disabled={isGoalsLoading || isSkillsLoading}>
              <SelectTrigger>
                <SelectValue placeholder={isGoalsLoading ? "Đang tải..." : "Chọn một mục tiêu"} />
              </SelectTrigger>
              <SelectContent>
                {goals.map((goal, index) => (
                  <SelectItem key={index} value={goal}>{goal}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Khu vực hiển thị kết quả */}
          <div className="p-4 border-2 border-dashed rounded-lg min-h-[200px] flex items-center justify-center">
            {isSkillsLoading ? (
              <div className="flex flex-col items-center text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="mt-2">AI đang suy nghĩ...</p>
              </div>
            ) : skills.length > 0 ? (
              <div className="w-full">
                <h3 className="mb-4 text-lg font-semibold">Các kỹ năng gợi ý cho "{selectedGoal}":</h3>
                <ul className="space-y-2">
                  {skills.map((skill, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-1" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center text-muted-foreground">
                <Lightbulb className="w-8 h-8" />
                <p className="mt-2">Vui lòng chọn một mục tiêu để xem các kỹ năng gợi ý.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}