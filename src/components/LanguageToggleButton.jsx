import { useTranslation } from 'react-i18next';

export function LanguageToggleButton() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-2 py-1 mx-1 text-white hover:text-blue-gray-400 hover:scale-x-105 hover:scale-y-105 transition duration-150 border-double border-4 border-spacing-4 border-white rounded"
    >
      {i18n.language === 'es' ? 'ES' : 'EN'}
    </button>
  );
}