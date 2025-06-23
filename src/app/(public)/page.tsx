import Image from 'next/image'
import DishListAds from './_components/dish-list-ads'

export default function Home() {
  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <span className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></span>
        <Image
          src="https://images.unsplash.com/photo-1625215739543-622ab79d1533"
          width={1920}
          height={300}
          quality={100}
          alt="Banner"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="z-20 relative py-10 md:py-28 px-4 sm:px-10 md:px-20 text-white">
          <h1 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold">
            Tiệm Ăn Nhà Nudo350
          </h1>
          <p className="text-center text-sm sm:text-base mt-4">
            Vị ngon, trọn khoảnh khắc trong từng món ăn
          </p>
        </div>
      </div>
      <DishListAds />
    </div>
  )
}
