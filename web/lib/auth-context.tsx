"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('team12_admin_auth') === 'true'
    }
    return false
  })

  const login = useCallback((username: string, password: string) => {
    // Demo credentials
    if (username === 'admin' && password === 'pass2026') {
      setIsAuthenticated(true)
      if (typeof window !== 'undefined') {
        localStorage.setItem('team12_admin_auth', 'true')
      }
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('team12_admin_auth')
    }
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
