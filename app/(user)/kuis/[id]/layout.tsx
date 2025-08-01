import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex-1 flex justify-center items-center'>
      {children}
    </div>
  )
}

export default layout