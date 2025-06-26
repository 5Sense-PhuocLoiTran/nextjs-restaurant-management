'use client'

import { useGetDishList } from '@/queries/useDish'
import DishAddToCart from './dish-add-to-cart'
import { Button } from '@/components/ui/button'

export default function DishListAds() {
  const dishListQuery = useGetDishList()
  const data = dishListQuery.data?.payload.data ?? []
  return (
    <section className="space-y-10 py-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {data.map((dish) => (
            <DishAddToCart key={dish.id} dish={dish} />
          ))}
        </div>
      </div>
      <div className="mx-auto text-center mt-10">
        <Button className="w-full max-w-[600px] mt-4 bg-green-600 text-white hover:bg-green-700 transition-colors">
          Thêm vào giỏ hàng
        </Button>
      </div>
    </section>
  )
}
