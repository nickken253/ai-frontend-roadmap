// app/not-found.tsx
'use client';

import Link from 'next/link';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';


export default function NotFound() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize(); // Chạy lần đầu
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    mouseX.set(windowSize.width / 2);
    mouseY.set(windowSize.height / 2);
  }, [windowSize, mouseX, mouseY]);


  const rocketX = useTransform(mouseX, (val) => (val - windowSize.width / 2) / -20);
  const rocketY = useTransform(mouseY, (val) => (val - windowSize.height / 2) / -20);
  const textX = useTransform(mouseX, (val) => (val - windowSize.width / 2) / -40);
  const textY = useTransform(mouseY, (val) => (val - windowSize.height / 2) / -40);

  // NEW: Sử dụng useSpring để làm mượt chuyển động
  const springConfig = { damping: 15, stiffness: 100, mass: 0.5 };
  const smoothRocketX = useSpring(rocketX, springConfig);
  const smoothRocketY = useSpring(rocketY, springConfig);
  const smoothTextX = useSpring(textX, springConfig);
  const smoothTextY = useSpring(textY, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    mouseX.set(event.clientX);
    mouseY.set(event.clientY);
  };
  
  return (
    <motion.div 
      className="relative flex flex-col items-center justify-center min-h-screen text-center text-white overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
    >
      {/* Nền Aurora giờ có z-index thấp nhất */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_25%_30%,hsl(var(--primary)/0.2),transparent_40%),radial-gradient(circle_at_75%_70%,hsl(var(--secondary)/0.2),transparent_40%)] -z-20 filter blur-[80px]"></div>
      
      
      <div className="relative z-10 p-4">
        <motion.div
          // Áp dụng giá trị đã được làm mượt
          style={{ x: smoothRocketX, y: smoothRocketY }}
          animate={{ y: [0, -15, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
        >
          <Rocket className="w-24 h-24 mb-6 text-primary drop-shadow-lg" />
        </motion.div>

        <motion.div style={{ x: smoothTextX, y: smoothTextY }}>
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary via-secondary to-accent"
            >
                404
            </motion.h1>
            
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-4 text-4xl font-bold tracking-tight text-foreground"
            >
                Lạc vào không gian
            </motion.h2>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-4 text-lg text-muted-foreground"
            >
                Tín hiệu yếu... Không tìm thấy hành tinh bạn yêu cầu.
            </motion.p>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-8"
            >
                <Link href="/">
                <Button size="lg">Quay về Trái Đất</Button>
                </Link>
            </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}