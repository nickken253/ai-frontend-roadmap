import type { Metadata } from "next";
import { Nunito } from 'next/font/google';
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from '@/components/ui/sonner';
import QueryProvider from '@/components/providers/QueryProvider';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const nunito = Nunito({ subsets: ['latin'] });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Learning Roadmap",
  description: "Vạch Ra Lộ Trình, Chinh Phục Tương Lai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${nunito.className}`}
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-20 -z-50"></div>
        <div className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute"
             style={{
               background: "radial-gradient(600px at 50% 50%, rgba(29, 78, 216, 0.15), transparent 80%)"
             }}>
        </div>
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
