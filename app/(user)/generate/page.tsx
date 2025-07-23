// app/(user)/generate/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, X, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import type { Resolver } from "react-hook-form";



const skillSchema = z.object({
    name: z.string().min(1, 'Tên kỹ năng không được để trống.'),
    level: z.string(),
});

// NEW: Cập nhật schema chính, `skills` giờ là một mảng object
const roadmapSchema = z.object({
    goal: z.string().min(1, { message: 'Vui lòng chọn mục tiêu.' }),
    skills: z.array(skillSchema).min(1, 'Vui lòng thêm ít nhất một kỹ năng.'),
    timeline: z.string().min(1, 'Vui lòng nhập thời gian mong muốn.'),
    hours: z.coerce.number().min(1, 'Số giờ học phải lớn hơn 0.'),
}).strict();;


// Hàm helper để xử lý chuỗi kỹ năng
const parseSkills = (skillsString: string) => {
    return skillsString
        .split('\n')
        .map(line => {
            const parts = line.split('-').map(part => part.trim());
            const name = parts[0];
            const level = parts[1] || 'Cơ bản'; // Mặc định là 'Cơ bản' nếu không có
            return { name, level };
        })
        .filter(skill => skill.name); // Bỏ qua các dòng trống
};


export default function GeneratePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [goals, setGoals] = useState<string[]>([]);

    const [currentSkillName, setCurrentSkillName] = useState('');
    const [currentSkillLevel, setCurrentSkillLevel] = useState('Cơ bản');

    type RoadmapFormValues = z.infer<typeof roadmapSchema>;

    const form = useForm<RoadmapFormValues>({
        resolver: zodResolver(roadmapSchema) as Resolver<RoadmapFormValues, any>,
        defaultValues: { goal: '', skills: [], timeline: '6 tháng', hours: 10 },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "skills"
    });

    // Fetch danh sách mục tiêu nghề nghiệp khi component được mount
    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await api.get('/suggestions/goals');

                // Thêm dòng này để bạn có thể tự kiểm tra cấu trúc dữ liệu
                console.log("Dữ liệu goals nhận được từ API:", response.data);

                // SỬA LỖI Ở ĐÂY
                // Giả sử mảng nằm trong key 'data' hoặc 'goals'.
                // Hãy thay `response.data.data` bằng key đúng sau khi xem console.log
                const goalsData = response.data.data || response.data.goals || response.data;

                // Đảm bảo rằng chúng ta luôn set state là một mảng
                if (Array.isArray(goalsData)) {
                    setGoals(goalsData);
                } else {
                    console.error("Dữ liệu goals nhận được không phải là một mảng!");
                    setGoals([]); // Set thành mảng rỗng để tránh lỗi render
                }

            } catch (error) {
                toast.error("Không thể tải danh sách mục tiêu.");
                setGoals([]); // Set thành mảng rỗng nếu có lỗi
            }
        };
        fetchGoals();
    }, []);

    const handleAddSkill = () => {
        if (currentSkillName.trim() === '') {
            toast.warning('Vui lòng nhập tên kỹ năng.');
            return;
        }
        // `append` là hàm từ `useFieldArray` để thêm một phần tử mới
        append({ name: currentSkillName.trim(), level: currentSkillLevel });
        // Reset input
        setCurrentSkillName('');
        setCurrentSkillLevel('Cơ bản');
    };


    async function onSubmit(values: z.infer<typeof roadmapSchema>) {
        setIsLoading(true);
        toast.info("AI đang phân tích và tạo lộ trình cho bạn...", {
            description: "Quá trình này có thể mất một vài phút."
        });

        try {
            // Dữ liệu `values` giờ đã đúng định dạng, gửi thẳng đi mà không cần xử lý
            const response = await api.post('/roadmaps/generate', values);
            const newRoadmap = response.data;

            toast.success("Tạo lộ trình thành công!");
            router.push(`/roadmaps/${newRoadmap._id}`);
        } catch (error: any) {
            toast.error("Tạo lộ trình thất bại", {
                description: error.response?.data?.message || "Đã có lỗi xảy ra từ server.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Card className="shadow-soft">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Tạo Lộ trình Học tập của bạn</CardTitle>
                    <CardDescription>
                        Cung cấp thông tin để AI của chúng tôi tạo ra một con đường dành riêng cho bạn.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Mục tiêu nghề nghiệp (Giữ nguyên) */}
                            <FormField
                                control={form.control}
                                name="goal"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mục tiêu nghề nghiệp</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Chọn mục tiêu của bạn" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {goals.map((goal, index) => (
                                                    <SelectItem key={index} value={goal}>{goal}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* === PHẦN NHẬP KỸ NĂNG ĐƯỢC THAY THẾ HOÀN TOÀN === */}
                            <div className="space-y-3">
                                <FormLabel>Các kỹ năng bạn đã có</FormLabel>
                                <div className="flex items-start gap-2">
                                    <Input
                                        placeholder="Tên kỹ năng (VD: React)"
                                        value={currentSkillName}
                                        onChange={(e) => setCurrentSkillName(e.target.value)}
                                        className="flex-grow"
                                        disabled={isLoading}
                                    />
                                    <Select
                                        value={currentSkillLevel}
                                        onValueChange={setCurrentSkillLevel}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue placeholder="Chọn cấp độ" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Cơ bản">Cơ bản</SelectItem>
                                            <SelectItem value="Trung bình">Trung bình</SelectItem>
                                            <SelectItem value="Thành thạo">Thành thạo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button type="button" onClick={handleAddSkill} disabled={isLoading}>
                                        <PlusCircle className="w-4 h-4 mr-2" /> Thêm
                                    </Button>
                                </div>
                                {/* Hiển thị lỗi của mảng skills, ví dụ "Vui lòng thêm ít nhất một kỹ năng" */}
                                <p className="text-sm font-medium text-destructive">
                                    {form.formState.errors.skills?.message}
                                </p>
                            </div>

                            {/* Khu vực hiển thị các tag kỹ năng đã thêm */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {fields.map((field, index) => (
                                    <Badge key={field.id} variant="secondary" className="px-3 py-1 text-sm">
                                        {field.name} - {field.level}
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="ml-2 rounded-full outline-none hover:bg-destructive/20"
                                            disabled={isLoading}
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            {/* ====================================================== */}

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Thời gian hoàn thành (Giữ nguyên) */}
                                <FormField
                                    control={form.control}
                                    name="timeline"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Thời gian mong muốn</FormLabel>
                                            <FormControl>
                                                <Input placeholder="VD: 6 tháng" {...field} disabled={isLoading} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Giờ học mỗi tuần (Giữ nguyên) */}
                                <FormField
                                    control={form.control}
                                    name="hours"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Số giờ học mỗi tuần</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="VD: 10" {...field} disabled={isLoading} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
                                {isLoading ? <Loader2 className="w-6 h-6 mr-2 animate-spin" /> : "🚀 Tạo Lộ trình với AI"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}