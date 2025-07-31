// components/admin/GoalsDonutChart.tsx
'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend, LegendProps } from 'recharts';
import { useState, useEffect } from 'react';

interface ChartData {
  goal: string;
  count: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) {
    return null;
  }

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={14}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Component chú thích tùy chỉnh để xử lý việc xuống dòng
const CustomLegend = (props: LegendProps) => {
    // SỬA LỖI Ở ĐÂY: Ép kiểu `props` để TypeScript hiểu được thuộc tính `payload`
    const { payload } = props as { payload?: any[] };
    
    return (
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs">
            {payload?.map((entry, index) => (
                <li key={`item-${index}`} className="flex items-center">
                    <span
                        className="w-3 h-3 mr-2 inline-block rounded-sm"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-muted-foreground">{entry.value}</span>
                </li>
            ))}
        </ul>
    );
};

export function GoalsDonutChart({ data }: { data: ChartData[] }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    // Tăng chiều cao trên mobile để có không gian cho chú thích
    <ResponsiveContainer width="100%" height={isMobile ? 400 : 350}>
      <PieChart>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background) / 0.75)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            borderColor: 'hsl(var(--border) / 0.5)',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          }}
        />
        {/* Sử dụng component chú thích tùy chỉnh */}
        <Legend content={<CustomLegend />} verticalAlign="bottom" />
        <Pie
          data={data}
          // Luôn căn giữa biểu đồ
          cx="50%"
          // Điều chỉnh vị trí dọc để chừa không gian cho chú thích
          cy="45%"
          labelLine={false}
          label={renderCustomizedLabel}
          innerRadius={isMobile ? 50 : 70}
          outerRadius={isMobile ? 80 : 110}
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