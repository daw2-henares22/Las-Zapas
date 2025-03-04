import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { Button } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { supabase } from "../bd/supabase";
import { useNavigate } from "react-router-dom";

export const Usuarios = () => {
    const { t } = useTranslation();
    const { setError } = useGlobalContext();
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [editingUsers, setEditingUsers] = useState({});

    // Obtener usuarios desde Supabase
    const fetchUsuarios = async () => {
        try {
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

    // Actualizar usuario
    const updateUser = async (id, updates) => {
        try {
            const { error } = await supabase.from("Usuarios").update(updates).eq("id", id);
            if (error) throw error;

            // Actualiza la lista de usuarios en el estado local
            setUsuarios((prev) =>
                prev.map((user) => (user.id === id ? { ...user, ...updates } : user))
            );
            setEditingUsers((prev) => ({ ...prev, [id]: undefined }));
        } catch (error) {
            console.error("Error updating user:", error.message);
            setError(error.message);
        }
    };

    // Eliminar usuario directamente en Supabase
    const deleteUser = async (id) => {
        try {
            const { error } = await supabase.from("Usuarios").delete().eq("id", id);
            if (error) throw error;

            setUsuarios((prev) => prev.filter((user) => user.id !== id));
        } catch (error) {
            console.error("Error deleting user:", error.message);
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-bl from-gray-200 dark:from-gray-800">
            <div className="container mx-auto py-20 pb-16">
                <h1 className="dark:text-white text-blue-gray-800 text-3xl font-bold mb-4 mt-14">
                    {t("Gestión de Usuarios")}
                </h1>
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="w-full table-auto text-left text-sm text-gray-500 dark:text-gray-300">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-200 border-b border-gray-600 dark:border-gray-200 dark:bg-gray-900 dark:text-gray-100">
                            <tr>
                                <th className="px-6 py-3">{t("Nombre")}</th>
                                <th className="px-6 py-3">{t("Correo")}</th>
                                <th className="px-6 py-3">{t("Rol")}</th>
                                <th className="px-6 py-3">{t("Acciones")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios?.map((user) => (
                                <tr key={user.id} className="border-b dark:border-gray-600 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                    <td className="px-6 py-4">
                                        {editingUsers[user.id] !== undefined ? (
                                            <input
                                                type="text"
                                                value={editingUsers[user.id]}
                                                onChange={(e) =>
                                                    setEditingUsers((prev) => ({ ...prev, [user.id]: e.target.value }))
                                                }
                                                onKeyDown={(e) => e.key === "Enter" && updateUser(user.id, { name_user: editingUsers[user.id] })}
                                                className="px-2 py-1 border border-gray-300 rounded-md dark:text-gray-800"
                                            />
                                        ) : (
                                            <button onClick={() => navigate(`/perfil/${user.uid}`)} className="transition duration-150 hover:scale-105">
                                                {user.name_user}
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${user.role === "admin" ? "bg-gray-900 text-gray-100" : "bg-gray-200 text-gray-800"}`}>
                                            {t(`roles.${user.role}`)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-between space-x-4">
                                            <Button size="sm" color="red" onClick={() => deleteUser(user.id)} className="hover:bg-red-700">
                                                {t("Eliminar")}
                                            </Button>
                                            {editingUsers[user.id] !== undefined ? (
                                                <>
                                                    <Button size="sm" color="green" onClick={() => updateUser(user.id, { name_user: editingUsers[user.id] })} className="hover:bg-green-700">
                                                        {t("Guardar")}
                                                    </Button>
                                                    <Button size="sm" color="blue-gray" onClick={() => setEditingUsers((prev) => ({ ...prev, [user.id]: undefined }))} className="bg-gray-900 hover:bg-gray-700">
                                                        {t("Cancelar")}
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button size="sm" color="green" onClick={() => setEditingUsers((prev) => ({ ...prev, [user.id]: user.name_user }))} className="bg-green-700 hover:bg-green-800">
                                                    {t("Editar Nombre")}
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                color="blue"
                                                onClick={() => updateUser(user.id, { role: user.role === "admin" ? "user" : "admin" })}
                                                className="hover:bg-blue-700 w-[100px]"
                                            >
                                                {user.role === "admin" ? t("Convertir a Usuario") : t("Hacer Admin")}
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
