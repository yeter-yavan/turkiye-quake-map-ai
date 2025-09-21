import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEarthquakeStore } from '@/stores/earthquake'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, MapPin, Calendar, AlertTriangle, ExternalLink } from 'lucide-react'
import type { Earthquake } from '@/types'

export default function EarthquakeDetailView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { earthquakes } = useEarthquakeStore()
  const [earthquake, setEarthquake] = useState<Earthquake | null>(null)

  useEffect(() => {
    if (id && earthquakes.length > 0) {
      const found = earthquakes.find(eq => eq.id === id)
      setEarthquake(found || null)
    }
  }, [id, earthquakes])

  if (!earthquake) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Deprem bulunamadı</p>
          <Button onClick={() => navigate('/')}>Ana Sayfaya Dön</Button>
        </div>
      </div>
    )
  }

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 6.0) return 'bg-red-500'
    if (magnitude >= 5.0) return 'bg-orange-500'
    if (magnitude >= 4.0) return 'bg-yellow-500'
    if (magnitude >= 3.0) return 'bg-green-500'
    return 'bg-gray-500'
  }

  const getMagnitudeDescription = (magnitude: number) => {
    if (magnitude >= 8.0) return 'Büyük Deprem'
    if (magnitude >= 7.0) return 'Çok Güçlü Deprem'
    if (magnitude >= 6.0) return 'Güçlü Deprem'
    if (magnitude >= 5.0) return 'Orta Güçte Deprem'
    if (magnitude >= 4.0) return 'Hafif Deprem'
    if (magnitude >= 3.0) return 'Çok Hafif Deprem'
    return 'Mikro Deprem'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Geri</span>
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold text-foreground">Deprem Detayı</h1>
          <p className="text-muted-foreground mt-2">
            {earthquake.location} - {earthquake.date}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Magnitude Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl ${getMagnitudeColor(earthquake.magnitude)}`}>
                  {earthquake.magnitude.toFixed(1)}
                </div>
                <div>
                  <div className="text-2xl">{getMagnitudeDescription(earthquake.magnitude)}</div>
                  <div className="text-sm text-muted-foreground">
                    Büyüklük: {earthquake.magnitude} Richter
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{earthquake.depth}</div>
                  <div className="text-sm text-muted-foreground">Derinlik (km)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {earthquake.latitude.toFixed(4)}
                  </div>
                  <div className="text-sm text-muted-foreground">Enlem</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {earthquake.longitude.toFixed(4)}
                  </div>
                  <div className="text-sm text-muted-foreground">Boylam</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {earthquake.timestamp}
                  </div>
                  <div className="text-sm text-muted-foreground">Timestamp</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Konum Bilgileri</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Şehir</label>
                  <p className="text-lg">{earthquake.province || 'Bilinmiyor'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">İlçe</label>
                  <p className="text-lg">{earthquake.district || 'Bilinmiyor'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Detay Konum</label>
                <p className="text-lg">{earthquake.location}</p>
              </div>
            </CardContent>
          </Card>

          {/* Time Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Zaman Bilgileri</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tarih</label>
                  <p className="text-lg">{earthquake.date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Saat</label>
                  <p className="text-lg">{earthquake.time}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Source Information */}
          <Card>
            <CardHeader>
              <CardTitle>Kaynak Bilgisi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{earthquake.source}</Badge>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Anomaly Detection */}
          {earthquake.isAnomaly && (
            <Card className="border-warning">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-warning-600">
                  <AlertTriangle className="w-5 h-5" />
                  <span>AI Anomali Tespiti</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Bu deprem AI algoritması tarafından anormal olarak tespit edildi.
                </p>
                {earthquake.anomalyScore && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning-600">
                      {earthquake.anomalyScore.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">Anomali Skoru</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Haritada Göster
              </Button>
              <Button className="w-full" variant="outline">
                Detaylı Rapor
              </Button>
              <Button className="w-full" variant="outline">
                Paylaş
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 