"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save, Edit, Trash2, Upload, X, Loader2, ArrowUp, ArrowDown } from "lucide-react"
import { ImageEditor } from "@/components/image-editor"

interface Product {
  id?: number
  name: string
  description: string
  fullDescription: string
  price: string
  originalPrice?: string
  image: string
  images: string[]
  categoryId: number
  type: "ladies" | "gents"
  inStock: boolean
  stockQuantity?: number
  material?: string
  width?: string
  weight?: string
  care?: string
  origin?: string
  colors: string[]
  sizes: string[]
  features: string[]
  rating?: number
  reviews?: number
  featured: boolean
  active: boolean
}

interface Category {
  id: number
  name: string
  type: "ladies" | "gents"
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Product>({
    name: "",
    description: "",
    fullDescription: "",
    price: "",
    originalPrice: "",
    image: "",
    images: [],
    categoryId: 0,
    type: "ladies",
    inStock: true,
    stockQuantity: 0,
    material: "",
    width: "",
    weight: "",
    care: "",
    origin: "",
    colors: [],
    sizes: [],
    features: [],
    rating: 0,
    reviews: 0,
    featured: false,
    active: true,
  })
  const [newColor, setNewColor] = useState("")
  const [newSize, setNewSize] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [newImage, setNewImage] = useState("")
  const [uploading, setUploading] = useState<"main" | "additional" | null>(null)
  const [editingImage, setEditingImage] = useState<{ file: File; type: "main" | "additional" } | null>(null)

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  const fetchCategories = async () => {
    try {
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
        ...ladies.map((c: any) => ({ id: c.id, name: c.name, type: "ladies" as const })),
        ...gents.map((c: any) => ({ id: c.id, name: c.name, type: "gents" as const })),
      ])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "main" | "additional") => {
    const file = e.target.files?.[0]
    if (!file) return
    setEditingImage({ file, type })
    e.target.value = ""
  }

  const handleImageEditorSave = async (editedFile: File) => {
    if (!editingImage) return

    const type = editingImage.type
    try {
      setUploading(type)
      const uploadFormData = new FormData()
      uploadFormData.append("file", editedFile)
      uploadFormData.append("folder", "products")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (response.ok) {
        const data = await response.json()
        if (type === "main") {
          setFormData((prev) => ({ ...prev, image: data.url }))
        } else {
          setFormData((prev) => ({ ...prev, images: [...prev.images, data.url] }))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingId
        ? `/api/products/${editingId}`
        : "/api/products/create"
      const method = "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchProducts()
        resetForm()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to save product")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Failed to save product")
    }
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id || null)
    setFormData(product)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: false }),
      })

      if (response.ok) {
        await fetchProducts()
      } else {
        alert("Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      fullDescription: "",
      price: "",
      originalPrice: "",
      image: "",
      images: [],
      categoryId: 0,
      type: "ladies",
      inStock: true,
      stockQuantity: 0,
      material: "",
      width: "",
      weight: "",
      care: "",
      origin: "",
      colors: [],
      sizes: [],
      features: [],
      rating: 0,
      reviews: 0,
      featured: false,
      active: true,
    })
    setEditingId(null)
    setShowForm(false)
    setNewColor("")
    setNewSize("")
    setNewFeature("")
    setNewImage("")
  }

  const addColor = () => {
    if (newColor.trim()) {
      setFormData({
        ...formData,
        colors: [...formData.colors, newColor.trim()],
      })
      setNewColor("")
    }
  }

  const removeColor = (index: number) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((_, i) => i !== index),
    })
  }

  const addSize = () => {
    if (newSize.trim()) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, newSize.trim()],
      })
      setNewSize("")
    }
  }

  const removeSize = (index: number) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== index),
    })
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      })
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    })
  }

  const addImage = () => {
    if (newImage.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, newImage.trim()],
      })
      setNewImage("")
    }
  }

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  const moveImageUp = (index: number) => {
    if (index === 0) return
    const newImages = [...formData.images]
    const temp = newImages[index]
    newImages[index] = newImages[index - 1]
    newImages[index - 1] = temp
    setFormData({ ...formData, images: newImages })
  }

  const moveImageDown = (index: number) => {
    if (index === formData.images.length - 1) return
    const newImages = [...formData.images]
    const temp = newImages[index]
    newImages[index] = newImages[index + 1]
    newImages[index + 1] = temp
    setFormData({ ...formData, images: newImages })
  }

  const filteredCategories = categories.filter((c) => c.type === formData.type)

  if (loading) {
    return <div>Loading...</div>
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
          <h1 className="text-2xl sm:text-3xl font-bold">Manage Products</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Add and manage products</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Cancel" : "Add Product"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Product" : "Add New Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
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
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        type: e.target.value as "ladies" | "gents",
                        categoryId: 0,
                      })
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="ladies">Ladies</option>
                    <option value="gents">Gents</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="categoryId">Category *</Label>
                <select
                  id="categoryId"
                  required
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: parseInt(e.target.value) })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value={0}>Select Category</option>
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="fullDescription">Full Description</Label>
                <Textarea
                  id="fullDescription"
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price * (e.g., PKR 1,200/meter)</Label>
                  <Input
                    id="price"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price (optional)</Label>
                  <Input
                    id="originalPrice"
                    value={formData.originalPrice || ""}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">Main Image * (Will appear as #1 on website)</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => handleFileSelect(e, "main")}
                        className="hidden"
                        id="main-image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        disabled={uploading === "main"}
                        onClick={() => document.getElementById("main-image-upload")?.click()}
                      >
                        {uploading === "main" ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Main Image
                          </>
                        )}
                      </Button>
                    </label>
                  </div>
                  {formData.image && (
                    <div className="relative">
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded z-10">
                        #1 Main
                      </div>
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: "" })}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        title="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Additional Images</Label>
                  <span className="text-sm text-muted-foreground">
                    Total Images on Website: <strong className="text-foreground">{1 + formData.images.length}</strong> (1 main + {formData.images.length} additional)
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => handleFileSelect(e, "additional")}
                        className="hidden"
                        id="additional-image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        disabled={uploading === "additional"}
                        onClick={() => document.getElementById("additional-image-upload")?.click()}
                      >
                        {uploading === "additional" ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Additional Image
                          </>
                        )}
                      </Button>
                    </label>
                  </div>
                  {formData.images.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground mb-2">
                        Drag order: Use ↑ ↓ buttons to reorder images. Order will be displayed on website.
                      </p>
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 border rounded-md bg-secondary/30">
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => moveImageUp(idx)}
                              disabled={idx === 0}
                              className="p-1 bg-background rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Move up"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveImageDown(idx)}
                              disabled={idx === formData.images.length - 1}
                              className="p-1 bg-background rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Move down"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="relative flex-1">
                            <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                              #{idx + 2}
                            </div>
                            <img
                              src={img}
                              alt={`Additional ${idx + 1}`}
                              className="w-full h-24 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              title="Remove image"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    value={formData.material || ""}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    value={formData.width || ""}
                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    value={formData.weight || ""}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="origin">Origin</Label>
                  <Input
                    id="origin"
                    value={formData.origin || ""}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="care">Care Instructions</Label>
                <Input
                  id="care"
                  value={formData.care || ""}
                  onChange={(e) => setFormData({ ...formData, care: e.target.value })}
                />
              </div>

              <div>
                <Label>Colors</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addColor())}
                    placeholder="Add color"
                  />
                  <Button type="button" onClick={addColor}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary/80 text-primary-foreground rounded-full text-xs font-medium flex items-center gap-2"
                    >
                      {color}
                      <button
                        type="button"
                        onClick={() => removeColor(idx)}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <Label>Sizes</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSize())}
                    placeholder="Add size"
                  />
                  <Button type="button" onClick={addSize}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.sizes.map((size, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary/80 text-primary-foreground rounded-full text-xs font-medium flex items-center gap-2"
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => removeSize(idx)}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <Label>Features</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    placeholder="Add feature"
                  />
                  <Button type="button" onClick={addFeature}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary/80 text-primary-foreground rounded-full text-xs font-medium flex items-center gap-2"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    value={formData.stockQuantity || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="reviews">Reviews Count</Label>
                  <Input
                    id="reviews"
                    type="number"
                    value={formData.reviews || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, reviews: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="flex items-end gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    />
                    <span className="text-sm">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? "Update" : "Create"} Product
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
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription>
                {product.type.charAt(0).toUpperCase() + product.type.slice(1)} - {product.price}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-md mb-4"
                />
              )}
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center gap-2 mb-4">
                {product.inStock ? (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    In Stock
                  </span>
                ) : (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
                {product.featured && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => product.id && handleDelete(product.id)}
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

