"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Store, Upload, Loader2, X } from "lucide-react"
import { ImageEditor } from "@/components/image-editor"

interface StoreInfo {
  title: string
  description?: string
  image?: string
  location: string
  contactPhone: string
  email?: string
  storeHours?: string
  facebookUrl?: string
  instagramUrl?: string
  tiktokUrl?: string
}

export default function StoreInfoPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingImage, setEditingImage] = useState<File | null>(null)
  const [formData, setFormData] = useState<StoreInfo>({
    title: "",
    description: "",
    image: "",
    location: "",
    contactPhone: "",
    email: "",
    storeHours: "",
    facebookUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
  })

  useEffect(() => {
    if (session?.user?.type !== "admin") {
      router.push("/dashboard")
      return
    }
    fetchStoreInfo()
  }, [session, router])

  const fetchStoreInfo = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/store-info", {
        method: "GET",
      })

      if (response.ok) {
        const data = await response.json()
        setFormData({
          title: data.title || "",
          description: data.description || "",
          image: data.image || "",
          location: data.location || "",
          contactPhone: data.contactPhone || "",
          email: data.email || "",
          storeHours: data.storeHours || "",
          facebookUrl: data.facebookUrl || "",
          instagramUrl: data.instagramUrl || "",
          tiktokUrl: data.tiktokUrl || "",
        })
      }
    } catch (error) {
      console.error("Error fetching store info:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setEditingImage(file)
    e.target.value = ""
  }

  const handleImageEditorSave = async (editedFile: File) => {
    try {
      setUploading(true)
      const uploadFormData = new FormData()
      uploadFormData.append("file", editedFile)
      uploadFormData.append("folder", "store-info")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData((prev) => ({ ...prev, image: data.url }))
        setEditingImage(null)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const response = await fetch("/api/store-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Store info saved successfully!")
        await fetchStoreInfo()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to save store info")
      }
    } catch (error) {
      console.error("Error saving store info:", error)
      alert("Failed to save store info")
    } finally {
      setSaving(false)
    }
  }

  if (session?.user?.type !== "admin") {
    return <div>Access denied. Admin only.</div>
  }

  if (loading) {
    return <div>Loading store info...</div>
  }

  return (
    <div>
      {editingImage && (
        <ImageEditor
          file={editingImage}
          onSave={handleImageEditorSave}
          onCancel={() => setEditingImage(null)}
        />
      )}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Store Information</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage store information shown in the about section on homepage
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            About Section Content
          </CardTitle>
          <CardDescription>
            Update the title, description, image, location, contact, and store hours displayed on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Visit Our Store in Lahore"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description about your store"
              />
            </div>

            <div>
              <Label htmlFor="image">Store Image</Label>
              <div className="space-y-2">
                {formData.image && (
                  <div className="relative w-full max-w-md">
                    <img
                      src={formData.image}
                      alt="Store"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="store-image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={uploading}
                      onClick={() => document.getElementById("store-image-upload")?.click()}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          {formData.image ? "Change Image" : "Upload Image"}
                        </>
                      )}
                    </Button>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., 26-Hajvery Center, Ichra Road, Lahore"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Contact Phone *</Label>
                <Input
                  id="contactPhone"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="e.g., 0323 9348438"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="storeHours">Store Hours</Label>
              <Textarea
                id="storeHours"
                rows={3}
                value={formData.storeHours || ""}
                onChange={(e) => setFormData({ ...formData, storeHours: e.target.value })}
                placeholder="e.g., Mon - Sat: 10:00 AM - 9:00 PM&#10;Sunday: 11:00 AM - 7:00 PM"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use line breaks to separate different days/hours
              </p>
            </div>

            <div>
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g., info@shahzadfabrics.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input
                  id="facebookUrl"
                  type="url"
                  value={formData.facebookUrl || ""}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  placeholder="e.g., https://facebook.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input
                  id="instagramUrl"
                  type="url"
                  value={formData.instagramUrl || ""}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  placeholder="e.g., https://instagram.com/yourprofile"
                />
              </div>
              <div>
                <Label htmlFor="tiktokUrl">TikTok URL</Label>
                <Input
                  id="tiktokUrl"
                  type="url"
                  value={formData.tiktokUrl || ""}
                  onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                  placeholder="e.g., https://tiktok.com/@yourprofile"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Store Info
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

