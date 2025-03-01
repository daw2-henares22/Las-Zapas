import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY); // Crear cliente aquí

  const { userId, nombre, email, password } = req.body;

  if (!userId || !nombre.trim() || !email.trim()) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    //  Actualizar el nombre en la tabla Usuarios
    const { error: profileError } = await supabase
      .from("Usuarios")
      .update({ name_user: nombre, email: email })
      .eq("uid", userId);

    if (profileError) {
      throw profileError;
    }

    //  Actualizar el correo en Supabase Auth
    const { data: userData, error: authError } = await supabase.auth.admin.updateUserById(userId, {
      email,
      password: password || undefined, // Solo actualiza si se envía
    });

    if (authError) {
      throw authError;
    }

    return res.status(200).json({ message: "Perfil actualizado", userData });
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    return res.status(500).json({ error: error.message });
  }
}