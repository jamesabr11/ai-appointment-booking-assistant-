"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  Scissors,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Calendar', href: '/admin/dashboard/calendar', icon: Calendar },
  { name: 'Bookings', href: '/admin/dashboard/bookings', icon: ClipboardList },
  { name: 'Customers', href: '/admin/dashboard/customers', icon: Users },
  { name: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/admin')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-border/30">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Scissors className="h-5 w-5 text-accent" />
          </div>
          <div>
            <span className="font-bold text-lg">Team12</span>
            <span className="text-xs text-muted-foreground block">Admin</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative group ${
                isActive
                  ? 'bg-accent/20 text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-accent"
                />
              )}
              <item.icon className={`h-5 w-5 ${isActive ? 'text-accent' : ''}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/30">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isMobileOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 bottom-0 w-[280px] glass z-50 lg:hidden"
      >
        <SidebarContent />
      </motion.aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 bottom-0 w-[280px] glass border-r border-border/30 z-40">
        <SidebarContent />
      </aside>
    </>
  )
}
