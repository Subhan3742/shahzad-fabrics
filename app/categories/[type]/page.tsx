import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Force dynamic rendering - fetch fresh data on every request
export const dynamic = 'force-dynamic'

// Direct Prisma call for server components (better performance)
import { prisma } from '@/lib/prisma'

async function getCategories(type: string) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        type: type,
        active: true,
      },
      orderBy: {
        id: 'asc',
      },
    })

    // Format the response to match frontend expectations
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description || '',
      image: category.image || '/placeholder.svg',
      items: category.items || [],
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function CategoriesPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params
  const normalizedType = type.toLowerCase()

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

  // Fetch categories from API
  const categories = await getCategories(normalizedType)
  const pageTitle = normalizedType === "ladies" ? "Ladies Collection" : "Gents Collection"

  return (
    <main className="min-h-screen">
      <Header />
      <section className="pt-20 pb-20 md:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Back Button */}
          <Link href="/#categories">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
              {pageTitle}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
              {normalizedType === "ladies"
                ? "Explore our exquisite collection of premium fabrics for ladies"
                : "Discover our premium collection of quality fabrics for gents"}
            </p>
          </div>

          {/* Categories Grid */}
          {categories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No categories found. Please add categories from the dashboard.</p>
              <Link href="/dashboard/categories" className="mt-4 inline-block">
                <Button>Go to Dashboard</Button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {categories.map((category) => (
              <Link key={category.id} href={`/categories/${normalizedType}/${category.id}`} className="block">
                <Card className="group overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-2">{category.name}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed text-sm">{category.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {category.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary/80 text-primary-foreground rounded-full text-xs font-medium shadow-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      View Products
                    </Button>
                  </CardContent>
                </Card>
              </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}

