// tailwind.config.ts
import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}', 
  ],
  theme: {
    extend: {
      // Bảng màu sẽ được quản lý bằng biến CSS trong globals.css
      // Chúng ta thêm các animation mới ở đây
      animation: {
        'aurora': 'aurora 60s linear infinite',
        'glow': 'glow 4s ease-in-out infinite',
      },
      keyframes: {
        aurora: {
          from: { backgroundPosition: '0% 50%' },
          to: { backgroundPosition: '200% 50%' },
        },
        glow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        }
      },
      // NEW: Thêm một hiệu ứng text shadow để kiểm tra
      textShadow: {
        'glow': '0 0 8px var(--primary) / 0.75',
      },
    },
  },
  // NEW: Thêm plugin để Tailwind nhận biết utility `text-shadow`
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
}
export default config
