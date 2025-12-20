"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingBag, Plus, Minus, Trash2, Phone } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart()
  const totalPrice = getTotalPrice()
  const totalItems = getTotalItems()

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString("en-PK")}`
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen">
        <Header />
        <section className="pt-20 pb-20 md:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <Link href="/">
              <Button variant="ghost" className="mb-8">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            <div className="max-w-2xl mx-auto text-center py-12 sm:py-16 md:py-20 px-4">
              <ShoppingBag className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 mx-auto text-muted-foreground mb-4 sm:mb-6" />
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-4">
                Start adding products to your cart to see them here
              </p>
              <Link href="/#categories">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      <section className="pt-20 pb-20 md:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <Link href="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                Shopping Cart
              </h1>
              <Button 
                variant="outline" 
                onClick={clearCart} 
                className="text-red-600 hover:text-red-700 w-full sm:w-auto"
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                {items.map((item) => {
                  const priceMatch = item.price.match(/[\d,]+/)
                  const itemPrice = priceMatch ? parseFloat(priceMatch[0].replace(/,/g, "")) : 0
                  const itemTotal = itemPrice * item.quantity

                  return (
                    <Card key={item.id}>
                      <CardContent className="p-3 sm:p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6">
                          {/* Product Image */}
                          <div className="w-full sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted mx-auto sm:mx-0">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0 w-full">
                            <div className="flex items-start justify-between gap-2 sm:gap-4 mb-2 sm:mb-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-base sm:text-lg text-foreground mb-1 line-clamp-2">{item.name}</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground">{item.category}</p>
                                <p className="text-xs sm:text-sm text-muted-foreground capitalize">{item.type}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mt-3 sm:mt-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="h-8 w-8 sm:h-9 sm:w-9"
                                >
                                  <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <span className="text-base sm:text-lg font-semibold w-8 sm:w-10 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="h-8 w-8 sm:h-9 sm:w-9"
                                >
                                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </div>

                              {/* Price */}
                              <div className="text-center sm:text-right">
                                <p className="text-xs sm:text-sm text-muted-foreground">{item.price}</p>
                                <p className="text-base sm:text-lg font-bold text-primary">
                                  {formatPrice(itemTotal)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="lg:sticky lg:top-24">
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Order Summary</h2>

                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                      <div className="flex justify-between text-sm sm:text-base text-muted-foreground">
                        <span>Items ({totalItems})</span>
                        <span className="font-medium">{formatPrice(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base text-muted-foreground">
                        <span>Delivery</span>
                        <span className="font-medium">Free</span>
                      </div>
                      <div className="border-t border-border pt-3 sm:pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-base sm:text-lg font-semibold text-foreground">Total</span>
                          <span className="text-xl sm:text-2xl font-bold text-primary">{formatPrice(totalPrice)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <Link href="/checkout" className="block">
                        <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base">
                          Proceed to Checkout
                        </Button>
                      </Link>
                      <Link href="/#contact" className="block">
                        <Button size="lg" variant="outline" className="w-full text-sm sm:text-base">
                          <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                          Call to Order
                        </Button>
                      </Link>
                      <Link href="/#categories" className="block">
                        <Button size="lg" variant="outline" className="w-full text-sm sm:text-base">
                          Continue Shopping
                        </Button>
                      </Link>
                    </div>

                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-secondary/30 rounded-lg">
                      <p className="text-xs sm:text-sm text-muted-foreground text-center">
                        Visit our store or call us to complete your order. We're here to help you find the perfect fabric!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

