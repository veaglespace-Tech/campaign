'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { HeartHandshake, ShieldCheck, Flag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useGetConfigQuery } from '../../redux/api/apiSlice';
import DemandForm from '../../components/demand/DemandForm';
import { useRouter } from 'next/navigation';

function DemandContent() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('campaignId') || 1;
  
  const { data: configData } = useGetConfigQuery();
  const siteConfig = configData?.config || {};

  const [status, setStatus] = useState('idle');

  const [demandId, setDemandId] = useState(null);
  
  const router = useRouter();
  
  const handleDemandSuccess = (id, certNumber) => {
    setDemandId(id);
    setStatus('success');
    
    // Slight delay for UI effect before redirecting
    setTimeout(() => {
      if (certNumber) {
        router.push(`/demand/success?id=${id}&cert=${certNumber}`);
      } else {
        router.push(`/demand/success?id=${id}`);
      }
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 pt-32 pb-16">
        {/* Background Image & Overlay */}
        <div className="fixed inset-0 z-0">
          <img src="/protest_bg.jpg" alt="Protest Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-red-950/90 mix-blend-multiply"></div>
        </div>
        
        <div className="max-w-md w-full bg-black/40 backdrop-blur-3xl rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.5)] overflow-hidden border border-white/10 animate-scale-in relative z-10 flex flex-col items-center justify-center p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-4 border-red-500 mb-8"></div>
          <h2 className="text-2xl font-black text-white mb-3 tracking-tight">Generating Certificate...</h2>
          <p className="text-gray-400 text-sm">Please wait while we prepare your official MPSC Protest Support Certificate.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex justify-center">
      
      {/* Background Image & Overlay */}
      <div className="fixed inset-0 z-0">
        <img src="/protest_bg.jpg" alt="Protest Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/80 to-red-950/90 mix-blend-multiply"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="mb-8 animate-fade-in-up">
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:text-white hover:border-white/40 hover:bg-white/20 font-medium rounded-full shadow-[0_4px_15px_rgb(0,0,0,0.2)] transition-all duration-300 text-sm">
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-red-600/20 border border-red-500/30 text-red-100 font-medium text-xs sm:text-sm mb-6 shadow-[0_0_20px_rgba(220,38,38,0.2)] whitespace-nowrap backdrop-blur-md">
            <Flag size={14} className="text-red-400" />
            MPSC Protest Support
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-lg">Register Your Support</h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto drop-shadow-md">Join the movement and download your protest demands certificate.</p>
        </div>
        
        <DemandForm 
          campaignId={campaignId} 
          siteConfig={siteConfig} 
          onSuccess={handleDemandSuccess} 
        />
      </div>
    </div>
  );
}

export default function DemandPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF9F2] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9933]"></div></div>}>
      <DemandContent />
    </Suspense>
  );
}
