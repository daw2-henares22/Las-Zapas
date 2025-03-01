import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { Button } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export const Usuarios = () => {
    const { t } = useTranslation()
    const { setError } = useGlobalContext();
    const [usuarios, setUsuarios] = useState([]); // Definici贸n del estado usuarios
    const [editUserId, setEditUserId] = useState(null);
    const [newName, setNewName] = useState("");

    // Funci贸n para obtener los usuarios desde Supabase
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
    
        useEffect(() => {
            fetchUsuarios();
        }, []);

        // Funci贸n para actualizar un usuario (cambiar nombre o rol)
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
    
        // Funci贸n para eliminar un usuario
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
        
                // Si se elimina con 茅xito, actualiza el estado local
                setUsuarios((prev) => prev.filter((user) => user.id !== id));
            } catch (error) {
                console.error('Error deleting user:', error.message);
                setError(error.message);
            }
        };

    const handleNameChange = (e, userId) => {
        setNewName(e.target.value);
        setEditUserId(userId);
    };

    const saveNameChange = (userId) => {
        if (newName.trim()) {
            updateUser(userId, { name_user: newName });
        }
        setEditUserId(null);
    };

    const handleKeyDown = (e, userId) => {
        if (e.key === "Enter") {
            saveNameChange(userId);
        }
    };

    const cancelEdit = () => {
        setEditUserId(null);
        setNewName("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-bl from-gray-200 dark:from-gray-800">
        <div className="container mx-auto py-20 pb-16">
            <h1 className="dark:text-white text-blue-gray-800 text-3xl font-bold mb-4 mt-14">
                {t('Gestión de Usuarios')}
            </h1>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="w-full table-auto text-left text-sm text-gray-500 dark:text-gray-300">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 border-b border-gray-600 dark:border-gray-200 dark:bg-gray-900 dark:text-gray-100">
                        <tr>
                            <th className="px-6 py-3">{t('Nombre')}</th>
                            <th className="px-6 py-3">{t('Correo')}</th>
                            <th className="px-6 py-3">{t('Rol')}</th>
                            <th className="px-6 py-3">{t('Acciones')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios?.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                            >
                                <td className="px-6 py-4">
                                    {editUserId === user.id ? (
                                        <input
                                            type="text"
                                            value={newName || user.name_user}
                                            onChange={(e) => handleNameChange(e, user.id)}
                                            onKeyDown={(e) => handleKeyDown(e, user.id)}
                                            className="px-2 py-1 border border-gray-300 rounded-md dark:text-gray-800"
                                        />
                                    ) : (
                                        user.name_user
                                    )}
                                </td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                                            user.role === "admin"
                                                ? "bg-gray-800 text-gray-200"
                                                : "bg-gray-200 text-gray-800"
                                        }`}
                                    >
                                        {t(`roles.${user.role}`)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-between space-x-4">
                                        <Button
                                            size="sm"
                                            color="red"
                                            onClick={() => deleteUser(user.id)}
                                            className="hover:bg-red-700"
                                        >
                                            {t('Eliminar')}
                                        </Button>
                                        {editUserId === user.id ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    color="green"
                                                    onClick={() => saveNameChange(user.id)}
                                                    className="hover:bg-green-700"
                                                >
                                                    {t('Guardar')}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    color="gray"
                                                    onClick={cancelEdit}
                                                    className="hover:bg-gray-700"
                                                >
                                                    {t('Cancelar')}
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                size="sm"
                                                color="blue"
                                                onClick={() => {
                                                    setEditUserId(user.id);
                                                    setNewName(user.name_user);
                                                }}
                                                className="bg-green-700 hover:bg-green-800"
                                            >
                                                {t('Editar Nombre')}
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            color="blue"
                                            onClick={() =>
                                                updateUser(user.id, {
                                                    role: user.role === "admin" ? "user" : "admin",
                                                })
                                            }
                                            className="hover:bg-blue-700 w-[100px]"
                                        >
                                            {user.role === "admin"
                                                ? t('Convertir a Usuario')
                                                : t('Hacer Admin')}
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div> 
    );
};