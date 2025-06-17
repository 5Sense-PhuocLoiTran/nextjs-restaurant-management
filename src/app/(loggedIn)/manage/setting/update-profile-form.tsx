'use client'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { handleErrorApi } from '@/lib/utils'
import {
  useAccountMe,
  useUpdateMeMutation,
} from '@/queries/useAccount'
import { useUploadMediaMutation } from '@/queries/useMedia'
import {
  UpdateMeBody,
  UpdateMeBodyType,
} from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function UpdateProfileForm() {
  const [avatarFile, setAvatarFile] = useState<File | null>(
    null
  )
  const avatarInputRef =
    React.useRef<HTMLInputElement>(null)

  const { data, refetch } = useAccountMe()

  const updateMeMutation = useUpdateMeMutation()
  const uploadMediaMutation = useUploadMediaMutation()

  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: '',
      avatar: '',
    },
  })

  const resetForm = () => {
    form.reset()
    setAvatarFile(null)
  }

  const onSubmit = async (values: UpdateMeBodyType) => {
    let body = values
    try {
      if (avatarFile) {
        const formData = new FormData()
        formData.append('file', avatarFile)
        const uploadAvatarResult =
          await uploadMediaMutation.mutateAsync(formData)
        const imageUploadUrl =
          uploadAvatarResult.payload.data
        body = {
          ...values,
          avatar: imageUploadUrl,
        }
      }

      const result = await updateMeMutation.mutateAsync(
        body
      )

      if (result) {
        toast.success(
          result.payload.message || 'Cập nhật thành công'
        )
      }

      refetch() // update the user avatar in dropdown menu
    } catch (error) {
      handleErrorApi({ error, setError: form.setError })
    }
  }

  useEffect(() => {
    if (data) {
      const { name, avatar } = data.payload.data
      form.reset({
        name,
        avatar: avatar || '',
      })
    }
  }, [data, form])

  const name = form.watch('name')
  const avatar = form.watch('avatar')
  const previewAvatar = avatarFile
    ? URL.createObjectURL(avatarFile)
    : avatar || ''

  return (
    <Form {...form}>
      <form
        noValidate
        className="grid auto-rows-max items-start gap-4 md:gap-8"
        onReset={resetForm}
        onSubmit={form.handleSubmit(onSubmit, (e) => {
          console.log(e)
        })}
      >
        <Card x-chunk="dashboard-07-chunk-0">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatar} />
                        <AvatarFallback className="rounded-none">
                          {name
                            ? name.charAt(0).toUpperCase()
                            : 'Avatar'}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setAvatarFile(file)
                            field.onChange(
                              'http://localhost:3000/ ' +
                                field.name
                            ) // Set a dummy value to trigger form validation zod shema
                          }
                        }}
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() =>
                          avatarInputRef.current?.click()
                        }
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">
                          Upload
                        </span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="name">Tên</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className=" items-center gap-2 md:ml-auto flex">
                <Button
                  variant="outline"
                  size="sm"
                  type="reset"
                >
                  Hủy
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  disabled={updateMeMutation.isPending}
                >
                  {updateMeMutation.isPending
                    ? 'Đang cập nhật...'
                    : 'Lưu thông tin'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
