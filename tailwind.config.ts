// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Định nghĩa bảng màu của bạn ở đây
        primary: '#2563eb',   // Chính
        secondary: '#34d399', // Phụ
        accent: '#fbbf24',    // Nhấn
        background: '#f8fafc', // Nền
        text: '#1e293b',       // Text
        'primary-hover': '#1d4ed8', // Thêm màu hover để tăng trải nghiệm
      },
      borderRadius: {
        lg: '0.75rem', // Bo tròn nhẹ cho các card, input
      },
      boxShadow: {
        'soft': '0 4px 14px 0 rgba(0, 0, 0, 0.05)', // Đổ bóng mềm
      },
    },
  },
  plugins: [],
};
export default config;