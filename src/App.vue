<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo ve başlık -->
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"/>
              </svg>
            </div>
            <h1 class="text-xl font-bold text-gray-900">Türkiye Deprem Haritası</h1>
            <span class="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">AI Destekli</span>
          </div>
          
          <!-- Navigation -->
          <nav class="hidden md:flex space-x-8">
            <router-link 
              to="/" 
              class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-primary-600 bg-primary-50"
            >
              Harita
            </router-link>
            <router-link 
              to="/list" 
              class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-primary-600 bg-primary-50"
            >
              Liste
            </router-link>
            <router-link 
              to="/analytics" 
              class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-primary-600 bg-primary-50"
            >
              Analiz
            </router-link>
          </nav>
          
          <!-- Sağ taraf kontroller -->
          <div class="flex items-center space-x-4">
            <!-- Bağlantı durumu -->
            <div class="flex items-center space-x-2">
              <div 
                :class="[
                  'w-2 h-2 rounded-full',
                  appStore.isConnected ? 'bg-green-500' : 'bg-red-500'
                ]"
              ></div>
              <span class="text-sm text-gray-500">
                {{ appStore.isConnected ? 'Bağlı' : 'Bağlantı Yok' }}
              </span>
            </div>
            
            <!-- Son güncelleme -->
            <div v-if="appStore.lastUpdate" class="text-sm text-gray-500">
              Son: {{ formatTime(appStore.lastUpdate) }}
            </div>
            
            <!-- Mobil menü butonu -->
            <button 
              @click="appStore.toggleSidebar"
              class="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Error banner -->
      <div 
        v-if="appStore.hasError" 
        class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
      >
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="text-red-800">{{ appStore.error }}</span>
          <button 
            @click="appStore.clearError"
            class="ml-auto text-red-400 hover:text-red-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Router view -->
      <router-view />
    </main>

    <!-- Mobil sidebar -->
    <div 
      v-if="appStore.sidebarOpen" 
      class="fixed inset-0 z-50 md:hidden"
    >
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black bg-opacity-50"
        @click="appStore.toggleSidebar"
      ></div>
      
      <!-- Sidebar -->
      <div class="fixed right-0 top-0 h-full w-64 bg-white shadow-xl">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Menü</h2>
          <button 
            @click="appStore.toggleSidebar"
            class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <nav class="p-4 space-y-2">
          <router-link 
            to="/" 
            @click="appStore.toggleSidebar"
            class="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            active-class="text-primary-600 bg-primary-50"
          >
            Harita Görünümü
          </router-link>
          <router-link 
            to="/list" 
            @click="appStore.toggleSidebar"
            class="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            active-class="text-primary-600 bg-primary-50"
          >
            Liste Görünümü
          </router-link>
          <router-link 
            to="/analytics" 
            @click="appStore.toggleSidebar"
            class="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            active-class="text-primary-600 bg-primary-50"
          >
            Analiz Görünümü
          </router-link>
        </nav>
      </div>
    </div>

    <!-- Loading overlay -->
    <div 
      v-if="appStore.isLoading" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span class="text-gray-700">Yükleniyor...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { useEarthquakeStore } from '@/stores/earthquake'

// Stores
const appStore = useAppStore()
const earthquakeStore = useEarthquakeStore()

// Computed
const formatTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'Az önce'
  if (minutes < 60) return `${minutes} dk önce`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} saat önce`
  
  const days = Math.floor(hours / 24)
  return `${days} gün önce`
}

// Lifecycle
onMounted(async () => {
  try {
    appStore.setLoading(true)
    await earthquakeStore.fetchEarthquakes()
    appStore.updateLastUpdate()
  } catch (error) {
    console.error('App initialization error:', error)
  } finally {
    appStore.setLoading(false)
  }
})
</script>

<style>
#app {
  font-family: 'Inter', system-ui, sans-serif;
}

/* Router link active styles */
.router-link-active {
  @apply text-primary-600 bg-primary-50;
}

/* Smooth transitions */
.transition-colors {
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
}
</style> 