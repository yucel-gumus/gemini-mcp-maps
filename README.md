# 🗺️ Gemini MCP Maps - AI-Powered Geospatial Assistant & Map Tools

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Model Context Protocol](https://img.shields.io/badge/MCP-Protocol-purple?style=for-the-badge)](https://modelcontextprotocol.io/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Portfolio](https://img.shields.io/badge/Portfolio-yucelgumus.dev-2563EB?style=for-the-badge&logo=google-chrome&logoColor=white)](https://www.yucelgumus.dev/)

> **Google Gemini AI** ve **Model Context Protocol (MCP)** standartlarını kullanarak doğal dil konum sorgularını coğrafi koordinatlara, harita işaretçilerine ve anlık mekan görsellerine dönüştüren harita ve rota asistanı.

---

## 🌟 Öne Çıkan Özellikler

- 💬 **Doğal Dil ile Harita Kontrolü:** Kullanıcının sohbet penceresinde sorduğu yerleri veya rotaları analiz ederek haritada otomatik odaklanma (pan/zoom) ve marker yerleştirme.
- 📍 **Geocoding & Ters Geocoding Entegrasyonu:** Adresleri anında koordinatlara ve koordinatları anlamsal mekan bilgilerine dönüştürme (`geocoding.service.ts`).
- 🖼️ **Mekan Görselleri & Zenginleştirme:** Sorgulanan konumların yüksek kaliteli fotoğraflarını çekip sohbet akışında ve harita üzerinde gösterme.
- ⚡ **Hafif ve Tip Güvenli Mimari:** TypeScript ve saf modern DOM optimizasyonları ile yüksek render performansı.

---

## 🏗️ Mimari & Çalışma Şeması

```mermaid
graph LR
    User([Kullanıcı]) <-->|Sohbet & Konum Sorusu| Chat[Chat Container & Input]
    Chat --> AISvc[Gemini AI Service]
    AISvc --> GeoSvc[Geocoding & Location Service]
    AISvc --> ImgSvc[Image Service]
    GeoSvc --> Map[Interactive Map Container]
    ImgSvc --> Chat
```

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
- **Node.js**: v18.0+
- **Google Gemini API Key**

### Kurulum

```bash
git clone https://github.com/yucel-gumus/gemini-mcp-maps.git
cd gemini-mcp-maps

npm install
```

### Ortam Değişkenleri (`.env`)

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Çalıştırma

```bash
npm run dev
```

---

## 📂 Proje Dizin Yapısı

```
gemini-mcp-maps/
├── index.html
├── package.json
├── vite.config.ts
└── src/
    ├── main.ts
    ├── types/                      # Tip tanımları
    ├── constants/                  # Promptlar ve sistem yapılandırması
    ├── utils/                      # Konum ve metin ayrıştırma yardımcıları
    ├── services/
    │   ├── ai.service.ts           # Gemini API istemcisi
    │   ├── geocoding.service.ts    # Koordinat çözümleme
    │   └── image.service.ts        # Mekan görsel servisi
    └── components/
        ├── Chat/                   # Sohbet arayüzü
        ├── Map/                    # Harita motoru
        └── shared/                 # Markdown ayrıştırıcı
```

---

## 📄 Lisans
Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.

---

## 👨‍💻 Geliştirici & İletişim

**Yücel Gümüş** - Full Stack Developer

- 🌐 **Web Sitesi / Portfolyo:** [yucelgumus.dev](https://www.yucelgumus.dev/)
- 💼 **LinkedIn:** [linkedin.com/in/yucel-gumus](https://www.linkedin.com/in/yucel-gumus/)
- 🐙 **GitHub:** [@yucel-gumus](https://github.com/yucel-gumus)

<p align="left">
  <a href="https://www.yucelgumus.dev/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Developed%20by-Yücel%20Gümüş-blue?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Yücel Gümüş Portfolio" />
  </a>
</p>