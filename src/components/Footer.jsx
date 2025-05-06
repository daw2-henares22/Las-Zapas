import { useTranslation } from "react-i18next";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-900 text-white p-4 fixed bottom-0 left-0 right-0 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <p className="text-sm font-semibold">{t('Creado por')} Rubén Henares Hidalgo</p>
        
        <div className="flex items-center gap-4">
          <a href="https://github.com/daw2-henares22/Las-Zapas" target="_blank" rel="noopener noreferrer">
            <FaGithub className="w-6 h-6" />
          </a>
          <Link to="/sobreNosotros" className="text-sm font-semibold">
            {t('Sobre nosotros')}
          </Link>
        </div>
      </div>
    </footer>
  );
};