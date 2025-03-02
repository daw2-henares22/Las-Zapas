import { useParams } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  Dialog,
  Button,
  Typography,
  Card,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { supabase } from "../bd/supabase";
import { useGlobalContext } from "../context/GlobalContext";
import { useTranslation } from "react-i18next";

export function Comprar() {
  const { t } = useTranslation();

  const { tableName, nombre } = useParams();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedTallas, setSelectedTallas] = useState([]);
  const [isTallasMenuOpen, setIsTallasMenuOpen] = useState(false);
  const {session}= useGlobalContext();
  const menuRef = useRef(null);

  const obtenerSeccionProducto = (tableName) => {
    if (tableName === "ZapatosDeVestirHombre") return "Zapatos para Hombre";
    if (tableName === "BotasYBotinesHombre") return "Botas y Botines para Hombre";
    if (tableName === "ZapatillasHombre") return "Zapatillas para Hombre";
    if (tableName === "ZapatosDeVestirMujer") return "Zapatos para Mujer";
    if (tableName === "BotasYBotinesMujer") return "Botas y Botines para Mujer";
    if (tableName === "ZapatillasMujer") return "Zapatillas para Mujer";
    return "Otras categorías"; // En caso de que agregues más tablas en el futuro
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .eq("nombre", nombre)
          .single();
        if (error) throw error;
        setItem(data);
      } catch (err) {
        setError("No se pudo cargar el elemento. Inténtalo más tarde.");
      } finally {
        setLoading(false);
      }
    };  
    fetchItem();
  }, [tableName, nombre]); // Aseguramos que solo se ejecute cuando estas dependencias cambian
  

  const tallas = [37, 38, 39, 40, 41, 42, 43, 44, 45];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsTallasMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectTalla = (talla) => {
    setSelectedTallas([...selectedTallas, talla]);
  };

  const handleRemoveTalla = (index) => {
    const newTallas = [...selectedTallas];
    newTallas.splice(index, 1);
    setSelectedTallas(newTallas);
  };

  const handleComprar = useCallback(async () => {
    if (selectedTallas.length === 0) return;
  
    let seccionProducto = obtenerSeccionProducto(tableName);
  
    try {
      const { error } = await supabase
        .from("Compras")
        .insert(selectedTallas.map(talla => ({
          uid: session?.user.id,
          puid: item?.id,
          nombre: nombre,
          imagen: item.imagen,
          tabla_producto: tableName,
          seccion: seccionProducto,
          talla: talla,
          precio: item?.precio,
          created_at: new Date()
        })));
  
      if (error) throw error;
  
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error al guardar la compra:", error.message);
    }
  }, [selectedTallas, session, item, tableName]); // Solo cambia si estas dependencias cambian
  


  const totalPrecio = selectedTallas.length * (parseFloat(item?.precio) || 0);

  if (loading) return <div className="text-center py-20">Cargando...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

  return (
    <>
    <div className="min-h-screen bg-gradient-to-bl from-gray-200 dark:from-gray-800">
      <div className="container mx-auto py-20 px-4">
      <Card className="w-full max-w-8xl mx-auto bg-gradient-to-bl bg-gray-400 dark:bg-gray-600">
        <CardBody className="flex flex-col md:flex-row gap-8 items-start">
          <CardBody className="w-full md:w-1/2">
            <img
              src={item.imagen || "https://via.placeholder.com/300"}
              alt={item.nombre}
              className="w-full h-auto rounded-lg shadow-md cursor-pointer"
              onClick={() => setPopupOpen(true)}
            />
            <Dialog open={popupOpen} handler={() => setPopupOpen(false)}>
              <img src={item.imagen} alt={item.nombre} className="w-full h-auto rounded-md" />
            </Dialog>
          </CardBody>

          <CardBody className="w-full md:w-1/2">
            <Typography variant="h2" className="font-bold mb-4 dark:text-gray-100">
              {item.nombre}
            </Typography>
            <Typography variant="lead" className="mb-4 dark:text-gray-100">
              {t('Descripción')}: {item.descripcion}
            </Typography>
            <Typography className="text-xl font-semibold mb-4 dark:text-gray-100">{t('Selecciona las Tallas')}:</Typography>

            <div className="relative w-full">
              <label className="text-xs text-gray-600 dark:text-gray-400">{t('Tallas')}</label>
              <button
                onClick={() => setIsTallasMenuOpen(!isTallasMenuOpen)}
                className="py-2.5 px-3 w-full border border-gray-100 focus:border-gray-900 flex items-center justify-between rounded dark:text-gray-200"
              >
                {selectedTallas.length > 0 ? selectedTallas.join(", ") : t("Numero de Tallas")}
              </button>

              {isTallasMenuOpen && (
                <div ref={menuRef} className="absolute z-10 top-full left-0 md:w-10 sm:w-20 lg:w-20 xl:w-28 rounded-md shadow-lg bg-gray-100 border border-gray-300 mt-1 text-sm">
                  <div className="max-h-48 overflow-y-auto">
                    {tallas.map((talla) => (
                      <div
                        key={talla}
                        onClick={() => handleSelectTalla(talla)}
                        className={`cursor-pointer px-3 py-2 hover:bg-gray-200 ${
                          selectedTallas.includes(talla) ? "bg-blue-100 text-blue-700" : ""
                        }`}
                      >
                        {talla}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mr-10 ml-10 mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-md shadow-lg border border-gray-300 max-h-48 overflow-y-auto">
              <Typography variant="h6" className="text-center mb-2 dark:text-gray-300">{t('Tallas Seleccionadas')}</Typography>
              {selectedTallas.map((talla, index) => (
                <div key={index} className="ml-5 mr-5 flex justify-between items-center px-2 py-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-md mb-1">
                  <p className="ml-20">{talla}</p>
                  <button onClick={() => handleRemoveTalla(index)} className="mr-20 text-red-500 font-bold">✕</button>
                </div>
              ))}
            </div>

            <Typography className="text-xl font-semibold text-center mt-10 dark:text-gray-100">
              Total {t('Precio')}: {totalPrecio.toFixed(2)} €
            </Typography>
            <Typography className="text-center">
              <Button
                size="lg"
                variant="gradient"
                className="mt-4"
                onClick={handleComprar}
                disabled={selectedTallas.length === 0}
              >
                {t('Comprar Ahora')}
              </Button>
            </Typography>
          </CardBody>
        </CardBody>
      </Card>
      </div>

      <Dialog size="xs" open={showSuccessPopup} handler={() => setShowSuccessPopup(false)} className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-[24rem] bg-gray-100 dark:bg-blue-gray-900 dark:text-white">
          <CardBody className="flex flex-col items-center">
            <Typography variant="h4" color="green">
              {t('Compra realizada con éxito')}
            </Typography>
            <Typography className="mb-3 font-normal text-center">
            {t('Has comprado {{count}} {{talla}}', { count: selectedTallas.length, talla: t('talla', { count: selectedTallas.length }) })} Total: {totalPrecio.toFixed(2)} €
            </Typography>
            <Typography className="mb-3 font-normal text-center">
              {t('Que tenga un buen dia')} 😁
            </Typography>
          </CardBody>
          <CardFooter>
            <Button variant="gradient" fullWidth onClick={() => setShowSuccessPopup(false)}>
              Cerrar
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
      </div>
    </>
  );
}