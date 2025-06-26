'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import { DishSchema } from '@/schemaValidations/dish.schema'
import { Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { z } from 'zod'

type Dish = z.infer<typeof DishSchema>

type Props = {
  dish: Dish
}

const DishAddToCart = ({ dish }: Props) => {
  const [quantity, setQuantity] = useState(1)

  const increment = () => setQuantity((prev) => prev + 1)
  const decrement = () => setQuantity((prev) => Math.max(1, prev - 1))

  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row gap-4 h-full">
        <div className="flex-shrink-0 w-full md:w-1/2 aspect-[4/3] relative rounded overflow-hidden">
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover rounded"
          />
        </div>
        <div className="flex flex-col justify-between flex-1 p-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">{dish.name}</h2>
            <p className="text-sm">{dish.description}</p>
            <p className="text-base font-medium text-zinc-700">
              <span className="text-yellow-500 font-semibold text-xl">
                {formatCurrency(dish.price)}
              </span>
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-between w-full">
                <Button
                  type="button"
                  size="icon"
                  onClick={decrement}
                  className="bg-green-100 !text-green-600 hover:bg-green-200 transition-colors rounded-full"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  id={`quantity-${dish.id}`}
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value)))
                  }
                  className="w-16 text-center"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={increment}
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
