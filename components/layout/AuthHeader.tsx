// components/layout/AuthHeader.tsx
'use client';

import Link from 'next/link';
import { Rocket } from 'lucide-react';

export default function AuthHeader() {
  return (
    <header className="absolute top-0 w-full p-4">
      <div className="container mx-auto">
        <Link href="/" className="inline-flex items-center space-x-2">
          <Rocket className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold">AI Roadmap</span>
        </Link>
      </div>
    </header>
  );
}