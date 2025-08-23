import React, { ReactNode } from 'react'

function AuthLayout({children}: {children: ReactNode}) {
  return (
    <div className='flex justify-center items-center min-h-screen'>{children}</div>
  )
}

export default AuthLayout;