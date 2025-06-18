'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField } from '@/components/ui/form'
import {
  ChangePasswordBody,
  ChangePasswordBodyType,
} from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useChangePasswordMutation } from '@/queries/useAccount'
import {
  handleErrorApi,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from '@/lib/utils'
import { toast } from 'sonner'
import PasswordInputField from './_components/passwor-input-field'

export default function ChangePasswordForm() {
  const changePasswordMutation = useChangePasswordMutation()

  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ChangePasswordBodyType) => {
    if (changePasswordMutation.isPending) return

    try {
      const result = await changePasswordMutation.mutateAsync(data)

      setAccessTokenToLocalStorage(result.payload.data.accessToken)
      setRefreshTokenToLocalStorage(result.payload.data.refreshToken)

      toast.success(result.payload.message || 'Đổi mật khẩu thành công')
      form.reset()
    } catch (error) {
      console.error('Error in change password:', error)
      handleErrorApi({
        error,
        setError: form.setError,
      })
    }
  }

  const resetForm = () => {
    form.reset()
  }

  return (
    <Form {...form}>
      <form
        noValidate
        className="grid auto-rows-max items-start gap-4 md:gap-8"
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={resetForm}
      >
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <PasswordInputField
                    id="oldPassword"
                    label="Mật khẩu cũ"
                    field={field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <PasswordInputField
                    id="password"
                    label="Mật khẩu mới"
                    field={field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <PasswordInputField
                    id="confirmPassword"
                    label="Nhập lại mật khẩu mới"
                    field={field}
                  />
                )}
              />

              <div className="flex items-center gap-2 md:ml-auto">
                <Button variant="outline" size="sm" type="reset">
                  Hủy
                </Button>
                <Button size="sm" disabled={changePasswordMutation.isPending}>
                  {changePasswordMutation.isPending
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
