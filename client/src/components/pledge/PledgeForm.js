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
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-red-600/10 transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col h-full animate-fade-in-up-delay-1">
        {/* Red top accent */}
        <div className="h-1 bg-red-600" />
        
        <div className="p-6 sm:p-8 bg-gray-50 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-black">1</span>
            Our Demands
          </h2>
        </div>
        
        <div className="p-6 sm:p-8 flex-1 flex flex-col">
          {/* Language Selector */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Languages className="text-red-600 w-5 h-5" />
              <label className="text-sm font-bold text-gray-900">Select Language</label>
            </div>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {[
                { id: 'english', label: 'English' },
                { id: 'hindi', label: 'हिन्दी' },
                { id: 'marathi', label: 'मराठी' }
              ].map(lang => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setLanguage(lang.id)}
                  className={`py-1.5 sm:py-2 rounded-xl font-medium border text-xs sm:text-sm transition-all ${
                    language === lang.id 
                    ? 'bg-red-50 border-red-500 text-red-700 shadow-sm' 
                    : 'bg-white border-gray-300 text-gray-600 hover:border-red-300'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-red-50/50 rounded-2xl border border-red-100 p-5 mb-6 flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar text-left space-y-3" style={{ maxHeight: '350px' }}>
              <ul className="list-decimal pl-5 text-sm text-gray-700 space-y-3 font-medium">
                {getPledgePoints(language, siteConfig).map((point, idx) => (
                  <li key={idx} className="leading-relaxed">{point}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <label className="flex items-start gap-3 cursor-pointer group mt-auto p-4 bg-white border border-gray-200 rounded-xl hover:border-red-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex h-5 items-center mt-0.5">
              <input
                required
                name="consent"
                type="checkbox"
                onChange={handleChange}
                className="h-5 w-5 rounded border-gray-300 bg-white text-red-600 focus:ring-red-600 focus:ring-offset-white accent-red-600"
              />
            </div>
            <div className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
              I agree with these demands and allow my details to be used to generate the support certificate.
            </div>
          </label>
        </div>
      </div>

      {/* Right Card: User Details */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-200 transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col h-full animate-fade-in-up-delay-2">
        {/* Red top accent */}
        <div className="h-1 bg-red-600" />
        
        <div className="p-6 sm:p-8 bg-gray-50 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-black">2</span>
            Your Details
          </h2>
        </div>
        
        <div className="p-6 sm:p-8 flex-1 flex flex-col">
          <div className="space-y-5 flex-1">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Full Name *</label>
                <input required type="text" name="name" onChange={handleChange} className="w-full rounded-xl bg-gray-50 border-gray-200 px-4 py-2.5 border focus:bg-white focus:border-red-500 outline-none text-gray-900 transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Mobile Number *</label>
                <input required type="tel" name="mobile" pattern="[0-9]{10}" maxLength="10" minLength="10" title="Please enter a valid 10-digit mobile number" onChange={handleChange} className="w-full rounded-xl bg-gray-50 border-gray-200 px-4 py-2.5 border focus:bg-white focus:border-red-500 outline-none text-gray-900 transition-all" placeholder="9876543210" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Email Address *</label>
              <input required type="email" name="email" onChange={handleChange} className="w-full rounded-xl bg-gray-50 border-gray-200 px-4 py-2.5 border focus:bg-white focus:border-red-500 outline-none text-gray-900 transition-all" placeholder="john@example.com" />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Profession *</label>
                <select required name="profession" onChange={handleChange} className="w-full rounded-xl bg-gray-50 border-gray-200 px-4 py-2.5 border focus:bg-white focus:border-red-500 outline-none text-gray-700 transition-all">
                  <option value="" className="bg-white text-gray-700">Select</option>
                  <option value="Student" className="bg-white text-gray-700">Student</option>
                  <option value="Employee" className="bg-white text-gray-700">Employee</option>
                  <option value="Business Owner" className="bg-white text-gray-700">Business Owner</option>
                  <option value="Professional" className="bg-white text-gray-700">Professional</option>
                  <option value="Teacher" className="bg-white text-gray-700">Teacher</option>
                  <option value="Other" className="bg-white text-gray-700">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">City</label>
                <input type="text" name="city" onChange={handleChange} className="w-full rounded-xl bg-gray-50 border-gray-200 px-4 py-2.5 border focus:bg-white focus:border-red-500 outline-none text-gray-900 transition-all" placeholder="Pune" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">State</label>
                <input type="text" name="state" onChange={handleChange} className="w-full rounded-xl bg-gray-50 border-gray-200 px-4 py-2.5 border focus:bg-white focus:border-red-500 outline-none text-gray-900 transition-all" placeholder="Maharashtra" />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
            {errorStatus && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 p-4 rounded-xl text-sm font-medium">
                <AlertCircle size={18} className="shrink-0" />
                <span>There was an error processing your request. Please try again.</span>
              </div>
            )}

            <button
              disabled={isCreating || !formData.consent}
              type="submit"
              className="w-full flex justify-center py-4 px-4 rounded-xl shadow-[0_0_30px_-5px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_-5px_rgba(220,38,38,0.5)] text-lg font-bold text-white bg-red-600 hover:bg-red-700 hover:-translate-y-1 transition-all duration-300 outline-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isCreating ? 'PROCESSING...' : 'SUBMIT SUPPORT'}
            </button>

          </div>
        </div>
      </div>
    </form>
  );
}
