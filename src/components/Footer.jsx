import { useTranslation } from "react-i18next";
import { FaGithub } from "react-icons/fa";

export const Footer = () => {
  const { t } = useTranslation();
    return (
        <footer className="bg-gray-900 text-white p-4 fixed bottom-0 left-0 right-0 py-4">
          <div className="container mx-auto flex justify-between items-center">
            <p className="text-sm font-semibold">{t('Creado por')} Pau Ibañez Arroyo</p>
            <a href="https://github.com/Pauibarr/Las-Zapas" target="_blank" rel="noopener noreferrer">
              <FaGithub className="w-6 h-6"/>
            </a>
          </div>
        </footer>
      );
    };