// app/page.tsx
'use client';

import Link from 'next/link';
import { motion, Transition, Variants } from 'framer-motion';
import { ArrowRight, BrainCircuit, BarChart, Zap, LayoutGrid, Check, MoveRight, Users, Code, Briefcase } from 'lucide-react';
import { FaReact, FaPython, FaDocker, FaAws } from 'react-icons/fa';
import { SiTensorflow, SiPostgresql } from 'react-icons/si';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import LandingHeader from '@/components/layout/LandingHeader';

// Nút "thông minh" với hiệu ứng hover đã sửa lỗi màu chữ
const ShimmerButton = ({ children, href }: { children: React.ReactNode, href: string }) => (
  <Link href={href}>
    <Button size="lg" className="relative text-lg overflow-hidden group shadow-lg">
      <span className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="absolute inset-0.5 bg-background rounded-md transition-all duration-300 group-hover:opacity-0" />
      <span className="relative z-10 flex items-center text-foreground group-hover:text-background transition-colors duration-300">
        {children}
      </span>
    </Button>
  </Link>
);

export default function HomePage() {
  const fadeIn = (delay = 0, y = 30) => ({
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: "easeInOut" } as Transition,
    viewport: { once: true },
  });
  const fadeInVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay,
        ease: "easeInOut"
      }
    }),
  };

  return (
    // Sửa đổi ở đây: Thêm `relative` và bỏ `bg-background`
    <div className="relative flex flex-col min-h-screen text-foreground overflow-x-hidden">
      {/* Hiệu ứng Aurora được áp dụng trực tiếp ở đây */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_25%_30%,hsl(var(--primary)/0.3),transparent_35%),radial-gradient(circle_at_75%_70%,hsl(var(--secondary)/0.3),transparent_35%),radial-gradient(circle_at_10%_80%,hsl(var(--accent)/0.2),transparent_35%)] -z-10 filter blur-[80px] animate-aurora"></div>

      <LandingHeader />

      <main>
        {/* === Hero Section === */}
        <section className="container relative mx-auto flex flex-col items-center justify-center text-center py-24 md:py-32">
          <motion.div 
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0} // delay = 0
          >
            <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">Sử dụng sức mạnh của Gemini AI</Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary via-secondary to-accent">
              Lộ Trình Học Tập Cá Nhân Hóa
            </h1>
            <p className="max-w-3xl mx-auto mt-6 text-lg md:text-xl text-muted-foreground">
              Biến mục tiêu sự nghiệp thành một kế hoạch chi tiết. AI của chúng tôi sẽ vạch ra con đường rõ ràng nhất để bạn chinh phục đỉnh cao mới.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <ShimmerButton href="/register">
                Bắt đầu Hành trình <ArrowRight className="w-5 h-5 ml-2" />
              </ShimmerButton>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 w-full max-w-4xl"
          >
            <Card className="bg-background/30 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-4">
                <img src="https://placehold.co/1200x600/1e293b/f8fafc?text=AI+Roadmap+Visualization" alt="AI Roadmap Visualization" className="rounded-lg" />
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* === Technology Showcase Section (FIXED) === */}
        <section className="py-16">
          <div className="relative w-full overflow-hidden">
            <p className="text-center text-sm font-semibold text-muted-foreground mb-6">HỖ TRỢ HÀNG TRĂM CÔNG NGHỆ & KỸ NĂNG</p>
            <motion.div
              className="flex w-[200%]"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ ease: 'linear', duration: 30, repeat: Infinity }}
            >
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex-shrink-0 flex items-center justify-around w-1/2">
                  <FaReact size={40} className="text-muted-foreground" />
                  <FaPython size={40} className="text-muted-foreground" />
                  <FaDocker size={40} className="text-muted-foreground" />
                  <FaAws size={40} className="text-muted-foreground" />
                  <SiTensorflow size={40} className="text-muted-foreground" />
                  <SiPostgresql size={40} className="text-muted-foreground" />
                  <span className="text-4xl font-bold text-muted-foreground">SQL</span>
                  <span className="text-4xl font-bold text-muted-foreground">Go</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* === How It Works Section === */}
        <section className="container mx-auto py-24">
          <motion.h2 variants={fadeInVariants} className="text-4xl font-bold text-center mb-16">Hoạt động Chỉ trong 3 bước</motion.h2>
          <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-border hidden md:block" />
            <motion.div {...fadeIn(0.2)} className="relative text-center p-6"><div className="relative z-10 flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-background border-2 rounded-full border-primary text-primary text-3xl font-bold">1</div><h3 className="mb-2 text-2xl font-semibold">Cung cấp Thông tin</h3><p className="text-muted-foreground">Cho chúng tôi biết kỹ năng hiện tại và mục tiêu nghề nghiệp bạn đang hướng tới.</p></motion.div>
            <motion.div {...fadeIn(0.4)} className="relative text-center p-6"><div className="relative z-10 flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-background border-2 rounded-full border-secondary text-secondary text-3xl font-bold">2</div><h3 className="mb-2 text-2xl font-semibold">AI Phân tích</h3><p className="text-muted-foreground">Hệ thống sẽ phân tích, so sánh và xác định "khoảng trống" kiến thức của bạn.</p></motion.div>
            <motion.div {...fadeIn(0.6)} className="relative text-center p-6"><div className="relative z-10 flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-background border-2 rounded-full border-accent text-accent text-3xl font-bold">3</div><h3 className="mb-2 text-2xl font-semibold">Nhận Lộ trình</h3><p className="text-muted-foreground">Nhận một lộ trình chi tiết, bao gồm các chủ đề và tài nguyên học tập chọn lọc.</p></motion.div>
          </div>
        </section>

        {/* === Features Section (Redesigned) === */}
        <section className="py-24 bg-muted/30">
          <div className="container grid items-center gap-12 mx-auto lg:grid-cols-2 lg:gap-20">

            {/* Cột bên trái: Danh sách tính năng với hiệu ứng nối tiếp */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              // Định nghĩa animation cho container
              variants={{
                visible: { transition: { staggerChildren: 0.2 } }
              }}
              className="order-2 space-y-8 lg:order-1"
            >
              <motion.div variants={fadeInVariants}>
                <h2 className="text-4xl font-bold">Không chỉ là một danh sách.</h2>
                <p className="mt-4 text-xl text-muted-foreground">Mỗi lộ trình được tạo ra là một hệ thống học tập hoàn chỉnh, được thiết kế để bạn thành công.</p>
              </motion.div>

              {/* Các tính năng con */}
              <div className="space-y-6">
                {[
                  { icon: Check, title: "Phân chia Giai đoạn", description: "Từ nền tảng đến chuyên sâu, học có hệ thống và logic để không bị choáng ngợp." },
                  { icon: LayoutGrid, title: "Tài nguyên Chất lượng", description: "Đi kèm các khóa học, sách, và dự án thực tế được AI tuyển chọn từ khắp internet." },
                  { icon: BarChart, title: "Trực quan Sinh động", description: "Dễ dàng theo dõi tiến trình và cấu trúc tổng thể của lộ trình qua biểu đồ tương tác." }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    // Định nghĩa animation cho từng item con
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
                    }}
                    className="flex items-start"
                  >
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mr-4 rounded-lg bg-primary/10 text-primary">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{feature.title}</h3>
                      <p className="mt-1 text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Cột bên phải: Hình ảnh trong khung giả lập */}
            <motion.div
              {...fadeIn(0.2)}
              className="order-1 lg:order-2"
            >
              {/* Khung giả lập trình duyệt */}
              <div className="relative rounded-xl shadow-2xl bg-slate-800 border-4 border-slate-700">
                {/* Thanh tiêu đề của cửa sổ */}
                <div className="absolute top-0 left-0 flex items-center w-full h-8 gap-1.5 px-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <img
                  src="https://placehold.co/1200x900/34d399/1e293b?text=Dynamic+Roadmap+UI"
                  alt="Roadmap UI"
                  className="mt-8 border-t rounded-b-lg border-slate-700"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* === NEW: Who is this for Section === */}
        <section className="container mx-auto py-24">
          <motion.h2 {...fadeIn()} className="text-4xl font-bold text-center mb-16">Được thiết kế cho Mọi người</motion.h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <motion.div {...fadeIn(0.2)}>
              <Card className="h-full text-center transition-all duration-300 hover:border-primary hover:shadow-xl overflow-hidden">
                {/* NEW: Thêm ảnh cho từng đối tượng */}
                <img src="https://placehold.co/400x250/2563eb/ffffff?text=Students" alt="Students" className="w-full h-48 object-cover" />
                <CardHeader><Users className="w-12 h-12 mx-auto mb-4 text-primary" /><CardTitle>Sinh viên & Người mới</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">Bắt đầu sự nghiệp của bạn với một con đường rõ ràng, không còn mơ hồ.</p></CardContent>
              </Card>
            </motion.div>
            <motion.div {...fadeIn(0.4)}>
              <Card className="h-full text-center transition-all duration-300 hover:border-secondary hover:shadow-xl overflow-hidden">
                <img src="https://placehold.co/400x250/34d399/ffffff?text=Career+Changers" alt="Career Changers" className="w-full h-48 object-cover" />
                <CardHeader><Briefcase className="w-12 h-12 mx-auto mb-4 text-secondary" /><CardTitle>Người chuyển ngành</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">Tận dụng kinh nghiệm cũ và lấp đầy khoảng trống kiến thức một cách hiệu quả.</p></CardContent>
              </Card>
            </motion.div>
            <motion.div {...fadeIn(0.6)}>
              <Card className="h-full text-center transition-all duration-300 hover:border-accent hover:shadow-xl overflow-hidden">
                <img src="https://placehold.co/400x250/fbbf24/1e293b?text=Professionals" alt="Professionals" className="w-full h-48 object-cover" />
                <CardHeader><Code className="w-12 h-12 mx-auto mb-4 text-accent" /><CardTitle>Lập trình viên Kinh nghiệm</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">Nâng cao kỹ năng, học công nghệ mới và thăng tiến trong sự nghiệp.</p></CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* === FAQ Section (Redesigned) === */}
        <section className="container mx-auto py-24">
          <div className="grid items-start gap-12 md:grid-cols-3">
            {/* Cột bên trái: Tiêu đề & Mô tả */}
            <motion.div
              {...fadeIn()}
              className="md:col-span-1"
            >
              <h2 className="text-4xl font-bold">Bạn có câu hỏi?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Chúng tôi đã tổng hợp một số câu hỏi phổ biến nhất. Nếu bạn không tìm thấy câu trả lời, đừng ngần ngại liên hệ.
              </p>
              {/* Thêm một ảnh minh họa để khu vực này sinh động hơn */}
              <div className="hidden mt-8 md:block">
                <img src="https://placehold.co/400x300/fbbf24/1e293b?text=Questions?" alt="FAQ Illustration" className="rounded-lg" />
              </div>
            </motion.div>

            {/* Cột bên phải: Danh sách câu hỏi */}
            <motion.div
              {...fadeIn(0.2)}
              className="md:col-span-2"
            >
              <Accordion type="single" collapsible className="w-full space-y-4">
                {/* Mỗi câu hỏi giờ là một item riêng biệt, có bo góc và nền */}
                <AccordionItem value="item-1" className="p-4 border rounded-lg bg-muted/30">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">AI Roadmap có miễn phí không?</AccordionTrigger>
                  <AccordionContent className="pt-2 text-base text-muted-foreground">
                    Hoàn toàn miễn phí! Bạn có thể tạo và lưu trữ các lộ trình học tập mà không tốn bất kỳ chi phí nào.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="p-4 border rounded-lg bg-muted/30">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">Dữ liệu lộ trình được lấy từ đâu?</AccordionTrigger>
                  <AccordionContent className="pt-2 text-base text-muted-foreground">
                    AI của chúng tôi được huấn luyện trên một tập dữ liệu khổng lồ bao gồm mô tả công việc, giáo trình các khóa học uy tín, và các lộ trình thành công của các chuyên gia trong ngành.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="p-4 border rounded-lg bg-muted/30">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">Tôi có thể chỉnh sửa lộ trình sau khi được tạo không?</AccordionTrigger>
                  <AccordionContent className="pt-2 text-base text-muted-foreground">
                    Có, bạn hoàn toàn có thể tùy chỉnh, thêm, bớt các chủ đề trong lộ trình để phù hợp nhất với nhu cầu và sở thích cá nhân của bạn.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* === Final CTA Section === */}
        <section className="py-24">
          <motion.div {...fadeIn()} className="container mx-auto text-center">
            <Card className="inline-block p-8 md:p-12 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 shadow-2xl">
              <h2 className="text-4xl font-bold">Sẵn sàng để tăng tốc sự nghiệp của bạn?</h2>
              <p className="mt-4 text-xl text-muted-foreground">Tương lai của bạn chỉ cách một cú nhấp chuột.</p>
              <div className="mt-8">
                <ShimmerButton href="/register">
                  Tạo Lộ trình Đầu tiên của Tôi <MoveRight className="w-5 h-5 ml-2" />
                </ShimmerButton>
              </div>
            </Card>
          </motion.div>
        </section>
      </main>

      <footer className="py-8 border-t">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AI Learning Roadmap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}