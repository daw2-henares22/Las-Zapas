import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";


export const SobreNosotros = () => {
    const {t} = useTranslation();

    return (
      <div className="min-h-screen bg-gradient-to-bl from-gray-200 dark:from-gray-800 flex items-center justify-center p-8">
        <div className="max-w-4xl bg-white dark:bg-gray-900  shadow-2xl rounded-3xl p-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">{t('Sobre Nosotros')}</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {t('En')} <span className="font-semibold text-gray-900 dark:text-gray-100">Las Zapas</span>, {t('nos apasiona ofrecer el mejor calzado para cada ocasión. Nuestra tienda online cuenta con una amplia selección de')} <span className="font-semibold text-gray-900 dark:text-gray-100">{t('botas, botines, zapatos y zapatillas')}</span> {t('tanto para hombre como para mujer, combinando estilo, confort y calidad')}.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {t('Trabajamos con las mejores marcas para garantizarte productos excepcionales, cuidando cada detalle para que encuentres el calzado perfecto que se adapte a tu personalidad y necesidades')}.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {t('Gracias por confiar en nosotros y ser parte de nuestra comunidad. ¡Explora nuestra colección y da el siguiente paso con estilo y comodidad!')}
          </p>
          <div className="mt-6">
            <Link to="/" className="px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-black rounded-full text-lg font-semibold shadow-lg hover:bg-gray-800 transition">{t('Explorar Colección')}</Link>
          </div>
        </div>
      </div>
    );
  };