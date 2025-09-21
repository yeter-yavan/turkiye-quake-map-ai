import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEarthquakeStore } from '@/stores/earthquake'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Clock, Gauge, AlertTriangle } from 'lucide-react'
import type { Earthquake } from '@/types'

export default function ListView() {
  const navigate = useNavigate()
  const { filteredEarthquakes, fetchEarthquakes, isLoading } = useEarthquakeStore()
  const [sortBy, setSortBy] = useState<'date' | 'magnitude' | 'depth'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetchEarthquakes()
  }, [fetchEarthquakes])

  const sortedEarthquakes = [...filteredEarthquakes].sort((a, b) => {
    let aValue: number
    let bValue: number

    switch (sortBy) {
      case 'magnitude':
        aValue = a.magnitude
        bValue = b.magnitude
        break
      case 'depth':
        aValue = a.depth
        bValue = b.depth
        break
      case 'date':
      default:
        aValue = new Date(a.date).getTime()
        bValue = new Date(b.date).getTime()
        break
    }

    if (sortOrder === 'asc') {
      return aValue - bValue
    } else {
      return bValue - aValue
    }
  })

  const handleEarthquakeClick = (earthquake: Earthquake) => {
    navigate(`/earthquake/${earthquake.id}`)
  }

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 6.0) return 'bg-red-500'
    if (magnitude >= 5.0) return 'bg-orange-500'
    if (magnitude >= 4.0) return 'bg-yellow-500'
    if (magnitude >= 3.0) return 'bg-green-500'
    return 'bg-gray-500'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Deprem Listesi</h1>
          <p className="text-muted-foreground mt-2">
            Türkiye'deki güncel deprem verilerini liste halinde görüntüleyin
          </p>
        </div>
        
        <div className="flex space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'magnitude' | 'depth')}
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
          >
            <option value="date">Tarih</option>
            <option value="magnitude">Büyüklük</option>
            <option value="depth">Derinlik</option>
          </select>
          
          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {sortedEarthquakes.map((earthquake) => (
          <Card
            key={earthquake.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleEarthquakeClick(earthquake)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${getMagnitudeColor(earthquake.magnitude)}`}>
                    {earthquake.magnitude.toFixed(1)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{earthquake.location}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{earthquake.province || 'Bilinmiyor'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{earthquake.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{earthquake.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Gauge className="w-4 h-4" />
                        <span>{earthquake.depth} km</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{earthquake.source}</Badge>
                  {earthquake.isAnomaly && (
                    <Badge variant="destructive" className="flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Anomali</span>
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {sortedEarthquakes.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">Henüz deprem verisi bulunmuyor.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 