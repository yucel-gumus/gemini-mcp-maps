# 🗺️ MCP Maps Basic

MCP (Model Context Protocol) ile Google Gemini AI'yi Leaflet haritalarıyla entegre eden Türkçe destekli harita asistanı.

## ✨ Özellikler

- 🤖 **Google Gemini AI** entegrasyonu
- 🗺️ **Leaflet** ile interaktif haritalar  
- 🇹🇷 **Türkçe konum desteği** (Pisa Kulesi, Eyfel Kulesi, vb.)
- 📍 **Akıllı konum arama** (60+ Türkçe-İngilizce çeviri)
- 🔄 **MCP protokolü** ile standardize edilmiş AI-araç iletişimi

## 🚀 Yerel Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- Google Gemini API key

### Kurulum Adımları

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **API Key Konfigürasyonu:**
   
   **Seçenek A: .env.local dosyası (Önerilen)**
   ```bash
   # .env.local dosyası oluşturun
   echo "GEMINI_API_KEY=your_api_key_here" > .env.local
   echo "VITE_GEMINI_API_KEY=your_api_key_here" >> .env.local
   ```
   
   **Seçenek B: Environment variable**
   ```bash
   export GEMINI_API_KEY=your_api_key_here
   ```

3. **Google Gemini API Key alın:**
   - [Google AI Studio](https://makersuite.google.com/app/apikey) adresine gidin
   - API key oluşturun
   - `.env.local` dosyasındaki `your_api_key_here` kısmını değiştirin

4. **Uygulamayı çalıştırın:**
   ```bash
   npm run dev
   ```

5. **Tarayıcıda açın:** http://localhost:5173

## 🌐 Deployment (Canlıya Alma)

### Vercel ile Deployment

1. **Proje build edin:**
   ```bash
   npm run build
   ```

2. **Vercel'e deploy edin:**
   ```bash
   npx vercel
   ```

3. **Environment Variables ekleyin:**
   - Vercel dashboard'da projenizi açın
   - Settings > Environment Variables
   - `GEMINI_API_KEY` ekleyin

### Netlify ile Deployment

1. **Build komutu:** `npm run build`
2. **Publish directory:** `dist`
3. **Environment Variables:** `GEMINI_API_KEY`

### Diğer Platformlar

Build edilmiş dosyalar `dist/` klasöründe bulunur. Statik hosting servisleri:
- GitHub Pages
- Firebase Hosting  
- AWS S3 + CloudFront

## 🔧 Yapılandırma

### Desteklenen Konumlar
Sistem 60+ Türkçe konum ismini otomatik çevirir:
- ✅ Pisa Kulesi → Leaning Tower of Pisa
- ✅ Eyfel Kulesi → Eiffel Tower
- ✅ Ayasofya → Hagia Sophia Istanbul
- ✅ Galata Kulesi → Galata Tower Istanbul

### MCP Server Konfigürasyonu
`mcp_maps_server.ts` dosyasında araç ayarları:
```typescript
server.tool('konum_goster', /* ... */);
```

## 🐛 Sorun Giderme

### API Key Hataları
```
Error: API key not found
```
**Çözüm:** `.env.local` dosyasını kontrol edin, API key'in doğru olduğundan emin olun.

### Konum Bulunamıyor
```
"Pisa Kulesi" konumunu bulamadım
```
**Çözüm:** Konum çeviri sözlüğüne yeni entries ekleyin (`playground.ts` → `LOCATION_TRANSLATIONS`).

### Build Hataları
```
Module not found
```
**Çözüm:** `npm install` çalıştırın, node_modules silin ve tekrar yükleyin.

## 📦 Teknik Detaylar

- **Frontend:** TypeScript + Lit Element + Vite
- **AI:** Google Gemini 2.0 Flash
- **Harita:** Leaflet + OpenStreetMap
- **Geocoding:** Nominatim API
- **Protokol:** MCP (Model Context Protocol)

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 License

Apache 2.0 License
