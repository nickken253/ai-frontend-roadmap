// components/roadmap/GeneratingLoader.tsx
'use client';

import { motion } from 'framer-motion';
import { BrainCircuit, FileText, Sparkles, CircleCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

const steps = [
  { icon: <BrainCircuit className="w-8 h-8 text-primary" />, text: "Phân tích kỹ năng và mục tiêu của bạn..." },
  { icon: <FileText className="w-8 h-8 text-secondary" />, text: "Xây dựng các giai đoạn học tập..." },
  { icon: <Sparkles className="w-8 h-8 text-accent" />, text: "Tuyển chọn tài nguyên học tập tốt nhất..." },
  { icon: <Sparkles className="w-8 h-8 text-primary" />, text: "Sắp xếp lại lộ trình cho hợp lý..." },
  { icon: <BrainCircuit className="w-8 h-8 text-secondary" />, text: "Hoàn tất và tạo biểu đồ trực quan..." },
];

// Component này nhận một prop `status` để quyết định giao diện cần hiển thị
interface GeneratingLoaderProps {
  status: 'loading' | 'success';
}

export default function GeneratingLoader({ status }: GeneratingLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Animation đổi chữ chỉ chạy khi đang ở trạng thái 'loading'
    if (status === 'loading') {
      const interval = setInterval(() => {
        setCurrentStep((prevStep) => (prevStep + 1) % steps.length);
      }, 3000); // Cứ sau 3 giây, chuyển sang bước tiếp theo
      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      {/* Hiển thị giao diện tương ứng với trạng thái */}
      {status === 'loading' && (
        <>
          <div className="relative w-24 h-24">
            <motion.div
              className="absolute inset-0 border-4 border-primary/20 rounded-full"
            />
            <motion.div
              className="absolute inset-0 border-t-4 border-primary rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="mt-8 text-center">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center text-xl font-semibold"
            >
              {steps[currentStep].icon}
              <span className="ml-4">{steps[currentStep].text}</span>
            </motion.div>
            <p className="mt-4 text-muted-foreground">Quá trình này có thể mất một vài phút, vui lòng không rời khỏi trang.</p>
          </div>
        </>
      )}
      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="text-center flex flex-col items-center"
        >
            <CircleCheck className="w-24 h-24 text-green-500" />
            <h2 className="mt-6 text-2xl font-bold">Quá trình hoàn tất!</h2>
            <p className="mt-2 text-muted-foreground">Đang chuẩn bị kết quả và chuyển hướng...</p>
        </motion.div>
      )}
    </div>
  );
}