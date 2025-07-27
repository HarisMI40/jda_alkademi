'use client'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

const SectionButton = () => {
  const {status} = useSession()

  if(status === "unauthenticated"){
    return (
      <>
        <Button size="lg">Mulai Gratis</Button>
        <Button variant="outline" size="lg">
          <Link href={"/login"}>Masuk sebagai Guru</Link>
        </Button>
      </>
    )
  }else{
    return(
      <Button className='bg-tersier hover:bg-tersier/90'>
        <Link href="/dashboard">Pergi Ke Dashboard</Link>
      </Button>
    )
  }
}

export default SectionButton