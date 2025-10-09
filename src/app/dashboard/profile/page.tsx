"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Sidebar, Header } from "@/app/dashboard/components"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Camera } from "lucide-react"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [country, setCountry] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
      setEmail(session.user.email || "")
      setCompany((session.user as any).company || "")
      setJobTitle((session.user as any).jobTitle || "")
      setCountry((session.user as any).country || "")
      setProfileImage(session.user.image || null)
    }
  }, [session])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, company, jobTitle, country }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || "Gagal mengupdate profil" })
      } else {
        setMessage({ type: 'success', text: "Profil berhasil diupdate" })
        await update()
      }
    } catch (error) {
      setMessage({ type: 'error', text: "Terjadi kesalahan saat mengupdate profil" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: "Password baru tidak cocok" })
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: "Password minimal 6 karakter" })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || "Gagal mengubah password" })
      } else {
        setMessage({ type: 'success', text: "Password berhasil diubah" })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      }
    } catch (error) {
      setMessage({ type: 'error', text: "Terjadi kesalahan saat mengubah password" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (4MB)
    if (file.size > 4 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size exceeds 4MB limit' })
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Please upload JPG, PNG, GIF, or WebP image' })
      return
    }

    setIsUploadingImage(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/user/upload-image', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to upload image' })
      } else {
        setMessage({ type: 'success', text: 'Profile image updated successfully' })
        // Add timestamp to force browser to reload image
        const imageUrlWithCache = `${data.imageUrl}?t=${Date.now()}`
        setProfileImage(imageUrlWithCache)
        await update()
        // Force session refresh
        router.refresh()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image' })
    } finally {
      setIsUploadingImage(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-slate-950">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
              <p className="text-gray-600 dark:text-slate-400 mt-1">Manage your account settings and preferences</p>
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}>
                {message.text}
              </div>
            )}

            {/* Profile Information */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Profile Information</CardTitle>
                <CardDescription className="dark:text-slate-400">Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profileImage || session?.user?.image || ""} alt={name} />
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xl font-semibold">
                      {getInitials(name || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      type="file"
                      id="profile-image"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                    />
                    <label htmlFor="profile-image">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2 border rounded-full text-white dark:text-slate-300"
                        disabled={isUploadingImage}
                        onClick={() => document.getElementById('profile-image')?.click()}
                      >
                        <Camera className="h-4 w-4" />
                        <span className="text-white dark:text-slate-300">{isUploadingImage ? 'Uploading...' : 'Change Photo'}</span>
                      </Button>
                    </label>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">JPG, GIF, PNG or WebP. Max size 4MB</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium flex items-center space-x-2 text-white dark:text-slate-300">
                      <User className="h-4 w-4" />
                      <span>Full Name</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      placeholder="Your name"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium flex items-center space-x-2 text-gray-700 dark:text-slate-300">
                      <Mail className="h-4 w-4" />
                      <span>Email Address</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      placeholder="your@email.com"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      Company
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      placeholder="Your company"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="jobTitle" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      Job Title
                    </label>
                    <input
                      id="jobTitle"
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      placeholder="Your job title"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="country" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      Country
                    </label>
                    <select
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 appearance-none"
                      disabled={isLoading}
                    >
                      <option value="">Select your country</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Thailand">Thailand</option>
                      <option value="Philippines">Philippines</option>
                      <option value="Vietnam">Vietnam</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Change Password</CardTitle>
                <CardDescription className="dark:text-slate-400">Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      disabled={isLoading}
                    >
                      {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
