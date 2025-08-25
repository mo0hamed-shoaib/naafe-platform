import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { Toaster } from '@/components/ui/sonner'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background font-cairo flex flex-col">
      {/* Header */}
      <Header />
      
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
