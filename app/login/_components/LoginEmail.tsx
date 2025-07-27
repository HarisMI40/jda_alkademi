'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { LoaderCircle } from 'lucide-react'

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
    setError(null) // Hapus error sebelumnya

    try {
      const signInResponse = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false, // Penting: tangani redirect secara manual
      })

      if (signInResponse?.error) {
        // Jika ada error, tampilkan pesan yang sesuai
        setError('Email atau password salah. Silakan coba lagi.')
        return;
      }

      const callbackUrl = searchParams.get('callbackUrl');
      // Jika berhasil, arahkan ke halaman tujuan
      const redirectUrl = callbackUrl || '/dashboard';
      router.push(redirectUrl);
      router.refresh(); // Opsional: untuk memastikan sesi server terupdate

    } catch (err) {
      console.error(err)
      setError("Terjadi kesalahan yang tidak terduga. Silakan coba lagi.")
    } finally {
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