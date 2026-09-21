'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser } from '@/lib/api';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUdyraLogin = async () => {
    setLoading(true);
    
    const demoUsername = 'udyra_demo_user';
    const demoPassword = 'udyra_demo_password_123!';

    try {
      try { await registerUser(demoUsername, demoPassword); } catch (err) {}
      const { access_token } = await loginUser(demoUsername, demoPassword);
      localStorage.setItem('transformai_token', access_token);
      router.push('/');
    } catch (err) {
      setLoading(false);
      alert('Authentication failed');
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center relative overflow-hidden font-sans">
      
      {/* Background Image Container */}
      <div className="absolute top-0 left-0 w-full h-[65%] z-0">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: 'url(/bg.jpg)' }}
        />
        {/* Gradient fade into black */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Main UI Container */}
      <div className="w-full h-screen flex flex-col justify-end items-center pb-8 px-6 z-10 relative">
        
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <svg className="w-14 h-14 text-white mb-2" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 24L28 24L22 30L34 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 20L32 20L22 30" fill="currentColor"/>
            <path d="M16 18L32 18L24 28" fill="none" stroke="currentColor" strokeWidth="2"/>
            {/* Custom stylized R / lightning bolt */}
            <path d="M14 20 H34 L28 26 L36 34 M28 26 H18" stroke="currentColor" strokeWidth="3" strokeLinecap="square"/>
          </svg>
          <h1 className="text-white text-[28px] font-medium tracking-[0.2em] mb-4 uppercase">Relay</h1>
        </div>

        {/* Login Button */}
        <button
          onClick={handleUdyraLogin}
          disabled={loading}
          className="w-full max-w-[340px] bg-white text-black font-semibold py-4 px-6 rounded-full flex items-center justify-center space-x-3 mb-8 transition-transform active:scale-95 disabled:opacity-70"
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              {/* Stylized Bird/Wing Icon */}
              <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983c-.88-.236-2.022-.27-3.303-.092-.93.13-1.666.388-2.185.66-.566.295-1.109.704-1.636 1.155-.785-.436-1.554-1.173-2.193-2.261-.318-.542-.582-1.127-.78-1.748.74-.298 1.488-.475 2.247-.482a6.435 6.435 0 011.665.23c.31.082.637.214.96.38.118-.328.216-.67.283-1.026.069-.364.085-.733.045-1.1a4.935 4.935 0 00-.518-1.722c-1.11 1.09-2.327 2.222-3.46 3.126-1.2.955-2.22 1.638-3.003 2.062 1.258 2.052 3.197 3.327 5.176 3.966a8.88 8.88 0 003.111.411c.966-.053 1.892-.256 2.766-.568a8.847 8.847 0 002.39-1.282c-.65-.638-1.39-1.135-2.228-1.464l-.337-.116z" />
              </svg>
              <span className="text-[15px]">Continue with Udyra</span>
            </>
          )}
        </button>

        {/* Footer Links */}
        <div className="flex flex-col items-center space-y-6 mb-2">
          <p className="text-[#888888] text-[13px]">
            Don't have an account? <button className="text-white font-semibold ml-1">Sign up</button>
          </p>
          
          <div className="flex items-center space-x-6 text-[#555555] text-[12px]">
            <button className="hover:text-[#888888] transition-colors">Privacy policy</button>
            <button className="hover:text-[#888888] transition-colors">Terms of service</button>
          </div>
        </div>

      </div>
    </div>
  );
}
