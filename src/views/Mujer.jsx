import { Button, Dialog } from "@material-tailwind/react";
import { useGlobalContext } from "../context/GlobalContext";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function Mujer() {
  const { t } = useTranslation()
  const { fetchTableData, zapatosMujer, setZapatosMujer, zapatillasMujer, setZapatillasMujer, botasMujer, setBotasMujer, selectedItem, handleOpen, activePopup, openPopup } = useGlobalContext();

  const openLoginForCategory = (category) => {
    handleOpen(null, category);
    openPopup("login");
  };

  useEffect(() => {
    const fetchZapatos = async () => {
      const data = await fetchTableData("ZapatosDeVestirMujer");
      // Encuentra el elemento con el ID más bajo
      const minIdItem = data.reduce((minItem, currentItem) =>
        currentItem.id < minItem.id ? currentItem : minItem
      , data[0]);
      setZapatosMujer([minIdItem]); // Configura el estado con un solo elemento (el de menor ID)
    };
    fetchZapatos();

    const fetchZapatillas = async () => {
      const data = await fetchTableData("ZapatillasMujer");
      // Encuentra el elemento con el ID más bajo
      const minIdItem = data.reduce((minItem, currentItem) =>
        currentItem.id < minItem.id ? currentItem : minItem
      , data[0]);
      setZapatillasMujer([minIdItem]);
    };
    fetchZapatillas();

    const fetchBotas = async () => {
      const data = await fetchTableData("BotasYBotinesMujer");
      // Encuentra el elemento con el ID más bajo
      const minIdItem = data.reduce((minItem, currentItem) =>
        currentItem.id < minItem.id ? currentItem : minItem
      , data[0]);
      setBotasMujer([minIdItem]);
    };
    fetchBotas();
  }, []);

  return (
      <div className="relative flex flex-col items-center py-16">
        <h2 className="dark:text-white text-black md:text-5xl text-4xl font-extrabold mb-8 mt-6 text-center">
          {t('Zapatos para Mujer')}
        </h2>
        <p className="dark:text-gray-200 text-gray-700 text-lg mb-12 text-center max-w-2xl w-[600px]">
          {t('Explora nuestra colección exclusiva para mujeres: Botas, Zapatillas y Zapatos de vestir')}
        </p>

        <div className="text-center grid md:grid-cols-3 gap-20 px-4">
          {/* Botas */}
        {botasMujer.map((Bota, index) => (
          <div key={Bota?.id || `botas-${index}`} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden group w-[400px] md:w-[250px] lg:w-[330px] xl:w-[390px]">
            <button className="w-full transition duration-300 hover:scale-105">
              <img
                onClick={() => handleOpen(Bota, "botasMujer")}
                src={Bota?.imagen || "/botasMujer.png"} // Cambia por la imagen correspondiente
                alt={Bota?.nombre || "Botas"}
                className="w-full h-56 object-cover"
              />
            </button>
            <Dialog
              size="xs"
              open={activePopup === "botasMujer" && selectedItem?.id === Bota?.id}
              handler={() => openPopup(null)}
              className="bg-transparent shadow-none"
            >
              <img src={selectedItem?.imagen || "botasMujer.png"} alt={selectedItem?.nombre || "Botas"} className="w-full mb-4 rounded-md" />
            </Dialog>
            <div className="p-4">
              <h3 className="text-black dark:text-white text-2xl font-bold mb-2">{t('Botas')}</h3>
              <p className="text-gray-600 dark:text-gray-100 font-semibold mb-4">{t('Duraderas y con estilo para cualquier ocasión')}</p>
              <Link to="/botasMujer">
                <Button
                  size="sm"
                  color="blue"
                  onClick={() => openLoginForCategory("botasMujer")}
                >
                  {t('Ver Más')}
                </Button>
              </Link>
            </div>
          </div>
        ))}
          {/* Zapatillas */}
          {zapatillasMujer.map((Zapatilla, index) => (
            <div key={Zapatilla?.id || `zapatillas-${index}`} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden group w-[400px] md:w-[250px] lg:w-[330px] xl:w-[390px]">
              <button className="w-full transition duration-300 hover:scale-105">
                <img
                  onClick={() => handleOpen(Zapatilla, "zapatillasMujer")}
                  src={Zapatilla?.imagen || "/zapatillasMujer.png"}
                  alt={Zapatilla?.nombre || "Zapatillas"}
                  className="w-full h-56 object-cover"
                />
              </button>
              <Dialog
                size="xs"
                open={activePopup === "zapatillasMujer" && selectedItem?.id === Zapatilla?.id}
                handler={() => openPopup(null)}
                className="bg-transparent shadow-none"
              >
                <img src={selectedItem?.imagen || "zapatillasMujer.png"} alt={selectedItem?.nombre || "Zapatillas"} className="w-full mb-4 rounded-md" />
              </Dialog>
              <div className="p-4">
                <h3 className="text-black dark:text-white text-2xl font-bold mb-2">{t('Zapatillas')}</h3>
                <p className="text-gray-600 dark:text-gray-100 font-semibold mb-4">{t('Comodidad y estilo para tu día a día')}</p>
                <Link to="/zapatillasMujer">
                  <Button
                    size="sm"
                    color="blue"
                    onClick={() => openLoginForCategory("zapatillasMujer")}
                  >
                    {t('Ver Más')}
                  </Button>
                </Link>
              </div>
            </div>
          ))}

          {/* Zapatos de vestir */}
          {zapatosMujer.map((Zapato, index) => (
            <div key={Zapato?.id || `zapatos-${index}`} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden group w-[400px] md:w-[250px] lg:w-[330px] xl:w-[390px]">
              <button className="w-full transition duration-300 hover:scale-105">
                <img
                  onClick={() => handleOpen(Zapato, "vestirMujer")}
                  src={Zapato?.imagen || "/vestirMujer.png"}
                  alt={Zapato?.nombre || "Zapatos de vestir"}
                  className="w-full h-56 object-cover"
                />
              </button>
              <Dialog
                size="xs"
                open={activePopup === "vestirMujer" && selectedItem?.id === Zapato?.id}
                handler={() => openPopup(null)}
                className="bg-transparent shadow-none"
              >
                <img src={selectedItem?.imagen} alt={selectedItem?.nombre} className="w-full mb-4 rounded-md" />
              </Dialog>
              <div className="p-4">
                <h3 className="text-black dark:text-white text-2xl font-bold mb-2">{t('Zapatos de vestir')}</h3>
                <p className="text-gray-600 dark:text-gray-100 font-semibold mb-4">{t('Elegancia para ocasiones especiales')}</p>
                <Link to="/zapatosMujer">
                  <Button
                    size="sm"
                    color="blue"
                    onClick={() => openLoginForCategory("vestirMujer")}
                  >
                    {t('Ver Más')}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}