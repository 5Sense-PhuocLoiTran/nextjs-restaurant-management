'use client'

import { useGetDishList } from '@/queries/useDish'
import DishAddToCart from './dish-add-to-cart'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import { formatCurrency } from '@/lib/utils'

export default function DishListAds() {
  const dishListQuery = useGetDishList()
  const dishes = dishListQuery.data?.payload.data ?? []

  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])
  const handleQuantityChange = (dishId: number, quantity: number) => {
    console.log('handleQuantityChange', dishId, quantity)
    setOrders((prevOrders) => {
      if (quantity <= 0) {
        return prevOrders.filter((order) => order.dishId !== dishId)
      }
      const index = prevOrders.findIndex((order) => order.dishId === dishId)
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }]
      }
      const updatedOrders = [...prevOrders]
      updatedOrders[index] = { ...updatedOrders[index], quantity }
      return updatedOrders
    })
  }

  const totalPrice = dishes.reduce((result, dish) => {
    const order = orders.find((o) => o.dishId === dish.id)
    return result + (order?.quantity || 0) * dish.price
  }, 0)

  return (
    <section className="space-y-10 py-16">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {dishes
            .filter((dish) => dish.status !== 'Hidden')
            .map((dish) => (
              <DishAddToCart
                key={dish.id}
                dish={dish}
                onChange={(value) => handleQuantityChange(dish.id, value)}
                value={orders.find((o) => o.dishId === dish.id)?.quantity || 0}
              />
            ))}
        </div>
      </div>
      <div className="mx-auto text-center mt-10">
        {dishes.length === 0 ? (
          <p className="text-lg text-gray-500">
            Không có món ăn nào để order. Vui lòng quay lại sau.
          </p>
        ) : (
          <Button className="w-full max-w-[600px] mt-4 bg-green-600 text-white hover:bg-green-700 transition-colors">
            Giỏ hàng
            {orders.length > 0 && (
              <>
                <span className="text-sm">{orders.length} món:</span>
                {totalPrice > 0 && (
                  <span className="text-sm font-bold text-yellow-300 animate-pulse">
                    {formatCurrency(totalPrice)}
                  </span>
                )}
              </>
            )}
          </Button>
        )}
      </div>
    </section>
  )
}
