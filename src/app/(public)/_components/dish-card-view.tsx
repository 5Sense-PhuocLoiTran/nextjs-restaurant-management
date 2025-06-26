'use client'

import { formatCurrency } from '@/lib/utils'
import { DishSchema } from '@/schemaValidations/dish.schema'
import Image from 'next/image'
import { z } from 'zod'

type Dish = z.infer<typeof DishSchema>

type Props = {
  dish: Dish
}

const DishCardView = ({ dish }: Props) => {
  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row gap-4 h-full">
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
            <p className="mb-2">{dish.description}</p>
            <p className="text-base font-medium mt-8">
              Đơn giá:{' '}
              <span className="text-green-500 font-semibold text-2xl ml-1">
                {formatCurrency(dish.price)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DishCardView
