'use client'

import { useGetDishList } from '@/queries/useDish'
import DishCard from './dish-card'

export default function DishListAds() {
  const dishListQuery = useGetDishList()
  const data = dishListQuery.data?.payload.data ?? []
  return (
    <section className="space-y-10 py-16">
      <h2 className="text-center text-4xl font-bold">Đa dạng các món ăn</h2>
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {data.slice(0, 4).map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      </div>
    </section>
  )
}
