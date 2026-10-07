'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { LayoutDashboard, Users, UserCog, LogOut, Menu, Sliders } from 'lucide-react';
import { logout } from '../../redux/slice/appSlice';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const token = useSelector((state) => state.app.token);
  const adminUser = useSelector((state) => state.app.adminUser);

  const isLoginPage = pathname === '/admin/login';

  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!token && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [token, isLoginPage, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/admin/login');
  };

  if (!mounted) {
    // Avoid hydration mismatch by returning a placeholder or empty div with same structure
    return <div className="h-screen overflow-hidden bg-[#FAFAFA] flex"></div>;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!token) return <div className="h-screen overflow-hidden bg-[#FAFAFA] flex"></div>; // Wait for redirect

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Users & Pledges', href: '/admin/users', icon: Users },
    { name: 'Site Config', href: '/admin/config', icon: Sliders },
  ];

  return (
    <div className="h-screen overflow-hidden bg-[#0a0a0a] flex relative text-gray-300">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-red-600/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-[120px]" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-20 md:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 flex flex-col w-72 bg-black/60 backdrop-blur-3xl border-r border-white/10 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Top accent */}
        <div className="h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />
        
        <div className="h-24 flex items-center px-8 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <span className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 group-hover:opacity-80 transition-opacity duration-300">MPSC Support</span>
          </Link>
        </div>

        <div className="flex-1 py-8 px-4 overflow-y-auto space-y-2">
          <div className="px-4 mb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Menu
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-[0_8px_20px_rgba(220,38,38,0.3)]' 
                  : 'hover:bg-white/5 hover:text-white text-gray-400'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-500'} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5">
          <Link href="/admin/settings" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl mb-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-inner">
              {adminUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{adminUser?.name || 'Admin'}</p>
              <p className="text-xs text-gray-400 truncate">{adminUser?.role || 'Super Admin'}</p>
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Mobile Header */}
        <header className="md:hidden h-20 bg-black/60 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 relative">
          {/* Top accent */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <span className="text-lg font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">MPSC Support</span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
