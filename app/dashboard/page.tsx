import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, FolderTree, LayoutDashboard, ShoppingCart, BarChart3, Star } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your store content</p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Orders
            </CardTitle>
            <CardDescription>View and manage customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/orders">
              <Button className="w-full">Manage Orders</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sales Report
            </CardTitle>
            <CardDescription>View detailed sales analytics and reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/sales">
              <Button className="w-full">View Sales Report</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />
              Sections
            </CardTitle>
            <CardDescription>Manage Ladies and Gents collections</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/sections">
              <Button className="w-full">Manage Sections</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderTree className="h-5 w-5" />
              Categories
            </CardTitle>
            <CardDescription>Add and manage product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/categories">
              <Button className="w-full">Manage Categories</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Products
            </CardTitle>
            <CardDescription>Add and manage products</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/products">
              <Button className="w-full">Manage Products</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Featured Products
            </CardTitle>
            <CardDescription>Manage products shown on homepage</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/featured">
              <Button className="w-full">Manage Featured</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

