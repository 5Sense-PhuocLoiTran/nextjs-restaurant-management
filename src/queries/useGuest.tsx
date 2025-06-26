import guestApiRequests from '@/apiRequests/guest'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequests.login,
  })
}

export const useGuestLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequests.logout,
  })
}

export const useGuestCreateOrderMutation = () => {
  return useMutation({
    mutationFn: guestApiRequests.order,
  })
}

export const useGuestGetOrderListQuery = () => {
  return useQuery({
    queryFn: guestApiRequests.getOrderList,
    queryKey: ['guest-order-list'],
  })
}
