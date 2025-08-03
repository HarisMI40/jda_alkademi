'use client'
import { useSession } from 'next-auth/react'
import React from 'react'

const Page = () => {

  const {data:session} = useSession();

  return (
    <div className='container mx-auto w-8/12 bg-white p-5 rounded-lg'>
      <h1 className='text-2xl'>Selamat Datang {session?.user?.name}</h1>
    </div>
  )
}

export default Page