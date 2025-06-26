import MenuOrder from './_components/menu-order'

export default async function MenuPage() {
  return (
    <div className="mx-auto space-y-4 w-full">
      <h2 className="text-center text-4xl font-bold animate-pulse">
        🍕 Menu - Tiệm Ăn Nhà Nudo350
      </h2>
      <MenuOrder />
    </div>
  )
}
