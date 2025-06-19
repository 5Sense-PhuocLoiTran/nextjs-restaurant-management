import dishApiRequest from '@/apiRequests/dish'
import { UpdateDishBodyType } from '@/schemaValidations/dish.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetDishList = () => {
  return useQuery({
    queryKey: ['dishes-list'],
    queryFn: dishApiRequest.list,
  })
}

export const useGetDishDetail = ({
  id,
  enabled,
}: {
  id: number
  enabled: boolean
}) => {
  return useQuery({
    queryKey: ['dishes', id],
    queryFn: () => dishApiRequest.dishDetail(id),
    enabled,
  })
}

export const useAddDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dishApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes-list'],
      })
    },
  })
}

export const useUpdateDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateDishBodyType & { id: number }) =>
      dishApiRequest.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes-list'],
        exact: true,
      })
    },
  })
}

export const useDeleteDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: number }) => dishApiRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes-list'],
        exact: true,
      })
    },
  })
}
