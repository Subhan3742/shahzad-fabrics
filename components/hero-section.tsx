"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-background to-accent/20" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-1.5 bg-primary/90 text-primary-foreground rounded-full shadow-lg border border-primary/50">
            <p className="text-xs md:text-sm font-medium">{"Premium Quality Since 1995"}</p>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 text-balance leading-tight">
            Elegance in
            <span className="block text-primary">Every Thread</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-pretty leading-relaxed">
            {
              "Discover the finest collection of premium fabrics for ladies and gents. Where tradition meets contemporary style at Shahzad Fabrics Brand's Shop."
            }
          </p>

          <div className="flex items-center justify-center">
            <Link href="/#categories">
              <Button size="lg" className="text-base px-8 bg-primary text-primary-foreground hover:bg-primary/90">
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Hero Image Grid */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="aspect-[3/4] rounded-lg bg-muted overflow-hidden">
              <img
                src="/elegant-ladies-fabric-collection-colorful.jpg"
                alt="Ladies Fabrics"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-[3/4] rounded-lg bg-muted overflow-hidden md:mt-12">
              <img
                src="/premium-mens-suiting-fabric-texture.jpg"
                alt="Gents Fabrics"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-[3/4] rounded-lg bg-muted overflow-hidden col-span-2 md:col-span-1">
              <img
                src="/luxury-fabric-collection-display.jpg"
                alt="Premium Collection"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
