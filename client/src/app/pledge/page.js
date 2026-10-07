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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-28 pb-12 relative">
        
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl shadow-red-600/5 overflow-hidden border border-gray-200 animate-scale-in">
          {/* Header */}
          <div className="bg-red-600 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <HeartHandshake className="mx-auto h-16 w-16 mb-4 relative z-10 drop-shadow-md" />
            <h2 className="text-3xl font-black tracking-tight mb-2 relative z-10 text-white">Thank You for Your Support</h2>
            <p className="text-white/80 font-medium relative z-10">Your support has been recorded. You can optionally support our on-ground protest initiatives.</p>
          </div>
          
          <div className="p-8">
            {/* Donation Transparency Box */}
            <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-2xl flex gap-4">
              <ShieldCheck className="text-red-600 shrink-0 w-8 h-8" />
              <div>
                <h4 className="font-bold text-red-700 mb-1">How your donation helps</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
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
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8 flex justify-center relative">
      
      <div className="max-w-6xl w-full">
        <div className="mb-6 animate-fade-in-up">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-x-1 transition-all duration-300">
            <ArrowLeft size={18} />
            Back
          </Link>
        </div>
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-red-50 border border-red-100 text-xs sm:text-sm font-semibold text-red-700 mb-4 shadow-sm whitespace-nowrap">
            <Flag size={14} className="text-red-600" />
            MPSC Protest Support
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 sm:mb-3 text-gray-900 drop-shadow-sm">Register Your Support</h1>
          <p className="text-gray-600">Join the movement and download your protest demands certificate.</p>
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
