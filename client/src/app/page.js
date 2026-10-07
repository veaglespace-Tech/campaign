'use client';
import Link from 'next/link';
import { HeartHandshake, Shield, Users, ArrowRight, Flag, Star } from 'lucide-react';
import { useGetCampaignsQuery } from '../redux/api/apiSlice';

export default function Home() {
  const { data, isLoading } = useGetCampaignsQuery();
  const campaign = data?.success ? data.campaigns[0] : null;

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">



      {/* Ultra-Premium Glassmorphism Hero */}
      <main className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 min-h-screen flex items-center justify-center">
        {/* Full Visibility Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat fixed" 
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=2000")' }} 
        />
        {/* Vibrant Gradient Overlay to make the image pop but text readable */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/80 to-red-50/90" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">

          {/* Eye-catching Floating Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(225,29,72,0.15)] text-gray-900 font-bold text-sm mb-10 hover:-translate-y-1 transition-transform cursor-default">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            </span>
            <span className="tracking-wide uppercase text-xs sm:text-sm text-red-600">MPSC Students Protest</span>
          </div>

          {/* Epic Main Heading */}
          <h1 className="animate-fade-in-up-delay-1 text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-black text-gray-900 tracking-tighter mb-8 leading-[1.05] max-w-5xl mx-auto drop-shadow-xl">
            We Demand <br className="hidden sm:block" />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
                Absolute Justice.
              </span>
              <span className="absolute -bottom-2 left-0 w-full h-4 bg-red-200/50 -z-10 -rotate-1 blur-sm"></span>
            </span>
          </h1>

          {/* Dynamic Subtitle */}
          <p className="animate-fade-in-up-delay-2 text-lg md:text-2xl text-gray-800 max-w-3xl mx-auto mb-12 leading-relaxed font-semibold drop-shadow-md">
            {campaign?.description || 'Stand united with the students of Maharashtra. Register your support, join the protest to demand fair MPSC exams, and secure your official support certificate today.'}
          </p>

          {/* Vibrant CTA Button */}
          <div className="animate-fade-in-up-delay-3 flex justify-center">
            <Link
              href="/demand"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-red-600 to-red-500 text-white font-black text-xl rounded-full overflow-hidden shadow-[0_10px_40px_rgba(220,38,38,0.4)] hover:shadow-[0_15px_50px_rgba(220,38,38,0.6)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10">JOIN THE MOVEMENT</span>
              <ArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" size={24} strokeWidth={3} />
            </Link>
          </div>

          {/* Glassmorphism Stats Card */}
          {data?.stats && (
            <div className="animate-fade-in-up-delay-5 mt-20 mx-auto max-w-lg bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-[0_20px_60px_rgba(220,38,38,0.15)] relative overflow-hidden group hover:border-red-500/50 transition-colors duration-500">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />
              
              <div className="flex flex-col items-center justify-center space-y-3 hover:scale-105 transition-transform duration-300">
                <span className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 tracking-tight drop-shadow-lg">
                  {data.stats.totalDemands.toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm sm:text-base font-bold text-red-400 uppercase tracking-[0.2em] text-center">
                    Total Supporters
                  </span>
                </div>
              </div>
              
            </div>
          )}
        </div>
      </main>

      {/* Eye-Catching Features Section */}
      <section className="py-24 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-gray-900 uppercase">Why This Matters</h2>
            <div className="w-24 h-2 bg-red-600 mx-auto mb-6 rounded-full" />
            <p className="text-gray-600 max-w-2xl mx-auto text-xl font-medium leading-relaxed">The future of lakhs of students is at stake. Together we can ensure fair opportunities and absolute transparency.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <FeatureCard
              icon={Shield}
              title="Protect Our Future"
              desc="Unfair exam patterns and delays destroy the potential of our youth. We demand absolute transparency."
            />
            <FeatureCard
              icon={Users}
              title="Stand United"
              desc="A united student body is powerful. Join the movement to show the government our true strength."
            />
            <FeatureCard
              icon={HeartHandshake}
              title="Demand Justice"
              desc="Your support helps amplify our voice to fill vacant positions and conduct exams fairly."
            />
          </div>
        </div>
      </section>

      {/* Epic Quote Section */}
      <section className="py-32 bg-red-600 relative overflow-hidden">
        {/* Dynamic Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500 rounded-full blur-[100px] opacity-50 mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500 rounded-full blur-[100px] opacity-50 mix-blend-screen" />
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <Star className="w-16 h-16 text-white/30 mx-auto mb-8" />
          <blockquote className="text-4xl md:text-6xl font-black text-white leading-[1.2] tracking-tighter mb-12 drop-shadow-xl">
            "We do not ask for favors, we ask for our rights —<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">a fair, transparent, and timely MPSC exam.</span>"
          </blockquote>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="p-8 md:p-12 rounded-[2rem] bg-white border border-gray-200 shadow-[0_10px_30px_rgb(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(220,38,38,0.15)] hover:-translate-y-2 transition-all duration-300 group">
      <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-inner">
        <Icon size={36} strokeWidth={2} />
      </div>
      <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tighter">{title}</h3>
      <p className="text-gray-600 text-lg leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
