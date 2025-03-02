import { useState, useEffect } from "react";
import { supabase } from "../bd/supabase";
import { Button, Typography, Card } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function Devoluciones() {
  const { t } = useTranslation();
  const [devoluciones, setDevoluciones] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDevoluciones = async () => {
      setLoading(true);
    
      // 1️⃣ Obtener las devoluciones con la compra asociada
      const { data: devolucionesData, error: devolucionesError } = await supabase
        .from("Devoluciones")
        .select("id, estado, motivo, compra_id, seccion, user_id, talla, precio"); // Agregamos user_id
        
      if (devolucionesError) {
        console.error("Error obteniendo devoluciones:", devolucionesError);
        setLoading(false);
        return;
      }
    
      // 2️⃣ Obtener los datos de las compras asociadas
      const compraIds = devolucionesData.map((dev) => dev.compra_id);
      const { data: compras, error: comprasError } = await supabase
        .from("Compras")
        .select("id, puid, nombre, imagen, tabla_producto, talla, seccion, precio")
        .in("id", compraIds);
    
      if (comprasError) {
        console.error("Error obteniendo compras:", comprasError);
        setLoading(false);
        return;
      }
    
     
    
      // 4️⃣ Obtener los datos de los usuarios que solicitaron la devolución
     
      const { data: usuarios, error: usuariosError } = await supabase
  .from("Usuarios")
  .select("id, uid, name_user, email");

if (usuariosError) {
  console.error("Error obteniendo usuarios:", usuariosError);
} else {
  console.log("Usuarios obtenidos:", usuarios);
}
    
      // 5️⃣ Unir los productos y los usuarios con sus devoluciones
      const devolucionesConProductosYUsuarios = devolucionesData.map((dev) => {
      
        const compra = compras.find((c) => c.id === dev.compra_id);
        const usuario = usuarios.find((u) => u.uid === dev.user_id);

        return {
          ...dev,
          nombre_producto: compra?.nombre || "Sin producto",
          imagen_producto: compra?.imagen || "https://via.placeholder.com/150",
          seccion_producto: compra?.seccion || "Desconocida",
          talla_producto: compra?.talla || "No especificada",
          precio_producto: compra?.precio || "Desconocido",
          usuario_nombre: usuario?.name_user || "Desconocido",
          usuario_email: usuario?.email || "Sin correo",
        };
      });
    
      setDevoluciones(devolucionesConProductosYUsuarios);
      setLoading(false);
    };
    
    fetchDevoluciones();
  }, []);

  const handleUpdateEstado = async (id, estado) => {
    setLoading(true);
    const { error } = await supabase.from("Devoluciones").update({ estado }).eq("id", id);
    if (error) {
      console.error("Error actualizando estado:", error);
    } else {
      setDevoluciones((prev) =>
        prev.map((dev) => (dev.id === id ? { ...dev, estado } : dev))
      );
    }
    setLoading(false);
  };
  console.log("hola");  // Verifica la estructura de la compra y si la propiedad 'seccion' existe
  

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-100 dark:from-gray-800 p-6 pb-20 flex flex-col items-center">
  <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6 md:mt-24 mt-14">
  {t('Gestión de Devoluciones')}
</h3>

  <div className="w-full max-w-6xl space-y-6">
    {loading ? (
      <Typography className="text-center text-gray-600">{t('Cargando...')}</Typography>
    ) : devoluciones.length > 0 ? (
      devoluciones.map((dev) => (
        <Card
          key={dev.id}
          className="p-4 md:p-6 flex flex-col md:flex-row items-center bg-white dark:bg-gray-900 shadow-lg rounded-lg gap-4"
        >
          {/* Imagen */}
          <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
            <img
              src={dev.imagen_producto}
              alt={dev.nombre_producto}
              className="w-full h-full object-cover rounded-md"
            />
          </div>

          {/* Datos en Responsive Grid */}
<div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  <Typography
    className="text-gray-600 font-semibold text-sm"
  >
    {t('Solicitado por')}: <span className="font-medium text-gray-500">{dev.usuario_nombre}</span>
  </Typography>
  <Typography
  className={`text-gray-600 font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis 
  ${dev.estado === "Pendiente" ? "md:ml-[74px] lg:ml-[74px]" : ""}`}
>
  {t('Correo')}: <span className="font-medium text-gray-500">{dev.usuario_email}</span>
</Typography>

  <Typography
    className={`text-gray-600 font-semibold text-sm
      ${dev.estado === "Pendiente" ? "md:ml-[146px]" : ""}`}
  >
    {t('Producto')}: <span className="font-medium text-gray-500">{dev.nombre_producto}</span>
  </Typography>
  <Typography
    className="text-gray-600 font-semibold text-sm"
  >
    {t('Motivo')}: <span className="italic font-medium text-gray-500">{dev.motivo}</span>
  </Typography>
  <Typography
    className={`text-gray-600 font-semibold text-sm
      ${dev.estado === "Pendiente" ? "md:ml-[74px]" : ""}`}
  >
    {t('Sección')}: <span className="font-medium text-gray-500">{dev.seccion_producto}</span>
  </Typography>
  <Typography
    className={`text-gray-600 font-semibold text-sm
      ${dev.estado === "Pendiente" ? "md:ml-[144px]" : ""}`}
  >
    {t('Talla')}: <span className="font-medium text-gray-500">{dev.talla_producto}</span>
  </Typography>
  <Typography className="font-semibold text-sm">
    {t('Estado')}:{" "}
    <span
      className={`${
        dev.estado === "Devuelto"
          ? "text-green-500"
          : dev.estado === "Denegado"
          ? "text-red-500"
          : "text-blue-500"
      }`}
    >
      {t(dev.estado)}
    </span>
  </Typography>
  <Typography
    className={`text-gray-600 font-semibold text-sm
      ${dev.estado === "Pendiente" ? "md:ml-[74px]" : ""}`}
  >
    {t('Precio')}: <span className="font-medium text-gray-500">{dev.precio_producto}</span>
  </Typography>
</div>



          {/* Botones */}
          {dev.estado === "Pendiente" && (
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto md:mt-[160px] lg:mt-[114px] xl:mt-0">
              <Button
                color="green"
                className="text-[13px] px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600 transition"
                onClick={() => handleUpdateEstado(dev.id, t("Devuelto"))}
                disabled={loading}
              >
                {t('Aceptar')}
              </Button>
              <Button
                color="red"
                className="text-[13px]  px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 transition"
                onClick={() => handleUpdateEstado(dev.id, t("Denegado"))}
                disabled={loading}
              >
                {t('Denegar')}
              </Button>
            </div>
          )}
        </Card>
      ))
    ) : (
      <Typography className="text-center text-gray-600">
        {t('No hay devoluciones pendientes')}
      </Typography>
    )}
  </div>
</div>

  

  
);

}