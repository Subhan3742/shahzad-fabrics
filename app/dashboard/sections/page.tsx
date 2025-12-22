"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save, Upload, X, Loader2, Trash2 } from "lucide-react"
import { ImageEditor } from "@/components/image-editor"

interface Section {
  id?: number
  type: "ladies" | "gents"
  title: string
  description: string
  image: string
  items: string[]
}

export default function SectionsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [editingType, setEditingType] = useState<"ladies" | "gents" | null>(null)
  
  // Separate form states for each section
  const [ladiesForm, setLadiesForm] = useState<Section>({
    type: "ladies",
    title: "",
    description: "",
    image: "",
    items: [],
  })
  const [gentsForm, setGentsForm] = useState<Section>({
    type: "gents",
    title: "",
    description: "",
    image: "",
    items: [],
  })
  
  const [ladiesNewItem, setLadiesNewItem] = useState("")
  const [gentsNewItem, setGentsNewItem] = useState("")
  const [uploading, setUploading] = useState<"ladies" | "gents" | null>(null)
  const [editingImage, setEditingImage] = useState<{ file: File; type: "ladies" | "gents" } | null>(null)

  useEffect(() => {
    // Wait for session to load
    if (session === undefined) {
      // Session is still loading
      return
    }
    
    // If no session, middleware should redirect, but check anyway
    if (!session) {
      router.push("/login")
      return
    }
    
    // Check if user is admin
    if (session.user?.type !== "admin") {
      router.push("/dashboard")
      return
    }
    
    // User is admin, fetch sections
    fetchSections()
  }, [session, router])

  const fetchSections = async () => {
    try {
      setLoading(true)
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "ladies" | "gents") => {
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
      const formData = new FormData()
      formData.append("file", editedFile)
      formData.append("folder", "sections")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        if (type === "ladies") {
          setLadiesForm({ ...ladiesForm, image: data.url })
        } else {
          setGentsForm({ ...gentsForm, image: data.url })
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

  const handleEdit = (section: Section) => {
    setEditingType(section.type)
    if (section.type === "ladies") {
      setLadiesForm(section)
    } else {
      setGentsForm(section)
    }
  }

  const handleSave = async (type: "ladies" | "gents") => {
    const formData = type === "ladies" ? ladiesForm : gentsForm
    
    if (!formData.title?.trim()) {
      alert("Title is required")
      return
    }
    
    if (!formData.image?.trim()) {
      alert("Image is required. Please upload an image.")
      return
    }

    try {
      const section = sections.find((s) => s.type === type)
      
      if (section?.id) {
        // Update existing section
        const response = await fetch(`/api/sections/${section.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update",
            ...formData,
          }),
        })

        if (response.ok) {
          await fetchSections()
          handleCancel(type)
        } else {
          const error = await response.json()
          alert(error.error || "Failed to update section")
        }
      } else {
        // Create new section
        const response = await fetch("/api/sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create",
            ...formData,
          }),
        })

        if (response.ok) {
          await fetchSections()
          handleCancel(type)
        } else {
          const error = await response.json()
          alert(error.error || "Failed to create section")
        }
      }
    } catch (error) {
      console.error("Error saving section:", error)
      alert("Failed to save section")
    }
  }

  const handleCancel = (type: "ladies" | "gents") => {
    setEditingType(null)
    if (type === "ladies") {
      const section = sections.find((s) => s.type === "ladies")
      setLadiesForm(section || {
        type: "ladies",
        title: "",
        description: "",
        image: "",
        items: [],
      })
      setLadiesNewItem("")
    } else {
      const section = sections.find((s) => s.type === "gents")
      setGentsForm(section || {
        type: "gents",
        title: "",
        description: "",
        image: "",
        items: [],
      })
      setGentsNewItem("")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this section?")) return

    try {
      const response = await fetch(`/api/sections/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete" }),
      })

      if (response.ok) {
        await fetchSections()
      } else {
        alert("Failed to delete section")
      }
    } catch (error) {
      console.error("Error deleting section:", error)
      alert("Failed to delete section")
    }
  }

  const addItem = (type: "ladies" | "gents", item: string) => {
    if (!item.trim()) return
    
    if (type === "ladies") {
      setLadiesForm({
        ...ladiesForm,
        items: [...ladiesForm.items, item.trim()],
      })
      setLadiesNewItem("")
    } else {
      setGentsForm({
        ...gentsForm,
        items: [...gentsForm.items, item.trim()],
      })
      setGentsNewItem("")
    }
  }

  const removeItem = (type: "ladies" | "gents", index: number) => {
    if (type === "ladies") {
      setLadiesForm({
        ...ladiesForm,
        items: ladiesForm.items.filter((_, i) => i !== index),
      })
    } else {
      setGentsForm({
        ...gentsForm,
        items: gentsForm.items.filter((_, i) => i !== index),
      })
    }
  }

  const removeImage = (type: "ladies" | "gents") => {
    if (type === "ladies") {
      setLadiesForm({ ...ladiesForm, image: "" })
    } else {
      setGentsForm({ ...gentsForm, image: "" })
    }
  }

  // Show loading while session is being checked
  if (session === undefined) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>
  }

  // If no session, show access denied (middleware should have redirected)
  if (!session) {
    return <div className="flex items-center justify-center min-h-[400px]">Access denied. Please login.</div>
  }

  // Check if user is admin
  if (session.user?.type !== "admin") {
    return <div className="flex items-center justify-center min-h-[400px]">Access denied. Admin only.</div>
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading sections...</div>
  }

  const ladiesSection = sections.find((s) => s.type === "ladies")
  const gentsSection = sections.find((s) => s.type === "gents")

  const renderSectionForm = (type: "ladies" | "gents", section: Section | undefined, formData: Section, newItem: string, setNewItem: (val: string) => void) => {
    const isEditing = editingType === type
    const sectionId = section?.id

    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {section ? section.title : `${type === "ladies" ? "Ladies" : "Gents"} Collection`}
          </CardTitle>
          <CardDescription>
            {section ? section.description : "No section configured"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing || !section ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor={`type-${type}`}>Type</Label>
                <select
                  id={`type-${type}`}
                  value={formData.type}
                  onChange={(e) => {
                    if (type === "ladies") {
                      setLadiesForm({ ...ladiesForm, type: e.target.value as "ladies" | "gents" })
                    } else {
                      setGentsForm({ ...gentsForm, type: e.target.value as "ladies" | "gents" })
                    }
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  disabled={!!sectionId}
                >
                  <option value="ladies">Ladies</option>
                  <option value="gents">Gents</option>
                </select>
              </div>
              <div>
                <Label htmlFor={`title-${type}`}>Title *</Label>
                <Input
                  id={`title-${type}`}
                  value={formData.title}
                  onChange={(e) => {
                    if (type === "ladies") {
                      setLadiesForm({ ...ladiesForm, title: e.target.value })
                    } else {
                      setGentsForm({ ...gentsForm, title: e.target.value })
                    }
                  }}
                  placeholder={type === "ladies" ? "Ladies Collection" : "Gents Collection"}
                />
              </div>
              <div>
                <Label htmlFor={`description-${type}`}>Description</Label>
                <Textarea
                  id={`description-${type}`}
                  value={formData.description}
                  onChange={(e) => {
                    if (type === "ladies") {
                      setLadiesForm({ ...ladiesForm, description: e.target.value })
                    } else {
                      setGentsForm({ ...gentsForm, description: e.target.value })
                    }
                  }}
                  placeholder={type === "ladies" ? "Exquisite fabrics for every occasion" : "Premium quality suiting and shirting"}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor={`image-${type}`}>Image *</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => handleFileSelect(e, type)}
                        className="hidden"
                        id={`image-upload-${type}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        disabled={uploading === type}
                        onClick={() => document.getElementById(`image-upload-${type}`)?.click()}
                      >
                        {uploading === type ? (
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
                        onClick={() => removeImage(type)}
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
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem(type, newItem))}
                    placeholder={type === "ladies" ? "Add item (e.g., Lawn, Chiffon)" : "Add item (e.g., Suiting, Shirting)"}
                  />
                  <Button type="button" onClick={() => addItem(type, newItem)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary/80 text-primary-foreground rounded-full text-xs font-medium flex items-center gap-2"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeItem(type, idx)}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleSave(type)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" onClick={() => handleCancel(type)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Items:</h3>
                <div className="flex flex-wrap gap-2">
                  {section.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary/80 text-primary-foreground rounded-full text-xs font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(section)}>Edit</Button>
                <Button variant="outline" onClick={() => handleDelete(section.id!)} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
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
          <h1 className="text-2xl sm:text-3xl font-bold">Manage Sections</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage Ladies and Gents collection sections</p>
        </div>
        {(!ladiesSection || !gentsSection) && (
          <Button onClick={() => {
            if (!ladiesSection) {
              setEditingType("ladies")
              setLadiesForm({ type: "ladies", title: "", description: "", image: "", items: [] })
            } else if (!gentsSection) {
              setEditingType("gents")
              setGentsForm({ type: "gents", title: "", description: "", image: "", items: [] })
            }
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        {renderSectionForm("ladies", ladiesSection, ladiesForm, ladiesNewItem, setLadiesNewItem)}
        {renderSectionForm("gents", gentsSection, gentsForm, gentsNewItem, setGentsNewItem)}
      </div>
    </div>
  )
}
