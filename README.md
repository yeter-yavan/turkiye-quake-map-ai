# Türkiye Deprem Haritası - AI Destekli Takip Uygulaması

Vue 3 + TypeScript ile geliştirilmiş, Türkiye'deki depremleri gerçek zamanlı olarak takip eden, AI destekli web uygulaması.

## 🚀 Özellikler

- **Gerçek Zamanlı Veri**: AFAD ve Kandilli API'lerinden canlı deprem verisi
- **İnteraktif Harita**: Leaflet ile gelişmiş harita görünümü
- **AI Anomali Tespiti**: Yapay zeka ile anormal deprem tespiti
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu modern arayüz
- **Gelişmiş Filtreleme**: Magnitude, derinlik, tarih ve kaynak bazlı filtreleme
- **Real-time Updates**: WebSocket ile anlık güncellemeler
- **State Management**: Pinia ile modern state yönetimi
- **TypeScript**: Tip güvenliği ve geliştirici deneyimi

## 🛠️ Teknolojiler

- **Frontend**: Vue 3 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Maps**: Leaflet
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Charts**: Chart.js + Vue-Chartjs

## 📋 Gereksinimler

- Node.js 18+ 
- npm veya yarn

## 🚀 Kurulum

1. **Projeyi klonlayın**
```bash
git clone https://github.com/yourusername/turkiye-quake-map-ai.git
cd turkiye-quake-map-ai
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

4. **Tarayıcıda açın**
```
http://localhost:3000
```

## 📁 Proje Yapısı

```
src/
├── components/          # Vue komponentleri
│   └── EarthquakeMap.vue
├── stores/             # Pinia store'ları
│   ├── earthquake.ts
│   └── app.ts
├── services/           # API servisleri
│   └── earthquakeService.ts
├── types/              # TypeScript tip tanımları
│   └── index.ts
├── views/              # Sayfa görünümleri
│   ├── MapView.vue
│   ├── ListView.vue
│   └── AnalyticsView.vue
├── router/             # Vue Router konfigürasyonu
│   └── index.ts
├── App.vue             # Ana uygulama komponenti
├── main.ts             # Uygulama entry point
└── style.css           # Global stiller
```

## 🔧 API Konfigürasyonu

### AFAD API
- **Base URL**: `https://deprem.afad.gov.tr/apiv2`
- **Endpoints**:
  - `/earthquake/filter` - Filtrelenmiş deprem verisi
  - `/earthquake/last24h` - Son 24 saat
  - `/earthquake/last7days` - Son 7 gün

### Kandilli API
- **Base URL**: `https://api.kandilli.gov.tr`
- **Endpoints**:
  - `/earthquakes` - Tüm depremler
  - `/earthquakes/last24h` - Son 24 saat

## 🎯 Kullanım

### Harita Görünümü
- Depremleri harita üzerinde görüntüleme
- Magnitude'a göre renk kodlu marker'lar
- Zoom ve pan kontrolleri
- Farklı harita katmanları (OSM, Uydu, Arazi)

### Liste Görünümü
- Tüm depremleri tablo formatında listeleme
- Gelişmiş filtreleme ve sıralama
- Sayfalama desteği
- CSV export özelliği

### Analiz Görünümü
- Deprem istatistikleri ve grafikleri
- AI anomali tespiti sonuçları
- Trend analizi

## 🔍 Filtreleme Seçenekleri

- **Magnitude**: 0.0 - 10.0 arası
- **Derinlik**: 0 - 1000 km arası
- **Tarih Aralığı**: Başlangıç ve bitiş tarihi
- **Veri Kaynağı**: AFAD, Kandilli veya her ikisi
- **Anomali Durumu**: Normal, anomali veya tümü

## 🧠 AI Anomali Tespiti

Uygulama, deprem verilerini analiz ederek:
- Anormal magnitude değerleri
- Beklenmeyen derinlik değişimleri
- Zaman bazlı anormallikler
- Konum bazlı anormallikler

## 📱 Responsive Tasarım

- **Desktop**: Tam özellikli harita ve sidebar
- **Tablet**: Uyarlanmış layout
- **Mobile**: Mobil öncelikli tasarım, touch-friendly kontroller

## 🚀 Build ve Deploy

### Production Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

### Type Check
```bash
npm run type-check
```

## 🔧 Geliştirme

### Yeni Özellik Ekleme
1. Feature branch oluşturun
2. Gerekli komponentleri ve store'ları ekleyin
3. TypeScript tip tanımlarını güncelleyin
4. Test edin ve PR oluşturun

### API Entegrasyonu
1. `services/` klasörüne yeni servis ekleyin
2. TypeScript tiplerini `types/` klasöründe tanımlayın
3. Store'da gerekli state ve action'ları ekleyin

## 📊 Performans

- **Lazy Loading**: Route bazlı kod bölme
- **Virtual Scrolling**: Büyük listeler için
- **Debounced Search**: Arama optimizasyonu
- **Caching**: API response cache'leme

## 🔒 Güvenlik

- **API Rate Limiting**: API çağrılarında sınırlama
- **Input Validation**: Kullanıcı girdisi doğrulama
- **XSS Protection**: Güvenli HTML rendering
- **CORS**: Cross-origin resource sharing

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- **Proje Sahibi**: [Your Name]
- **Email**: [your.email@example.com]
- **GitHub**: [@yourusername]

## 🙏 Teşekkürler

- AFAD ve Kandilli Rasathanesi'ne veri sağladıkları için
- Vue.js ekibine harika framework için
- TailwindCSS ekibine CSS framework için
- Leaflet ekibine harita kütüphanesi için

## 📈 Roadmap

- [ ] WebSocket real-time updates
- [ ] Push notifications
- [ ] Offline support
- [ ] PWA features
- [ ] Advanced AI models
- [ ] Historical data analysis
- [ ] Earthquake prediction models
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Advanced analytics dashboard

## 🐛 Bilinen Sorunlar

- AFAD API bazen yavaş yanıt verebiliyor
- Kandilli API rate limiting
- Leaflet marker clustering büyük veri setlerinde yavaş

## 📚 Dokümantasyon

- [Vue 3 Guide](https://vuejs.org/guide/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Leaflet Docs](https://leafletjs.com/reference.html)
- [Pinia Docs](https://pinia.vuejs.org/) 