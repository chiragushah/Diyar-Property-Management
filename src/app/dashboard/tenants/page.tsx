"use client"

import React, { useState } from "react"
import { getTenants, createTenant } from "@/lib/actions/tenants"
import { Button } from "@/components/ui/button"
import { Plus, User, Phone, Mail, Home, Loader2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Tenant {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  leases: any[]
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  React.useEffect(() => {
    async function load() {
      const data = await getTenants()
      setTenants(data as unknown as Tenant[])
      setLoading(false)
    }
    load()
  }, [])

  const handleAddTenant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)

    try {
      const data = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
      }

      const newTenant = await createTenant(data)
      setTenants(prev => [{ ...newTenant, leases: [] } as unknown as Tenant, ...prev])
      setIsDialogOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <div className="p-8">Loading tenants...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tenants</h1>
          <p className="text-slate-500">Manage your tenant relationships and leases</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="w-4 h-4 mr-2" />
            Add Tenant
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tenant</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTenant} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" placeholder="Doe" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" placeholder="+1 (555) 000-0000" />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : "Create Tenant"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Active Lease</TableHead>
              <TableHead>Property/Unit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => {
              const activeLease = tenant.leases.find(l => l.status === "ACTIVE")
              return (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{tenant.firstName} {tenant.lastName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail className="w-3 h-3" />
                        {tenant.email}
                      </div>
                      {tenant.phone && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Phone className="w-3 h-3" />
                          {tenant.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {activeLease ? (
                      <div className="text-sm font-medium">
                        ${activeLease.rentAmount}/mo
                      </div>
                    ) : (
                      <span className="text-slate-400">No active lease</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {activeLease ? (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Home className="w-3 h-3" />
                        {activeLease.unit.property.name} - Unit {activeLease.unit.unitNumber}
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={activeLease ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"}>
                      {activeLease ? "Current" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              )
            })}
            {tenants.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  No tenants found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
