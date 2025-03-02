import { useState, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { Dialog, Button, Typography, Input, Card, CardBody, Alert } from "@material-tailwind/react";
import { supabase } from "../bd/supabase";
import { useTranslation } from "react-i18next";

export function Perfil() {

  const { t } = useTranslation();

  const { compras, session, setSession, fetchCompras, fetchUserData } = useGlobalContext();
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [view, setView] = useState(() => localStorage.getItem("perfilView") || "compras");
  const [showMotivoInput, setShowMotivoInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMotivo, setErrorMotivo] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [devoluciones, setDevoluciones] = useState({});
  const [cancelCompraId, setCancelCompraId] = useState(null);

  const [email, setEmail] = useState(session?.user?.email || "");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");

// Guardar en localStorage cuando cambia la vista
useEffect(() => {
  localStorage.setItem("perfilView", view);
}, [view]);

  useEffect(() => {
    if (session?.user?.id) {
        fetchCompras(session.user.id);
    }
}, [session]);  // Se ejecuta cuando la sesión cambia

const handleUpdateProfile = async () => {
  if (!email.trim() || !nombre.trim()) {
    return showAlert(t("Todos los campos son obligatorios"), "red");
  }

  if (!session?.user?.id) {
    return showAlert(t("Error: Usuario no identificado"), "red");
  }

  try {
    const response = await fetch("https://las-zapass.vercel.app/api/update-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.user.id,
        nombre,
        email,
        password: password || undefined, // Solo lo manda si hay contraseña
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Error al actualizar perfil");
    }

    // 🔹 Actualizar sesión con el nuevo correo y nombre
    setSession((prevSession) => ({
      ...prevSession,
      user: {
        ...prevSession.user,
        email,
        user_metadata: { ...prevSession.user.user_metadata, name: nombre },
      },
    }));

    // 🔹 Volver a obtener los datos desde la base de datos
    await fetchUserData(session.user.id);

    showAlert(t("Perfil actualizado"), "green");
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    showAlert(t("Error al actualizar el perfil"), "red");
  }
};




  useEffect(() => {
    const fetchDevoluciones = async () => {
      const { data } = await supabase.from("Devoluciones").select("*").eq("user_id", session?.user?.id);
      const devolMap = {};
      data?.forEach((d) => (devolMap[d.compra_id] = d));
      setDevoluciones(devolMap);
    };
    if (session?.user?.id) fetchDevoluciones();
  }, [session]);

  const handleOpenModal = (compra) => {
    setSelectedCompra(compra);
    setShowModal(true);
    setShowMotivoInput(false);
    setMotivo("");
    setErrorMotivo("");
  };

  const handleConfirmDevolucion = () => {
    if (cancelCompraId) {
      // Si estamos cancelando una devolución, simplemente cerramos el modal
      setShowModal(false);
      setCancelCompraId(null); // Reseteamos el estado
    } else {
      // Si estamos haciendo una devolución nueva, pedimos el motivo
      setShowMotivoInput(true);
    }
  };

  const showAlert = (message, color) => {
    setAlertMessage({ message, color });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleEnviarDevolucion = async () => {
    if (!motivo.trim()) return setErrorMotivo(t("Por favor, ingresa un motivo"));
    if (!session?.user?.id) return showAlert(t("Usuario no autenticado"), "red");
    setLoading(true);
    try {
      const { error } = await supabase.from("Devoluciones").insert([{ user_id: session.user.id, compra_id: selectedCompra.id, motivo, estado: "Pendiente" }]);
      if (error) throw error;
      showAlert(t("Devolución enviada"), "green");
      setShowModal(false);
      setDevoluciones({ ...devoluciones, [selectedCompra.id]: { motivo, estado: "Pendiente" } });
    } catch (error) {
      showAlert(t("Error al solicitar devolución"), "red");
    } finally {
      setLoading(false);
    }
  };

  const handleEditDevolucion = async (compra) => {
    setSelectedCompra(compra);
    setMotivo(devoluciones[compra.id].motivo);
    setShowModal(true);
    setShowMotivoInput(true);
  };

  const handleUpdateDevolucion = async () => {
    if (!motivo.trim()) return setErrorMotivo("Ingresa un motivo");
    setLoading(true);
    try {
      const { error } = await supabase.from("Devoluciones").update({ motivo }).eq("compra_id", selectedCompra.id);
      if (error) throw error;
      showAlert(t("Motivo actualizado"), "green");
      setShowModal(false);
      setDevoluciones({ ...devoluciones, [selectedCompra.id]: { ...devoluciones[selectedCompra.id], motivo } });
    } catch (error) {
      showAlert(t("Error al actualizar el motivo"), "red");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDevolucion = async (compraId) => {
    setCancelCompraId(compraId);
    setShowModal(true);
    setShowMotivoInput(false);
  };
  
  const handleConfirmCancelDevolucion = async () => {
    if (!cancelCompraId) return;
  
    try {
      const { error } = await supabase.from("Devoluciones").delete().eq("compra_id", cancelCompraId);
  
      if (error) throw error;
  
      // Eliminar la devolución del estado
      const updatedDevoluciones = { ...devoluciones };
      delete updatedDevoluciones[cancelCompraId];
      setDevoluciones(updatedDevoluciones);
  
      showAlert(t("Devolución cancelada"), "green");
    } catch (error) {
      console.error("Error al cancelar la devolución:", error);
      showAlert(t("Error al cancelar la devolución"), "red");
    } finally {
      setShowModal(false);
      setCancelCompraId(null);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-200 dark:from-gray-800 p-6 pt-24 pb-20 flex justify-center items-center">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-8 border border-gray-200 dark:border-gray-600">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 border-b pb-4 mb-6">{t('Perfil')}</h1>
        <div className="flex justify-between">
          <button className={`capitalize text-2xl font-medium px-4 py-2 rounded-xl mb-4 
            ${view === "compras" ? "text-gray-900 dark:text-gray-100 cursor-text select-text" : "transition duration-150 hover:scale-105 bg-gray-900 hover:bg-gray-700 dark:bg-gray-200 dark:hover:bg-gray-400 text-gray-100 dark:text-gray-900"}`}
            onClick={() => setView("compras")}
          >
            {t("Mis Compras")}
          </button>

          <button className={`capitalize text-2xl font-medium px-4 py-2 rounded-xl mb-4
            ${view === "editar" ? "text-gray-900 dark:text-gray-100 cursor-text select-text" : "transition duration-150 hover:scale-105 bg-gray-900 hover:bg-gray-700 dark:bg-gray-200 dark:hover:bg-gray-400 text-gray-100 dark:text-gray-900"}`}
            onClick={() => setView("editar")}
          >
            {t("Editar")}
          </button>
        </div>

        {view === "editar" ? (
          <div className="space-y-4">
            <Input color="blue-gray" className="text-gray-900 dark:text-gray-100" type="text" label={t("Nombre")} value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <Input color="blue-gray" className="text-gray-900 dark:text-gray-100" type="email" label={t("Correo electrónico")} value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input color="blue-gray" className="text-gray-900 dark:text-gray-100" label={t("Nueva contraseña")} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button color="green" onClick={handleUpdateProfile}>{t("Guardar cambios")}</Button>
          </div>
        ) : (

        
        <div className="space-y-6">
          {compras.length > 0 ? (
            compras.map((compra) => (
              <div key={compra.id} className="flex items-center from-gray-200 bg-gradient-to-bl dark:from-gray-700 p-5 rounded-lg shadow-md border hover:shadow-lg transition-all">
                <img src={compra.imagen || "https://via.placeholder.com/100"} alt={compra.nombre} className="w-24 h-24 object-cover rounded-md" />
                <div className="ml-5 flex-1 text-[13px] sm:text-[13px] md:text-[16px]">
                  <div className="flex">
                    <h3 className="text-[14px] sm:text-lg md:text-lg lg:text-lg xl:text-lg font-extrabold text-gray-900 dark:text-gray-100">{t('Sección')}:</h3>
                    <h3 className="ml-[10px] pt-[1px] text-[14px] sm:text-[16px] md:text-lg lg:text-lg xl:text-lg font-semibold text-gray-900 dark:text-gray-100">{compra.seccion}</h3>
                  </div>
                  <h2 className="text-[14px] sm:text-lg md:text-lg lg:text-lg xl:text-lg font-semibold text-gray-900 dark:text-gray-100">{compra.nombre}</h2>
                  <p className="text-gray-600 dark:text-gray-300">{compra.created_at.split("T")[0]}</p>
                  <p className="text-gray-900 dark:text-gray-100">{t('Talla')}: {compra.talla}</p>
                  <p className="text-gray-900 dark:text-gray-100 font-bold">{compra.precio}</p>
                  {devoluciones[compra.id] ? (
                    <div className="mt-2">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {t('Estado')}: <span className={
                          devoluciones[compra.id]?.estado === "Devuelto"
                            ? "text-green-500"
                            : devoluciones[compra.id]?.estado === "Denegado"
                            ? "text-red-500"
                            : "text-blue-500"
                        }>
                          {t(devoluciones[compra.id]?.estado)}
                        </span>
                      </p>
                      <div className="flex flex-col space-x-0 sm:space-x-2 sm:flex-row mt-2">
                        <Button className="text-[11px] sm:text-[12px]" size="sm" color="blue" onClick={() => handleEditDevolucion(compra)}>{t('Editar el Motivo')}</Button>
                        <Button className="mt-2 sm:mt-0 text-[11px] sm:text-[12px]" size="sm" color="red" onClick={() => handleCancelDevolucion(compra.id)}>{t('Cancelar Devolución')}</Button>
                      </div>
                    </div>
                  ) : (
                    <Button className="text-[11px] sm:text-[12px] mt-2" size="sm" color="red" onClick={() => handleOpenModal(compra)}>{t('Devolución')}</Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">{t('No tienes compras registradas')}</p>
          )}
        </div>
        )}
      </div>
      <Dialog size="xs" open={showModal} handler={() => setShowModal(false)} className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-[24rem] bg-gray-100 dark:bg-blue-gray-900">
          <CardBody className="flex flex-col items-center">
            {!showMotivoInput ? (
              <>
                <Typography variant="h4" className="text-red-600 text-center">
                  {cancelCompraId 
                    ? t('¿Seguro que quieres cancelar la devolución?') 
                    : t('¿Seguro que quieres devolver este producto?')
                  }
                </Typography>
                <Typography className="mb-3 font-normal text-center text-gray-700 dark:text-gray-300">{selectedCompra?.nombre || compras.producto?.nombre}</Typography>
                <div className="flex justify-between w-full mt-4">
                <Button className="text-[11px]" color="red" onClick={cancelCompraId ? handleConfirmCancelDevolucion : handleConfirmDevolucion}>
                  {t('Sí, estoy seguro')}
                </Button>
                  <Button className="text-[11px]" color="gray" onClick={() => setShowModal(false)}>
                    {cancelCompraId ? t('No quiero cancelar') : t('No quiero devolver')}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Typography variant="h5" className="text-gray-800 dark:text-gray-200 font-extrabold">{t('Motivo de la devolución')}</Typography>
                <Input color="blue-gray" className="text-gray-900 dark:text-gray-100 w-full" type="text" label={t('Motivo')} value={motivo} onChange={(e) => { setMotivo(e.target.value); setErrorMotivo(""); }} disabled={loading} />
                {errorMotivo && <Typography className="text-red-600 text-sm mt-2">{errorMotivo}</Typography>}
                <div className="flex justify-between w-full mt-4">
                  <Button color="green" onClick={selectedCompra && devoluciones[selectedCompra.id] ? handleUpdateDevolucion : handleEnviarDevolucion} disabled={loading}>
                    {loading ? "Enviando..." : "Guardar"}
                  </Button>
                  <Button color="gray" onClick={() => setShowModal(false)} disabled={loading}>{t('Cancelar')}</Button>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </Dialog>
      {alertMessage && <Alert color={alertMessage.color} className="fixed bottom-5 z-50">{alertMessage.message}</Alert>}
    </div>
  );
}