"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface Section {
  id: number
  type: string
  title: string
  description: string | null
  image: string
  items: string[]
}

export function CategoriesSection() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const response = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list" }),
      })

      if (response.ok) {
        const data = await response.json()
        setSections(data)
      }
    } catch (error) {
      console.error("Error fetching sections:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="categories" className="py-20 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading collections...</p>
          </div>
        </div>
      </section>
    )
  }

  if (sections.length === 0) {
    return null
  }

  return (
    <section id="categories" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
            Our Collections
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            {"Explore our curated selection of premium fabrics for both ladies and gents"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {sections.map((section) => (
            <Link key={section.id} href={`/categories/${section.type}`} className="block">
              <Card className="group overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 cursor-pointer h-full">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={section.image || "/placeholder.svg"}
                    alt={section.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-8">
                  <h3 className="font-serif text-3xl font-bold text-foreground mb-2">{section.title}</h3>
                  {section.description && (
                    <p className="text-muted-foreground mb-6 leading-relaxed">{section.description}</p>
                  )}
                  {section.items && section.items.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {section.items.map((item, idx) => (
                        <span key={idx} className="px-3 py-1 bg-primary/80 text-primary-foreground rounded-full text-sm font-medium shadow-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                    View Collection
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
