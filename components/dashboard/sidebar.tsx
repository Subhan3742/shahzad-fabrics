"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { LayoutDashboard, FolderTree, Package, Home, ShoppingCart, BarChart3, Users, LogOut, Star, Menu, X, Building2, Store, FileText, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Sales Report",
    href: "/dashboard/sales",
    icon: BarChart3,
    adminOnly: true,
  },
  {
    title: "Sections",
    href: "/dashboard/sections",
    icon: FolderTree,
  },
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: FolderTree,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Featured Products",
    href: "/dashboard/featured",
    icon: Star,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
    adminOnly: true,
  },
  {
    title: "Bank Details",
    href: "/dashboard/bank-details",
    icon: Building2,
    adminOnly: true,
  },
  {
    title: "Store Info",
    href: "/dashboard/store-info",
    icon: Store,
    adminOnly: true,
  },
  {
    title: "About Page",
    href: "/dashboard/about-page",
    icon: FileText,
    adminOnly: true,
  },
  {
    title: "Owners",
    href: "/dashboard/owners",
    icon: UserCircle,
    adminOnly: true,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center justify-between border-b px-4 sm:px-6">
        <h2 className="text-base sm:text-lg font-semibold">Admin Dashboard</h2>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <nav className="flex-1 space-y-1 p-3 sm:p-4 overflow-y-auto">
        <Link
          href="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
            pathname === "/" && "bg-accent text-accent-foreground"
          )}
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        {menuItems.map((item) => {
          // Only show admin-only items to admins
          if (item.adminOnly && session?.user?.type !== "admin") {
            return null
          }
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-accent text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-3 sm:p-4">
        <div className="mb-2 px-3 py-2 text-xs sm:text-sm text-muted-foreground">
          <p className="font-medium truncate">{session?.user?.name}</p>
          <p className="text-xs truncate">{session?.user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 sm:hidden bg-background border"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden sm:flex h-screen w-64 flex-col border-r bg-card">
        {sidebarContent}
      </div>

      {/* Sidebar - Mobile */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 flex-col border-r bg-card transform transition-transform duration-300 sm:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>
    </>
  )
}

