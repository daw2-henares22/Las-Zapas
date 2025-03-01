import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../bd/supabase";
import { useTranslation } from "react-i18next";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

    const {t} = useTranslation();

    // Esto es para las imagenes desde la base de datos para hombre y mujer
    const [zapatosHombre, setZapatosHombre] = useState([]);
    const [zapatillasHombre, setZapatillasHombre] = useState([]);
    const [botasHombre, setBotasHombre] = useState([]);
    const [zapatosMujer, setZapatosMujer] = useState([]);
    const [zapatillasMujer, setZapatillasMujer] = useState([]);
    const [botasMujer, setBotasMujer] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true); // ⏳ Nuevo estado de carga
    ////////////////////////////

    const [compras, setCompras] = useState([]);
    const [zapass, setZapass] = useState([]);
    const [activePopup, setActivePopup] = useState(null); // Manejo de popups
    const [session, setSession] = useState(null); // Sesi贸n actual del usuario
    const [userData, setUserData] = useState(null); // Datos del usuario
    const [isAdmin, setIsAdmin] = useState(false); // Indica si el usuario es administrador
    const [selectedItem, setSelectedItem] = useState(null);
    const [editData,setEditData] = useState(null);
    const [errorSubmit, setErrorSubmit] = useState("");
    const [error, setError] = useState(null); // Manejo de errores
    const [tableData, setTableData] = useState({}); // Datos de las tablas (cache)

    const openPopup = (popupName) => setActivePopup(popupName); // Cambiar popup activo

    const [newZapatoBota, setNewZapatoBota] = useState({
        nombre: "",
        created_at: "",
        descripcion: "",
        imagen: "",
        precio: "",
    });

    useEffect(() => {
            const fetchSession = async () => {
                const { data } = await supabase.auth.getSession();
                setSession(data.session);
        
                if (data.session?.user) {
                    await fetchUserData(data.session.user.id);
                    await fetchCompras(data.session.user.id);  // 馃憠 Llamar funci贸n aqu铆
                } else {
                    setIsAdmin(false); // Por defecto, no es admin si no hay sesi贸n
                    setCompras([]);  // Limpiar compras si no hay sesi贸n

                }
            };
        
            fetchSession();
        
            const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session);
        
                if (session?.user) {
                    fetchUserData(session.user.id);
                    fetchCompras(session.user.id);  // 馃憠 Actualizar compras al cambiar usuario
                } else {
                    setIsAdmin(false); // Por defecto, no es admin si no hay sesi贸n
                    setCompras([]);
                }
            });
        
            return () => subscription?.unsubscribe?.();
        
    }, []);

    const fetchUserData = async (uid) => {
        try {
            setLoadingUser(true); // Inicia carga
            const { data, error } = await supabase
                .from("Usuarios")
                .select("role, name_user")
                .eq("uid", uid)
                .single();
    
            if (error) throw error;
    
            setIsAdmin(data.role === "admin");
    
            setSession((prevSession) => ({
                ...prevSession,
                user: {
                    ...prevSession.user,
                    user_metadata: { ...prevSession.user.user_metadata, name: data.name_user },
                },
            }));
        } catch (error) {
            console.error("Error fetching user data:", error.message);
            setIsAdmin(false);
        } finally {
            setLoadingUser(false); // Finaliza carga
        }
    };
    

    const fetchTableData = async (tableName) => {
        if (tableData[tableName]) {
            return tableData[tableName];
        }

        try {
            const { data, error } = await supabase.from(tableName).select("*");
            if (error) throw error;
            setTableData((prev) => ({ ...prev, [tableName]: data }));
            return data;
        } catch (error) {
            console.error(`Error fetching data from ${tableName}:`, error.message);
            setError(error.message);
            return [];
        }
    };

    const handleOpen = (item, popupName) => {
        setSelectedItem(item);
        openPopup(popupName);
    };

    const editTableData = async (tableName, id, updates) => {
        try {
            const { data, error } = await supabase
                .from(tableName)
                .update(updates)
                .eq("id", id)
                .select();

            if (error) throw error;

            if (!data || data.length === 0) {
                throw new Error("Update failed, no data returned.");
            }

            setTableData((prev) => {
                const updatedTable = prev[tableName]?.map((item) =>
                    item.id === id ? data[0] : item
                );
                return { ...prev, [tableName]: updatedTable };
            });

            return data[0];
        } catch (error) {
            console.error(`Error updating data in ${tableName}:`, error.message);
            setError(error.message);
        }
    };

    //Compras

    const fetchCompras = async (userId) => {
        try {
            const { data: compras, error } = await supabase
                .from("Compras")
                .select("id, created_at, puid, tabla_producto, talla")
                .eq("uid", userId);
            
            if (error) throw error;
    
            // Obtener los detalles de cada producto de su tabla respectiva
            const productosComprados = await Promise.all(
                compras.map(async (compra) => {
                    const { data: producto, error: errorProducto } = await supabase
                        .from(compra.tabla_producto) // Consultamos en la tabla espec铆fica
                        .select("nombre, imagen, precio")
                        .eq("id", compra.puid)
                        .single();
                    
                    if (errorProducto) {
                        console.error(`Error obteniendo producto ${compra.puid} de ${compra.tabla_producto}:`, errorProducto);
                        return null;
                    }
    
                    return { ...compra, producto };
                })
            );
    
            // Filtramos los productos que se encontraron correctamente
            setCompras(productosComprados.filter(item => item !== null));
    
        } catch (error) {
            console.error("Error obteniendo compras:", error.message);
            setError(error.message);
        }
    };
    
    /////////////////

    const handleOpenImage = (item) => {
        setSelectedItem(item); // Establece el elemento seleccionado para el popup.
        openPopup("zapatoBotaDetail"); // Abre el popup espec铆fico de la imagen.
    };
    

    const handleOpenEdit = (tableName, item) => {
        setEditData(item); // Guarda los datos actuales en edici贸n.
        setNewZapatoBota(item); // Actualiza el formulario con los datos del zapato.
        openPopup("editZapatoBota"); // Abre el popup de edici贸n.
    };    
    

    const putZapatoBota = () => {
        setNewZapatoBota({
            nombre: "",
            created_at: "",
            descripcion: "",
            imagen: "",
            precio: "",
        })
    }

    const handleOpenPut = () => {
        setErrorSubmit(""); // Limpia el mensaje de error al abrir el popup
        putZapatoBota();
        openPopup("newZapatoBota");
    }

    const handleSubmit = async (tableName, newItem) => {
        try {
            const { created_at, ...dataToSubmit } = newItem; // Excluye created_at
    
            // Verificar si ya existe un zapato con el mismo nombre
            const { data: existingData, error: fetchError } = await supabase
                .from(tableName)
                .select("id")
                .eq("nombre", newItem.nombre);
    
            if (fetchError) throw fetchError;
    
            // Si ya existe y estamos en modo creación, muestra el error y detiene la ejecución
            if (existingData.length > 0 && !editData) {
                setErrorSubmit(t('Ya existe este nombre'));
                return; // Detiene la ejecución si ya existe un zapato con el mismo nombre
            }
    
            let data;
            if (editData) {
                // Modo edición
                const { data: updatedData, error } = await supabase
                    .from(tableName)
                    .update(dataToSubmit)
                    .eq("id", editData.id)
                    .select();
    
                if (error) throw error;
                data = updatedData[0];
    
                // Actualizar estados localmente
                setZapass(prev => prev.map(item => item.id === data.id ? data : item));
                setTableData(prev => ({
                    ...prev,
                    [tableName]: prev[tableName]?.map(item => item.id === data.id ? data : item),
                }));
            } else {
                // Modo creación
                const { data: insertedData, error } = await supabase
                    .from(tableName)
                    .insert([dataToSubmit])
                    .select();
    
                if (error) throw error;
                data = insertedData[0];
    
                // Agregar nuevo elemento al estado
                setZapass(prev => [...prev, data]);
                setTableData(prev => ({
                    ...prev,
                    [tableName]: [...(prev[tableName] || []), data],
                }));
            }
    
            // Limpiar formulario y cerrar popup
            setNewZapatoBota({
                nombre: "",
                descripcion: "",
                imagen: "",
                precio: "",
            });
            setEditData(null);
            openPopup(null);
        } catch (error) {
            console.error(`Error en ${tableName}:`, error.message);
            setError(error.message);
        }
    };
    
    
    
    
    
    

    const deleteTableData = async (tableName, id) => {
        try {
            const { error } = await supabase.from(tableName).delete().eq("id", id);
            if (error) throw error;

            setTableData((prev) => {
                const updatedTable = prev[tableName]?.filter((item) => item.id !== id);
                return { ...prev, [tableName]: updatedTable };
            });
        } catch (error) {
            console.error(`Error deleting data from ${tableName}:`, error.message);
            setError(error.message);
        }
    };

    const handleChange = (editZapatoBota) => {
        const { name, value } = editZapatoBota.target;
    
        setNewZapatoBota((prev) => ({
            ...prev,
            [name]: value,
        }));
    
        if (name === "nombre") {
            setErrorSubmit(null); // Borra el error si el usuario cambia el nombre
        }
    };
    
    
    const logout = async () => {
        try {
            await supabase.auth.signOut();
            setSession(null);
            setUserData(null);
    
            // 🔄 Forzar actualización de sesión después del logout
            await supabase.auth.refreshSession();
    
        } catch (error) {
            console.error("Error cerrando sesión:", error.message);
            setError(error.message);
        }
    }; 

    return (
        <GlobalContext.Provider value={{
            zapatosHombre,
            setZapatosHombre,
            zapatillasHombre,
            setZapatillasHombre,
            botasHombre,
            setBotasHombre,
            zapatosMujer,
            setZapatosMujer,
            zapatillasMujer,
            setZapatillasMujer,
            botasMujer,
            setBotasMujer,
            compras,
            fetchCompras,
            errorSubmit,
            setErrorSubmit,
            zapass,
            setZapass,
            activePopup,
            openPopup,
            session,
            setSession,
            userData,
            fetchUserData,
            loadingUser,
            fetchTableData,
            isAdmin,
            setIsAdmin,
            selectedItem,
            handleOpen,
            editTableData,
            editData,
            setEditData,
            handleOpenImage,
            handleOpenEdit,
            newZapatoBota,
            setNewZapatoBota,
            handleOpenPut,
            handleSubmit,
            deleteTableData,
            handleChange,
            logout,
            error,
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);