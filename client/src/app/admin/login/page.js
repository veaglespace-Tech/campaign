'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAdminLoginMutation, useAdminVerifyOtpMutation } from '../../../redux/api/apiSlice';
import { setCredentials } from '../../../redux/slice/appSlice';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Login, 2 = OTP
  const [errorMsg, setErrorMsg] = useState('');
  
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.app.token);
  
  const [adminLogin, { isLoading: isLoggingIn }] = useAdminLoginMutation();
  const [adminVerifyOtp, { isLoading: isVerifying }] = useAdminVerifyOtpMutation();

  useEffect(() => {
    if (token) {
      router.push('/admin');
    }
  }, [token, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await adminLogin({ email, password }).unwrap();
      if (res.success && res.requiresOtp) {
        setStep(2); // Move to OTP step
      }
    } catch (err) {
      setErrorMsg(err?.data?.message || 'Invalid credentials or server error.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await adminVerifyOtp({ email, otp }).unwrap();
      if (res.success) {
        dispatch(setCredentials({ user: res.user, token: res.token }));
        router.push('/admin');
      }
    } catch (err) {
      setErrorMsg(err?.data?.message || 'Invalid or expired OTP.');
    }
  };

  if (token) return null; // Prevent flicker while redirecting

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="fixed inset-0 z-0">
        <img src="/protest_bg.jpg" alt="Protest Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-red-950/90 mix-blend-multiply"></div>
      </div>
      
      {/* Top bar accent */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 z-50" />
      
      {/* Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-red-600/10 blur-[120px]" />
        <div className="absolute -bottom-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-orange-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            <Lock className="text-red-500 h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">Admin Portal</h1>
          <p className="text-gray-400 mt-2 font-medium">Sign in to manage campaign data</p>
        </div>

        <div className="bg-black/40 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Top red accent */}
          <div className="absolute top-0 left-0 w-full h-1 rounded-t-3xl bg-gradient-to-r from-red-600 to-orange-500" />
          
          {step === 1 ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-red-500 focus:bg-white/10 outline-none transition-all font-medium"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-red-500 focus:bg-white/10 outline-none transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-red-200 bg-red-900/40 border border-red-500/30 p-4 rounded-xl text-sm font-medium backdrop-blur-md">
                  <AlertCircle size={18} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl shadow-[0_8px_20px_rgba(220,38,38,0.3)] text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-orange-500 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? 'VERIFYING...' : 'CONTINUE'}
                {!isLoggingIn && <ArrowRight size={18} />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-400">
                  We sent a 6-digit verification code to<br />
                  <span className="font-bold text-white">{email}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Verification Code (OTP)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-red-500 focus:bg-white/10 outline-none transition-all font-medium text-center tracking-widest font-mono text-lg"
                    placeholder="000000"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-red-200 bg-red-900/40 border border-red-500/30 p-4 rounded-xl text-sm font-medium backdrop-blur-md">
                  <AlertCircle size={18} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl shadow-[0_8px_20px_rgba(220,38,38,0.3)] text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-orange-500 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? 'VERIFYING...' : 'SECURE LOGIN'}
                {!isVerifying && <Lock size={16} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp('');
                  setErrorMsg('');
                }}
                className="w-full text-center text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Login
              </button>
            </form>
          )}
        </div>
        
        <p className="text-center text-gray-500 text-sm mt-8 relative z-10">
          Secure Access Only. Protected by Veagle Space.
        </p>
      </div>
    </div>
  );
}
