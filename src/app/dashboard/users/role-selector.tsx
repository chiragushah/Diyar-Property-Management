"use client"

import { useState } from "react"
import { updateUserRole } from "@/lib/actions/users"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

export function RoleSelector({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [loading, setLoading] = useState(false)

  const handleRoleChange = async (newRole: string | null) => {
    if (!newRole) return
    setLoading(true)
    try {
      await updateUserRole(userId, newRole)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Select defaultValue={currentRole} onValueChange={handleRoleChange} disabled={loading}>
      <SelectTrigger className="w-[130px] h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="MANAGER">Manager</SelectItem>
        <SelectItem value="OWNER">Owner</SelectItem>
        <SelectItem value="TENANT">Tenant</SelectItem>
      </SelectContent>
    </Select>
  )
}
