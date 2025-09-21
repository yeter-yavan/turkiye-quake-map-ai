import { Link } from 'react-router-dom'
import { MapIcon, ListIcon, BarChart3Icon } from 'lucide-react'
import { useAppStore } from '@/stores/app'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

interface SidebarProps {
  open: boolean
}

export function Sidebar({ open }: SidebarProps) {
  const { toggleSidebar } = useAppStore()

  const navigation = [
    { path: '/', label: 'Harita Görünümü', icon: MapIcon },
    { path: '/list', label: 'Liste Görünümü', icon: ListIcon },
    { path: '/analytics', label: 'Analiz Görünümü', icon: BarChart3Icon }
  ]

  return (
    <Sheet open={open} onOpenChange={toggleSidebar}>
      <SheetContent side="right" className="w-64">
        <SheetHeader>
          <SheetTitle>Menü</SheetTitle>
        </SheetHeader>
        
        <nav className="mt-6 space-y-2">
          {navigation.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path} onClick={toggleSidebar}>
              <Button
                variant="ghost"
                className="w-full justify-start space-x-3 h-12"
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Button>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
} 