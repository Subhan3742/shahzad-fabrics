"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface CartItem {
  id: number
  name: string
  price: string
  image: string
  quantity: number
  category: string
  type: "ladies" | "gents"
  selectedColor?: string
  selectedSize?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: number, selectedColor?: string, selectedSize?: string) => void
  updateQuantity: (id: number, quantity: number, selectedColor?: string, selectedSize?: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("shahzad-cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("shahzad-cart", JSON.stringify(items))
  }, [items])

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      // Check if same item with same color/size exists
      const existingItem = prevItems.find((i) => 
        i.id === item.id && 
        i.selectedColor === item.selectedColor && 
        i.selectedSize === item.selectedSize
      )
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id && 
          i.selectedColor === item.selectedColor && 
          i.selectedSize === item.selectedSize
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        )
      }
      return [...prevItems, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number, selectedColor?: string, selectedSize?: string) => {
    setItems((prevItems) => 
      prevItems.filter((i) => 
        !(i.id === id && 
          i.selectedColor === selectedColor && 
          i.selectedSize === selectedSize)
      )
    )
  }

  const updateQuantity = (id: number, quantity: number, selectedColor?: string, selectedSize?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, selectedColor, selectedSize)
      return
    }
    setItems((prevItems) =>
      prevItems.map((i) => 
        i.id === id && 
        i.selectedColor === selectedColor && 
        i.selectedSize === selectedSize
          ? { ...i, quantity } 
          : i
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      // Extract numeric value from price string (e.g., "PKR 1,200/meter" -> 1200)
      const priceMatch = item.price.match(/[\d,]+/)
      if (priceMatch) {
        const priceValue = parseFloat(priceMatch[0].replace(/,/g, ""))
        return total + priceValue * item.quantity
      }
      return total
    }, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

