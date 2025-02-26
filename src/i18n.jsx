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

const handleUpdateProfile = async () => {
  if (!email.trim() || !nombre.trim()) {
    return showAlert(t("Todos los campos son obligatorios"), "red");
  }

  if (!session?.user?.id) {
    return showAlert(t("Error: Usuario no identificado"), "red");
  }

  try {
    const response = await fetch("https://las-zapass.vercel.app/api/update-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.user.id,
        nombre,
        email,
        password: password || undefined, // Solo lo manda si hay contraseña
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Error al actualizar perfil");
    }

    // Actualizar sesión con el nuevo correo y nombre
    setSession((prevSession) => ({
      ...prevSession,
      user: {
        ...prevSession.user,
        email,
        user_metadata: { ...prevSession.user.user_metadata, name: nombre },
      },
    }));

    showAlert(t("Perfil actualizado"), "green");
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    showAlert(t("Error al actualizar el perfil"), "red");
  }
};