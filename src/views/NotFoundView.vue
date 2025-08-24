<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <!-- 404 Icon -->
        <div class="mx-auto h-24 w-24 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"/>
          </svg>
        </div>
        
        <!-- 404 Text -->
        <h1 class="mt-6 text-6xl font-bold text-gray-900">404</h1>
        <h2 class="mt-4 text-2xl font-semibold text-gray-900">Sayfa Bulunamadı</h2>
        
        <p class="mt-2 text-gray-600">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
      </div>

      <!-- Navigation -->
      <div class="mt-8 space-y-4">
        <router-link 
          to="/"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          Ana Sayfaya Dön
        </router-link>
        
        <div class="text-center">
          <p class="text-sm text-gray-500">Veya şu sayfalardan birini ziyaret edin:</p>
        </div>
        
        <div class="grid grid-cols-1 gap-3">
          <router-link 
            to="/list"
            class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            Deprem Listesi
          </router-link>
          
          <router-link 
            to="/analytics"
            class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            Analiz Görünümü
          </router-link>
        </div>
      </div>

      <!-- Help text -->
      <div class="mt-8 text-center">
        <p class="text-xs text-gray-500">
          Eğer bu hatayı sürekli alıyorsanız, lütfen bizimle iletişime geçin.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Bu sayfa için özel logic gerekmiyor
</script> 