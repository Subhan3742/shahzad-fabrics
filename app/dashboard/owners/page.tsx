"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save, Edit, Trash2, Upload, X, Loader2, Users, ArrowUp, ArrowDown } from "lucide-react"
import { ImageEditor } from "@/components/image-editor"
import Image from "next/image"

interface Owner {
  id: number
  name: string
  image?: string
  description?: string
  order: number
}

export default function OwnersPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [owners, setOwners] = useState<Owner[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<number | "new" | null>(null)
  const [editingImage, setEditingImage] = useState<{ file: File; ownerId: number | "new" } | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null)
  const [formData, setFormData] = useState<Owner>({
    id: 0,
    name: "",
    image: "",
    description: "",
    order: 0,
  })

  useEffect(() => {
    if (session?.user?.type !== "admin") {
      router.push("/dashboard")
      return
    }
    fetchOwners()
  }, [session, router])

  const fetchOwners = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/owners", {
        method: "GET",
      })

      if (response.ok) {
        const data = await response.json()
        setOwners(data)
      }
    } catch (error) {
      console.error("Error fetching owners:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, ownerId: number | "new") => {
    const file = e.target.files?.[0]
    if (!file) return
    setEditingImage({ file, ownerId })
    e.target.value = ""
  }

  const handleImageEditorSave = async (editedFile: File) => {
    if (!editingImage) return

    const ownerId = editingImage.ownerId
    try {
      setUploading(ownerId)
      const uploadFormData = new FormData()
      uploadFormData.append("file", editedFile)
      uploadFormData.append("folder", "owners")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (response.ok) {
        const data = await response.json()
        // If we're in the form (creating or editing), update formData
        if (showForm) {
          setFormData((prev) => ({ ...prev, image: data.url }))
        } else if (typeof ownerId === "number" && ownerId > 0) {
          // Update existing owner directly (when not in form)
          await updateOwnerImage(ownerId, data.url)
        }
        setEditingImage(null)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Failed to upload image")
    } finally {
      setUploading(null)
    }
  }

  const updateOwnerImage = async (ownerId: number, imageUrl: string) => {
    const owner = owners.find((o) => o.id === ownerId)
    if (!owner) return

    try {
      const response = await fetch("/api/owners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          ownerId: ownerId.toString(),
          name: owner.name,
          image: imageUrl,
          description: owner.description,
          order: owner.order,
        }),
      })

      if (response.ok) {
        await fetchOwners()
      }
    } catch (error) {
      console.error("Error updating owner image:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const url = "/api/owners"
      const body = editingOwner
        ? {
            action: "update",
            ownerId: editingOwner.id.toString(),
            name: formData.name,
            image: formData.image || null,
            description: formData.description || null,
            order: formData.order,
          }
        : {
            action: "create",
            name: formData.name,
            image: formData.image || null,
            description: formData.description || null,
            order: owners.length,
          }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        await fetchOwners()
        resetForm()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to save owner")
      }
    } catch (error) {
      console.error("Error saving owner:", error)
      alert("Failed to save owner")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (owner: Owner) => {
    setEditingOwner(owner)
    setFormData(owner)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this owner?")) return

    try {
      const response = await fetch("/api/owners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", ownerId: id.toString() }),
      })

      if (response.ok) {
        await fetchOwners()
      } else {
        alert("Failed to delete owner")
      }
    } catch (error) {
      console.error("Error deleting owner:", error)
      alert("Failed to delete owner")
    }
  }

  const moveOwner = async (ownerId: number, direction: "up" | "down") => {
    const ownerIndex = owners.findIndex((o) => o.id === ownerId)
    if (ownerIndex === -1) return

    const newIndex = direction === "up" ? ownerIndex - 1 : ownerIndex + 1
    if (newIndex < 0 || newIndex >= owners.length) return

    const owner = owners[ownerIndex]
    const targetOwner = owners[newIndex]

    try {
      // Swap orders
      await Promise.all([
        fetch("/api/owners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update",
            ownerId: owner.id.toString(),
            name: owner.name,
            image: owner.image,
            description: owner.description,
            order: targetOwner.order,
          }),
        }),
        fetch("/api/owners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update",
            ownerId: targetOwner.id.toString(),
            name: targetOwner.name,
            image: targetOwner.image,
            description: targetOwner.description,
            order: owner.order,
          }),
        }),
      ])

      await fetchOwners()
    } catch (error) {
      console.error("Error moving owner:", error)
      alert("Failed to reorder owner")
    }
  }

  const resetForm = () => {
    setFormData({
      id: 0,
      name: "",
      image: "",
      description: "",
      order: 0,
    })
    setEditingOwner(null)
    setShowForm(false)
  }

  if (session?.user?.type !== "admin") {
    return <div>Access denied. Admin only.</div>
  }

  if (loading) {
    return <div>Loading owners...</div>
  }

  return (
    <div>
      {editingImage && (
        <ImageEditor
          file={editingImage.file}
          onSave={handleImageEditorSave}
          onCancel={() => setEditingImage(null)}
        />
      )}
      <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Owners Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage owner information and photos displayed on the about page
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Cancel" : "Add Owner"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingOwner ? "Edit Owner" : "Add New Owner"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Owner Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Owner 1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter owner description"
                />
              </div>

              <div>
                <Label htmlFor="image">Owner Photo</Label>
                <div className="space-y-2">
                  {formData.image && (
                    <div className="relative w-full max-w-xs">
                      <img
                        src={formData.image}
                        alt="Owner"
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
                        onChange={(e) => handleFileSelect(e, editingOwner?.id || "new")}
                        className="hidden"
                        id="owner-image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        disabled={uploading === (editingOwner?.id || "new")}
                        onClick={() => document.getElementById("owner-image-upload")?.click()}
                      >
                        {uploading === (editingOwner?.id || "new") ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            {formData.image ? "Change Photo" : "Upload Photo"}
                          </>
                        )}
                      </Button>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingOwner ? "Update" : "Create"} Owner
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {owners.map((owner, index) => (
          <Card key={owner.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{owner.name}</span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveOwner(owner.id, "up")}
                    disabled={index === 0}
                    className="h-8 w-8"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveOwner(owner.id, "down")}
                    disabled={index === owners.length - 1}
                    className="h-8 w-8"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {owner.image && (
                <div className="relative w-full aspect-[3/4] mb-4 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={owner.image}
                    alt={owner.name}
                    fill
                    className="object-cover"
                    onError={(e: { currentTarget: { src: string } }) => {
                      e.currentTarget.src = "/placeholder-user.jpg"
                    }}
                  />
                </div>
              )}
              {owner.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {owner.description}
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(owner)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(owner.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {owners.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No owners added yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

