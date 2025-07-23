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
      animation: {
        aurora: 'moveAurora 20s linear infinite',
      },
      keyframes: {
        moveAurora: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(20px, 40px) rotate(20deg)' },
          '50%': { transform: 'translate(-20px, -40px) rotate(-20deg)' },
          '75%': { transform: 'translate(40px, -20px) rotate(10deg)' },
          '100%': { transform: 'translate(0, 0) rotate(0deg)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;