import http from '@/lib/http'
import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  ChangePasswordV2BodyType,
  ChangePasswordV2ResType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
} from '@/schemaValidations/account.schema'
import {} from '@/schemaValidations/auth.schema'

const prefix = '/accounts'

const accountApiRequest = {
  me: () => http.get<AccountResType>(`${prefix}/me`),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>(`${prefix}/me`, body),
  changePassword: (body: ChangePasswordBodyType) =>
    http.put<AccountResType>(`${prefix}/change-password`, body),
  sChangePasswordV2: (accessToken: string, body: ChangePasswordV2BodyType) =>
    http.put<ChangePasswordV2ResType>(`${prefix}/change-password-v2`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  changePasswordV2: (body: ChangePasswordBodyType) =>
    http.put<ChangePasswordV2ResType>(
      '/api' + `${prefix}/change-password-v2`,
      body,
      {
        baseUrl: '',
      }
    ),
  list: () => http.get<AccountListResType>(`${prefix}`),
  AddEmployee: (body: CreateEmployeeAccountBodyType) =>
    http.post<AccountResType>(`${prefix}`, body),
  updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) =>
    http.put<AccountResType>(`${prefix}/detail/${id}`, body),
  getEmployee: (id: number) =>
    http.get<AccountResType>(`${prefix}/detail/${id}`),
  deleteEmployee: (id: number) =>
    http.delete<AccountResType>(`${prefix}/detail/${id}`),
}

export default accountApiRequest
