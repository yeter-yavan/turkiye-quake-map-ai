# Türkiye Deprem Haritası - AI Destekli

Modern, responsive ve AI destekli Türkiye deprem takip uygulaması. React, TypeScript ve shadcn/ui kullanılarak geliştirilmiştir.

## 🚀 Özellikler

- **Harita Görünümü**: Leaflet tabanlı interaktif deprem haritası
- **Liste Görünümü**: Filtrelenebilir deprem listesi
- **Analiz Görünümü**: Detaylı istatistikler ve grafikler
- **AI Anomali Tespiti**: Deprem verilerinde anormal durumları tespit eder
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu modern arayüz
- **Gerçek Zamanlı Veri**: AFAD ve Kandilli kaynaklarından güncel veriler
- **Filtreleme Sistemi**: Magnitude, derinlik, tarih ve kaynak bazında filtreleme

## 🛠️ Teknolojiler

- **Frontend**: React 18 + TypeScript
- **State Management**: Zustand
- **Routing**: React Router DOM
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Maps**: React Leaflet + Leaflet
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Kurulum

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

3. **Tarayıcıda açın:**
   ```
   http://localhost:5173
   ```

## 🏗️ Proje Yapısı

```
src/
├── components/          # UI bileşenleri
│   ├── ui/             # shadcn/ui bileşenleri
│   ├── Header.tsx      # Ana başlık
│   ├── Sidebar.tsx     # Mobil menü
│   ├── EarthquakeMap.tsx # Harita bileşeni
│   └── ...
├── views/               # Sayfa bileşenleri
│   ├── MapView.tsx     # Harita görünümü
│   ├── ListView.tsx    # Liste görünümü
│   ├── AnalyticsView.tsx # Analiz görünümü
│   └── ...
├── stores/              # Zustand state yönetimi
│   ├── app.ts          # Uygulama durumu
│   └── earthquake.ts   # Deprem verisi
├── services/            # API servisleri
├── types/               # TypeScript tip tanımları
├── lib/                 # Yardımcı fonksiyonlar
└── router/              # React Router yapılandırması
```

## 🎨 UI Bileşenleri

Uygulama shadcn/ui bileşen kütüphanesini kullanır:

- **Button**: Farklı varyantlarda butonlar
- **Card**: Bilgi kartları
- **Badge**: Etiketler ve durum göstergeleri
- **Select**: Dropdown seçiciler
- **Sheet**: Mobil menü ve overlay'ler
- **Alert**: Hata ve uyarı mesajları

## 🗺️ Harita Özellikleri

- **Çoklu Tile Layer**: OpenStreetMap, Uydu, Arazi
- **Zoom Kontrolleri**: Yakınlaştırma/uzaklaştırma
- **Deprem Marker'ları**: Magnitude'a göre renk kodlaması
- **Popup Bilgileri**: Detaylı deprem bilgileri
- **Responsive Tasarım**: Tüm ekran boyutlarında uyumlu

## 📊 Veri Yönetimi

- **Zustand Store**: Merkezi state yönetimi
- **Mock Data**: Geliştirme için örnek veriler
- **Filtreleme**: Gerçek zamanlı veri filtreleme
- **Anomali Tespiti**: AI destekli anormal durum analizi

## 🔧 Geliştirme Komutları

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# TypeScript tip kontrolü
npm run type-check

# Linting
npm run lint

# Preview build
npm run preview
```

## 🌐 API Entegrasyonu

Uygulama şu veri kaynaklarını destekler:

- **AFAD**: Türkiye Afet ve Acil Durum Yönetimi
- **Kandilli**: Boğaziçi Üniversitesi Kandilli Rasathanesi

## 📱 Responsive Tasarım

- **Mobile First**: Mobil öncelikli tasarım
- **Breakpoints**: Tailwind CSS responsive breakpoint'leri
- **Touch Friendly**: Dokunmatik ekran uyumlu
- **Progressive Enhancement**: Temel işlevsellikten gelişmiş özelliklere

## 🎯 Gelecek Özellikler

- [ ] WebSocket ile gerçek zamanlı veri güncellemesi
- [ ] Gelişmiş AI anomali tespiti
- [ ] Deprem tahmin algoritmaları
- [ ] Kullanıcı hesapları ve favoriler
- [ ] Push notification'lar
- [ ] Offline çalışma desteği
- [ ] Çoklu dil desteği

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Proje**: [GitHub Repository](https://github.com/your-username/turkiye-quake-map-ai)
- **Sorular**: Issues bölümünü kullanın

---

**Not**: Bu uygulama geliştirme amaçlıdır ve gerçek deprem verilerini göstermek için tasarlanmıştır. Acil durumlar için resmi AFAD ve Kandilli kaynaklarını kullanın. 