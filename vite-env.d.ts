/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UNSPLASH_ACCESS_KEY: string
  readonly VITE_UNSPLASH_SECRET_KEY: string
  readonly VITE_UNSPLASH_APPLICATION_ID: string
  readonly VITE_UNSPLASH_REDIRECT_URI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}