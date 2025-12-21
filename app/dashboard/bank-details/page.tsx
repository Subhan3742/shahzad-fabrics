"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Building2, Loader2 } from "lucide-react"

interface BankDetails {
  bankName: string
  accountNumber: string
  accountTitle: string
  iban?: string
  swiftCode?: string
  branchName?: string
  branchAddress?: string
  contactPhone?: string
}

export default function BankDetailsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<BankDetails>({
    bankName: "",
    accountNumber: "",
    accountTitle: "",
    iban: "",
    swiftCode: "",
    branchName: "",
    branchAddress: "",
    contactPhone: "",
  })

  useEffect(() => {
    if (session?.user?.type !== "admin") {
      router.push("/dashboard")
      return
    }
    fetchBankDetails()
  }, [session, router])

  const fetchBankDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/bank-details", {
        method: "GET",
      })

      if (response.ok) {
        const data = await response.json()
        setFormData({
          bankName: data.bankName || "",
          accountNumber: data.accountNumber || "",
          accountTitle: data.accountTitle || "",
          iban: data.iban || "",
          swiftCode: data.swiftCode || "",
          branchName: data.branchName || "",
          branchAddress: data.branchAddress || "",
          contactPhone: data.contactPhone || "",
        })
      }
    } catch (error) {
      console.error("Error fetching bank details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const response = await fetch("/api/bank-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Bank details saved successfully!")
        await fetchBankDetails()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to save bank details")
      }
    } catch (error) {
      console.error("Error saving bank details:", error)
      alert("Failed to save bank details")
    } finally {
      setSaving(false)
    }
  }

  if (session?.user?.type !== "admin") {
    return <div>Access denied. Admin only.</div>
  }

  if (loading) {
    return <div>Loading bank details...</div>
  }

  return (
    <div>
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Bank Details</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage bank account information shown on checkout page
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Bank Account Information
          </CardTitle>
          <CardDescription>
            These details will be displayed to customers during checkout when they select online payment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankName">Bank Name *</Label>
                <Input
                  id="bankName"
                  required
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="e.g., Habib Bank Limited"
                />
              </div>
              <div>
                <Label htmlFor="accountNumber">Account Number *</Label>
                <Input
                  id="accountNumber"
                  required
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="e.g., 1234-5678-9012-3456"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="accountTitle">Account Title *</Label>
              <Input
                id="accountTitle"
                required
                value={formData.accountTitle}
                onChange={(e) => setFormData({ ...formData, accountTitle: e.target.value })}
                placeholder="e.g., Shahzad Fabrics"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="iban">IBAN (Optional)</Label>
                <Input
                  id="iban"
                  value={formData.iban || ""}
                  onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                  placeholder="e.g., PK36SCBL0000001123456702"
                />
              </div>
              <div>
                <Label htmlFor="swiftCode">SWIFT Code (Optional)</Label>
                <Input
                  id="swiftCode"
                  value={formData.swiftCode || ""}
                  onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
                  placeholder="e.g., HBLPKKA"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="branchName">Branch Name (Optional)</Label>
              <Input
                id="branchName"
                value={formData.branchName || ""}
                onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                placeholder="e.g., Main Branch"
              />
            </div>

            <div>
              <Label htmlFor="branchAddress">Branch Address (Optional)</Label>
              <Textarea
                id="branchAddress"
                rows={3}
                value={formData.branchAddress || ""}
                onChange={(e) => setFormData({ ...formData, branchAddress: e.target.value })}
                placeholder="Enter branch address"
              />
            </div>

            <div>
              <Label htmlFor="contactPhone">Contact Phone (Optional)</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone || ""}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="e.g., 0323 9348438"
              />
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
                    Save Bank Details
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


