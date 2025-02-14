import { useState, useEffect } from "react";
import { supabase } from "../bd/supabase";
import { Button, Typography, Card, CardBody } from "@material-tailwind/react";

export function Devoluciones() {
  const [devoluciones, setDevoluciones] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDevoluciones = async () => {
      const { data, error } = await supabase.from("Devoluciones").select("id, motivo, estado, user_id, compra_id, compras (producto (nombre))");
      if (error) console.error(error);
      else setDevoluciones(data);
    };
    fetchDevoluciones();
  }, []);

  const handleUpdateEstado = async (id, estado) => {
    setLoading(true);
    const { error } = await supabase.from("Devoluciones").update({ estado }).eq("id", id);
    if (error) {
      console.error(error);
    } else {
      setDevoluciones(devoluciones.map((dev) => (dev.id === id ? { ...dev, estado } : dev)));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-200 dark:from-gray-800 p-6">
      <Typography variant="h3" className="mb-4">Gestión de Devoluciones</Typography>
      <div className="space-y-4">
        {devoluciones.length > 0 ? (
          devoluciones.map((dev) => (
            <Card key={dev.id} className="p-4">
              <CardBody>
                <Typography variant="h5">{dev.compras.producto.nombre}</Typography>
                <Typography className="text-gray-600">Motivo: {dev.motivo}</Typography>
                <Typography className="mb-2">Estado: {dev.estado}</Typography>
                {dev.estado === "pendiente" && (
                  <div className="flex space-x-2">
                    <Button color="green" onClick={() => handleUpdateEstado(dev.id, "Producto Devuelto")} disabled={loading}>Aceptar</Button>
                    <Button color="red" onClick={() => handleUpdateEstado(dev.id, "Denegada")} disabled={loading}>Denegar</Button>
                  </div>
                )}
              </CardBody>
            </Card>
          ))
        ) : (
          <Typography>No hay devoluciones pendientes.</Typography>
        )}
      </div>
    </div>
  );
}