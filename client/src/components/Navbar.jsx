import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Navbar() {
  return (
    <>
      <nav className="fixed top-0 w-full z-40 bg-white/70 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center gap-2">
          <a href="https://veaglespace.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 sm:gap-1.5 cursor-pointer group">
            <span className="text-base sm:text-xl font-extrabold tracking-tight text-[#0A0A0A] group-hover:text-[#E11D48] transition-colors duration-300 uppercase">MPSC Protest</span>
          </a>
          <Link
            href="/demand"
            className="group flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white font-medium text-sm rounded-full transition-all duration-300 hover:shadow-[0_4px_14px_rgba(0,0,0,0.15)] active:scale-95"
          >
            <span className="hidden sm:inline">Register Support</span>
            <span className="sm:hidden">Support</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
          </Link>
        </div>
      </nav>
    </>
  );
}
