import http from '@/lib/http'
import { AccountResType } from '@/schemaValidations/account.schema'
import {} from '@/schemaValidations/auth.schema'

const accountApiRequest = {
  me: () => http.get<AccountResType>('/accounts/me'),
}

export default accountApiRequest
