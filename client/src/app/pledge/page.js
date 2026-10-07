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
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 pt-32 pb-16 relative">
        
        <div className="max-w-xl w-full bg-white rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] overflow-hidden border border-gray-100 animate-scale-in">
          {/* Header */}
          <div className="bg-[#0A0A0A] p-10 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <HeartHandshake className="mx-auto h-16 w-16 mb-4 relative z-10 drop-shadow-md" />
            <h2 className="text-3xl font-black tracking-tight mb-2 relative z-10 text-white">Thank You for Your Support</h2>
            <p className="text-white/80 font-medium relative z-10">Your support has been recorded. You can optionally support our on-ground protest initiatives.</p>
          </div>
          
          <div className="p-8">
            {/* Donation Transparency Box */}
            <div className="mb-8 p-6 bg-gray-50 border border-gray-100 rounded-2xl flex gap-4">
              <ShieldCheck className="text-[#0A0A0A] shrink-0 w-8 h-8" />
              <div>
                <h4 className="font-bold text-[#0A0A0A] mb-1 tracking-tight">How your donation helps</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-normal">
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
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex justify-center relative">
      
      <div className="max-w-6xl w-full">
        <div className="mb-8 animate-fade-in-up">
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:text-[#0A0A0A] hover:border-gray-300 hover:bg-gray-50 font-medium rounded-full shadow-[0_2px_8px_rgb(0,0,0,0.04)] transition-all duration-300 text-sm">
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-800 font-medium text-xs sm:text-sm mb-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] whitespace-nowrap backdrop-blur-md">
            <Flag size={14} className="text-[#E11D48]" />
            MPSC Protest Support
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-[#0A0A0A]">Register Your Support</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Join the movement and download your protest demands certificate.</p>
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
