'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { HeartHandshake, ShieldCheck, Flag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useGetConfigQuery } from '../../redux/api/apiSlice';
import PledgeForm from '../../components/pledge/PledgeForm';
import DonationForm from '../../components/pledge/DonationForm';

function PledgeContent() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('campaignId') || 1;
  
  const { data: configData } = useGetConfigQuery();
  const siteConfig = configData?.config || {};

  const [status, setStatus] = useState('idle'); // idle, success
  const [pledgeId, setPledgeId] = useState(null);
  
  const handlePledgeSuccess = (id) => {
    setPledgeId(id);
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 pt-32 pb-16">
        {/* Background Image & Overlay */}
        <div className="fixed inset-0 z-0">
          <img src="/protest_bg.jpg" alt="Protest Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-red-950/90 mix-blend-multiply"></div>
        </div>
        
        <div className="max-w-xl w-full bg-black/40 backdrop-blur-3xl rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.5)] overflow-hidden border border-white/10 animate-scale-in relative z-10">
          {/* Header */}
          <div className="bg-red-600/20 backdrop-blur-md p-10 text-center text-white relative overflow-hidden border-b border-white/10">
            <HeartHandshake className="mx-auto h-16 w-16 mb-4 relative z-10 text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" />
            <h2 className="text-3xl font-black tracking-tight mb-2 relative z-10 text-white drop-shadow-md">Thank You for Your Support</h2>
            <p className="text-gray-300 font-medium relative z-10">Your support has been recorded. You can optionally support our on-ground protest initiatives.</p>
          </div>
          
          <div className="p-8">
            {/* Donation Transparency Box */}
            <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-2xl flex gap-4 backdrop-blur-md">
              <ShieldCheck className="text-red-400 shrink-0 w-8 h-8 drop-shadow-[0_0_10px_rgba(248,113,113,0.4)]" />
              <div>
                <h4 className="font-bold text-white mb-1 tracking-tight">How your donation helps</h4>
                <p className="text-sm text-gray-300 leading-relaxed font-normal">
                  {siteConfig.donationUsage || 'Your donations will be utilized for conducting the on-ground protests, legal fees, and student support.'}
                </p>
              </div>
            </div>
            
            <DonationForm pledgeId={pledgeId} />
          </div>
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
        
        <PledgeForm 
          campaignId={campaignId} 
          siteConfig={siteConfig} 
          onSuccess={handlePledgeSuccess} 
        />
      </div>
    </div>
  );
}

export default function PledgePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF9F2] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9933]"></div></div>}>
      <PledgeContent />
    </Suspense>
  );
}
