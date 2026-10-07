'use client';
import { Download, Search, CheckCircle2, Clock, Filter, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useGetAdminDemandsQuery } from '../../../redux/api/apiSlice';
import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function UsersPage() {
  const { data, isLoading } = useGetAdminDemandsQuery();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'generated', 'pending'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const demands = data?.success ? data.demands : [];

  // Filter & Search Logic
  const filteredDemands = useMemo(() => {
    return demands.filter(p => {
      const matchesSearch = 
        p.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.city?.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter === 'generated') {
        matchesStatus = p.certificates && p.certificates.length > 0;
      } else if (statusFilter === 'pending') {
        matchesStatus = !p.certificates || p.certificates.length === 0;
      }

      return matchesSearch && matchesStatus;
    });
  }, [demands, searchTerm, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredDemands.length / itemsPerPage);
  const paginatedDemands = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDemands.slice(start, start + itemsPerPage);
  }, [filteredDemands, currentPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9933]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 tracking-tight">Users & Demands</h1>
          <p className="text-gray-400 mt-1">Manage and export all campaign participants.</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-orange-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_8px_20px_rgba(220,38,38,0.3)]">
          <Download size={18} />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-500" />
        
        {/* Filters & Search */}
        <div className="p-6 border-b border-white/10 bg-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 border border-white/10 bg-white/5 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-red-500 focus:bg-white/10 outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-gray-400 font-medium">
              <Filter size={18} />
              <span className="hidden sm:inline">Status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 md:w-auto block w-full pl-4 pr-10 py-3 border border-white/10 bg-black/40 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:bg-white/10 outline-none transition-all cursor-pointer"
            >
              <option value="all" className="bg-gray-900">All Users</option>
              <option value="generated" className="bg-gray-900">Certificate Generated</option>
              <option value="pending" className="bg-gray-900">Certificate Pending</option>
            </select>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Certificate Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-white/10">
              {paginatedDemands.map((demand) => (
                <tr key={demand.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center font-bold border border-red-500/20">
                        {demand.user?.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-200">{demand.user?.name}</div>
                        <div className="text-sm text-gray-500">{demand.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-300 font-medium">{demand.user?.city || '-'}</div>
                    <div className="text-sm text-gray-500">{demand.user?.state || '-'}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-medium">
                    {new Date(demand.demandDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    {demand.certificates && demand.certificates.length > 0 ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                        <CheckCircle2 size={14} /> Generated
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        <Clock size={14} /> Pending
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/users/${demand.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-lg transition-colors border border-white/10"
                      >
                        View Details
                      </Link>
                      {demand.certificates && demand.certificates.length > 0 && (
                        <>
                          <a
                            href={`${apiUrl}/demands/download/${demand.certificates[0].certificateNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-lg transition-colors border border-white/10"
                            title="Preview Certificate"
                          >
                            <Eye size={18} />
                          </a>
                          <a
                            href={`${apiUrl}/demands/download/${demand.certificates[0].certificateNumber}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold rounded-lg transition-colors border border-red-500/20"
                            title="Download Certificate"
                          >
                            <Download size={18} />
                          </a>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedDemands.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No users found matching your search and filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400 text-center sm:text-left">
              Showing <span className="font-semibold text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-white">{Math.min(currentPage * itemsPerPage, filteredDemands.length)}</span> of <span className="font-semibold text-white">{filteredDemands.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm font-semibold text-gray-200">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
