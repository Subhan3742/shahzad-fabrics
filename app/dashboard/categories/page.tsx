"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save, Edit, Trash2, Upload, X, Loader2 } from "lucide-react"
import { ImageEditor } from "@/components/image-editor"

interface Category {
  id?: number
  name: string
  description: string
  image: string
  type: "ladies" | "gents"
  items: string[]
  active: boolean
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Category>({
    name: "",
    description: "",
    image: "",
    type: "ladies",
    items: [],
    active: true,
  })
  const [newItem, setNewItem] = useState("")
  const [uploading, setUploading] = useState(false)
  const [editingImage, setEditingImage] = useState<File | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const [ladiesRes, gentsRes] = await Promise.all([
        fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "ladies" }),
        }),
        fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "gents" }),
        }),
      ])

      const ladies = await ladiesRes.json()
      const gents = await gentsRes.json()

      setCategories([
        ...ladies.map((c: any) => ({ ...c, type: "ladies" as const, items: c.items || [] })),
        ...gents.map((c: any) => ({ ...c, type: "gents" as const, items: c.items || [] })),
      ])
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingId
        ? `/api/categories/${editingId}`
        : "/api/categories/create"
      const method = "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchCategories()
        resetForm()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to save category")
      }
    } catch (error) {
      console.error("Error saving category:", error)
      alert("Failed to save category")
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
      uploadFormData.append("folder", "categories")

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

  const handleEdit = (category: Category) => {
    setEditingId(category.id || null)
    setFormData({
      ...category,
      items: category.items || [],
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: false }),
      })

      if (response.ok) {
        await fetchCategories()
      } else {
        alert("Failed to delete category")
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Failed to delete category")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      type: "ladies",
      items: [],
      active: true,
    })
    setEditingId(null)
    setShowForm(false)
    setNewItem("")
  }

  const addItem = () => {
    if (newItem.trim()) {
      setFormData({
        ...formData,
        items: [...(formData.items || []), newItem.trim()],
      })
      setNewItem("")
    }
  }

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    })
  }

  if (loading) {
    return <div>Loading...</div>
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
      <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Manage Categories</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Add and manage product categories</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Cancel" : "Add Category"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Category" : "Add New Category"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <select
                    id="type"
                    required
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as "ladies" | "gents" })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="ladies">Ladies</option>
                    <option value="gents">Gents</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="image">Image *</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        disabled={uploading}
                        onClick={() => document.getElementById("image-upload")?.click()}
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </>
                        )}
                      </Button>
                    </label>
                  </div>
                  {formData.image && (
                    <div className="relative">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md"
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
                </div>
              </div>
              <div>
                <Label>Items</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem())}
                    placeholder="Add item (e.g., Floral Lawn)"
                  />
                  <Button type="button" onClick={addItem}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.items || []).map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary/80 text-primary-foreground rounded-full text-xs font-medium flex items-center gap-2"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? "Update" : "Create"} Category
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
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>
                {category.type.charAt(0).toUpperCase() + category.type.slice(1)} Collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-32 object-cover rounded-md mb-4"
                />
              )}
              <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {(category.items || []).slice(0, 3).map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-primary/80 text-primary-foreground rounded-full text-xs"
                  >
                    {item}
                  </span>
                ))}
                {(category.items || []).length > 3 && (
                  <span className="px-2 py-1 text-xs text-muted-foreground">
                    +{(category.items || []).length - 3} more
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => category.id && handleDelete(category.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

