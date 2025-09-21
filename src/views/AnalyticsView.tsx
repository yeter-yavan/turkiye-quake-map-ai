import { useEffect, useState } from 'react'
import { useEarthquakeStore } from '@/stores/earthquake'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, AlertTriangle, Gauge } from 'lucide-react'

export default function AnalyticsView() {
  const { filteredEarthquakes, fetchEarthquakes, isLoading } = useEarthquakeStore()
  const [stats, setStats] = useState({
    total: 0,
    averageMagnitude: 0,
    maxMagnitude: 0,
    minMagnitude: 0,
    averageDepth: 0,
    anomalyCount: 0,
    sourceDistribution: {} as Record<string, number>,
    magnitudeDistribution: {} as Record<string, number>
  })

  useEffect(() => {
    fetchEarthquakes()
  }, [fetchEarthquakes])

  useEffect(() => {
    if (filteredEarthquakes.length > 0) {
      const magnitudes = filteredEarthquakes.map(eq => eq.magnitude)
      const depths = filteredEarthquakes.map(eq => eq.depth)
      const sources = filteredEarthquakes.map(eq => eq.source)
      const anomalies = filteredEarthquakes.filter(eq => eq.isAnomaly)

      // Calculate statistics
      const total = filteredEarthquakes.length
      const averageMagnitude = magnitudes.reduce((a, b) => a + b, 0) / total
      const maxMagnitude = Math.max(...magnitudes)
      const minMagnitude = Math.min(...magnitudes)
      const averageDepth = depths.reduce((a, b) => a + b, 0) / total
      const anomalyCount = anomalies.length

      // Source distribution
      const sourceDistribution = sources.reduce((acc, source) => {
        acc[source] = (acc[source] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Magnitude distribution
      const magnitudeDistribution = magnitudes.reduce((acc, mag) => {
        const range = mag < 3 ? '<3' : mag < 4 ? '3-4' : mag < 5 ? '4-5' : mag < 6 ? '5-6' : '≥6'
        acc[range] = (acc[range] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      setStats({
        total,
        averageMagnitude,
        maxMagnitude,
        minMagnitude,
        averageDepth,
        anomalyCount,
        sourceDistribution,
        magnitudeDistribution
      })
    }
  }, [filteredEarthquakes])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Deprem Analizi</h1>
        <p className="text-muted-foreground mt-2">
          Türkiye'deki deprem verilerinin detaylı analizi ve istatistikleri
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Deprem</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Büyüklük</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageMagnitude.toFixed(1)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Derinlik</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageDepth.toFixed(1)} km</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anomali Sayısı</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-600">{stats.anomalyCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Magnitude Range */}
        <Card>
          <CardHeader>
            <CardTitle>Büyüklük Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.magnitudeDistribution).map(([range, count]) => (
                <div key={range} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{range}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Source Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Kaynak Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.sourceDistribution).map(([source, count]) => (
                <div key={source} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{source}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div
                        className="bg-secondary h-2 rounded-full"
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Magnitude Range Details */}
      <Card>
        <CardHeader>
          <CardTitle>Büyüklük Aralıkları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.minMagnitude.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">En Düşük</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.averageMagnitude.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Ortalama</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.maxMagnitude.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">En Yüksek</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {stats.total === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">Henüz deprem verisi bulunmuyor.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 