'use client'

import { useGetDishList } from '@/queries/useDish'
import DishCardView from './dish-card-view'

export default function DishListAds() {
  const dishListQuery = useGetDishList()
  const data = dishListQuery.data?.payload.data ?? []
  return (
    <section className="space-y-10 py-16">
      <h2 className="text-center text-4xl font-bold">Đa dạng các món ăn</h2>
      <p className="text-center text-lg italic animate-pulse">
        Khám phá thực đơn phong phú với những món ăn ngon miệng. Nhanh tay quét
        QR code trên bàn để đặt món ngay nhé Khách iu ơi!
      </p>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {data.slice(0, 4).map((dish) => (
            <DishCardView key={dish.id} dish={dish} />
          ))}
        </div>
      </div>
    </section>
  )
}
