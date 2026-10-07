'use client';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, FileText, ArrowRight, Flag } from 'lucide-react';
import Link from 'next/link';

import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const certId = searchParams.get('cert');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 relative pt-20 pb-16">
      
      {/* Subtle background glows */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] text-center border border-gray-100 relative overflow-hidden animate-scale-in">
        
        {/* Top accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-orange-500" />

        <div className="w-24 h-24 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8 relative z-10 shadow-inner">
          <CheckCircle2 size={48} strokeWidth={2.5} />
        </div>
        
        <h1 className="text-3xl font-black mb-4 relative z-10 text-gray-900 tracking-tight">Thank You!</h1>
        <p className="text-gray-500 mb-8 relative z-10 leading-relaxed font-medium">
          Your support has been recorded successfully. Together, we can ensure a fair, transparent, and timely examination system.
        </p>

        {certId && (
          <div className="bg-[#FAFAFA] p-6 rounded-[1.5rem] border border-gray-200 mb-10 relative z-10 shadow-sm">
            <div className="w-12 h-12 bg-white text-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
              <FileText size={24} />
            </div>
            <p className="text-sm text-gray-500 mb-1 font-bold">Your Certificate ID</p>
            <p className="font-black text-2xl text-gray-900 tracking-wider mb-2">{certId}</p>
            <a
              href={`${apiUrl}/demands/download/${certId}`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full flex items-center justify-center gap-2.5 bg-white text-gray-900 hover:text-red-600 font-bold py-3.5 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all duration-300 shadow-sm"
            >
              <FileText size={18} />
              Download Certificate
            </a>
          </div>
        )}

        <Link
          href="/"
          className="relative z-10 flex items-center justify-center w-full bg-[#0A0A0A] text-white font-bold py-4 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-[#1A1A1A] hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
        >
          Return Home
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>}>
      <SuccessContent />
    </Suspense>
  );
}
