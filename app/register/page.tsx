import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'
import FormRegister from './_components/FormRegister'
import SignupGoogle from './_components/SignupGoogle'

const Register = () => {
  return (
   <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Create Account for enter the application
        </CardDescription>
        <CardAction>
          <Link href="/login" className='hover:opacity-80'>Login</Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FormRegister />
      </CardContent>
      <CardFooter className="flex-col gap-2">
          <SignupGoogle />
      </CardFooter>
    </Card>
  )
}

export default Register