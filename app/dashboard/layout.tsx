import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex-1 w-11/12 m-auto'>
      {children}
    </div>
  )
}

export default layout