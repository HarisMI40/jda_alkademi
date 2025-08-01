import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const SectionUserNotLogin = () => {
  return (
    <>
      <Button variant="ghost">
        <Link href={"/login"}>Masuk</Link>
      </Button>
      <Button>Daftar</Button>
    </>
  )
}

export default SectionUserNotLogin