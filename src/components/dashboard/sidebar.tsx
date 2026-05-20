import Link from "next/link"
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Wrench,
  DollarSign,
  Settings,
  LogOut,
  Target,
  FolderOpen,
  Briefcase,
  Receipt,
  Users2
} from "lucide-react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Target, label: "CRM (Leads)", href: "/dashboard/crm" },
  { icon: Building2, label: "Properties", href: "/dashboard/properties" },
  { icon: Users, label: "Tenants", href: "/dashboard/tenants" },
  { icon: FileText, label: "Leases", href: "/dashboard/leases" },
  { icon: Wrench, label: "Maintenance", href: "/dashboard/maintenance" },
  { icon: FolderOpen, label: "Documents", href: "/dashboard/documents" },
  { icon: Briefcase, label: "Projects", href: "/dashboard/projects" },
  { icon: Receipt, label: "Invoices", href: "/dashboard/invoices" },
  { icon: DollarSign, label: "Financials", href: "/dashboard/financials" },
  { icon: Users2, label: "User Management", href: "/dashboard/users" },
]

export default function Sidebar() {
  return (
    <div className="flex flex-col w-64 h-screen bg-slate-900 text-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-400">PropMgmt CRM</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-slate-800 transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
