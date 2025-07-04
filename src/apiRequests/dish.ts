import http from '@/lib/http'
import {} from '@/schemaValidations/auth.schema'
import {
  CreateDishBodyType,
  DishListResType,
  DishResType,
  UpdateDishBodyType,
} from '@/schemaValidations/dish.schema'

const prefix = '/dishes'

const dishApiRequest = {
  list: () =>
    http.get<DishListResType>(`${prefix}`, { next: { tags: ['dishes'] } }),
  add: (body: CreateDishBodyType) => http.post<DishResType>(`${prefix}`, body),
  dishDetail: (id: number) => http.get<DishResType>(`${prefix}/${id}`),
  update: (id: number, body: UpdateDishBodyType) =>
    http.put<DishResType>(`${prefix}/${id}`, body),
  delete: (id: number) => http.delete<DishResType>(`${prefix}/${id}`),
}

export default dishApiRequest
