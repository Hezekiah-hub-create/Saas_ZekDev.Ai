"use client"
    
import React, { useState } from 'react'
import CardTag from '../global/CardTag'
import AuthForm from './AuthForm'
import Socials from './Socials'

const SignIn = () => {
    const [loading, setLoading] = useState(false)
  return (
    <CardTag
        title="Sign In to your Account"
        description="Enter your details to create a new account"
        content={<AuthForm loading={loading} setLoading={setLoading} />}
        footer={<Socials loading={loading} setLoading={setLoading}/>}
    />
  )
}

export default SignIn