import { getUsers } from "@/lib/actions/users"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Shield, User as UserIcon } from "lucide-react"
import { RoleSelector } from "./role-selector"

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-slate-500">Manage user roles and custom permissions</p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Custom Permissions</TableHead>
              <TableHead className="text-right">Manage Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={user.role === "ADMIN" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.permissions.map((p) => (
                      <Badge key={p.id} variant="outline" className="text-[10px]">
                        {p.action}:{p.resource}
                      </Badge>
                    ))}
                    {user.permissions.length === 0 && (
                      <span className="text-xs text-slate-400">Default permissions</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <RoleSelector userId={user.id} currentRole={user.role} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
