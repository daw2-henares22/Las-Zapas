import { Button, Dialog } from "@material-tailwind/react";
import { useGlobalContext } from "../context/GlobalContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Home() {
   const { t } = useTranslation();
  const { handleOpen, activePopup, openPopup, session } = useGlobalContext();

  const openLoginForCategory = (category) => {
    handleOpen(null, category);
    openPopup("login"); // Asegura abrir el popup del login
  };

 

  return (
      <div className="relative flex flex-col items-center py-16">
        <h2 className="dark:text-white text-black md:text-5xl text-4xl font-extrabold mb-8 mt-8 text-center">
          {t('Bienvenido a Las Zapas')}
        </h2>
        <p className="dark:text-gray-200 text-gray-700 text-lg mb-12 text-center max-w-2xl w-[600px]">
          {t('Descubre nuestra colección de zapatillas para todas las ocasiones. ¡Encuentra tus favoritas ahora!')}
        </p>

        <div className="text-center grid md:grid-cols-2 gap-20 px-4">
          {/* Categoría: Hombres */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden group w-[500px] md:w-[300px] lg:w-[500px] xl:w-[610px]">
            <button className="w-full transition duration-300 hover:scale-105">
              <img
                onClick={() => handleOpen(null, "zapatoHombre")} // Pasamos null como item
                src="/3perfecto.png"
                alt="Hombres"
                className="w-full h-56 object-cover"
              />
            </button>
            <Dialog
              size="xs"
              open={activePopup === "zapatoHombre"}
              handler={() => openPopup(null)} // Para cerrar el popup
              className="bg-transparent shadow-none"
            >
              <img src="/3perfecto.png" alt="zapatoHombre" className="w-full mb-4 rounded-md" />
            </Dialog>
            <div className="p-4">
              <h3 className="text-black dark:text-white text-2xl font-bold mb-2">{t('Hombres')}</h3>
              <p className="text-gray-600 dark:text-gray-100 font-semibold mb-4">
                {t('Estilo y comodidad en cada paso. Explora nuestra colección para hombres')}
              </p>
                {!session && (
                              <>
                                <Button
                                  size="sm"
                                  color="blue"
                                  onClick={() => openLoginForCategory("zapatoHombre")}
                                  >
                                    {t('Ver Más')}
                                </Button>
                              </>
                )}
                {session && (
                              <Link to="/hombre">
                                <Button
                                  size="sm"
                                  color="blue"
                                  onClick={() => openLoginForCategory("zapatoHombre")}
                                >
                                  {t('Ver Más')}
                                </Button>
                              </Link>
                )}
            </div>
          </div>

          {/* Categoría: Mujeres */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden group w-[500px] md:w-[300px] lg:w-[500px] xl:w-[610px]">
            <button className="w-full transition duration-300 hover:scale-105">
              <img
                onClick={() => handleOpen(null, "zapatoMujer")} // Pasamos null como item
                src="/m1.png"
                alt="Mujeres"
                className="w-full h-56 object-cover"
              />
            </button>
            <Dialog
              size="xs"
              open={activePopup === "zapatoMujer"}
              handler={() => openPopup(null)} // Para cerrar el popup
              className="bg-transparent shadow-none"
            >
              <img src="/m1.png" alt="zapatoMujer" className="w-full mb-4 rounded-md" />
            </Dialog>
            <div className="p-4">
              <h3 className="text-black dark:text-white text-2xl font-bold mb-2">{t('Mujeres')}</h3>
              <p className="text-gray-600 dark:text-gray-100 font-semibold mb-4">
                {t('Diseños elegantes para cualquier ocasión. Encuentra tu par ideal')}
              </p>
                {!session && (
                              <>
                                <Button
                                  size="sm"
                                  color="blue"
                                  onClick={() => openLoginForCategory("zapatoMujer")}
                                  >
                                    {t('Ver Más')}
                                </Button>
                              </>
                )}
                {session && (
                              <Link to="/mujer">
                                <Button
                                  size="sm"
                                  color="blue"
                                  onClick={() => openLoginForCategory("zapatoMujer")}
                                >
                                  {t('Ver Más')}
                                </Button>
                              </Link>
                )}
            </div>
          </div>
        </div>
      </div>
  );
}