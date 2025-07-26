import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import LoginGoogle from './_components/LoginGoogle'
import LoginEmail from './_components/LoginEmail'
import Link from 'next/link'


const Login = () => {

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Link href="/register" className='hover:opacity-80'>Sign Up</Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <LoginEmail />
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <LoginGoogle />
      </CardFooter>
    </Card>
  )
}

export default Login