"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ShoppingBag, Phone, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useSession } from "next-auth/react"
import Image from "next/image"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { getTotalItems } = useCart()
  const cartItemsCount = getTotalItems()
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/#categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/#contact" },
  ]

  const handleWhatsAppClick = () => {
    const phoneNumber = "923239348438" // Pakistan format without + and spaces
    const message = "Hello, I'm interested in your fabrics. Please provide more information."
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 mt-[5%] overflow-hidden">
            <Image 
              src="/circlelogo.png" 
              alt="Shahzad Fabrics" 
              width={180} 
              height={180} 
              className="h-15 w-auto sm:h-40 md:h-50 lg:h-60 lg:mt-[100px] object-contain overflow-hidden" 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount > 9 ? "9+" : cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>
           
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleWhatsAppClick}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-border bg-background/98 backdrop-blur-md shadow-xl">
            <nav className="flex flex-col gap-3 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-foreground hover:text-primary hover:bg-primary/10 transition-all py-3 px-4 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-border mt-2 space-y-3">
                <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full bg-background border-2 hover:bg-secondary/50 transition-all py-6">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    <span className="text-base font-medium">Cart</span>
                    {cartItemsCount > 0 && (
                      <span className="ml-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm font-bold">
                        {cartItemsCount > 9 ? "9+" : cartItemsCount}
                      </span>
                    )}
                  </Button>
                </Link>
                {session ? (
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full bg-background border-2 hover:bg-secondary/50 transition-all py-6">
                      <LogIn className="h-5 w-5 mr-2" />
                      <span className="text-base font-medium">Dashboard</span>
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full bg-background border-2 hover:bg-secondary/50 transition-all py-6">
                      <LogIn className="h-5 w-5 mr-2" />
                      <span className="text-base font-medium">Login</span>
                    </Button>
                  </Link>
                )}
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all py-6 shadow-lg"
                  onClick={handleWhatsAppClick}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  <span className="text-base font-medium">Call: 0323 9348438</span>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
