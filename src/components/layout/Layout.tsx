import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { Toaster } from '@/components/ui/sonner'

interface LayoutProps {
  children: React.ReactNode
  isAuthenticated?: boolean
  user?: {
    name: string
    email: string
    avatar?: string
    role: 'seeker' | 'provider' | 'admin'
  }
}

export function Layout({ children, isAuthenticated = false, user }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background font-cairo flex flex-col">
      {/* Header */}
      <Header isAuthenticated={isAuthenticated} user={user} />
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        richColors
        closeButton
        duration={4000}
      />
    </div>
  )
}
