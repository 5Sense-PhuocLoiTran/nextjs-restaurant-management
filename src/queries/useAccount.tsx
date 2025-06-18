import accountApiRequest from '@/apiRequests/account'
import { UpdateEmployeeAccountBodyType } from '@/schemaValidations/account.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

export const useGetAccountList = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: accountApiRequest.list,
  })
}

export const useGetAccount = ({
  id,
  enabled,
}: {
  id: number
  enabled: boolean
}) => {
  return useQuery({
    queryKey: ['account', id],
    queryFn: () => accountApiRequest.getEmployee(id),
    enabled,
  })
}

export const useAddAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.AddEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['accounts'],
      })
    },
  })
}

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: UpdateEmployeeAccountBodyType & { id: number }) =>
      accountApiRequest.updateEmployee(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['accounts'],
        exact: true,
      })
    },
  })
}

export const useDeleteAccountMutation = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => accountApiRequest.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['account', id],
      })
      queryClient.invalidateQueries({
        queryKey: ['accounts'],
      })
    },
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
