import Link from 'next/link'
import React from 'react'

const Authlayout = ({children}: {children:React.ReactNode}) => {
  return (
    <div className=''>
        <Link className='flex items-center gap-2' href="/">
            AI SaaS (powered by ZekDev.Ai)
        </Link>
        {children}
    </div>
  )
}

export default Authlayout