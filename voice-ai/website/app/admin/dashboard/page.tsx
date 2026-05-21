"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  PhoneOff,
  TrendingUp,
  Users,
  Bot,
  ArrowUpRight,
} from 'lucide-react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { useAuth } from '@/lib/auth-context'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Appointment {
  id: number
  customer_name: string
  customer_phone: string
  service: string
  barber: string
  date: string
  time: string
  status: string
  source: string
}

interface Stats {
  today: number
  pending: number
  confirmed: number
  total: number
}


interface ActivityItem {
  id: number
  type: string
  message: string
  appointment_id?: number | null
  customer_name?: string | null
  status?: string | null
  created_at: string
}

function formatRelativeTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Just now'

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000))
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

function getActivityIcon(type: string) {
  if (type === 'booking') return Bot
  if (type === 'confirmed') return CheckCircle2
  if (type === 'completed') return CheckCircle2
  if (type === 'cancelled' || type === 'deleted') return PhoneOff
  return Users
}

function getActivityStyles(type: string) {
  if (type === 'booking') return { box: 'bg-accent/20', icon: 'text-accent' }
  if (type === 'confirmed' || type === 'completed') return { box: 'bg-emerald-500/20', icon: 'text-emerald-400' }
  if (type === 'cancelled' || type === 'deleted') return { box: 'bg-red-500/20', icon: 'text-red-400' }
  return { box: 'bg-primary/20', icon: 'text-primary' }
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  
  const today = new Date().toISOString().split('T')[0]
  
  const { data: stats } = useSWR<Stats>('/api/appointments?stats=true', fetcher, { refreshInterval: 5000 })
  const { data: todaysAppointments } = useSWR<Appointment[]>(`/api/appointments?date=${today}`, fetcher, { refreshInterval: 5000 })
  const { data: recentActivity = [] } = useSWR<ActivityItem[]>('/api/activity?limit=8', fetcher, { refreshInterval: 3000 })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const statCards = [
    {
      title: "Today's Bookings",
      value: stats?.today?.toString() || '0',
      icon: CalendarDays,
      color: 'from-accent/20 to-blue-500/10',
      iconColor: 'text-accent',
      change: '+12%',
    },
    {
      title: 'Confirmed Appointments',
      value: stats?.confirmed?.toString() || '0',
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-teal-500/10',
      iconColor: 'text-emerald-400',
      change: '+8%',
    },
    {
      title: 'Pending Confirmations',
      value: stats?.pending?.toString() || '0',
      icon: Clock,
      color: 'from-amber-500/20 to-orange-500/10',
      iconColor: 'text-amber-400',
      change: '-3%',
    },
    {
      title: 'Total Bookings',
      value: stats?.total?.toString() || '0',
      icon: Users,
      color: 'from-primary/20 to-rose-500/10',
      iconColor: 'text-primary',
      change: '+15%',
    },
  ]


  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      {/* Main Content */}
      <main className="lg:ml-[280px] min-h-screen">
        {/* Header */}
        <div className="glass border-b border-border/30 sticky top-0 z-30">
          <div className="px-6 py-4 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="pl-12 lg:pl-0">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Team12 Admin Dashboard</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">AI Assistant Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    stat.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    <TrendingUp className={`h-3 w-3 ${stat.change.startsWith('-') ? 'rotate-180' : ''}`} />
                    {stat.change}
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.title}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Today's Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 glass-card rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Today&apos;s Schedule</h2>
                <a
                  href="/admin/dashboard/calendar"
                  className="text-sm text-accent hover:text-accent/80 flex items-center gap-1"
                >
                  View Calendar
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>

              {todaysAppointments && todaysAppointments.length > 0 ? (
                <div className="space-y-3">
                  {todaysAppointments.slice(0, 5).map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold">
                          {appointment.customer_name[0]}
                        </div>
                        <div>
                          <div className="font-medium">{appointment.customer_name}</div>
                          <div className="text-sm text-muted-foreground">{appointment.service} with {appointment.barber}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{appointment.time}</div>
                        <div className={`text-xs px-2 py-0.5 rounded-full inline-flex ${
                          appointment.status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : appointment.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400'
                            : appointment.status === 'completed'
                            ? 'bg-accent/20 text-accent'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No bookings scheduled for today</p>
                </div>
              )}
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.length > 0 ? recentActivity.map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity.type)
                  const styles = getActivityStyles(activity.type)
                  return (
                    <motion.div
                      key={activity.id || `${activity.type}-${index}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${styles.box}`}>
                        <ActivityIcon className={`h-4 w-4 ${styles.icon}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.created_at)}</p>
                      </div>
                    </motion.div>
                  )
                }) : (
                  <div className="text-sm text-muted-foreground">
                    New bookings and status changes will show up here.
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* AI Assistant Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">AI Booking Assistant</h2>
                <p className="text-sm text-muted-foreground">Performance overview</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-4 gap-6">
              {[
                { label: 'Calls Handled', value: '47', change: '+23%' },
                { label: 'Bookings Created', value: '32', change: '+18%' },
                { label: 'Avg. Call Duration', value: '45s', change: '-12%' },
                { label: 'Success Rate', value: '94%', change: '+5%' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                  <div className={`text-xs font-medium ${
                    stat.change.startsWith('+') ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {stat.change} this week
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
