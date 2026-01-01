import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Authlayout = ({children}: {children:React.ReactNode}) => {
  return (
      <div className='auth-layout'>
        <Link className='flex flex-col items-center gap-2 self-center  font-bold' 
        href="/">
            <Image src={"/ai_icon.png"} 
            alt="ZekDev.Ai Logo" 
            width={40} 
            height={40} 
            className="rounded-full"
            />
           ZekDev AI POWERED SaaS PLATFORM
        </Link>
        {children}
    </div>
  )
}

export default Authlayout