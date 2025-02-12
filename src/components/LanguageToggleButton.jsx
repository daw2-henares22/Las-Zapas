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
      className="sm:py-1 sm:px-1 lg:py-1 lg:px-2 xl:py-1 xl:px-2 text-white hover:text-blue-gray-400 hover:scale-105 active:scale-95 transition-transform duration-150 border-double border-4 border-white rounded"
    >
      {i18n.language === 'es' ? 'ES' : 'EN'}
    </button>
  );
}