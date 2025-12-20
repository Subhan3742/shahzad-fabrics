"use client"

import { useState, useEffect } from "react"
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react"

interface StoreInfo {
  location: string
  contactPhone: string
  email?: string
  facebookUrl?: string
  instagramUrl?: string
  tiktokUrl?: string
}

// TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

export function Footer() {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    location: "26-Hajvery Center, Ichra Road, Lahore",
    contactPhone: "0323 9348438",
    email: "info@shahzadfabrics.com",
    facebookUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
  })

  useEffect(() => {
    fetch("/api/store-info")
      .then((res) => res.json())
      .then((data) => {
        setStoreInfo({
          location: data.location || storeInfo.location,
          contactPhone: data.contactPhone || storeInfo.contactPhone,
          email: data.email || storeInfo.email,
          facebookUrl: data.facebookUrl || "",
          instagramUrl: data.instagramUrl || "",
          tiktokUrl: data.tiktokUrl || "",
        })
      })
      .catch((error) => {
        console.error("Error fetching store info:", error)
      })
  }, [])

  return (
    <footer id="contact" className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">Shahzad Fabrics</h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              {"Your trusted destination for premium quality fabrics in Lahore since 1995."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Categories", "About", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={link === "Home" ? "/" : link === "About" ? "/about" : `#${link.toLowerCase()}`}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80 leading-relaxed">
                  {storeInfo.location}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a
                  href={`tel:${storeInfo.contactPhone.replace(/\s/g, "")}`}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {storeInfo.contactPhone}
                </a>
              </li>
              {storeInfo.email && (
                <li className="flex gap-3">
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  <a
                    href={`mailto:${storeInfo.email}`}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {storeInfo.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/80 text-sm">
            {"© 2025 Shahzad Fabrics Brand's Shop. All rights reserved."}
          </p>
          <div className="flex gap-4">
            {storeInfo.facebookUrl && (
              <a
                href={storeInfo.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {storeInfo.instagramUrl && (
              <a
                href={storeInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {storeInfo.tiktokUrl && (
              <a
                href={storeInfo.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full flex items-center justify-center transition-colors"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
            )}
            <a
              href={`tel:${storeInfo.contactPhone.replace(/\s/g, "")}`}
              className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full flex items-center justify-center transition-colors"
            >
              <Phone className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
