import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'
import { BProgress } from '@bprogress/core';

interface user {
  email?: string | null | undefined,
  image?: string | null | undefined,
  name?: string | null | undefined
}

const SectionUserLogged = ({ user }: { user: user }) => {

  const HandleLogout = async () => {
     // Mulai progress bar terlebih dahulu
    BProgress.start();
    
    // Kemudian panggil signOut.
    signOut(); 
  }


  return (
    <>
      <Popover>
        <PopoverTrigger>
          <div className='flex gap-2 items-center hover:cursor-pointer hover:bg-slate-200/70 py-2 px-4 rounded'>
            {user.image && (
              <Image
                src={user.image}
                width={20} // Gunakan ukuran yang lebih sesuai untuk avatar
                height={20}
                alt={user.name || 'User avatar'} // Alt text yang lebih baik
                className='rounded-full h-auto w-auto'
              />
            )}
            {user.name}
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-max hover:cursor-pointer hover:bg-slate-200 px-10' align="end">
          <button className='text-red-500 hover:cursor-pointer flex gap-3' onClick={HandleLogout}><LogOut />  Logout</button>
        </PopoverContent>
      </Popover>
    </>
  )
}

export default SectionUserLogged