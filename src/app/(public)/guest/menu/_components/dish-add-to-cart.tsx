'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DishStatus } from '@/constants/type'
import { formatCurrency, getVietnameseDishStatusOrder } from '@/lib/utils'
import { DishSchema } from '@/schemaValidations/dish.schema'
import { Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

type Dish = z.infer<typeof DishSchema>

type Props = {
  dish: Dish
  onChange: (quantity: number) => void
  value: number
}

const DishAddToCart = ({ dish, onChange, value }: Props) => {
  const [quantity, setQuantity] = useState(value)

  const increment = () => {
    setQuantity((prev) => prev + 1)
    toast.success('Đã thêm món vào giỏ hàng', {
      description: `Bạn đã thêm ${quantity + 1} ${dish.name} vào giỏ hàng.`,
    })
  }
  const decrement = () => {
    setQuantity((prev) => prev - 1)
    toast.warning('Đã giảm món trong giỏ hàng', {
      description: `Bạn đã giảm ${quantity - 1} ${dish.name} trong giỏ hàng.`,
    })
  }

  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row gap-4 h-full">
        <div className="flex-shrink-0 w-full md:w-1/3 aspect-[4/3] relative rounded overflow-hidden">
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover rounded"
          />
          {dish.status === DishStatus.Unavailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                {getVietnameseDishStatusOrder(dish.status)}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between flex-1 p-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">{dish.name}</h2>
            <p className="text-sm line-clamp-1">{dish.description}</p>
            <div className="mt-2 flex items-center gap-3">
              <p className="text-base font-medium text-zinc-700">
                <span className="text-yellow-500 font-semibold text-2xl">
                  {formatCurrency(dish.price)}
                </span>
              </p>
              {/* {dish.status && (
                <>
                  {dish.status === DishStatus.Unavailable ? (
                    <div className="px-3 py-1 bg-red-200 text-red-800 text-xs font-semibold rounded-full w-fit">
                      {getVietnameseDishStatusOrder(dish.status)}
                    </div>
                  ) : dish.status === DishStatus.Available ? (
                    <div className="px-3 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded-full w-fit">
                      {getVietnameseDishStatusOrder(dish.status)}
                    </div>
                  ) : null}
                </>
              )} */}
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-between w-full">
                <Button
                  type="button"
                  size="icon"
                  onClick={() => {
                    decrement()
                    onChange(value - 1)
                  }}
                  disabled={
                    quantity === 0 || dish.status === DishStatus.Unavailable
                  }
                  className="bg-green-100 !text-green-600 hover:bg-green-200 transition-colors rounded-full"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="text"
                  min={1}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={quantity}
                  disabled={dish.status === DishStatus.Unavailable}
                  onChange={(e) => {
                    const eValue = e.target.value
                    const numberValue = Number(eValue)
                    console.log('onChange', 1)

                    if (isNaN(numberValue) || numberValue < 1) return
                    console.log('onChange', 2)
                    setQuantity(numberValue)
                    onChange(numberValue)
                  }}
                  className="w-18 text-center"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={() => {
                    increment()
                    onChange(value + 1)
                  }}
                  disabled={dish.status === DishStatus.Unavailable}
                  variant="outline"
                  className="bg-green-600 !text-white hover:bg-green-700 transition-colors rounded-full"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DishAddToCart
