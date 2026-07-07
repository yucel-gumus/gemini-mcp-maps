# 🗺️ Gemini MCP Maps (Türkçe Destekli Akıllı Harita Asistanı)

Gemini MCP Maps; kullanıcıların harita ve lokasyon aramalarını doğal dilde yapmalarını sağlayan, Google Gemini yapay zeka modelinin **Function Calling (Araç Çağırma)** yeteneğini **Leaflet Harita** altyapısıyla birleştiren modern ve akışkan (streaming) bir web uygulamasıdır. 

Uygulamanın arayüzü **Lit Web Components** mimarisiyle sıfırdan bileşen tabanlı olarak kodlanmıştır.

---

## 🌟 Öne Çıkan Özellikler

* 🇹🇷 **Doğal Dil ile Konum Arama:** *"İstanbul'daki en tarihi 3 camiyi göster"*, *"Bana Pisa Kulesi'ne odaklan"* gibi komutları doğrudan algılar ve haritayı o konuma kaydırır.
* 🤖 **Gemini Function Calling Entegrasyonu:** Model, kullanıcının isteklerine göre arka planda `konum_goster` gibi harita araçlarını parametreleriyle tetikler.
* 📡 **Akışkan SSE İstemcisi (Server-Sent Events):** Backend sunucusundan gelen yanıtlar hem metin hem de fonksiyon çağrıları (event) halinde anlık olarak akar.
* 🗺️ **Leaflet & Nominatim Geocoding:** Fonksiyon çağrısı alındığında istemci tarafında **Nominatim API** üzerinden adres coğrafi koordinatlara (enlem, boylam) dönüştürülür ve harita `flyTo` animasyonu ile o konuma kaydırılıp marker eklenir.
* 🎨 **Modern Glassmorphism Tasarım:** Tamamen responsive, karanlık mod uyumlu ve göze hitap eden modern arayüz tasarımı.

---

## 🏗️ Sistem Mimarisi ve Akış

```
[ Lit Frontend (Tarayıcı) ] ──(SSE EventSource /api/chat)──► [ Pages BFF (Vercel) ]
           ▲                                                        │
           │                                                (Yetkilendirme / Proxy)
     (Map.flyTo)                                                    ▼
[ Leaflet / Nominatim ] ◄──(Function Call Event)─── [ Python Backend (Gemini API) ]
```

1. **İstek:** Kullanıcı arama alanına bir metin girer.
2. **Akış (BFF & Backend):** İstek, **Pages BFF** proxy'si üzerinden Python Backend'e iletilir. Gemini, arama yapılması gerektiğine karar verirse `konum_goster` aracı oluşturur.
3. **SSE Parse:** Tarayıcı, gelen event-stream'i okur:
   ```json
   data: {"type":"text","content":"Pisa Kulesi'ni gösteriyorum..."}
   data: {"type":"function_call","name":"konum_goster","args":{"location":"Pisa Kulesi"}}
   ```
4. **Harita Güncellemesi:** Tarayıcı `function_call` event'ini yakalar, Nominatim'den koordinatları çözer, haritayı kaydırır ve işaretçiyi yerleştirir.

---

## 🛠️ Teknoloji Stack

* **Frontend Framework:** Lit (LitElement, reactive properties, template rendering), Vite, TypeScript.
* **Harita Kütüphanesi:** Leaflet, OpenStreetMap (OSM).
* **Geocoding API:** OpenStreetMap Nominatim API.
* **Yapay Zeka API:** Google Gemini API (via [llm_api Gateway](https://github.com/yucel-gumus/llm_api)).
* **Markdown Ayrıştırıcı:** `marked`, `marked-highlight`, `highlight.js` (sohbet penceresindeki kod blokları ve markdown biçimlendirmeleri için).

---

## 📂 Proje Klasör Yapısı

```
gemini-mcp-maps/
├── src/
│   ├── components/       # Lit bileşenleri (ChatPanel, LeafletMap)
│   ├── services/         # API servisleri, SSE parser ve geocoder
│   ├── app.ts            # Ana LitElement uygulama girişi
│   └── types.ts
├── index.html
├── index.css             # Tailwind benzeri optimize edilmiş global CSS stilleri
├── vite.config.ts
└── package.json
```

---

## 🚀 Kurulum ve Yerel Çalıştırma

### 1. Bağımlılıkları Yükleyin
```bash
git clone https://github.com/yucel-gumus/gemini-mcp-maps.git
cd gemini-mcp-maps
npm install
```

### 2. Ortam Değişkenleri (`.env`)
Proje kök dizininde `.env` oluşturun:

```env
# Yerel Python Backend adresi (Geliştirme için)
VITE_API_URL=http://localhost:8000
VITE_CLIENT_API_KEY=your_development_client_key

# Üretim (Production) BFF adresi
VITE_BFF_URL=https://pages-bff.vercel.app
```

### 3. Geliştirme Sunucusunu Başlatma
```bash
npm run dev
```
Uygulama `http://localhost:5173` (veya Vite'in verdiği portta) başlayacaktır.

---

## 🔗 Canlı Bağlantılar
* **Canlı Demo:** [https://yucel-gumus.github.io/gemini-mcp-maps/](https://yucel-gumus.github.io/gemini-mcp-maps/)
* **Python Backend Gateway:** [yucel-gumus/llm_api](https://github.com/yucel-gumus/llm_api)