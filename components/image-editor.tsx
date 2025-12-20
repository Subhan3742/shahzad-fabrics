"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, RotateCw, ZoomIn, ZoomOut, Sun, Contrast, Check, RotateCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ImageEditorProps {
  file: File
  onSave: (editedFile: File) => void
  onCancel: () => void
}

export function ImageEditor({ file, onSave, onCancel }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [imageSrc, setImageSrc] = useState<string>("")
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)

  useEffect(() => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [file])

  useEffect(() => {
    if (imageSrc && canvasRef.current) {
      drawImage()
    }
  }, [imageSrc, rotation, scale, brightness, contrast])

  const drawImage = () => {
    const canvas = canvasRef.current
    if (!canvas || !imageSrc) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      imageRef.current = img
      
      // Set canvas size
      const maxWidth = 800
      const maxHeight = 600
      const aspectRatio = img.width / img.height
      
      let canvasWidth = Math.min(img.width, maxWidth)
      let canvasHeight = canvasWidth / aspectRatio
      
      if (canvasHeight > maxHeight) {
        canvasHeight = maxHeight
        canvasWidth = canvasHeight * aspectRatio
      }

      canvas.width = canvasWidth
      canvas.height = canvasHeight

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Apply filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`

      // Calculate scaled dimensions
      const scaledWidth = canvasWidth * scale
      const scaledHeight = canvasHeight * scale
      const x = (canvas.width - scaledWidth) / 2
      const y = (canvas.height - scaledHeight) / 2

      // Save context
      ctx.save()

      // Rotate around center
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)

      // Draw image
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

      ctx.restore()
    }
    img.src = imageSrc
  }

  const handleSave = async () => {
    const canvas = canvasRef.current
    if (!canvas || !imageRef.current) return

    // Create final canvas with original image dimensions
    const img = imageRef.current
    const finalCanvas = document.createElement("canvas")
    const finalCtx = finalCanvas.getContext("2d")
    if (!finalCtx) return

    finalCanvas.width = img.width
    finalCanvas.height = img.height

    // Apply filters
    finalCtx.filter = `brightness(${brightness}%) contrast(${contrast}%)`

    // Calculate scaled dimensions
    const scaledWidth = img.width * scale
    const scaledHeight = img.height * scale
    const x = (finalCanvas.width - scaledWidth) / 2
    const y = (finalCanvas.height - scaledHeight) / 2

    // Draw with rotation
    finalCtx.save()
    finalCtx.translate(finalCanvas.width / 2, finalCanvas.height / 2)
    finalCtx.rotate((rotation * Math.PI) / 180)
    finalCtx.translate(-finalCanvas.width / 2, -finalCanvas.height / 2)
    finalCtx.drawImage(img, x, y, scaledWidth, scaledHeight)
    finalCtx.restore()

    // Convert to blob and create file
    finalCanvas.toBlob(
      (blob) => {
        if (blob) {
          const editedFile = new File([blob], file.name, { type: file.type })
          onSave(editedFile)
        }
      },
      file.type,
      0.95
    )
  }

  const resetAdjustments = () => {
    setRotation(0)
    setScale(1)
    setBrightness(100)
    setContrast(100)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit Image - Adjust & Upload</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center bg-secondary/30 p-4 rounded-lg">
            <canvas
              ref={canvasRef}
              className="border rounded-md max-w-full"
              style={{ maxHeight: "500px" }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Rotate */}
            <div>
              <label className="text-sm font-medium mb-2 block">Rotate</label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation((r) => r - 90)}
                  title="Rotate Left"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <span className="text-sm w-16 text-center">{rotation}°</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation((r) => r + 90)}
                  title="Rotate Right"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Zoom */}
            <div>
              <label className="text-sm font-medium mb-2 block">Zoom</label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm w-16 text-center">{Math.round(scale * 100)}%</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setScale((s) => Math.min(2, s + 0.1))}
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Brightness */}
            <div>
              <label className="text-sm font-medium mb-2 block">Brightness</label>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm w-12 text-center">{brightness}%</span>
              </div>
            </div>

            {/* Contrast */}
            <div>
              <label className="text-sm font-medium mb-2 block">Contrast</label>
              <div className="flex items-center gap-2">
                <Contrast className="h-4 w-4" />
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm w-12 text-center">{contrast}%</span>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={resetAdjustments}>
              Reset All Adjustments
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Check className="h-4 w-4 mr-2" />
              Save & Upload
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
