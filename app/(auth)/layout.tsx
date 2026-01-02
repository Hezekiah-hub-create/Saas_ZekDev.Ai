import { getUserSession } from '@/services/auth/storeUser'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const Authlayout = async ({children}: {children:React.ReactNode}) => {
  const user = await getUserSession()
  if (user) {
    redirect("/dashboard")
  }
  return (
      <div className='auth-layout'>
        <Link className='flex flex-col items-center gap-2 self-center  font-bold font-[Outfit]' 
        href="/">
            <Image src={"/ai_icon.png"} 
            alt="ZekDev.Ai Logo" 
            width={40} 
            height={40} 
            className="rounded-full"
            />
           Cognivox AI
        </Link>
        {children}
    </div>
  )
}

export default Authlayout