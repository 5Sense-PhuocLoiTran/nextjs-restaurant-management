import accountApiRequest from '@/apiRequests/account'
import {
  useMutation,
  useQuery,
} from '@tanstack/react-query'

export const useAccountMe = () => {
  return useQuery({
    queryKey: ['account-me'],
    queryFn: accountApiRequest.me,
  })
}

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe,
  })
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePasswordV2,
  })
}

// import accountApiRequest from '@/apiRequests/account'
// import { AccountResType } from '@/schemaValidations/account.schema'
// import { useQuery } from '@tanstack/react-query'

// export const useAccountProfile = (
//   onSuccess?: (data: AccountResType) => void
// ) => {
//   return useQuery({
//     queryKey: ['account-profile'],
//     queryFn: () =>
//       accountApiRequest.me().then((res) => {
//         if (onSuccess) {
//           onSuccess(res.payload)
//         }
//         return res
//       }),
//   })
// }
