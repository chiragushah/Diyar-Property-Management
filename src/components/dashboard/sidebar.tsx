"use client"

import Link from "next/link"
import Image from "next/image"
import { signOut } from "next-auth/react"
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
  Globe,
  BarChart3,
  FolderOpen,
  Briefcase,
  Receipt,
  Users2
} from "lucide-react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Target, label: "CRM (Leads)", href: "/dashboard/crm" },
  { icon: Globe, label: "Marketplace", href: "/dashboard/marketplace" },
  { icon: BarChart3, label: "Owner Insights", href: "/dashboard/owner" },
  { icon: Wrench, label: "Vendors", href: "/dashboard/vendor" },
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
        <h1 className="text-2xl font-bold text-blue-400">PropSphere</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto font-sans">
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
      <div className="p-4 border-t border-slate-800 font-sans">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-slate-800 transition-colors mb-4"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>

        <div className="mt-auto pt-4 border-t border-slate-800 flex flex-col items-center gap-2">
          <Image
            src="/dynaimers-logo.jpg"
            alt="Dynaimers Logo"
            width={120}
            height={40}
            className="rounded opacity-80"
          />
          <p className="text-[10px] text-slate-500 text-center leading-tight">
            Conceptualized and Developed by<br/>
            <span className="font-semibold">Dynaimers Consulting Pvt. Ltd.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
