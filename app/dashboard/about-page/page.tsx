"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, FileText, Loader2 } from "lucide-react"

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

export default function AboutPageManagement() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<AboutPageData>({
    pageTitle: "",
    pageSubtitle: "",
    storyTitle: "",
    storyContent: "",
    valuesTitle: "",
    value1Title: "",
    value1Content: "",
    value2Title: "",
    value2Content: "",
    value3Title: "",
    value3Content: "",
  })

  useEffect(() => {
    if (session?.user?.type !== "admin") {
      router.push("/dashboard")
      return
    }
    fetchAboutPage()
  }, [session, router])

  const fetchAboutPage = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/about-page", {
        method: "GET",
      })

      if (response.ok) {
        const data = await response.json()
        setFormData({
          pageTitle: data.pageTitle || "",
          pageSubtitle: data.pageSubtitle || "",
          storyTitle: data.storyTitle || "",
          storyContent: data.storyContent || "",
          valuesTitle: data.valuesTitle || "",
          value1Title: data.value1Title || "",
          value1Content: data.value1Content || "",
          value2Title: data.value2Title || "",
          value2Content: data.value2Content || "",
          value3Title: data.value3Title || "",
          value3Content: data.value3Content || "",
        })
      }
    } catch (error) {
      console.error("Error fetching about page:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const response = await fetch("/api/about-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("About page content saved successfully!")
        await fetchAboutPage()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to save about page content")
      }
    } catch (error) {
      console.error("Error saving about page:", error)
      alert("Failed to save about page content")
    } finally {
      setSaving(false)
    }
  }

  if (session?.user?.type !== "admin") {
    return <div>Access denied. Admin only.</div>
  }

  if (loading) {
    return <div>Loading about page content...</div>
  }

  return (
    <div>
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">About Page Content</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage the content displayed on the about page
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Page Header
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="pageTitle">Page Title *</Label>
              <Input
                id="pageTitle"
                required
                value={formData.pageTitle}
                onChange={(e) => setFormData({ ...formData, pageTitle: e.target.value })}
                placeholder="e.g., About Shahzad Fabrics"
              />
            </div>

            <div>
              <Label htmlFor="pageSubtitle">Page Subtitle</Label>
              <Textarea
                id="pageSubtitle"
                rows={3}
                value={formData.pageSubtitle || ""}
                onChange={(e) => setFormData({ ...formData, pageSubtitle: e.target.value })}
                placeholder="Enter page subtitle/description"
              />
            </div>

            <div>
              <Label htmlFor="storyTitle">Story Section Title *</Label>
              <Input
                id="storyTitle"
                required
                value={formData.storyTitle}
                onChange={(e) => setFormData({ ...formData, storyTitle: e.target.value })}
                placeholder="e.g., Our Story"
              />
            </div>

            <div>
              <Label htmlFor="storyContent">Story Content</Label>
              <Textarea
                id="storyContent"
                rows={8}
                value={formData.storyContent || ""}
                onChange={(e) => setFormData({ ...formData, storyContent: e.target.value })}
                placeholder="Enter story paragraphs. Use line breaks to separate paragraphs."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use double line breaks to separate paragraphs
              </p>
            </div>

            <div>
              <Label htmlFor="valuesTitle">Values Section Title</Label>
              <Input
                id="valuesTitle"
                value={formData.valuesTitle || ""}
                onChange={(e) => setFormData({ ...formData, valuesTitle: e.target.value })}
                placeholder="e.g., Our Values"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="value1Title">Value 1 Title</Label>
                <Input
                  id="value1Title"
                  value={formData.value1Title || ""}
                  onChange={(e) => setFormData({ ...formData, value1Title: e.target.value })}
                  placeholder="e.g., Quality First"
                />
                <Textarea
                  rows={3}
                  className="mt-2"
                  value={formData.value1Content || ""}
                  onChange={(e) => setFormData({ ...formData, value1Content: e.target.value })}
                  placeholder="Value 1 description"
                />
              </div>
              <div>
                <Label htmlFor="value2Title">Value 2 Title</Label>
                <Input
                  id="value2Title"
                  value={formData.value2Title || ""}
                  onChange={(e) => setFormData({ ...formData, value2Title: e.target.value })}
                  placeholder="e.g., Customer Service"
                />
                <Textarea
                  rows={3}
                  className="mt-2"
                  value={formData.value2Content || ""}
                  onChange={(e) => setFormData({ ...formData, value2Content: e.target.value })}
                  placeholder="Value 2 description"
                />
              </div>
              <div>
                <Label htmlFor="value3Title">Value 3 Title</Label>
                <Input
                  id="value3Title"
                  value={formData.value3Title || ""}
                  onChange={(e) => setFormData({ ...formData, value3Title: e.target.value })}
                  placeholder="e.g., Trust & Integrity"
                />
                <Textarea
                  rows={3}
                  className="mt-2"
                  value={formData.value3Content || ""}
                  onChange={(e) => setFormData({ ...formData, value3Content: e.target.value })}
                  placeholder="Value 3 description"
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
                    Save About Page Content
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


