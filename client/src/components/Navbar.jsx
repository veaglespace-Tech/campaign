import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Navbar() {
  return (
    <>
      {/* Red Top Accent Bar */}
      <div className="w-full h-1.5 bg-red-600 fixed top-0 z-50" />
      <nav className="fixed top-1.5 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center gap-2">
          <a href="https://veaglespace.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 sm:gap-1.5 cursor-pointer group">
            <span className="text-base sm:text-xl font-black tracking-tight text-gray-900 group-hover:text-red-600 transition-colors duration-300 uppercase">MPSC Protest</span>
          </a>
          <Link
            href="/pledge"
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all text-xs sm:text-sm shadow-lg hover:-translate-y-0.5 whitespace-nowrap uppercase tracking-wider"
          >
            <span>Register Support</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </nav>
    </>
  );
}
