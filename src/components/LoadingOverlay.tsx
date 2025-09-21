import { Loader2 } from 'lucide-react'

interface LoadingOverlayProps {
  show: boolean
}

export function LoadingOverlay({ show }: LoadingOverlayProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 flex items-center space-x-3 shadow-lg border">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-foreground">Yükleniyor...</span>
      </div>
    </div>
  )
} 