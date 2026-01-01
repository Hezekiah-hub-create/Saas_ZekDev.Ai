import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { usePathname, useRouter } from 'next/navigation';
// import {
//     createUserWithEmailAndPassword,
//     signInWithEmailAndPassword,
// } from "firebase/auth";
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { title } from 'process';
import { Input } from '../ui/input';
import { Eye, EyeOff } from "lucide-react";

const AuthForm = ({
    loading, setLoading
} : {
    loading: boolean
    setLoading: (loading: boolean) => void
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const isSignUp = pathname === "/sign-up";


  const formSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(8, {message: "Password must be at least 8 characters"}),
    confirmPassword: isSignUp 
    ? z.string().min(8, {message: "Password must be at least 8 characters"}) : z.string().optional(),
  })
  .superRefine((date, ctx) => {
    if (isSignUp && date.password !== date.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
})

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
       <FieldGroup className='gap-4'>
        <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-email">
                    Email Address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your email address"
                    disabled={loading}
                    type='email'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            /><Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your password"
                    disabled={loading}
                    type='password'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {isSignUp && (
              <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-confirm-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Confirm your password"
                    disabled={loading}
                    type='password'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />)}
             <Button type="submit" disabled={loading} >
              {isSignUp ? " Create Account" : "Login to your Account"}
            </Button>
       </FieldGroup>
    </form>
  )
}

export default AuthForm