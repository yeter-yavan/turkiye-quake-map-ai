import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFoundView() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Sayfa Bulunamadı</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => navigate('/')}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Ana Sayfa</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Geri Dön</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 