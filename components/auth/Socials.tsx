import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Socials = ({
    loading, setLoading
} : {
    loading: boolean
    setLoading: (loading: boolean) => void
}) => {
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";
  return (
    <div>
      <p className='font-semibold text-sm'>
        Don't have an account?{' '}
        <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="text-primary hover:underline">
          {isSignIn ? "Create an account" : "Sign In"}
        </Link>
      </p>
    </div>
  )
}

export default Socials