import React, { ReactNode } from 'react'

const layout = ({children}: {children: ReactNode}) => {
  return (
    <div className='mx-10 mt-24'>
        {children}
    </div>
  )
}

export default layout