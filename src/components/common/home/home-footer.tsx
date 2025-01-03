'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast'
import SectionWrapper from '@/components/wrapper/section-wrapper'
import Image from 'next/image'

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type NewsletterFormValues = z.infer<typeof newsletterSchema>

export function HomeFooter() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(data: NewsletterFormValues) {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    console.log(data)
    toast({
      title: "Subscribed!",
      description: "You've successfully signed up for our newsletter.",
    })
    form.reset()
  }

  return (
    <div id='' className='h-16 px-4 md:px-12 lg:px-16 flex items-center'>
        <div className="w-full flex items-center justify-center">
            <div className="flex border-muted-foreground/20 text-center text-muted-foreground">
              <p className='text-sm'>&copy; {new Date().getFullYear()} MangoCare. All rights reserved.</p>
            </div>
        </div>
    </div>
  )
}