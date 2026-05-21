"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Settings,
  Bell,
  Clock,
  Phone,
  Mail,
  MapPin,
  Bot,
  Save,
  CheckCircle2,
} from 'lucide-react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

export default function AdminSettingsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  
  const [settings, setSettings] = useState({
    businessName: 'Team12 Barbershop',
    phone: '(778) 562-8468',
    email: 'bookings@team12barbershop.com',
    address: 'Vancouver, BC',
    openTime: '10:00',
    closeTime: '17:00',
    aiAssistantEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    autoConfirm: false,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your changes have been saved successfully.',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <Toaster />

      <main className="lg:ml-[280px] min-h-screen">
        {/* Header */}
        <div className="glass border-b border-border/30 sticky top-0 z-30">
          <div className="px-6 py-4 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="pl-12 lg:pl-0">
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your shop settings</p>
              </div>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8 space-y-6 max-w-4xl">
          {/* Business Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Settings className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Business Information</h2>
                <p className="text-sm text-muted-foreground">Basic shop details</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={settings.businessName}
                  onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Address
                </Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
            </div>
          </motion.div>

          {/* Business Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Business Hours</h2>
                <p className="text-sm text-muted-foreground">Set your operating hours</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="openTime">Opening Time</Label>
                <Input
                  id="openTime"
                  type="time"
                  value={settings.openTime}
                  onChange={(e) => setSettings({ ...settings, openTime: e.target.value })}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="closeTime">Closing Time</Label>
                <Input
                  id="closeTime"
                  type="time"
                  value={settings.closeTime}
                  onChange={(e) => setSettings({ ...settings, closeTime: e.target.value })}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm text-amber-400">
                Note: Weekend hours are currently set to closed. Contact support to modify weekend availability.
              </p>
            </div>
          </motion.div>

          {/* AI Assistant */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">AI Booking Assistant</h2>
                <p className="text-sm text-muted-foreground">Configure voice assistant settings</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                <div>
                  <div className="font-medium">Enable AI Assistant</div>
                  <div className="text-sm text-muted-foreground">Allow AI to handle incoming booking calls</div>
                </div>
                <Switch
                  checked={settings.aiAssistantEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, aiAssistantEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                <div>
                  <div className="font-medium">Auto-Confirm Bookings</div>
                  <div className="text-sm text-muted-foreground">Automatically confirm AI bookings</div>
                </div>
                <Switch
                  checked={settings.autoConfirm}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoConfirm: checked })}
                />
              </div>
            </div>

            {settings.aiAssistantEnabled && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <p className="text-sm text-emerald-400">
                  AI Assistant is currently online and handling calls
                </p>
              </div>
            )}
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Bell className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Notifications</h2>
                <p className="text-sm text-muted-foreground">Manage notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-muted-foreground">Receive booking updates via email</div>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                <div>
                  <div className="font-medium">SMS Notifications</div>
                  <div className="text-sm text-muted-foreground">Receive booking updates via SMS</div>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
