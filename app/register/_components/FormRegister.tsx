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

    } catch (error:any) {
      console.log(error.response.data);
      setError(error.response.data.errors);
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* {error > 0 && (
        <div className="mb-4 rounded bg-red-100 border border-red-400 text-red-700 px-4 py-3">
            <h1>ERROR</h1>
          <ul className="list-disc pl-5">
            {error.map((errMsg, idx) => (
              <li key={idx}>{errMsg[0]}</li>
            ))}
          </ul>
        </div>
      )} */}

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