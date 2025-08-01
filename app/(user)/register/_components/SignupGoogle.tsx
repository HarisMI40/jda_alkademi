'use client'

import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import React from 'react'

const SignupGoogle = () => {
  return (
    <Button variant="outline" className="w-full" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
      SignUp with Google
    </Button>
  )
}

export default SignupGoogle