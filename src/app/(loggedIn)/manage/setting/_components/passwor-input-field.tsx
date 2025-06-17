/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface PasswordInputFieldProps {
  id: string
  label: string
  field: any
}

export default function PasswordInputField({
  id,
  label,
  field,
}: PasswordInputFieldProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <FormItem>
      <div className="grid gap-3 relative">
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          type={isVisible ? 'text' : 'password'}
          className="w-full pr-10"
          {...field}
        />
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          tabIndex={-1}
        >
          {isVisible ? (
            <EyeOff
              size={18}
              className="text-white hover:text-yellow-400"
            />
          ) : (
            <Eye
              size={18}
              className="text-white hover:text-yellow-400"
            />
          )}
        </button>
        <FormMessage />
      </div>
    </FormItem>
  )
}
