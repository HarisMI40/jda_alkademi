'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { LoaderCircle } from 'lucide-react'
import { BProgress } from '@bprogress/core';

const LoginEmail = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const signInResponse = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (signInResponse?.error) {
        setError('Email atau password salah. Silakan coba lagi.')
        setLoading(false);
        return;
      }

      // 2. Mulai NProgress secara manual
      BProgress.start();

      // Refresh router untuk sinkronisasi sesi
      router.refresh();

      // Dapatkan callbackUrl atau gunakan default
      const callbackUrl = searchParams.get('callbackUrl');
      const redirectUrl = callbackUrl || '/dashboard';
      
      // Lakukan push
      router.push(redirectUrl);

    } catch (err) {
      console.error(err)
      setError("Terjadi kesalahan yang tidak terduga. Silakan coba lagi.")
      BProgress.done(); // Pastikan nprogress berhenti jika ada error tak terduga
    } finally {
      // Tidak perlu NProgress.done() di sini, karena event routeChangeComplete
      // dari router.push() akan menanganinya secara otomatis.
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        {/* Tampilkan alert jika ada error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <LoaderCircle className="animate-spin" /> : 'Login'}
        </Button>
      </div>
    </form>
  )
}

export default LoginEmail