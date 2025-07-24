// components/layout/VerificationBanner.tsx
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { MailWarning, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

export default function VerificationBanner() {
  const [isLoading, setIsLoading] = useState(false);

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await api.post('/auth/send-verification');
      toast.success("Đã gửi lại email xác thực!", {
        description: "Vui lòng kiểm tra hộp thư của bạn."
      });
    } catch (error) {
      toast.error("Gửi email thất bại, vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mb-6">
        <div className="flex items-center p-4 space-x-4 rounded-lg bg-amber-50 border border-amber-300 text-amber-800">
            <MailWarning className="w-6 h-6 flex-shrink-0" />
            <div className="flex-grow">
                <p className="font-semibold">Vui lòng xác thực email của bạn.</p>
                <p className="text-sm">Bạn cần xác thực email để sử dụng đầy đủ các tính năng.</p>
            </div>
            <Button size="sm" onClick={handleResend} disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Gửi lại link
            </Button>
        </div>
    </div>
  );
}