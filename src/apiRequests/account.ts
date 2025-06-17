import http from '@/lib/http'
import {
  AccountResType,
  ChangePasswordBodyType,
  UpdateMeBodyType,
} from '@/schemaValidations/account.schema'
import {} from '@/schemaValidations/auth.schema'

const accountApiRequest = {
  me: () => http.get<AccountResType>('/accounts/me'),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>('/accounts/me', body),
  changePassword: (body: ChangePasswordBodyType) =>
    http.put<AccountResType>(
      '/accounts/change-password',
      body
    ),
}

export default accountApiRequest
