import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import Link from "next/link"

// Force dynamic rendering - fetch fresh data on every request
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'

async function getProducts(type: string, categoryId: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: parseInt(categoryId),
        type: type,
        active: true,
      },
      orderBy: {
        id: 'asc',
      },
    })

    // Format the response to match frontend expectations
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      inStock: product.inStock,
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function ProductsPage({ params }: { params: Promise<{ type: string; categoryId: string }> }) {
  const { type, categoryId } = await params
  const normalizedType = type.toLowerCase()
  const categoryIdNum = parseInt(categoryId)

  // Validate type
  if (normalizedType !== "ladies" && normalizedType !== "gents") {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
          <Link href="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  // Fetch products from API
  const products = await getProducts(normalizedType, categoryId)
  
  // Get category name from database
  let categoryName = "Category"
  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryIdNum },
      select: { name: true },
    })
    if (category) {
      categoryName = category.name
    }
  } catch (error) {
    console.error('Error fetching category name:', error)
  }

  if (products.length === 0) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">No Products Found</h1>
          <Link href={`/categories/${normalizedType}`}>
            <Button>Back to Categories</Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      <section className="pt-20 pb-20 md:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Back Button */}
          <Link href={`/categories/${normalizedType}`}>
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          </Link>

          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
              {categoryName} Collection
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
              Explore our premium collection of {categoryName.toLowerCase()} fabrics
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="block">
                <Card className="group overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
                  <div className="aspect-[3/4] overflow-hidden bg-muted">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-primary">{product.price}</span>
                      {product.inStock ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">In Stock</span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Out of Stock</span>
                      )}
                    </div>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

