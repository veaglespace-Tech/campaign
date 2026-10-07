'use client';
import { useState, useEffect } from 'react';
import { Save, Languages, Shield, FileText } from 'lucide-react';
import { useGetConfigQuery, useUpdateConfigMutation } from '../../../redux/api/apiSlice';
import { defaultDemandEnglish, defaultDemandHindi, defaultDemandMarathi } from '../../../constants/demandTexts';

export default function SiteConfigPage() {
  const { data, isLoading } = useGetConfigQuery();
  const [updateConfig, { isLoading: isUpdating }] = useUpdateConfigMutation();
  
  const [formData, setFormData] = useState({
    demandEnglish: '',
    demandHindi: '',
    demandMarathi: '',
    certificateFormat: ''
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (data?.config) {
      setFormData({
        demandEnglish: data.config.demandEnglish || defaultDemandEnglish.join('\n'),
        demandHindi: data.config.demandHindi || defaultDemandHindi.join('\n'),
        demandMarathi: data.config.demandMarathi || defaultDemandMarathi.join('\n'),
        certificateFormat: data.config.certificateFormat || 'This certificate is proudly presented to {name} for supporting the MPSC Protest Demands.'
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await updateConfig(formData).unwrap();
      if (res.success) {
        setMessage('Configuration saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to save configuration.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 tracking-tight">Site Configuration</h1>
        <p className="text-gray-400 mt-1">Manage public texts, certificates, and multi-language demands.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Certificate Section */}
        <div className="bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-500" />
          <div className="p-6 border-b border-white/10 bg-white/5 flex items-center gap-3">
            <FileText className="text-orange-400" />
            <h2 className="text-xl font-bold text-white">Certificate Format</h2>
          </div>
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Certificate Introductory Text (Use <code>{'{name}'}</code> as placeholder)
            </label>
            <textarea
              name="certificateFormat"
              value={formData.certificateFormat}
              onChange={handleChange}
              rows="3"
              className="block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:bg-white/10 outline-none transition-all placeholder-gray-600"
              placeholder="This certificate is proudly presented to {name}..."
            />
          </div>
        </div>

        {/* Multi-Language Demands */}
        <div className="bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-500" />
          <div className="p-6 border-b border-white/10 bg-white/5 flex items-center gap-3">
            <Languages className="text-red-400" />
            <h2 className="text-xl font-bold text-white">Demands (3 Languages)</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">English Demand (Enter one point per line)</label>
              <textarea
                name="demandEnglish"
                value={formData.demandEnglish}
                onChange={handleChange}
                rows="10"
                className="block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:bg-white/10 outline-none transition-all placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Hindi Demand (हिन्दी) (Enter one point per line)</label>
              <textarea
                name="demandHindi"
                value={formData.demandHindi}
                onChange={handleChange}
                rows="10"
                className="block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:bg-white/10 outline-none transition-all placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Marathi Demand (मराठी) (Enter one point per line)</label>
              <textarea
                name="demandMarathi"
                value={formData.demandMarathi}
                onChange={handleChange}
                rows="10"
                className="block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:bg-white/10 outline-none transition-all placeholder-gray-600"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-orange-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_8px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_10px_25px_rgba(220,38,38,0.5)] disabled:opacity-50"
          >
            <Save size={20} />
            {isUpdating ? 'Saving...' : 'Save Configuration'}
          </button>
          {message && (
            <span className={`font-medium ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </span>
          )}
        </div>
        
      </form>
    </div>
  );
}
