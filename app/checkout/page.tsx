"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CreditCard, Truck, Check, Building2 } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"

type PaymentMethod = "online" | "cod" | null

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [confirmedTotalPrice, setConfirmedTotalPrice] = useState<number>(0)
  const [bankDetails, setBankDetails] = useState({
    bankName: "Habib Bank Limited",
    accountNumber: "1234-5678-9012-3456",
    accountTitle: "Shahzad Fabrics",
    contactPhone: "0323 9348438",
  })
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Lahore",
    postalCode: "",
    notes: "",
  })

  const totalPrice = getTotalPrice()

  // Fetch bank details on mount
  useEffect(() => {
    fetchBankDetails()
  }, [])

  const fetchBankDetails = async () => {
    try {
      const response = await fetch("/api/bank-details", {
        method: "GET",
      })
      if (response.ok) {
        const data = await response.json()
        setBankDetails({
          bankName: data.bankName || "Habib Bank Limited",
          accountNumber: data.accountNumber || "1234-5678-9012-3456",
          accountTitle: data.accountTitle || "Shahzad Fabrics",
          contactPhone: data.contactPhone || "0323 9348438",
        })
      }
    } catch (error) {
      console.error("Error fetching bank details:", error)
    }
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString("en-PK")}`
  }

  const generateOrderNumber = () => {
    return `SF-${Date.now().toString().slice(-8)}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill in all required fields")
      return
    }

    if (!paymentMethod) {
      alert("Please select a payment method")
      return
    }

    if (items.length === 0) {
      alert("Your cart is empty")
      return
    }

    try {
      // Generate order number
      const newOrderNumber = generateOrderNumber()
      
      // Prepare order items
      const orderItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        category: item.category,
        type: item.type,
      }))

      // Save order to database
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber: newOrderNumber,
          customerName: formData.name,
          customerPhone: formData.phone,
          customerAddress: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          deliveryNotes: formData.notes,
          paymentMethod: paymentMethod,
          totalAmount: totalPrice,
          items: orderItems,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create order')
      }

      const order = await response.json()
      setOrderNumber(newOrderNumber)
      // Store total price before clearing cart
      setConfirmedTotalPrice(totalPrice)
      setShowConfirmation(true)
      
      // Clear cart after order confirmation
      setTimeout(() => {
        clearCart()
      }, 1000)
    } catch (error) {
      console.error('Error creating order:', error)
      alert(error instanceof Error ? error.message : 'Failed to create order. Please try again.')
    }
  }

  if (items.length === 0 && !showConfirmation) {
    return (
      <main className="min-h-screen">
        <Header />
        <section className="pt-20 pb-20 md:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <Link href="/cart">
              <Button variant="ghost" className="mb-8">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
            <div className="max-w-2xl mx-auto text-center py-20">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Please add items to your cart before checkout
              </p>
              <Link href="/#categories">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
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

  // Order Confirmation Dialog
  if (showConfirmation) {
    return (
      <main className="min-h-screen">
        <Header />
        <section className="pt-20 pb-20 md:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-8 md:p-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>
                  <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                    Thank You for Your Order!
                  </h1>
                  <p className="text-xl text-muted-foreground mb-8">
                    Your order has been placed successfully
                  </p>
                  <div className="bg-secondary/30 rounded-lg p-6 mb-8">
                    <p className="text-sm text-muted-foreground mb-2">Order Number</p>
                    <p className="text-3xl font-bold text-primary">{orderNumber}</p>
                  </div>
                  <div className="space-y-4 text-left mb-8">
                    <div>
                      <p className="text-sm text-muted-foreground">Delivery Address</p>
                      <p className="font-medium">{formData.name}</p>
                      <p className="text-muted-foreground">{formData.address}</p>
                      <p className="text-muted-foreground">
                        {formData.city} {formData.postalCode && `- ${formData.postalCode}`}
                      </p>
                      <p className="text-muted-foreground">Phone: {formData.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Method</p>
                      <p className="font-medium">
                        {paymentMethod === "online" ? `Online Payment (${bankDetails.bankName})` : "Cash on Delivery"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold text-primary">{formatPrice(confirmedTotalPrice)}</p>
                    </div>
                  </div>
                  {paymentMethod === "online" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                      <p className="text-sm font-medium text-yellow-800 mb-2">
                        Please complete your payment to {bankDetails.bankName} account:
                      </p>
                      <p className="text-sm text-yellow-700">
                        Account Number: <span className="font-mono font-bold">{bankDetails.accountNumber}</span>
                      </p>
                      <p className="text-sm text-yellow-700">
                        Account Title: <span className="font-bold">{bankDetails.accountTitle}</span>
                      </p>
                      <p className="text-sm text-yellow-700 mt-2">
                        After payment, please send the transaction receipt to our WhatsApp or call us at {bankDetails.contactPhone}
                      </p>
                    </div>
                  )}
                  <div className="space-y-3">
                    <Link href="/">
                      <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Continue Shopping
                      </Button>
                    </Link>
                    <Link href="/#contact">
                      <Button size="lg" variant="outline" className="w-full">
                        Contact Us
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
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
          <Link href="/cart">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>

          <div className="max-w-6xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-12">
              Checkout
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Form */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Delivery Address */}
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                        Delivery Address
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="03XX-XXXXXXX"
                          />
                        </div>
                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                            Street Address <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="address"
                            name="address"
                            required
                            rows={3}
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="House/Shop number, Street, Area"
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label htmlFor="postalCode" className="block text-sm font-medium text-foreground mb-2">
                              Postal Code
                            </label>
                            <input
                              type="text"
                              id="postalCode"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="54000"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-2">
                            Delivery Notes (Optional)
                          </label>
                          <textarea
                            id="notes"
                            name="notes"
                            rows={2}
                            value={formData.notes}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Any special instructions for delivery"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Method */}
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                        Payment Method
                      </h2>
                      <div className="space-y-4">
                        {/* Online Payment */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("online")}
                          className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                            paymentMethod === "online"
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                paymentMethod === "online"
                                  ? "border-primary bg-primary"
                                  : "border-border"
                              }`}
                            >
                              {paymentMethod === "online" && (
                                <div className="w-3 h-3 rounded-full bg-primary-foreground" />
                              )}
                            </div>
                            <CreditCard className="h-6 w-6 text-primary" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">Online Payment ({bankDetails.bankName})</h3>
                              <p className="text-sm text-muted-foreground">
                                Pay via bank transfer to {bankDetails.bankName} account
                              </p>
                            </div>
                          </div>
                          {paymentMethod === "online" && (
                            <div className="mt-4 ml-9 p-4 bg-secondary/30 rounded-lg">
                              <div className="flex items-center gap-3 mb-3">
                                <Building2 className="h-8 w-8 text-primary" />
                                <div>
                                  <p className="font-semibold text-foreground">{bankDetails.bankName}</p>
                                  <p className="text-sm text-muted-foreground">Account Number</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Account Number:</span>
                                  <span className="font-mono font-bold text-foreground">{bankDetails.accountNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Account Title:</span>
                                  <span className="font-semibold text-foreground">{bankDetails.accountTitle}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Bank:</span>
                                  <span className="font-semibold text-foreground">{bankDetails.bankName}</span>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-3">
                                After payment, please send the transaction receipt via WhatsApp or call us at {bankDetails.contactPhone}
                              </p>
                            </div>
                          )}
                        </button>

                        {/* Cash on Delivery */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("cod")}
                          className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                            paymentMethod === "cod"
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                paymentMethod === "cod"
                                  ? "border-primary bg-primary"
                                  : "border-border"
                              }`}
                            >
                              {paymentMethod === "cod" && (
                                <div className="w-3 h-3 rounded-full bg-primary-foreground" />
                              )}
                            </div>
                            <Truck className="h-6 w-6 text-primary" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">Cash on Delivery</h3>
                              <p className="text-sm text-muted-foreground">
                                Pay cash when your order is delivered
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-24">
                    <CardContent className="p-6">
                      <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                        Order Summary
                      </h2>
                      <div className="space-y-4 mb-6">
                        {items.map((item) => {
                          const priceMatch = item.price.match(/[\d,]+/)
                          const itemPrice = priceMatch ? parseFloat(priceMatch[0].replace(/,/g, "")) : 0
                          return (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {item.name} x{item.quantity}
                              </span>
                              <span className="font-medium">{formatPrice(itemPrice * item.quantity)}</span>
                            </div>
                          )
                        })}
                        <div className="border-t border-border pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-foreground">Total</span>
                            <span className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Place Order
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

