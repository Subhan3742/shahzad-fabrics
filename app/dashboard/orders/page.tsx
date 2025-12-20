"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Eye, Phone } from "lucide-react"

interface OrderItem {
  id: number
  name: string
  price: string
  image: string
  quantity: number
  category: string
  type: string
}

interface Order {
  id: number
  orderNumber: string
  customerName: string
  customerPhone: string
  customerAddress: string
  city: string
  postalCode?: string
  deliveryNotes?: string
  paymentMethod: string
  status: string
  totalAmount: number
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [selectedStatus])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus })
        }
      } else {
        alert("Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order:", error)
      alert("Failed to update order status")
    }
  }

  const deleteOrder = async (orderId: number) => {
    if (!confirm("Are you sure you want to delete this order?")) return

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: false }),
      })

      if (response.ok) {
        await fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null)
        }
      } else {
        alert("Failed to delete order")
      }
    } catch (error) {
      console.error("Error deleting order:", error)
      alert("Failed to delete order")
    }
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString("en-PK")}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return <div>Loading orders...</div>
  }

  return (
    <div>
      <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Orders Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">View and manage customer orders</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="flex h-10 w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground text-lg">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <span className="text-lg sm:text-xl">Order #{order.orderNumber}</span>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium w-fit ${statusColors[order.status] || statusColors.pending}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </CardTitle>
                    <CardDescription className="mt-2 text-xs sm:text-sm">
                      {formatDate(order.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                      className="text-xs sm:text-sm"
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">{selectedOrder?.id === order.id ? "Hide" : "View"}</span>
                      <span className="sm:hidden">{selectedOrder?.id === order.id ? "Hide" : "View"}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteOrder(order.id)}
                      className="text-xs sm:text-sm"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">{order.customerName}</p>
                    <a href={`tel:${order.customerPhone}`} className="text-sm text-primary flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3" />
                      {order.customerPhone}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Address</p>
                    <p className="text-sm">{order.customerAddress}</p>
                    <p className="text-sm">{order.city} {order.postalCode && `- ${order.postalCode}`}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment & Total</p>
                    <p className="font-medium capitalize">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</p>
                    <p className="text-lg font-bold text-primary">{formatPrice(order.totalAmount)}</p>
                  </div>
                </div>

                {selectedOrder?.id === order.id && (
                  <div className="border-t pt-4 mt-4 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Order Items ({Array.isArray(order.items) ? order.items.length : 0})</h4>
                      <div className="space-y-2">
                        {Array.isArray(order.items) && order.items.map((item: OrderItem, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.category} • Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="font-medium">{item.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.deliveryNotes && (
                      <div>
                        <h4 className="font-semibold mb-2">Delivery Notes</h4>
                        <p className="text-sm text-muted-foreground">{order.deliveryNotes}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Update Status</h4>
                      <div className="flex flex-wrap gap-2">
                        {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                          <Button
                            key={status}
                            variant={order.status === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, status)}
                            className="text-xs sm:text-sm"
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

