# 🚀 Deployment Kontrol Listesi

Projenizi canlıya almadan önce bu adımları kontrol edin:

## ✅ Gerekli Kontroller

### 1. **API Key Konfigürasyonu**
- [ ] Google Gemini API key aldım
- [ ] `.env.local` dosyası oluşturuldu
- [ ] API key `.env.local` dosyasına eklendi
- [ ] Yerel olarak test edildi (`npm run dev`)

### 2. **Build Testi**
- [ ] `npm run build` çalıştırıldı
- [ ] Build hatasız tamamlandı
- [ ] `npm run preview` ile test edildi

### 3. **Hosting Platformu Seçimi**

#### Vercel (Önerilen)
- [ ] Vercel hesabı oluşturuldu
- [ ] GitHub repo bağlandı
- [ ] Environment Variables eklendi:
  - `GEMINI_API_KEY`: [Gemini API Key]

#### Netlify
- [ ] Netlify hesabı oluşturuldu
- [ ] Build settings:
  - Build command: `npm run build`
  - Publish directory: `dist`
- [ ] Environment Variables eklendi:
  - `GEMINI_API_KEY`: [Gemini API Key]

#### GitHub Pages
- [ ] Repository public yapıldı
- [ ] GitHub Actions workflow eklendi
- [ ] Secrets eklendi:
  - `GEMINI_API_KEY`

### 4. **Güvenlik Kontrolleri**
- [ ] `.env.local` dosyası commit edilmedi
- [ ] API key güvenli şekilde saklandı
- [ ] `.gitignore` dosyası güncel

### 5. **Fonksiyonellik Testi**
- [ ] Harita yükleniyor
- [ ] AI chat çalışıyor
- [ ] Türkçe konum arama çalışıyor
- [ ] Marker'lar haritada görünüyor

## 🔧 Deployment Komutları

### Yerel Test
```bash
# Bağımlılıkları yükle
npm install

# Development server başlat
npm run dev

# Build test et
npm run build
npm run preview
```

### Vercel Deployment
```bash
# Vercel CLI yükle (eğer yoksa)
npm i -g vercel

# Deploy et
npx vercel

# Environment variables ekle (web interface'den)
# GEMINI_API_KEY = your_actual_api_key
```

### Manuel Deployment
```bash
# Build oluştur
npm run deploy

# dist/ klasörünü hosting servisine yükle
```

## 🆘 Sorun Giderme

### API Key Hataları
**Problem:** "API key not found" hatası
**Çözüm:** Environment variables doğru eklendi mi kontrol edin

### Build Hataları
**Problem:** TypeScript/Vite build hataları
**Çözüm:** `npm install` ve `rm -rf node_modules && npm install`

### Harita Yüklenmiyor
**Problem:** Leaflet haritası görünmüyor
**Çözüm:** CSS dosyaları doğru import edildi mi kontrol edin

## 📞 Destek

Sorun yaşıyorsanız:
1. Console'da hata mesajlarını kontrol edin
2. Network sekmesinde API çağrılarını inceleyin  
3. Environment variables doğru set edildi mi bakın

## ✨ Deployment Sonrası

- [ ] Live URL test edildi
- [ ] Tüm özellikler çalışıyor
- [ ] Performance kabul edilebilir
- [ ] Mobile responsive kontrol edildi 