<template>
  <div class="space-y-6">
    <!-- Sayfa başlığı -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Deprem Analizi</h1>
        <p class="mt-1 text-sm text-gray-500">
          Deprem verilerini analiz edin ve istatistikleri görüntüleyin
        </p>
      </div>
      
      <!-- Aksiyon butonları -->
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <button 
          @click="refreshData"
          :disabled="isLoading"
          class="btn btn-primary flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span>Yenile</span>
        </button>
      </div>
    </div>

    <!-- İstatistik kartları -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Toplam Deprem</p>
            <p class="text-2xl font-semibold text-gray-900">{{ totalCount }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Bu Ay</p>
            <p class="text-2xl font-semibold text-gray-900">{{ thisMonthCount }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">AI Anomali</p>
            <p class="text-2xl font-semibold text-gray-900">{{ anomalyCount }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Ortalama Büyüklük</p>
            <p class="text-2xl font-semibold text-gray-900">{{ averageMagnitude }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Grafikler -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Magnitude dağılımı -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Magnitude Dağılımı</h3>
        <div class="h-64">
          <!-- Chart.js komponenti buraya gelecek -->
          <div class="flex items-center justify-center h-full text-gray-500">
            Magnitude dağılım grafiği burada görüntülenecek
          </div>
        </div>
      </div>

      <!-- Zaman bazlı trend -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Zaman Bazlı Trend</h3>
        <div class="h-64">
          <!-- Chart.js komponenti buraya gelecek -->
          <div class="flex items-center justify-center h-full text-gray-500">
            Zaman bazlı trend grafiği burada görüntülenecek
          </div>
        </div>
      </div>
    </div>

    <!-- AI Anomali Analizi -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">AI Anomali Analizi</h3>
      
      <div v-if="anomalies.length > 0" class="space-y-4">
        <div 
          v-for="anomaly in anomalies" 
          :key="anomaly.earthquakeId"
          class="border border-warning-200 rounded-lg p-4 bg-warning-50"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-warning-100 text-warning-800">
                  ⚠️ AI Anomali
                </span>
                <span class="text-sm text-gray-600">
                  Skor: {{ anomaly.confidence.toFixed(2) }}
                </span>
              </div>
              
              <div class="text-sm text-gray-700 mb-2">
                <strong>Deprem ID:</strong> {{ anomaly.earthquakeId }}
              </div>
              
              <div class="text-sm text-gray-700">
                <strong>Anomali Faktörleri:</strong>
                <ul class="list-disc list-inside mt-1 ml-4">
                  <li v-for="factor in anomaly.factors" :key="factor">
                    {{ factor }}
                  </li>
                </ul>
              </div>
            </div>
            
            <button 
              @click="viewAnomalyDetails(anomaly)"
              class="text-warning-600 hover:text-warning-800 text-sm font-medium"
            >
              Detay →
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-8 text-gray-500">
        Henüz AI anomali tespit edilmedi.
      </div>
    </div>

    <!-- Coğrafi analiz -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Coğrafi Analiz</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-primary-600">{{ mostActiveProvince.count }}</div>
          <div class="text-sm text-gray-600">En Aktif İl</div>
          <div class="text-lg font-medium text-gray-900">{{ mostActiveProvince.name }}</div>
        </div>
        
        <div class="text-center">
          <div class="text-2xl font-bold text-primary-600">{{ deepestEarthquake.depth }} km</div>
          <div class="text-sm text-gray-600">En Derin Deprem</div>
          <div class="text-lg font-medium text-gray-900">{{ deepestEarthquake.location }}</div>
        </div>
        
        <div class="text-center">
          <div class="text-2xl font-bold text-primary-600">{{ strongestEarthquake.magnitude }}</div>
          <div class="text-sm text-gray-600">En Büyük Deprem</div>
          <div class="text-lg font-medium text-gray-900">{{ strongestEarthquake.location }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useEarthquakeStore } from '@/stores/earthquake'
import type { AnomalyDetection } from '@/types'

// Store
const earthquakeStore = useEarthquakeStore()

// State
const isLoading = ref(false)

// Computed
const totalCount = computed(() => earthquakeStore.totalCount)
const thisMonthCount = computed(() => {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  
  return earthquakeStore.earthquakes.filter(eq => {
    const eqDate = new Date(eq.timestamp)
    return eqDate.getMonth() === thisMonth && eqDate.getFullYear() === thisYear
  }).length
})
const anomalyCount = computed(() => earthquakeStore.anomalyCount)
const averageMagnitude = computed(() => {
  if (earthquakeStore.earthquakes.length === 0) return 0
  const total = earthquakeStore.earthquakes.reduce((sum, eq) => sum + eq.magnitude, 0)
  return (total / earthquakeStore.earthquakes.length).toFixed(1)
})

// Mock data - gerçek uygulamada AI servisinden gelecek
const anomalies = ref<AnomalyDetection[]>([
  {
    earthquakeId: 'sample_1',
    score: 0.85,
    isAnomaly: true,
    factors: ['Beklenmeyen magnitude değeri', 'Anormal derinlik'],
    confidence: 0.85
  }
])

const mostActiveProvince = computed(() => {
  const provinceCounts = earthquakeStore.earthquakes.reduce((acc, eq) => {
    if (eq.province) {
      acc[eq.province] = (acc[eq.province] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)
  
  const mostActive = Object.entries(provinceCounts).reduce((max, [province, count]) => {
    return count > max.count ? { name: province, count } : max
  }, { name: 'Bilinmiyor', count: 0 })
  
  return mostActive
})

const deepestEarthquake = computed(() => {
  if (earthquakeStore.earthquakes.length === 0) {
    return { depth: 0, location: 'Bilinmiyor' }
  }
  
  const deepest = earthquakeStore.earthquakes.reduce((max, eq) => 
    eq.depth > max.depth ? eq : max
  )
  
  return {
    depth: deepest.depth,
    location: deepest.location
  }
})

const strongestEarthquake = computed(() => {
  if (earthquakeStore.earthquakes.length === 0) {
    return { magnitude: 0, location: 'Bilinmiyor' }
  }
  
  const strongest = earthquakeStore.earthquakes.reduce((max, eq) => 
    eq.magnitude > max.magnitude ? eq : max
  )
  
  return {
    magnitude: strongest.magnitude,
    location: strongest.location
  }
})

// Methods
const refreshData = async () => {
  try {
    isLoading.value = true
    await earthquakeStore.fetchEarthquakes()
  } catch (error) {
    console.error('Data refresh error:', error)
  } finally {
    isLoading.value = false
  }
}

const viewAnomalyDetails = (anomaly: AnomalyDetection) => {
  // Anomali detaylarını görüntüle
  console.log('Anomali detayları:', anomaly)
}

// Lifecycle
onMounted(async () => {
  if (earthquakeStore.earthquakes.length === 0) {
    await refreshData()
  }
})
</script> 