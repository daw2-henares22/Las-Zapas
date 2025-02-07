import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  Button,
  Typography,
  Card,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { supabase } from "../bd/supabase";

export function Comprar() {
  const { tableName, nombre } = useParams();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedTallas, setSelectedTallas] = useState([]);
  const [isTallasMenuOpen, setIsTallasMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
  }, [tableName, nombre]);

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

  const totalPrecio = selectedTallas.length * (parseFloat(item?.precio) || 0);

  if (loading) return <div className="text-center py-20">Cargando...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

  return (
    <>
      <div className="container mx-auto py-20 px-4">
      <Card className="w-full max-w-8xl mx-auto">
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
            <Typography variant="h2" className="font-bold mb-4">
              {item.nombre}
            </Typography>
            <Typography variant="lead" className="mb-4">
              {item.descripcion}
            </Typography>
            <Typography className="text-xl font-semibold mb-4">Selecciona las tallas:</Typography>

            <div className="relative w-full">
              <label className="text-xs text-gray-400">Selecciona Tallas</label>
              <button
                onClick={() => setIsTallasMenuOpen(!isTallasMenuOpen)}
                className="py-2.5 px-3 w-full border border-gray-300 focus:border-blue-500 flex items-center justify-between rounded"
              >
                {selectedTallas.length > 0 ? selectedTallas.join(", ") : "Seleccionar tallas"}
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

            <div className="mr-10 ml-10 mt-4 p-2 bg-gray-100 rounded-md shadow-lg border border-gray-300 max-h-48 overflow-y-auto">
              <Typography variant="h6" className="text-center mb-2">Tallas Seleccionadas</Typography>
              {selectedTallas.map((talla, index) => (
                <div key={index} className="ml-5 mr-5 flex justify-between items-center px-2 py-1 bg-white text-gray-800 rounded-md mb-1">
                  <p className="ml-20">{talla}</p>
                  <button onClick={() => handleRemoveTalla(index)} className="mr-20 text-red-500 font-bold">✕</button>
                </div>
              ))}
            </div>

            <Typography className="text-xl font-semibold text-center mt-10">
              Precio total: {totalPrecio.toFixed(2)} €
            </Typography>
            <Typography className="text-center">
              <Button
                size="lg"
                variant="gradient"
                className="mt-4"
                onClick={() => setShowSuccessPopup(true)}
                disabled={selectedTallas.length === 0}
              >
                Comprar Ahora
              </Button>
            </Typography>
          </CardBody>
        </CardBody>
      </Card>
      </div>

      <Dialog size="xs" open={showSuccessPopup} handler={() => setShowSuccessPopup(false)}>
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col items-center">
            <Typography variant="h4" color="green">
              Compra realizada con éxito.
            </Typography>
            <Typography className="mb-3 font-normal text-center">
              Has comprado {selectedTallas.length} talla(s). Total: {totalPrecio.toFixed(2)} €
            </Typography>
            <Typography className="mb-3 font-normal text-center">
              Que tenga un buen día 😁
            </Typography>
          </CardBody>
          <CardFooter>
            <Button variant="gradient" fullWidth onClick={() => setShowSuccessPopup(false)}>
              Cerrar
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}