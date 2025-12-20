"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Owner {
  id: number
  name: string
  image?: string
  description?: string
}

interface AboutPageData {
  pageTitle: string
  pageSubtitle?: string
  storyTitle: string
  storyContent?: string
  valuesTitle?: string
  value1Title?: string
  value1Content?: string
  value2Title?: string
  value2Content?: string
  value3Title?: string
  value3Content?: string
}

export default function AboutPage() {
  const [owners, setOwners] = useState<Owner[]>([])
  const [aboutData, setAboutData] = useState<AboutPageData>({
    pageTitle: "About Shahzad Fabrics",
    pageSubtitle: "Since 1995, Shahzad Fabrics has been serving the people of Lahore with premium quality fabrics. Our commitment to excellence and customer satisfaction has made us a trusted name in the textile industry.",
    storyTitle: "Our Story",
    storyContent: "Established in 1995, Shahzad Fabrics Brand's Shop has been a cornerstone of Lahore's textile market for nearly three decades. What started as a small family business has grown into one of the most trusted fabric stores in the city, known for our extensive collection and exceptional service.\n\nLocated in the heart of Lahore at 26-Hajvery Center, Ichra Road, we have been serving customers with premium quality fabrics for both ladies and gents. Our collection includes everything from elegant lawn and chiffon for women to premium suiting and shirting for men.\n\nOur success is built on three pillars: quality, service, and trust. We carefully select each fabric in our collection, ensuring it meets our high standards. Our knowledgeable staff is always ready to help you find the perfect fabric for your needs, whether it's for everyday wear or a special occasion.",
    valuesTitle: "Our Values",
    value1Title: "Quality First",
    value1Content: "We source only the finest fabrics, ensuring every piece meets our high standards of quality and durability.",
    value2Title: "Customer Service",
    value2Content: "Our experienced staff is dedicated to helping you find exactly what you're looking for, with personalized attention and expert advice.",
    value3Title: "Trust & Integrity",
    value3Content: "For nearly 30 years, we've built our reputation on honesty, transparency, and building lasting relationships with our customers.",
  })
  const [storeInfo, setStoreInfo] = useState({
    location: "26-Hajvery Center, Ichra Road, Lahore",
    contactPhone: "0323 9348438",
    storeHours: "Mon - Sat: 10:00 AM - 9:00 PM\nSunday: 11:00 AM - 7:00 PM",
  })

  useEffect(() => {
    fetchAboutPage()
    fetchOwners()
    fetchStoreInfo()
  }, [])

  const fetchAboutPage = async () => {
    try {
      const response = await fetch("/api/about-page", {
        method: "GET",
      })
      if (response.ok) {
        const data = await response.json()
        setAboutData(data)
      }
    } catch (error) {
      console.error("Error fetching about page:", error)
    }
  }

  const fetchOwners = async () => {
    try {
      const response = await fetch("/api/owners", {
        method: "GET",
      })
      if (response.ok) {
        const data = await response.json()
        setOwners(data)
      }
    } catch (error) {
      console.error("Error fetching owners:", error)
    }
  }

  const fetchStoreInfo = async () => {
    try {
      const response = await fetch("/api/store-info", {
        method: "GET",
      })
      if (response.ok) {
        const data = await response.json()
        setStoreInfo({
          location: data.location || storeInfo.location,
          contactPhone: data.contactPhone || storeInfo.contactPhone,
          storeHours: data.storeHours || storeInfo.storeHours,
        })
      }
    } catch (error) {
      console.error("Error fetching store info:", error)
    }
  }

  const formatStoryContent = (content?: string) => {
    if (!content) return []
    return content.split("\n\n").filter((para) => para.trim())
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
    <main className="min-h-screen">
      <Header />
      <section className="pt-20 pb-20 md:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          {/* Page Header */}
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              {aboutData.pageTitle}
            </h1>
            {aboutData.pageSubtitle && (
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
                {aboutData.pageSubtitle}
              </p>
            )}
          </div>

          {/* Our Story Section */}
          {aboutData.storyTitle && (
            <div className="max-w-4xl mx-auto mb-20">
              <Card>
                <CardContent className="p-8 md:p-12">
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">{aboutData.storyTitle}</h2>
                  {aboutData.storyContent && (
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      {formatStoryContent(aboutData.storyContent).map((para, index) => (
                        <p key={index}>{para}</p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Owners Section */}
          {owners.length > 0 && (
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Meet Our Owners
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  The visionaries behind Shahzad Fabrics, dedicated to bringing you the finest fabrics
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {owners.map((owner) => (
                  <Card key={owner.id} className="group overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="aspect-[3/4] overflow-hidden bg-muted">
                      <Image
                        src={owner.image || "/placeholder-user.jpg"}
                        height={400}
                        width={300}
                        alt={owner.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e: { currentTarget: { src: string } }) => {
                          e.currentTarget.src = "/placeholder-user.jpg"
                        }}
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-serif text-2xl font-bold text-foreground mb-3">{owner.name}</h3>
                      {owner.description && (
                        <p className="text-muted-foreground leading-relaxed text-sm">{owner.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Values Section */}
          {aboutData.valuesTitle && (aboutData.value1Title || aboutData.value2Title || aboutData.value3Title) && (
            <div className="max-w-6xl mx-auto mb-20">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">{aboutData.valuesTitle}</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {aboutData.value1Title && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold text-xl text-foreground mb-3">{aboutData.value1Title}</h3>
                      {aboutData.value1Content && (
                        <p className="text-muted-foreground">{aboutData.value1Content}</p>
                      )}
                    </CardContent>
                  </Card>
                )}
                {aboutData.value2Title && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold text-xl text-foreground mb-3">{aboutData.value2Title}</h3>
                      {aboutData.value2Content && (
                        <p className="text-muted-foreground">{aboutData.value2Content}</p>
                      )}
                    </CardContent>
                  </Card>
                )}
                {aboutData.value3Title && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold text-xl text-foreground mb-3">{aboutData.value3Title}</h3>
                      {aboutData.value3Content && (
                        <p className="text-muted-foreground">{aboutData.value3Content}</p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
                Visit Our Store
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Location</h3>
                  <p className="text-muted-foreground">{storeInfo.location}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Contact</h3>
                  <a 
                    href={`tel:${storeInfo.contactPhone.replace(/\s/g, "")}`} 
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    {storeInfo.contactPhone}
                  </a>
                </div>
                {storeInfo.storeHours && (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Store Hours</h3>
                    <p className="text-muted-foreground">
                      {formatStoreHours(storeInfo.storeHours)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </main>
  )
}

