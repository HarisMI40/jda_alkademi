import React from 'react'

const layout = ({children} : {children : React.ReactNode}) => {
  return (
    <div className='h-screen flex justify-center items-center'>
      <div className='p-8 shadow-xl bg-white min-h-11/12 rounded-lg w-6/12'>
        {children}
      </div>
    </div>
  )
}

export default layout