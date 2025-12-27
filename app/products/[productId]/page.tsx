import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ProductDetailClient } from "./product-detail-client"
import Link from "next/link"

// Force dynamic rendering - fetch fresh data on every request
export const dynamic = 'force-dynamic'

// Direct Prisma call for server components (better performance)
import { prisma } from '@/lib/prisma'

interface ProductDetail {
  id: number
  name: string
  price: string
  originalPrice?: string
  image: string
  images?: string[]
  description: string
  fullDescription: string
  category: string
  type: "ladies" | "gents"
  inStock: boolean
  stockQuantity?: number
  specifications: {
    material: string
    width: string
    weight?: string
    care: string
    origin?: string
  }
  colors?: string[]
  sizes?: string[]
  features: string[]
  rating?: number
  reviews?: number
}

async function getProductDetail(productId: string): Promise<ProductDetail | null> {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: parseInt(productId),
        active: true,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!product) {
      return null
    }

    // Format the response to match frontend expectations
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || undefined,
      image: product.image,
      images: product.images || [],
      description: product.description,
      fullDescription: product.fullDescription || product.description,
      category: product.category.name,
      type: product.type as "ladies" | "gents",
      inStock: product.inStock,
      stockQuantity: product.stockQuantity || undefined,
      specifications: {
        material: product.material || '',
        width: product.width || '',
        weight: product.weight || undefined,
        care: product.care || '',
        origin: product.origin || undefined,
      },
      colors: product.colors || [],
      sizes: product.sizes || [],
      features: product.features || [],
      rating: product.rating || undefined,
      reviews: product.reviews || undefined,
    }
  } catch (error) {
    console.error('Error fetching product detail:', error)
    return null
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params

  // Fetch product detail from database
  const product = await getProductDetail(productId)

  if (!product) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <Link href="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return <ProductDetailClient product={product} />
}

