import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React from 'react'

const LinkAdmin = ({ role }: { role: string | undefined }) => {
  const pathName = usePathname();

  if (role === "admin") {
    return (
      <ul className='flex gap-5 font-semibold'>
        <li className={`hover:text-blue-300 active:text-blue-300/80 ${pathName === '/admin' ? 'text-blue-500' : ''}`}> <Link href="/admin"> Home </Link></li>
        <li className={`hover:text-blue-300 active:text-blue-300/80 ${pathName === '/admin/kuis' ? 'text-blue-500' : ''}`}> <Link href="/admin/kuis"> Kuis </Link></li>
        <li className={`hover:text-blue-300 active:text-blue-300/80 ${pathName === '/admin/tag' ? 'text-blue-500' : ''}`}> <Link href="/admin/tag"> Tag </Link></li>
      </ul>
    )
  }
}

export default LinkAdmin