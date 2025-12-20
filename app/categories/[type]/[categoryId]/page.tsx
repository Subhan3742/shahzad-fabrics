import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import Link from "next/link"

// Generate static params for static export
export function generateStaticParams() {
  const params = []
  // Generate params for ladies categories (1-6)
  for (let i = 1; i <= 6; i++) {
    params.push({ type: "ladies", categoryId: i.toString() })
  }
  // Generate params for gents categories (1-6)
  for (let i = 1; i <= 6; i++) {
    params.push({ type: "gents", categoryId: i.toString() })
  }
  return params
}

// ============================================
// DUMMY PRODUCT DATA - REPLACE WITH API CALL
// ============================================
// To integrate with API:
// 1. Remove the productsData object below
// 2. Uncomment and use the getProducts function
// 3. Make the component async and await getProducts(type, categoryId)
// Example:
//   export default async function ProductsPage({ params }: { params: Promise<{ type: string, categoryId: string }> }) {
//     const { type, categoryId } = await params
//     const products = await getProducts(type, categoryId)
//     ...
//   }
// ============================================

const productsData: Record<string, Record<number, Array<{
  id: number
  name: string
  price: string
  image: string
  description: string
  inStock: boolean
}>>> = {
  ladies: {
    1: [ // Lawn
      { id: 1, name: "Floral Printed Lawn", price: "PKR 1,200/meter", image: "/premium-lawn-fabric-floral-pattern.jpg", description: "Beautiful floral printed lawn fabric", inStock: true },
      { id: 2, name: "Embroidered Lawn", price: "PKR 1,500/meter", image: "/premium-lawn-fabric-floral-pattern.jpg", description: "Elegant embroidered lawn with intricate designs", inStock: true },
      { id: 3, name: "Plain Lawn", price: "PKR 900/meter", image: "/premium-lawn-fabric-floral-pattern.jpg", description: "Classic plain lawn in various colors", inStock: true },
      { id: 4, name: "Digital Print Lawn", price: "PKR 1,350/meter", image: "/premium-lawn-fabric-floral-pattern.jpg", description: "Modern digital print lawn fabric", inStock: true },
      { id: 5, name: "Organza Lawn", price: "PKR 1,600/meter", image: "/premium-lawn-fabric-floral-pattern.jpg", description: "Premium organza lawn with sheen", inStock: true },
      { id: 6, name: "Chiffon Lawn", price: "PKR 1,400/meter", image: "/premium-lawn-fabric-floral-pattern.jpg", description: "Lightweight chiffon lawn blend", inStock: true },
    ],
    2: [ // Chiffon
      { id: 7, name: "Plain Chiffon", price: "PKR 1,800/meter", image: "/luxury-silk-fabric-elegant-texture.jpg", description: "Elegant plain chiffon in multiple colors", inStock: true },
      { id: 8, name: "Printed Chiffon", price: "PKR 2,000/meter", image: "/luxury-silk-fabric-elegant-texture.jpg", description: "Beautiful printed chiffon fabric", inStock: true },
      { id: 9, name: "Embroidered Chiffon", price: "PKR 2,500/meter", image: "/luxury-silk-fabric-elegant-texture.jpg", description: "Luxurious embroidered chiffon", inStock: true },
      { id: 10, name: "Georgette Chiffon", price: "PKR 2,200/meter", image: "/luxury-silk-fabric-elegant-texture.jpg", description: "Premium georgette chiffon blend", inStock: true },
    ],
    3: [ // Silk
      { id: 11, name: "Pure Silk", price: "PKR 3,500/meter", image: "/luxury-silk-fabric-elegant-texture.jpg", description: "100% pure silk fabric", inStock: true },
      { id: 12, name: "Silk Blend", price: "PKR 2,800/meter", image: "/luxury-silk-fabric-elegant-texture.jpg", description: "Premium silk blend fabric", inStock: true },
      { id: 13, name: "Embroidered Silk", price: "PKR 4,500/meter", image: "/luxury-silk-fabric-elegant-texture.jpg", description: "Luxurious embroidered silk", inStock: true },
      { id: 14, name: "Raw Silk", price: "PKR 3,000/meter", image: "/luxury-silk-fabric-elegant-texture.jpg", description: "Natural raw silk texture", inStock: true },
    ],
    4: [ // Cotton
      { id: 15, name: "Cotton Lawn", price: "PKR 800/meter", image: "/elegant-ladies-fabric-collection-colorful.jpg", description: "Soft cotton lawn fabric", inStock: true },
      { id: 16, name: "Cotton Voile", price: "PKR 750/meter", image: "/elegant-ladies-fabric-collection-colorful.jpg", description: "Lightweight cotton voile", inStock: true },
      { id: 17, name: "Cotton Poplin", price: "PKR 850/meter", image: "/elegant-ladies-fabric-collection-colorful.jpg", description: "Smooth cotton poplin", inStock: true },
      { id: 18, name: "Organic Cotton", price: "PKR 1,000/meter", image: "/elegant-ladies-fabric-collection-colorful.jpg", description: "Eco-friendly organic cotton", inStock: true },
    ],
    5: [ // Linen
      { id: 19, name: "Pure Linen", price: "PKR 1,500/meter", image: "/elegant-ladies-fabric-textile-pattern.jpg", description: "100% pure linen fabric", inStock: true },
      { id: 20, name: "Linen Blend", price: "PKR 1,200/meter", image: "/elegant-ladies-fabric-textile-pattern.jpg", description: "Comfortable linen blend", inStock: true },
      { id: 21, name: "Printed Linen", price: "PKR 1,600/meter", image: "/elegant-ladies-fabric-textile-pattern.jpg", description: "Beautiful printed linen", inStock: true },
    ],
    6: [ // Khaddar
      { id: 22, name: "Plain Khaddar", price: "PKR 600/meter", image: "/luxury-fabric-collection-display.jpg", description: "Traditional plain khaddar", inStock: true },
      { id: 23, name: "Printed Khaddar", price: "PKR 750/meter", image: "/luxury-fabric-collection-display.jpg", description: "Modern printed khaddar", inStock: true },
      { id: 24, name: "Embroidered Khaddar", price: "PKR 900/meter", image: "/luxury-fabric-collection-display.jpg", description: "Elegant embroidered khaddar", inStock: true },
    ],
  },
  gents: {
    1: [ // Suiting
      { id: 25, name: "Wool Suiting", price: "PKR 3,500/meter", image: "/executive-mens-suiting-fabric-navy.jpg", description: "Premium wool suiting fabric", inStock: true },
      { id: 26, name: "Polyester Suiting", price: "PKR 2,000/meter", image: "/executive-mens-suiting-fabric-navy.jpg", description: "Durable polyester suiting", inStock: true },
      { id: 27, name: "Blended Suiting", price: "PKR 2,500/meter", image: "/executive-mens-suiting-fabric-navy.jpg", description: "Premium blended suiting", inStock: true },
      { id: 28, name: "Premium Suiting", price: "PKR 4,000/meter", image: "/executive-mens-suiting-fabric-navy.jpg", description: "Luxury premium suiting", inStock: true },
      { id: 29, name: "Italian Suiting", price: "PKR 4,500/meter", image: "/executive-mens-suiting-fabric-navy.jpg", description: "Imported Italian suiting", inStock: true },
    ],
    2: [ // Shirting
      { id: 30, name: "Cotton Shirting", price: "PKR 800/meter", image: "/premium-cotton-shirting-fabric-white.jpg", description: "Premium cotton shirting", inStock: true },
      { id: 31, name: "Linen Shirting", price: "PKR 1,200/meter", image: "/premium-cotton-shirting-fabric-white.jpg", description: "Comfortable linen shirting", inStock: true },
      { id: 32, name: "Formal Shirting", price: "PKR 1,000/meter", image: "/premium-cotton-shirting-fabric-white.jpg", description: "Professional formal shirting", inStock: true },
      { id: 33, name: "Casual Shirting", price: "PKR 750/meter", image: "/premium-cotton-shirting-fabric-white.jpg", description: "Relaxed casual shirting", inStock: true },
      { id: 34, name: "Oxford Shirting", price: "PKR 900/meter", image: "/premium-cotton-shirting-fabric-white.jpg", description: "Classic oxford shirting", inStock: true },
    ],
    3: [ // Wash & Wear
      { id: 35, name: "Wash & Wear Suiting", price: "PKR 2,200/meter", image: "/premium-mens-suiting-fabric-texture.jpg", description: "Easy-care suiting fabric", inStock: true },
      { id: 36, name: "Wash & Wear Shirting", price: "PKR 850/meter", image: "/premium-mens-suiting-fabric-texture.jpg", description: "No-iron shirting fabric", inStock: true },
      { id: 37, name: "Wrinkle-Free Suiting", price: "PKR 2,400/meter", image: "/premium-mens-suiting-fabric-texture.jpg", description: "Wrinkle-resistant suiting", inStock: true },
    ],
    4: [ // Khaddar
      { id: 38, name: "Plain Khaddar", price: "PKR 600/meter", image: "/premium-mens-fabric-suiting-display.jpg", description: "Traditional plain khaddar", inStock: true },
      { id: 39, name: "Printed Khaddar", price: "PKR 750/meter", image: "/premium-mens-fabric-suiting-display.jpg", description: "Modern printed khaddar", inStock: true },
      { id: 40, name: "Embroidered Khaddar", price: "PKR 900/meter", image: "/premium-mens-fabric-suiting-display.jpg", description: "Elegant embroidered khaddar", inStock: true },
    ],
    5: [ // Cotton
      { id: 41, name: "Cotton Suiting", price: "PKR 1,500/meter", image: "/premium-cotton-shirting-fabric-white.jpg", description: "Comfortable cotton suiting", inStock: true },
      { id: 42, name: "Cotton Shirting", price: "PKR 800/meter", image: "/premium-cotton-shirting-fabric-white.jpg", description: "Premium cotton shirting", inStock: true },
      { id: 43, name: "Cotton Twill", price: "PKR 900/meter", image: "/premium-cotton-shirting-fabric-white.jpg", description: "Durable cotton twill", inStock: true },
    ],
    6: [ // Blended
      { id: 44, name: "Poly-Cotton", price: "PKR 1,200/meter", image: "/executive-mens-suiting-fabric-navy.jpg", description: "Polyester-cotton blend", inStock: true },
      { id: 45, name: "Poly-Wool", price: "PKR 2,800/meter", image: "/executive-mens-suiting-fabric-navy.jpg", description: "Polyester-wool blend", inStock: true },
      { id: 46, name: "Cotton-Polyester", price: "PKR 1,100/meter", image: "/executive-mens-suiting-fabric-navy.jpg", description: "Cotton-polyester blend", inStock: true },
    ],
  },
}

// Category names mapping
const categoryNames: Record<string, Record<number, string>> = {
  ladies: {
    1: "Lawn",
    2: "Chiffon",
    3: "Silk",
    4: "Cotton",
    5: "Linen",
    6: "Khaddar",
  },
  gents: {
    1: "Suiting",
    2: "Shirting",
    3: "Wash & Wear",
    4: "Khaddar",
    5: "Cotton",
    6: "Blended",
  },
}

// Direct Prisma call for server components (better performance)
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
  let categoryName = categoryNames[normalizedType]?.[categoryIdNum] || "Category"
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

