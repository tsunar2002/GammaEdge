"use client"

import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
})

export default function LogInPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit() {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // TODO: Implement authentication logic here
  }

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-black mb-2">Log in</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" className="h-12 rounded-xl bg-gray-100 border-transparent focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="password" placeholder="Password" className="h-12 rounded-xl bg-gray-100 border-transparent focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-0" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full h-12 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
            Log in
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-semibold text-blue-600 hover:text-blue-500">
            Sign up
        </Link>
      </div>
    </AuthLayout>
  );
}
