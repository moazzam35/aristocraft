export type Product = {
  id: string
  title: string
  brand: string
  description: string
  price: number
  salePrice: number | null
  discountPercentage: number
  rating: number
  reviewCount: number
  category: string
  color?: string
  imageUrl: string
  thumbnail: string
  stock: number
  details: string | null
  material: string | null
  dimensions: string | null
  weight: number | null
  images: string[]
  colors: { name: string; hex: string | null }[]
  isFeatured: boolean
  isNewArrival: boolean
  isBestSeller: boolean
  isOnSale: boolean
  isActive: boolean
  slug: string
}

export type ProductsResponse = {
  products: Product[]
}
