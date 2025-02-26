import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../bd/supabase";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

    // Esto es para las imagenes desde la base de datos para hombre y mujer
    const [zapatosHombre, setZapatosHombre] = useState([]);
    const [zapatillasHombre, setZapatillasHombre] = useState([]);
    const [botasHombre, setBotasHombre] = useState([]);
    const [zapatosMujer, setZapatosMujer] = useState([]);
    const [zapatillasMujer, setZapatillasMujer] = useState([]);
    const [botasMujer, setBotasMujer] = useState([]);
    ////////////////////////////

    const [compras, setCompras] = useState([]);
    const [zapass, setZapass] = useState([]);
    const [activePopup, setActivePopup] = useState(null); // Manejo de popups
    const [session, setSession] = useState(null); // Sesión actual del usuario
    const [usuarios, setUsuarios] = useState([]); // Definición del estado usuarios
    const [userData, setUserData] = useState(null); // Datos del usuario
    const [isAdmin, setIsAdmin] = useState(false); // Indica si el usuario es administrador
    const [selectedItem, setSelectedItem] = useState(null);
    const [editData,setEditData] = useState(null);
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
            console.log("🔍 Sesión al cargar:", data.session); // Debug
    
            if (data.session?.user) {
                setSession(data.session);
                await fetchUserData(data.session.user.id);
                await fetchCompras(data.session.user.id);
            } else {
                setSession(null);
                setUserData(null);
                setIsAdmin(false);
                setCompras([]);
            }
        };
    
        fetchSession();
    
        const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log("⚡ Cambio de sesión:", session); // Debug
    
            if (session?.user) {
                setSession(session);
                fetchUserData(session.user.id);
                fetchCompras(session.user.id);
            } else {
                console.log("❌ Usuario cerró sesión, limpiando estado...");
                setSession(null);
                setUserData(null);
                setIsAdmin(false);
                setCompras([]);
            }
        });
    
        return () => {
            console.log("🛑 Desuscribiendo onAuthStateChange"); // Debug
            subscription?.unsubscribe?.();
        };
    }, []);
    

    const fetchUserData = async (uid) => {
        try {
            const { data, error } = await supabase
                .from("Usuarios") // Nombre de tu tabla
                .select("role") // Selecciona únicamente el campo `role`
                .eq("uid", uid) // Filtra por el ID del usuario
                .single(); // Obtén un único resultado
    
            if (error) throw error;
    
            setIsAdmin(data.role === "admin"); // Actualiza `isAdmin` basado en el rol
        } catch (error) {
            console.error("Error fetching user data:", error.message);
            setIsAdmin(false); // Por seguridad, asume que no es admin si hay un error
        }
    };
    
    //Vista Usuarios
     // Función para obtener los usuarios desde Supabase
     const fetchUsuarios = async () => {
        try {
            // Obtiene todos los usuarios de la tabla "Usuarios"
            const { data, error } = await supabase.from("Usuarios").select("*");

            if (error) throw error;
            setUsuarios(data);
        } catch (error) {
            console.error("Error fetching users:", error.message);
            setError(error.message);
        }
    };

    // Función para actualizar un usuario (cambiar nombre o rol)
    const updateUser = async (id, updates) => {
        try {
            const { data, error } = await supabase.from("Usuarios").update(updates).eq("id", id).select();

            if (error) throw error;

            // Actualiza la lista de usuarios en el estado local
            setUsuarios((prev) => {
                return prev.map((user) => (user.id === id ? data[0] : user));
            });
        } catch (error) {
            console.error("Error updating user:", error.message);
            setError(error.message);
        }
    };

    // Función para eliminar un usuario
    const deleteUser = async (id) => {
        try {
            // Haz la solicitud al endpoint del backend
            const response = await fetch('https://las-zapass.vercel.app/api/delete-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
    
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al eliminar el usuario');
            }
    
            // Si se elimina con éxito, actualiza el estado local
            setUsuarios((prev) => prev.filter((user) => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error.message);
            setError(error.message);
        }
    };
    
    

    //Fin: Vista Usuarios

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
                        .from(compra.tabla_producto) // Consultamos en la tabla específica
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
        openPopup("zapatoBotaDetail"); // Abre el popup específico de la imagen.
    };
    

    const handleOpenEdit = (tableName, item) => {
        setEditData(item); // Guarda los datos actuales en edición.
        setNewZapatoBota(item); // Actualiza el formulario con los datos del zapato.
        openPopup("editZapatoBota"); // Abre el popup de edición.
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
        putZapatoBota();
        openPopup("newZapatoBota");
    }

    const handleSubmit = async (tableName, newItem) => {
        try {
            const { created_at, ...dataToSubmit } = newItem; // Excluye created_at
            const itemToSubmit = editData ? newItem : dataToSubmit; // Solo envía `created_at` si es necesario
    
            let data;
            if (editData) {
                // Modo edición
                const { data: updatedData, error } = await supabase
                    .from(tableName)
                    .update(itemToSubmit)
                    .eq("id", editData.id)
                    .select();
                if (error) throw error;
                data = updatedData[0];
    
                // Actualizar el estado zapass
                setZapass(prev => prev.map(item => item.id === data.id ? data : item));
    
                // También actualiza tableData para reflejar los cambios en caché
                setTableData((prev) => ({
                    ...prev,
                    [tableName]: prev[tableName]?.map((item) => item.id === data.id ? data : item)
                }));
            } else {
                // Modo creación
                const { data: insertedData, error } = await supabase
                    .from(tableName)
                    .insert([itemToSubmit])
                    .select();
                if (error) throw error;
                data = insertedData[0];
    
                // Agregar el nuevo elemento al estado zapass
                setZapass(prev => [...prev, data]);
    
                // También actualiza tableData para reflejar los cambios en caché
                setTableData((prev) => ({
                    ...prev,
                    [tableName]: [...(prev[tableName] || []), data]
                }));
            }
    
            // Limpia el formulario y cierra el popup
            setNewZapatoBota({
                nombre: "",
                created_at: "",
                descripcion: "",
                imagen: "",
                precio: "",
            });
            setEditData(null);
            openPopup(null);
        } catch (error) {
            console.error(`Error handling item in ${tableName}:`, error.message);
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
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut();
            setSession(null);
            setUserData(null);
        } catch (error) {
            console.error("Error logging out:", error.message);
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
            zapass,
            setZapass,
            activePopup,
            openPopup,
            session,
            setSession,
            userData,
            fetchUserData,
            usuarios,
            fetchUsuarios,
            updateUser,
            deleteUser,
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