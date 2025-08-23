import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Logo({className = ""}: {className?: String}) {
  return (
    <Link href={"/"}>
        <Image src={"/logo.png"} alt='Logo' width={200} height={60} className={`${className} h-12 w-auto py-1 object-contain`} />
    </Link>
  )
}

export default Logo