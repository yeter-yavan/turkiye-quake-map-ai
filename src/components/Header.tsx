import { Link, useLocation } from 'react-router-dom'
import { MapIcon, ListIcon, BarChart3Icon, MenuIcon, WifiIcon, WifiOffIcon } from 'lucide-react'
import { useAppStore, useIsConnected } from '@/stores/app'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatTime } from '@/lib/utils'

export function Header() {
  const location = useLocation()
  const { lastUpdate, toggleSidebar } = useAppStore()
  const isConnected = useIsConnected()

  const navigation = [
    { path: '/', label: 'Harita', icon: MapIcon },
    { path: '/list', label: 'Liste', icon: ListIcon },
    { path: '/analytics', label: 'Analiz', icon: BarChart3Icon }
  ]

  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MapIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Türkiye Deprem Haritası</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              AI Destekli
            </Badge>
            <Badge variant="outline" className="text-xs">
              Kandilli Verisi
            </Badge>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path
              return (
                <Link key={path} to={path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>
          
          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Connection status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-sm text-muted-foreground flex items-center space-x-1">
                {isConnected ? (
                  <>
                    <WifiIcon className="w-3 h-3" />
                    <span>Bağlı</span>
                  </>
                ) : (
                  <>
                    <WifiOffIcon className="w-3 h-3" />
                    <span>Bağlantı Yok</span>
                  </>
                )}
              </span>
            </div>
            
            {/* Last update */}
            {lastUpdate && (
              <div className="text-sm text-muted-foreground">
                Son: {formatTime(lastUpdate)}
              </div>
            )}
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <MenuIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 