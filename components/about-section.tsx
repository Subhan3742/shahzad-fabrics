"use client"

import { useState, useEffect } from "react"
import { MapPin, Phone, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface StoreInfo {
  title: string
  description?: string
  image?: string
  location: string
  contactPhone: string
  storeHours?: string
}

export function AboutSection() {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    title: "Visit Our Store in Lahore",
    description: "Experience the finest quality fabrics in person at our flagship store located in the heart of Lahore. Our expert staff is ready to help you find the perfect fabric for your needs.",
    image: "/shop-cover.jpeg",
    location: "26-Hajvery Center, Ichra Road, Lahore",
    contactPhone: "0323 9348438",
    storeHours: "Mon - Sat: 10:00 AM - 9:00 PM\nSunday: 11:00 AM - 7:00 PM",
  })

  useEffect(() => {
    fetchStoreInfo()
  }, [])

  const fetchStoreInfo = async () => {
    try {
      const response = await fetch("/api/store-info", {
        method: "GET",
      })
      if (response.ok) {
        const data = await response.json()
        setStoreInfo({
          title: data.title || storeInfo.title,
          description: data.description || storeInfo.description,
          image: data.image || storeInfo.image,
          location: data.location || storeInfo.location,
          contactPhone: data.contactPhone || storeInfo.contactPhone,
          storeHours: data.storeHours || storeInfo.storeHours,
        })
      }
    } catch (error) {
      console.error("Error fetching store info:", error)
    }
  }

  const formatStoreHours = (hours?: string) => {
    if (!hours) return ""
    return hours.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < hours.split("\n").length - 1 && <br />}
      </span>
    ))
  }

  return (
    <section id="about" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                {storeInfo.title}
              </h2>
              {storeInfo.description && (
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
                  {storeInfo.description}
                </p>
              )}
              <Link href="/about">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Learn More About Us
                </Button>
              </Link>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6 flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Our Location</h3>
                      <p className="text-muted-foreground leading-relaxed">{storeInfo.location}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                        <Phone className="h-6 w-6 text-accent" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Contact Us</h3>
                      <a 
                        href={`tel:${storeInfo.contactPhone.replace(/\s/g, "")}`} 
                        className="text-muted-foreground hover:text-accent transition-colors"
                      >
                        {storeInfo.contactPhone}
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {storeInfo.storeHours && (
                  <Card>
                    <CardContent className="p-6 flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Clock className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Store Hours</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {formatStoreHours(storeInfo.storeHours)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-2xl">
              <img
                src={storeInfo.image || "/shop-cover.jpeg"}
                alt="Shahzad Fabrics Store"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
