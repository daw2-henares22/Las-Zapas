import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Traducciones
import en from './premises/en.json';
import es from './premises/es.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
};

i18n
  .use(initReactI18next) // Integrar con React
  .init({
    resources, // Usa las traducciones importadas
    lng: 'es', // Idioma predeterminado
    fallbackLng: 'en', // Idioma de respaldo
    interpolation: {
      escapeValue: false, // React ya maneja el escape de valores
    },
  });

export default i18n;