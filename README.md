# 🗺️ MCP Maps

AI destekli interaktif harita asistanı. Gemini AI ile Türkçe konuşarak dünya üzerindeki yerleri keşfet.

## ✨ Özellikler

- 🤖 **Gemini AI** entegrasyonu (FastAPI backend)
- 🗺️ **Leaflet** ile interaktif haritalar
- 🇹🇷 **Türkçe** dil desteği
- 🎨 **Modern UI** - Glassmorphism, dark mode
- 📍 **Akıllı konum arama** - Nominatim geocoding

## 🏗️ Mimari

```
┌─────────────────────────────────────┐
│            FRONTEND                 │
│  ├── Vite + TypeScript + Lit       │
│  ├── Leaflet Maps                   │
│  └── SSE Client                     │
└──────────────┬──────────────────────┘
               │ HTTP/SSE
               ▼
┌─────────────────────────────────────┐
│         BACKEND (FastAPI)           │
│  ├── Gemini AI                      │
│  ├── Tool definitions               │
│  └── API Key (güvenli)              │
└─────────────────────────────────────┘
```

## 🚀 Kurulum

### Frontend

```bash
npm install
npm run dev
```

### Backend

Backend: `python_backend` (Gemini Gateway) — `POST /api/chat` (SSE), `X-API-Key` zorunlu.

**CORS:** Tarayıcıdan doğrudan API çağrısı için gateway `.env` içinde `ALLOWED_ORIGINS` listesine frontend origin ekleyin (ör. `https://yucel-gumus.github.io` GitHub Pages için).

**Environment Variables:**
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:8000
VITE_CLIENT_API_KEY=your_client_api_key
```

## 📦 Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| Frontend | Vite, TypeScript, Lit |
| UI | CSS (Glassmorphism, Dark Mode) |
| Harita | Leaflet, OpenStreetMap |
| Geocoding | Nominatim API |
| Backend | FastAPI, Gemini AI |

## 🔧 API Spec

### POST /api/chat

**Request:**
```json
{
  "message": "Pisa Kulesi'ni göster",
  "session_id": "default"
}
```

**Response (SSE Stream):**
```
data: {"type": "text", "content": "Tabii!"}
data: {"type": "function_call", "name": "konum_goster", "args": {"location": "Pisa Kulesi"}}
data: {"type": "done"}
```

## 🌐 Canlı (GitHub Pages)

- **URL:** https://yucel-gumus.github.io/gemini-mcp-maps/
- **Deploy:** `main` push → GitHub Actions (Vercel kullanılmaz)
- **Repo secrets (Settings → Secrets):** `VITE_API_URL`, `VITE_CLIENT_API_KEY`
- **Repo variables (Settings → Variables):** `VITE_API_URL` (zaten var), `VITE_CLIENT_API_KEY` (gateway client key) — CI build bunları kullanır

## 📄 License

Apache 2.0 License
