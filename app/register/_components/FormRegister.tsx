'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import axios from "axios";
import { LoaderCircle } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type FormSignUpState = {
  fullname: string
  username: string
  email: string
  password: string
}

const FormRegister = () => {
  const [form, setForm] = useState<FormSignUpState>({
    fullname: '',
    username: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const [error, setError] = useState(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true);

      const response = await axios.post("/api/auth/register", form);
      
      if (response.status !== 201) {
        throw new Error("Registration failed");
      }

      const signInResponse = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInResponse?.error) {
        console.error("Login after registration failed:", signInResponse.error);
        router.push('/login?error=LoginFailed');
        return;
      }

      router.push('/dashboard');
      router.refresh();

    } catch (error) {
      // 1. Gunakan type guard dari axios untuk memeriksa tipe error
      if (axios.isAxiosError(error)) {
        // 2. Pastikan ada respons dari server sebelum mengaksesnya
        if (error.response) {
          // Sekarang TypeScript tahu 'error.response' ada dan aman diakses
          console.log(error.response.data);
          // Set state error dengan objek 'errors' dari respons API
          setError(error.response.data.errors);
        } else {
          // Tangani kasus di mana tidak ada respons (misalnya, masalah jaringan)
          console.error("Error:", error.message);
          // Anda bisa set pesan error umum di sini jika mau
        }
      } else {
        // Tangani error yang bukan dari axios
        console.error("An unexpected error occurred:", error);
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">

        <div className="grid gap-2">
          <Label htmlFor="fullname">Full Name</Label>
          <Input
            id="fullname"
            type="text"
            placeholder="Fullname"
            required
            value={form.fullname}
            onChange={handleChange}
          />
          {error && error["fullname"] && (<div className='text-sm text-red-400'> {error["fullname"]} </div>)}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Username"
            required
            value={form.username}
            onChange={handleChange}
          />
          {error && error["username"] && (<div className='text-sm text-red-400'> {error["username"]} </div>)}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={form.email}
            onChange={handleChange}
          />
          {error && error["email"] && (<div className='text-sm text-red-400'> {error["email"]} </div>)}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
          />
          {error && error["password"] && (<div className='text-sm text-red-400'> {error["password"]} </div>)}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {!loading ? "Register" : (<div className='flex gap-3'><LoaderCircle className='animate-spin' />  Loading ...</div>)}
        </Button>
      </div>
    </form>
  )
}

export default FormRegister