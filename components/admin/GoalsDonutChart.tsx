// components/admin/GoalsDonutChart.tsx
'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';

interface ChartData {
  goal: string;
  count: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// NEW: Hàm để render label tùy chỉnh
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Chỉ hiển thị label nếu phần trăm đủ lớn để tránh chồng chéo
  if (percent < 0.05) {
    return null;
  }

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function GoalsDonutChart({ data }: { data: ChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip
  cursor={{ fill: 'transparent' }}
  contentStyle={{
    backgroundColor: 'hsl(var(--background) / 0.75)', // Nền trong suốt 75%
    backdropFilter: 'blur(4px)', // Hiệu ứng làm mờ
    WebkitBackdropFilter: 'blur(4px)', // Hỗ trợ trình duyệt cũ
    borderColor: 'hsl(var(--border) / 0.5)', // Bo viền cũng trong suốt
    borderRadius: '0.5rem',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Thêm bóng đổ cho đẹp hơn
  }}
/>
        {/* NEW: Component Legend để hiển thị chú thích tên và màu */}
        <Legend 
            iconSize={10} 
            layout="vertical" 
            verticalAlign="middle" 
            align="right" 
            formatter={(value, entry) => <span className="text-muted-foreground">{value}</span>}
        />
        <Pie
          data={data}
          cx="40%" // Dịch tâm biểu đồ sang trái để có chỗ cho Legend
          cy="50%"
          labelLine={false} // Tắt đường kẻ mặc định
          label={renderCustomizedLabel} // Sử dụng hàm render tùy chỉnh
          innerRadius={60}
          outerRadius={100}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="count"
          nameKey="goal"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}