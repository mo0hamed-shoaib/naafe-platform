import React, { useState } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { Sidebar } from './Sidebar'
import { Toaster } from '@/components/ui/sonner'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background font-cairo flex flex-col" dir="rtl">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        تخطي إلى المحتوى الرئيسي
      </a>
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-left"
        richColors
        closeButton
        duration={4000}
      />
    </div>
  )
}
