import http from '@/lib/http'
import { UpdateOrderBodyType } from '@/schemaValidations/order.schema'

const orderApiRequests = {
  getOrderList: () => http.get('orders'),
  updateOrder: (orderId: number, body: UpdateOrderBodyType) =>
    http.put<UpdateOrderBodyType>(`orders/${orderId}`, body),
}

export default orderApiRequests
