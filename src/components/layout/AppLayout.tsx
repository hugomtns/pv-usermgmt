import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Toaster } from '@/components/ui/toaster'
import './AppLayout.css'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-layout__main">
        <div className="app-layout__content">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  )
}
