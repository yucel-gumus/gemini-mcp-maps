# 🗺️ MCP Maps (`gemini-mcp-maps`)

Türkçe doğal dil ile konuşarak haritada yer arayan **AI harita asistanı**. Gemini **function calling** (araç tanımları) ile `konum_goster` gibi araçları tetikler; yanıtlar **SSE** ile akış halinde gelir. Lit + Vite frontend, backend olarak merkezi **Gemini Gateway** `POST /api/chat`.

**Canlı:** [yucel-gumus.github.io/gemini-mcp-maps](https://yucel-gumus.github.io/gemini-mcp-maps/)  
**GitHub:** [yucel-gumus/gemini-mcp-maps](https://github.com/yucel-gumus/gemini-mcp-maps)

---

## Özellikler

- 🤖 Gemini sohbet + harita araçları (MCP tarzı tool tanımları gateway’de)
- 🗺️ Leaflet harita, marker ve fly-to animasyonları
- 🇹🇷 Türkçe arayüz ve prompt odaklı UX
- 🎨 Glassmorphism, dark mode
- 📍 Nominatim geocoding (gateway veya araç katmanı)
- 📡 SSE istemci — kısmi metin ve `function_call` event’leri

---

## Mimari

```
┌─────────────────────────────────────┐
│  Frontend (Vite + TypeScript + Lit) │
│  Leaflet + SSE EventSource/fetch    │
└──────────────┬──────────────────────┘
               │
       VITE_BFF_URL/api/maps/chat  (Pages prod)
       veya VITE_API_URL/api/chat (dev)
               │
               ▼
┌─────────────────────────────────────┐
│  pages-bff (Vercel) — opsiyonel     │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│  python_backend — POST /api/chat    │
│  Gemini + tools + session_id        │
└─────────────────────────────────────┘
```

---

## SSE olay tipleri (örnek)

```
data: {"type":"text","content":"Tabii, gösteriyorum..."}
data: {"type":"function_call","name":"konum_goster","args":{"location":"Pisa Kulesi"}}
data: {"type":"done"}
```

Frontend `function_call` aldığında haritada geocode + marker günceller.

---

## Kurulum

```bash
git clone https://github.com/yucel-gumus/gemini-mcp-maps.git
cd gemini-mcp-maps
npm install
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:8000
VITE_CLIENT_API_KEY=your_client_key
# Production Pages:
VITE_BFF_URL=https://pages-bff.vercel.app
```

```bash
npm run dev
```

---

## GitHub Pages

- Deploy: `main` → GitHub Actions (Vercel **kullanılmaz**)
- **Secrets/Variables:** `VITE_API_URL`, `VITE_CLIENT_API_KEY` veya `VITE_BFF_URL`
- Public URL: `/gemini-mcp-maps/` path altında

---

## API — `POST /api/chat`

**İstek:**

```json
{
  "message": "İstanbul'daki en eski camileri göster",
  "session_id": "default"
}
```

**Yanıt:** `text/event-stream` — yukarıdaki JSON satırları.

Header: `X-API-Key` (BFF arkasında sunucuda).

---

## CORS ve güvenlik

- Doğrudan gateway: `ALLOWED_ORIGINS` içinde GitHub Pages origin
- Önerilen: **pages-bff** — anahtar yalnızca Vercel’de

---

## Teknoloji tablosu

| Katman | Teknoloji |
|--------|-----------|
| UI | Lit, Vite, TypeScript, CSS |
| Harita | Leaflet, OSM |
| Geocoding | Nominatim |
| AI | Gemini via [llm_api](https://github.com/yucel-gumus/llm_api) |

---

## Lisans

Apache-2.0