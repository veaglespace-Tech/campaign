import { useState } from 'react';
import { Languages, AlertCircle } from 'lucide-react';
import { useCreatePledgeMutation } from '../../redux/api/apiSlice';
import { getPledgePoints } from '../../constants/pledgeTexts';

export default function PledgeForm({ campaignId, siteConfig, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    profession: '',
    city: '',
    state: '',
    consent: false
  });
  
  const [language, setLanguage] = useState('english');
  const [errorStatus, setErrorStatus] = useState(false);
  
  const [createPledge, { isLoading: isCreating }] = useCreatePledgeMutation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consent) return;
    
    setErrorStatus(false);
    try {
      const res = await createPledge({
        ...formData,
        campaignId,
        language,
        pledgeText: '9 points standard pledge' // Storing a summary since the full text is huge
      }).unwrap();
      
      if (res.success) {
        onSuccess(res.pledgeId);
      } else {
        setErrorStatus(true);
      }
    } catch (error) {
      console.error('Submit Error:', error);
      const errorMessage = error?.data?.message || 'There was an error processing your pledge. Please try again.';
      alert(errorMessage);
      setErrorStatus(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      
      {/* Left Card: The Demands */}
      <div className="bg-black/40 backdrop-blur-3xl rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.5)] transition-all duration-300 border border-white/10 overflow-hidden flex flex-col h-full animate-fade-in-up-delay-1">
        
        <div className="p-8 sm:p-10 border-b border-white/10 bg-white/5">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3 tracking-tight">
            <span className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-200 flex items-center justify-center text-sm font-black shadow-sm">1</span>
            Our Demands
          </h2>
        </div>
        
        <div className="p-8 sm:p-10 flex-1 flex flex-col">
          {/* Language Selector */}
          <div className="p-5 bg-white/5 border border-white/10 rounded-[1.5rem] mb-8 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Languages className="text-red-400 w-5 h-5" />
              <label className="text-sm font-bold text-gray-200 tracking-wide">Select Language</label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'english', label: 'English' },
                { id: 'hindi', label: 'हिन्दी' },
                { id: 'marathi', label: 'मराठी' }
              ].map(lang => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setLanguage(lang.id)}
                  className={`py-2 sm:py-2.5 rounded-xl font-semibold border text-xs sm:text-sm transition-all duration-300 ${
                    language === lang.id 
                    ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-[1.5rem] border border-white/10 p-6 mb-8 flex flex-col shadow-inner">
            <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar text-left space-y-4" style={{ maxHeight: '350px' }}>
              <ul className="list-decimal pl-5 text-sm text-gray-300 space-y-4 font-medium">
                {getPledgePoints(language, siteConfig).map((point, idx) => (
                  <li key={idx} className="leading-relaxed">{point}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <label className="flex items-start gap-3.5 cursor-pointer group mt-auto p-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-[1.5rem] hover:border-white/30 hover:bg-white/10 transition-all duration-300">
            <div className="flex h-5 items-center mt-0.5">
              <input
                required
                name="consent"
                type="checkbox"
                onChange={handleChange}
                className="h-5 w-5 mt-0.5 rounded border-white/20 bg-black/50 text-red-600 focus:ring-red-500 focus:ring-offset-black accent-red-600 cursor-pointer"
              />
            </div>
            <div className="text-sm text-gray-400 font-medium group-hover:text-gray-200 transition-colors leading-relaxed">
              I agree with these demands and allow my details to be used to generate the official support certificate.
            </div>
          </label>
        </div>
      </div>

      {/* Right Card: User Details */}
      <div className="bg-black/40 backdrop-blur-3xl rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.5)] transition-all duration-300 border border-white/10 overflow-hidden flex flex-col h-full animate-fade-in-up-delay-2">
        
        <div className="p-8 sm:p-10 border-b border-white/10 bg-white/5">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3 tracking-tight">
            <span className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-200 flex items-center justify-center text-sm font-black shadow-sm">2</span>
            Your Details
          </h2>
        </div>
        
        <div className="p-8 sm:p-10 flex-1 flex flex-col">
          <div className="space-y-6 flex-1">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Full Name *</label>
                <input required type="text" name="name" onChange={handleChange} className="w-full rounded-xl bg-white/5 border-white/10 px-4 py-3 border focus:bg-white/10 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-white transition-all font-medium placeholder-gray-600" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Mobile Number *</label>
                <input required type="tel" name="mobile" pattern="[0-9]{10}" maxLength="10" minLength="10" title="Please enter a valid 10-digit mobile number" onChange={handleChange} className="w-full rounded-xl bg-white/5 border-white/10 px-4 py-3 border focus:bg-white/10 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-white transition-all font-medium placeholder-gray-600" placeholder="9876543210" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Email Address *</label>
              <input required type="email" name="email" onChange={handleChange} className="w-full rounded-xl bg-white/5 border-white/10 px-4 py-3 border focus:bg-white/10 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-white transition-all font-medium placeholder-gray-600" placeholder="john@example.com" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Profession *</label>
                <select required name="profession" onChange={handleChange} className="w-full rounded-xl bg-black/40 border-white/10 px-4 py-3 border focus:bg-black/60 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-gray-200 transition-all font-medium appearance-none">
                  <option value="" className="bg-gray-900">Select</option>
                  <option value="Student" className="bg-gray-900">Student</option>
                  <option value="Employee" className="bg-gray-900">Employee</option>
                  <option value="Business Owner" className="bg-gray-900">Business Owner</option>
                  <option value="Professional" className="bg-gray-900">Professional</option>
                  <option value="Teacher" className="bg-gray-900">Teacher</option>
                  <option value="Other" className="bg-gray-900">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">City</label>
                <input type="text" name="city" onChange={handleChange} className="w-full rounded-xl bg-white/5 border-white/10 px-4 py-3 border focus:bg-white/10 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-white transition-all font-medium placeholder-gray-600" placeholder="Pune" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">State</label>
                <input type="text" name="state" onChange={handleChange} className="w-full rounded-xl bg-white/5 border-white/10 px-4 py-3 border focus:bg-white/10 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-white transition-all font-medium placeholder-gray-600" placeholder="Maharashtra" />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 space-y-5">
            {errorStatus && (
              <div className="flex items-center gap-2 text-red-200 bg-red-900/40 border border-red-500/30 p-4 rounded-xl text-sm font-medium shadow-sm backdrop-blur-md">
                <AlertCircle size={18} className="shrink-0" />
                <span>There was an error processing your request. Please try again.</span>
              </div>
            )}

            <button
              disabled={isCreating || !formData.consent}
              type="submit"
              className="w-full flex justify-center py-4 px-6 rounded-full shadow-[0_8px_20px_rgba(220,38,38,0.2)] hover:shadow-[0_10px_25px_rgba(220,38,38,0.4)] text-lg font-bold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-orange-500 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 outline-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:active:scale-100 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isCreating ? 'PROCESSING...' : 'SUBMIT SUPPORT'}
            </button>

          </div>
        </div>
      </div>
    </form>
  );
}
