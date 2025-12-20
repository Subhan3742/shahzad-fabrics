"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, StarOff, Loader2 } from "lucide-react"

interface Product {
  id: number
  name: string
  price: string
  image: string
  type: "ladies" | "gents"
  featured: boolean
  category: string
}

export default function FeaturedProductsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)

  useEffect(() => {
    if (session?.user?.type !== "admin") {
      router.push("/dashboard")
      return
    }
    fetchProducts()
  }, [session, router])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Fetched products:", data)
        console.log("Featured products:", data.filter((p: Product) => p.featured))
        setProducts(data)
      } else {
        const error = await response.json()
        console.error("Error response:", error)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFeatured = async (productId: number, currentFeatured: boolean) => {
    try {
      setUpdating(productId)
      const newFeaturedStatus = !currentFeatured
      
      console.log(`Updating product ${productId} featured status to: ${newFeaturedStatus}`)
      
      const response = await fetch(`/api/products/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          featured: newFeaturedStatus,
        }),
      })

      if (response.ok) {
        const updatedProduct = await response.json()
        console.log("Product updated:", updatedProduct)
        await fetchProducts()
      } else {
        const error = await response.json()
        console.error("Update error:", error)
        alert(error.error || "Failed to update featured status")
      }
    } catch (error) {
      console.error("Error updating featured status:", error)
      alert("Failed to update featured status. Please check console for details.")
    } finally {
      setUpdating(null)
    }
  }

  if (session?.user?.type !== "admin") {
    return <div>Access denied. Admin only.</div>
  }

  if (loading) {
    return <div>Loading products...</div>
  }

  const featuredProducts = products.filter((p) => p.featured)
  const nonFeaturedProducts = products.filter((p) => !p.featured)

  return (
    <div>
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Featured Products</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage which products appear on the homepage. Currently showing {featuredProducts.length} featured products.
        </p>
      </div>

      {/* Featured Products Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            Currently Featured ({featuredProducts.length})
          </CardTitle>
          <CardDescription>
            These products are displayed on the homepage. Maximum 4 products will be shown.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {featuredProducts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No featured products yet.</p>
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="relative">
                  <div className="aspect-[3/4] overflow-hidden bg-muted">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                    <p className="text-primary font-bold mb-3">{product.price}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => toggleFeatured(product.id, product.featured)}
                      disabled={updating === product.id}
                    >
                      {updating === product.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <StarOff className="h-4 w-4 mr-2" />
                          Remove from Featured
                        </>
                      )}
                    </Button>
                  </CardContent>
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white rounded-full p-1">
                    <Star className="h-4 w-4 fill-white" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Products Section */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>Click to add products to featured section</CardDescription>
        </CardHeader>
        <CardContent>
          {nonFeaturedProducts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">All products are featured.</p>
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {nonFeaturedProducts.map((product) => (
                <Card key={product.id}>
                  <div className="aspect-[3/4] overflow-hidden bg-muted">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                    <p className="text-primary font-bold mb-3">{product.price}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => toggleFeatured(product.id, product.featured)}
                      disabled={updating === product.id}
                    >
                      {updating === product.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4 mr-2" />
                          Add to Featured
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

