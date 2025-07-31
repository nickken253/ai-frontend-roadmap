// components/admin/SkillsBarChart.tsx
'use client';

// NEW: Thêm 'Cell' từ recharts
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface ChartData {
    skill: string;
    count: number;
}

// NEW: Bảng màu để sử dụng cho các cột
const COLORS = ['#8884d8', '#82ca9d', '#FFBB28', '#FF8042', '#0088FE', '#00C49F'];

export function SkillsBarChart({ data }: { data: ChartData[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis
                    dataKey="skill"
                    type="category"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={120}
                    // Cắt bớt text nếu quá dài
                    tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                />
                <Tooltip
                    // cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{
                        backgroundColor: 'var(--background) / 0.75', // Nền trong suốt 75%
                        backdropFilter: 'blur(4px)', // Hiệu ứng làm mờ
                        WebkitBackdropFilter: 'blur(4px)', // Hỗ trợ trình duyệt cũ
                        borderColor: 'var(--border) / 0.5', // Bo viền cũng trong suốt
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 30px rgba(77, 77, 77, 0.1)', // Thêm bóng đổ cho đẹp hơn
                    }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                    {/* NEW: Dùng map để gán màu cho từng cột */}
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}