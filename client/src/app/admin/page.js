'use client';
import { Users, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import { useGetAdminStatsQuery } from '../../redux/api/apiSlice';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { data: statsData, isLoading } = useGetAdminStatsQuery();
  const stats = statsData?.success ? statsData.stats : null;

  // Mock data for the chart since backend doesn't provide historical data yet
  const chartData = [
    { name: 'Mon', demands: 140 },
    { name: 'Tue', demands: 230 },
    { name: 'Wed', demands: 370 },
    { name: 'Thu', demands: 250 },
    { name: 'Fri', demands: 580 },
    { name: 'Sat', demands: 820 },
    { name: 'Sun', demands: stats?.todayDemands || 120 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here's what's happening with the protest campaign today.</p>
      </div>
      
      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KPICard 
            title="Total Supporters" 
            value={stats.totalDemands} 
            icon={Users} 
            color="red" 
            trend="+12%" 
          />
          <KPICard 
            title="Certificates Issued" 
            value={stats.certificatesGenerated} 
            icon={FileText} 
            color="orange" 
            trend="+12%" 
          />
          <KPICard 
            title="Today's Signatures" 
            value={stats.todayDemands} 
            icon={TrendingUp} 
            color="yellow" 
            trend="+24%" 
          />
        </div>
      )}

      {/* Analytics Chart */}
      <div className="bg-black/40 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Top accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />
        
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-200">Weekly Engagement</h3>
          <p className="text-gray-400 text-sm">Signatures collected over the last 7 days.</p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDemands" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} dx={-10} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)', color: '#fff' }}
                itemStyle={{ color: '#ef4444' }}
              />
              <Area type="monotone" dataKey="demands" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorDemands)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon: Icon, color, trend }) {
  const colorMap = {
    red: { iconBg: 'bg-red-500/10', iconColor: 'text-red-500', trendColor: 'text-red-400', trendBg: 'bg-red-500/10' },
    orange: { iconBg: 'bg-orange-500/10', iconColor: 'text-orange-500', trendColor: 'text-orange-400', trendBg: 'bg-orange-500/10' },
    yellow: { iconBg: 'bg-yellow-500/10', iconColor: 'text-yellow-500', trendColor: 'text-yellow-400', trendBg: 'bg-yellow-500/10' },
  };

  const c = colorMap[color];

  return (
    <div className="bg-black/40 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 hover:shadow-[0_10px_30px_rgba(220,38,38,0.15)] transition-all relative overflow-hidden group">
      {/* Top accent on hover */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-400 font-medium text-sm">{title}</div>
        <div className={`p-3 rounded-2xl ${c.iconBg} ${c.iconColor}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
      <div className="flex items-baseline gap-3">
        <div className="text-4xl font-black text-white">{value}</div>
        <div className={`text-sm font-semibold ${c.trendColor} ${c.trendBg} px-2 py-1 rounded-lg`}>
          {trend}
        </div>
      </div>
    </div>
  );
}
