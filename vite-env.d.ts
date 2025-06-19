/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string
  // daha fazla env variables eklemek için buraya ekleyin
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 