import tableApiRequest from '@/apiRequests/table'
import { UpdateTableBodyType } from '@/schemaValidations/table.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGettableList = () => {
  return useQuery({
    queryKey: ['table-list'],
    queryFn: tableApiRequest.list,
  })
}

export const useGetTableDetail = ({
  id,
  enabled,
}: {
  id: number
  enabled: boolean
}) => {
  return useQuery({
    queryKey: ['table', id],
    queryFn: () => tableApiRequest.tableDetail(id),
    enabled,
  })
}

export const useAddTableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tableApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['table-list'],
      })
    },
  })
}

export const useUpdateTableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateTableBodyType & { id: number }) =>
      tableApiRequest.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['table-list'],
        exact: true,
      })
    },
  })
}

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: number }) => tableApiRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['table-list'],
        exact: true,
      })
    },
  })
}
