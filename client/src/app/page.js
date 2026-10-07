'use client';
import Link from 'next/link';
import { HeartHandshake, Shield, Users, ArrowRight, Flag, Star } from 'lucide-react';
import { useGetCampaignsQuery } from '../redux/api/apiSlice';

export default function Home() {
  const { data, isLoading } = useGetCampaignsQuery();
  const campaign = data?.success ? data.campaigns[0] : null;

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">



      {/* Hero Section with Visible Background Image */}
      <main className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center bg-black">
        {/* Background Image / Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50" 
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=2000")' }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">

          {/* Protest Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-100 font-bold text-xs sm:text-sm mb-8 shadow-sm whitespace-nowrap backdrop-blur-sm">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </span>
            MPSC Students Protest — Stand For Justice
          </div>

          {/* Main Heading */}
          <h1 className="animate-fade-in-up-delay-1 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 leading-[1.05]">
            MPSC Protest, <br />
            <span className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              Our Demands.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up-delay-2 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            {campaign?.description || 'Stand united with the students of Maharashtra. Register your support, join the protest to demand fair MPSC exams, and secure your official protest demands certificate today.'}
          </p>

          {/* CTA Button */}
          <div className="animate-fade-in-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pledge"
              className="group flex items-center justify-center gap-2.5 w-full sm:w-auto px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-2xl transition-all shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)] hover:shadow-[0_0_60px_-10px_rgba(220,38,38,0.7)] hover:-translate-y-1"
            >
              <Flag size={22} />
              <span>Register Support</span>
              <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={20} />
            </Link>
          </div>

          {/* Stats Card */}
          {data?.stats && (
            <div className="animate-fade-in-up-delay-5 mt-16 mx-auto max-w-2xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden group">
              {/* Red top border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />

              <div className="grid grid-cols-2 gap-4 sm:gap-8 divide-x divide-gray-200">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black text-red-600 mb-1 sm:mb-2">
                    {data.stats.totalPledges.toLocaleString()}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base font-bold text-gray-500 uppercase tracking-wider text-center">
                    Total Supporters
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-1 sm:mb-2">
                    {data.stats.donorsCount?.toLocaleString() || 0}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base font-bold text-gray-500 uppercase tracking-wider text-center">
                    Contributors
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Why This Matters Section */}
      <section className="py-12 md:py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-gray-900">Why This Matters</h2>
            <p className="text-gray-600 max-w-xl mx-auto text-lg font-medium">The future of lakhs of students is at stake. Together we can ensure fair opportunities for everyone.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Shield}
              title="Protect Our Future"
              desc="Unfair exam patterns and delays destroy the potential of our youth. We demand transparency."
              color="red"
            />
            <FeatureCard
              icon={Users}
              title="Stand United"
              desc="A united student body is powerful. Join the movement to show the government our strength."
              color="dark"
            />
            <FeatureCard
              icon={HeartHandshake}
              title="Demand Justice"
              desc="Your support helps amplify our voice to fill vacant positions and conduct exams fairly."
              color="red"
            />
          </div>
        </div>
      </section>

      {/* Motivational Quote Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <blockquote className="text-3xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-6">
            "We do not ask for favors, we ask for our rights —<br />
            <span className="text-red-600">a fair, transparent, and timely MPSC exam.</span>"
          </blockquote>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }) {
  const colorMap = {
    red: {
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      borderHover: 'hover:border-red-300',
      shadowHover: 'hover:shadow-red-500/10',
    },
    dark: {
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-800',
      borderHover: 'hover:border-gray-300',
      shadowHover: 'hover:shadow-gray-500/10',
    }
  };

  const c = colorMap[color] || colorMap.dark;

  return (
    <div className={`p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:-translate-y-2 transition-all duration-300 group ${c.borderHover} ${c.shadowHover}`}>
      <div className={`w-14 h-14 ${c.iconBg} ${c.iconColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
