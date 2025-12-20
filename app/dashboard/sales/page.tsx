"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp, DollarSign, ShoppingCart, Package, Calendar, Download } from "lucide-react"

interface SalesReport {
  summary: {
    totalOrders: number
    totalRevenue: number
    deliveredOrders: number
    deliveredRevenue: number
    averageOrderValue: number
  }
  salesByStatus: Record<string, number>
  ordersByStatus: Record<string, number>
  salesByPaymentMethod: Record<string, number>
  ordersByPaymentMethod: Record<string, number>
  salesByDate: Array<{
    date: string
    revenue: number
    orders: number
  }>
  topProducts: Array<{
    id: string
    name: string
    quantity: number
    revenue: number
    image: string
  }>
  salesByCategory: Record<string, number>
  salesByType: Record<string, number>
  salesByCity: Record<string, number>
  dateRange: {
    startDate: string | null
    endDate: string | null
    groupBy: string
  }
}

export default function SalesReportPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [report, setReport] = useState<SalesReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [groupBy, setGroupBy] = useState<"day" | "week" | "month" | "year">("day")

  useEffect(() => {
    if (session?.user?.type !== "admin") {
      router.push("/dashboard")
      return
    }
    fetchReport()
  }, [session, router])

  const fetchReport = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/sales/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          groupBy,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setReport(data)
      }
    } catch (error) {
      console.error("Error fetching sales report:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (dateString: string) => {
    if (groupBy === "day") {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" })
    } else if (groupBy === "week") {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" })
    } else if (groupBy === "month") {
      // Format: YYYY-MM
      const [year, month] = dateString.split("-")
      const date = new Date(parseInt(year), parseInt(month) - 1, 1)
      return date.toLocaleDateString("en-PK", { year: "numeric", month: "long" })
    } else {
      // Format: YYYY
      return dateString
    }
  }

  const exportReport = () => {
    if (!report) return

    const csv = [
      ["Sales Report", ""],
      ["Generated", new Date().toLocaleString()],
      ["", ""],
      ["Summary", ""],
      ["Total Orders", report.summary.totalOrders],
      ["Total Revenue", formatPrice(report.summary.totalRevenue)],
      ["Delivered Orders", report.summary.deliveredOrders],
      ["Delivered Revenue", formatPrice(report.summary.deliveredRevenue)],
      ["Average Order Value", formatPrice(report.summary.averageOrderValue)],
      ["", ""],
      ["Sales by Status", ""],
      ...Object.entries(report.salesByStatus).map(([status, revenue]) => [status, formatPrice(revenue)]),
      ["", ""],
      ["Top Products", ""],
      ["Product Name", "Quantity", "Revenue"],
      ...report.topProducts.map((p) => [p.name, p.quantity, formatPrice(p.revenue)]),
    ]

    const csvContent = csv.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sales-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  if (session?.user?.type !== "admin") {
    return <div>Access denied. Admin only.</div>
  }

  if (loading) {
    return <div>Loading sales report...</div>
  }

  if (!report) {
    return <div>No data available</div>
  }

  return (
    <div>
      <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Sales Report</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Detailed sales analytics and insights</p>
        </div>
        <Button onClick={exportReport}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="groupBy">Group By</Label>
              <select
                id="groupBy"
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as "day" | "week" | "month" | "year")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={fetchReport} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(report.summary.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">All orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.summary.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All statuses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(report.summary.deliveredRevenue)}</div>
            <p className="text-xs text-muted-foreground">{report.summary.deliveredOrders} delivered orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(report.summary.averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">Per order</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        {/* Sales by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Status</CardTitle>
            <CardDescription>Revenue breakdown by order status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(report.salesByStatus).map(([status, revenue]) => (
                <div key={status} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium capitalize">{status}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.ordersByStatus[status] || 0} orders
                    </p>
                  </div>
                  <p className="font-bold">{formatPrice(revenue)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales by Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Payment Method</CardTitle>
            <CardDescription>Revenue breakdown by payment type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(report.salesByPaymentMethod).map(([method, revenue]) => (
                <div key={method} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium capitalize">
                      {method === "cod" ? "Cash on Delivery" : "Online Payment"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {report.ordersByPaymentMethod[method] || 0} orders
                    </p>
                  </div>
                  <p className="font-bold">{formatPrice(revenue)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales by Date */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
            <CardDescription>Revenue by {groupBy}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {report.salesByDate.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{formatDate(item.date)}</p>
                    <p className="text-sm text-muted-foreground">{item.orders} orders</p>
                  </div>
                  <p className="font-bold">{formatPrice(item.revenue)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {report.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center text-xs font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {product.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold">{formatPrice(product.revenue)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Revenue breakdown by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(report.salesByCategory)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([category, revenue]) => (
                  <div key={category} className="flex items-center justify-between">
                    <p className="font-medium">{category}</p>
                    <p className="font-bold">{formatPrice(revenue as number)}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Type</CardTitle>
            <CardDescription>Revenue breakdown by collection type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(report.salesByType)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([type, revenue]) => (
                  <div key={type} className="flex items-center justify-between">
                    <p className="font-medium capitalize">{type}</p>
                    <p className="font-bold">{formatPrice(revenue as number)}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales by City */}
      {Object.keys(report.salesByCity).length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Sales by City</CardTitle>
            <CardDescription>Revenue breakdown by delivery city</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(report.salesByCity)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([city, revenue]) => (
                  <div key={city} className="flex items-center justify-between p-3 bg-secondary/30 rounded">
                    <p className="font-medium">{city}</p>
                    <p className="font-bold">{formatPrice(revenue as number)}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

