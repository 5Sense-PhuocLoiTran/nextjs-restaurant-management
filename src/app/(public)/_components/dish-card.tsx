'use client'

import { formatCurrency } from '@/lib/utils'
import { DishSchema } from '@/schemaValidations/dish.schema'
import Image from 'next/image'
import { useState } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner' // dùng sonner để hiển thị thông báo
import { PlusCircle } from 'lucide-react'

type Dish = z.infer<typeof DishSchema>

type Props = {
  dish: Dish
}

const DishCard = ({ dish }: Props) => {
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    const total = dish.price * quantity
    toast.success(
      `Đã thêm ${quantity} x ${dish.name} (${formatCurrency(total)})`
    )
  }

  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Ảnh bên trái */}
        <div className="flex-shrink-0 w-full md:w-1/2 aspect-[4/3] relative rounded overflow-hidden">
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover rounded"
          />
        </div>

        {/* Nội dung bên phải */}
        <div className="flex flex-col justify-between flex-1 p-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">{dish.name}</h2>
            <p className="text-gray-600 mb-2">{dish.description}</p>
            <p className="text-base font-medium text-zinc-700">
              Đơn giá:{' '}
              <span className="text-yellow-600 font-semibold">
                {formatCurrency(dish.price)}
              </span>
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label
                htmlFor={`quantity-${dish.id}`}
                className="text-sm font-medium"
              >
                Số lượng:
              </label>
              <Input
                id={`quantity-${dish.id}`}
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                className="w-20"
              />
            </div>
            <div className="text-green-600 text-lg font-bold">
              Tổng: {formatCurrency(dish.price * quantity)}
            </div>
            <Button
              onClick={handleAddToCart}
              className="w-fit flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <span>Đặt món</span>
              <PlusCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DishCard
