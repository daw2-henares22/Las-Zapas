import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Definir __dirname para que funcione en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar solo las variables específicas del frontend
config({ path: resolve(__dirname, './frontend/.env') });

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});