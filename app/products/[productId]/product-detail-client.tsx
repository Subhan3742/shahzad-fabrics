"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ShoppingBag, Phone, Check, X } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"

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

interface ProductDetailClientProps {
  product: ProductDetail
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addToCart } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      type: product.type,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <main className="min-h-screen">
      <Header />
      <section className="pt-20 pb-20 md:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Back Button */}
          <Link href={`/categories/${product.type}`}>
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          </Link>

          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              {/* Product Images */}
              <div>
                <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-4">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <div className="mb-4">
                  <span className="text-sm text-accent font-medium">{product.category}</span>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">{product.name}</h1>
                
                {product.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(product.rating!) ? "text-yellow-400" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                )}

                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-3xl font-bold text-primary">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">{product.originalPrice}</span>
                  )}
                </div>

                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{product.fullDescription}</p>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.inStock ? (
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">In Stock</span>
                      {product.stockQuantity && (
                        <span className="text-sm text-muted-foreground">({product.stockQuantity} meters available)</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                      <X className="h-5 w-5" />
                      <span className="font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-3">Available Colors:</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <span
                          key={color}
                          className="px-4 py-2 border border-border rounded-md text-sm bg-background hover:bg-accent/50 transition-colors"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                  <Button
                    size="lg"
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleAddToCart}
                    disabled={!product.inStock || addedToCart}
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    {addedToCart ? "Added to Cart!" : "Add to Cart"}
                  </Button>
                  <Link href="tel:03239348438">
                    <Button size="lg" variant="outline" className="flex-1">
                      <Phone className="h-5 w-5 mr-2" />
                      Call to Order
                    </Button>
                  </Link>
                </div>

                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-semibold text-foreground mb-3">Key Features:</h3>
                    <ul className="space-y-2">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Specifications */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Specifications</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Material:</span>
                        <span className="font-medium">{product.specifications.material}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Width:</span>
                        <span className="font-medium">{product.specifications.width}</span>
                      </div>
                      {product.specifications.weight && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Weight:</span>
                          <span className="font-medium">{product.specifications.weight}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Care:</span>
                        <span className="font-medium">{product.specifications.care}</span>
                      </div>
                      {product.specifications.origin && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Origin:</span>
                          <span className="font-medium">{product.specifications.origin}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Features */}
                {product.features.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-4">Features</h3>
                      <ul className="space-y-2">
                        {product.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Full Description */}
            <div className="mt-12">
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-serif text-2xl font-bold mb-4">Description</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.fullDescription}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

