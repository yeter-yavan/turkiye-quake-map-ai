import { AlertTriangle, X } from 'lucide-react'
import { useAppStore } from '@/stores/app'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function ErrorBanner() {
  const { error, clearError } = useAppStore()

  if (!error) return null

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{error}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearError}
          className="h-auto p-1 text-destructive-foreground hover:text-destructive-foreground/80"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
} 