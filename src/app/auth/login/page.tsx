"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, ArrowUpRight, Moon, Sun } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      setError("Terjadi kesalahan saat login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      setError("Terjadi kesalahan saat login dengan Google")
      setIsLoading(false)
    }
  }

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
        
        {/* === LEFT SIDE (FORM) === */}
        <div className="flex flex-col justify-center h-full overflow-y-auto [&::-webkit-scrollbar]:hidden bg-white dark:bg-[#0f172a]">
          <div className="w-full max-w-md mx-auto px-8 py-3">
            
            {/* Header Bar (Badge + Theme Toggle) */}
            <div className="flex items-center justify-between mb-4">
              <div className="inline-block px-3 py-1 bg-[#2B6CB0] rounded-full">
                <span className="text-white text-[10px] font-semibold tracking-wide">CMS WeldFine</span>
              </div>

              <button 
                onClick={toggleTheme}
                className="p-1.5 rounded-full bg-gray-100 dark:bg-[#1e293b] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#334155] transition-all border border-gray-200 dark:border-gray-700 scale-90"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            {/* Title */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-1">
                Welcome Back
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                Enter your email and password to access your account.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-2 rounded-md text-xs border border-red-100 dark:border-red-900/30">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-semibold text-gray-700 dark:text-gray-300">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1e293b] border border-transparent focus:bg-white dark:focus:bg-black focus:border-blue-500 focus:ring-0 rounded-lg text-xs transition-all outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="example@gmail.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-xs font-semibold text-gray-700 dark:text-gray-300">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1e293b] border border-transparent focus:bg-white dark:focus:bg-black focus:border-blue-500 focus:ring-0 rounded-lg text-xs transition-all outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 pr-10"
                    placeholder="Input your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 bg-white dark:bg-[#1e293b]"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Remember Me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-xs font-semibold text-gray-900 dark:text-white hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm transition-all active:scale-[0.98] text-xs"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Login"}
                </button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-5 rounded-lg border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-[#1e293b] flex items-center justify-center gap-2 text-xs bg-transparent h-10"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </Button>
              </div>

              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                Haven't joined yet? <Link href="/auth/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Sign Up</Link>
              </p>
            </form>

            {/* Testimonial Card (Versi Dark Mode Baru) */}
            <div className="mt-6 bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-gray-700 p-2 pr-4 rounded-full shadow-lg flex items-center justify-between transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1e293b] bg-gray-50 dark:bg-gray-800 overflow-hidden relative flex items-center justify-center">
                       <Image 
                          src={`/assets/icon${i}.ico`} 
                          alt={`User ${i}`}
                          width={20}
                          height={20}
                          className="object-contain"
                       />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">Join with 20K User</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-black cursor-pointer transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* === RIGHT SIDE (VISUAL) === */}
        <div className="hidden lg:flex items-center justify-center bg-white dark:bg-[#0f172a] h-full relative p-8 transition-colors duration-300">
          
          {/* Container Gambar */}
          <div className="relative w-full h-full max-h-[800px] rounded-[32px] overflow-hidden flex flex-col items-center justify-center shadow-2xl">
            
            {/* Gambar Background (bg_login.jpg) */}
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
              
              {/* 1. HEADER TEKS */}
              <div className="mt-1 text-center mx-auto max-w-lg">
                <h2 className="text-2xl font-semibold text-white leading-tight mb-2 drop-shadow-md">
                  Start building, managing, and scaling
                </h2>
                <p className="text-2xl text-gray-200/80 font-medium drop-shadow-md">
                  your projects with one powerful workspace.
                </p>
              </div>

              {/* 2. KONTROL (Managing Card) */}
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