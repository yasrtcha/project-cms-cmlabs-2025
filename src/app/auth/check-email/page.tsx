"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Moon, Sun } from "lucide-react"

export default function CheckEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "example@gmail.com"

  // --- DARK MODE LOGIC ---
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark") || localStorage.getItem('theme') === 'dark';
      setIsDarkMode(isDark);
      if (isDark) document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };
  // -----------------------

  return (
    <>
      {/* Inject Font Plus Jakarta Sans */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        body, input, button, select, h1, h2, p, span {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
      `}</style>

      <div className="h-screen w-full grid lg:grid-cols-2 overflow-hidden bg-white dark:bg-[#0f172a] transition-colors duration-300">
        
        {/* === LEFT SIDE (CONTENT) === */}
        {/* Flex layout untuk mengatur posisi atas, tengah, dan bawah */}
        <div className="flex flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:hidden bg-white dark:bg-[#0f172a] p-8 lg:p-12 relative">
          
          {/* 1. TOP SECTION: Badge & Theme Toggle */}
          <div className="flex justify-between items-center">
            {/* Badge */}
            <div className="inline-block px-3 py-1.5 bg-[#2B6CB0] rounded-lg">
                <span className="text-white text-[11px] font-semibold tracking-wide">CMS WeldFine</span>
            </div>

            {/* Theme Toggle */}
            <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-[#1e293b] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#334155] transition-all border border-gray-200 dark:border-gray-700 scale-90"
            >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* 2. MIDDLE SECTION: Main Content */}
          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-6">
            
            {/* Texts */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Check Your Email</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                We sent a password reset link to <span className="font-semibold text-gray-900 dark:text-white">({email})</span>. Please check your inbox!
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {/* Open Gmail Button */}
              <Button
                onClick={() => window.open('https://mail.google.com', '_blank')}
                className="w-full py-6 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md transition-all active:scale-[0.98] text-sm"
              >
                Open Gmail
              </Button>

              {/* Resend Email */}
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Don't receive the email?{" "}
                <Link href="/auth/forgot-password" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  Click here to resend!
                </Link>
              </p>
            </div>
          </div>

          {/* 3. BOTTOM SECTION: Back Button */}
          <div className="max-w-md mx-auto w-full pt-6">
            <Link href="/auth/login">
                <Button 
                  variant="outline"
                  className="px-6 py-5 rounded-full border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-[#1e293b] flex items-center justify-center gap-2 text-xs bg-transparent w-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Button>
            </Link>
          </div>

        </div>

        {/* === RIGHT SIDE (VISUAL) === */}
        <div className="hidden lg:flex items-center justify-center bg-white dark:bg-[#0f172a] h-full relative p-8 transition-colors duration-300">
          
          <div className="relative w-full h-full max-h-[800px] rounded-[32px] overflow-hidden flex flex-col items-center justify-center shadow-2xl">
            
            {/* Gambar Background */}
            <Image 
              src="/assets/bg_login.jpg" 
              alt="Visual" 
              width={800}
              height={800}
              className="object-cover w-full h-full absolute inset-0 opacity-100"
              priority
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 z-0"></div>

            {/* === ELEMEN TAMBAHAN (OVERLAY) === */}
            <div className="absolute inset-0 flex flex-col justify-between p-10 z-10">
              
              {/* Header Teks */}
              <div className="mt-1 text-center mx-auto max-w-lg">
                <h2 className="text-2xl font-semibold text-white leading-tight mb-2 drop-shadow-md">
                  Start building, managing, and scaling
                </h2>
                <p className="text-2xl text-gray-200/80 font-medium drop-shadow-md">
                  your projects with one powerful workspace.
                </p>
              </div>

              {/* Kontrol (Card) */}
              <div className="mb-2">
                  <div className="bg-[#0b0e14]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl ring-1 ring-white/5">
                      <div className="flex items-center justify-between mb-4">
                          {/* Kiri: Badge */}
                          <div className="flex items-center">
                              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5">
                                  <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
                                  <span className="text-[11px] font-bold tracking-widest text-white uppercase">MANAGING</span>
                              </div>
                          </div>
                          
                          {/* Kanan: Panah */}
                          <div className="flex gap-3">
                              <button className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-gray-300 hover:bg-white/10 hover:text-white transition-all">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="19" y1="5" x2="5" y2="19"></line>
                                    <polyline points="19 19 5 19 5 5"></polyline>
                                  </svg>
                              </button>
                              <button className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-gray-300 hover:bg-white/10 hover:text-white transition-all">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="19" x2="19" y2="5"></line>
                                    <polyline points="5 5 19 5 19 19"></polyline>
                                  </svg>
                              </button>
                          </div>
                      </div>

                      {/* Deskripsi */}
                      <p className="text-sm text-gray-400 font-light leading-relaxed">
                          Manage projects, collaborators, and content workflows seamlessly from a single dashboard with clear structure and control.
                      </p>
                  </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}