import React from 'react'

const page = async ({params}: any) => {
    const id = await params.id;
  return (
    <div>{id}</div>
  )
}

export default page