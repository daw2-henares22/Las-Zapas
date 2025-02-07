import { Button, Card, CardBody, CardFooter, Dialog, Typography, Input } from "@material-tailwind/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../bd/supabase";
import { useGlobalContext } from "../context/GlobalContext";
import { useTranslation } from "react-i18next";

export const Registro = () => {
    const { t } = useTranslation()
    const { activePopup, openPopup } = useGlobalContext(); // Control global para el modal de registro
    const navigate = useNavigate();
    const [showPopup] = useState(false);
    const [showUserExistsPopup, setShowUserExistsPopup] = useState(false); // Nuevo popup para usuario existente
    const [showErrorPopup, setShowErrorPopup] = useState(false); // Estado local para el popup de error
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Estado local para el popup de éxito
    const {setErrorMessage} = useState(false);

    const [dialogData, setDialogData] = useState({
        name: "", email: "", password: "", confirmPassword: ""
    });

    async function handleSubmit(e) {
        e.preventDefault();
    
        if (dialogData.password !== dialogData.confirmPassword) {
            setErrorMessage(t('Las contraseñas no coinciden'));
            setShowErrorPopup(true);
            return;
        }
    
        try {
            const { data, error } = await supabase.auth.signUp({
                email: dialogData.email,
                password: dialogData.password,
                options: {
                    data: { name: dialogData.name },
                },
            });
    
            if (error) {
                if (error.message.includes("User already registered")) {
                    setShowUserExistsPopup(true); // Activar nuevo popup
                    return;
                }
                throw error;
            }
    
            const uid = data.user.id;
            const role = data.user.email === "rubenhenareshidalgo97@gmail.com" ? "admin" : "user";
            const { error: profileError } = await supabase.from("Usuarios").insert([
                {
                    uid,
                    email: data.user.email,
                    name_user: dialogData.name,
                    role,
                    created_at: new Date(),
                },
            ]);
    
            if (profileError) throw profileError;
    
            openPopup(false);
            setShowSuccessPopup(true);

            setTimeout(() => {
                setShowSuccessPopup(false);
                navigate('/'); // <-- Redirige al usuario a la página principal
            }, 2500); // Espera 2,5 segundos antes de redirigir
    
        } catch (error) {
            setErrorMessage(error.message);
            setShowErrorPopup(true);
        }
    }

    function handleChange(event) {
        setDialogData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    }

    return (
        <>
            <Button onClick={() => showPopup("registro")}>{t('Registro')}</Button>

            {/* Modal de Registro */}
            <Dialog
    size="xs"
    open={activePopup === "registro"} // Se abre solo cuando el popup activo es "registro"
    handler={() => openPopup(null)} // Cierra el popup correctamente
    className="bg-transparent shadow-none"
>
    <div className="card bg-blue-400 shadow-lg w-full h-full rounded-3xl absolute transform -rotate-6"></div>
    <div className="card bg-red-400 shadow-lg w-full h-full rounded-3xl absolute transform rotate-6"></div>
    <Card className="dark:bg-blue-gray-900 dark:text-white mx-auto w-full max-w-[24rem]">
        <form onSubmit={handleSubmit}>
            <CardBody className="flex flex-col gap-4">
                <Typography variant="h4">{t('Registro')}</Typography>
                <Typography className="mb-3 font-normal text-gray-600 dark:text-gray-300" variant="paragraph">
                    {t('Ingresa tu correo y contraseña para registrarte')}
                </Typography>
                <Typography className="-mb-2" variant="h6">{t('Nombre')}</Typography>
                <Input color="blue-gray" className="dark:text-gray-300" label={t('Nombre')} size="lg" name="name" type="text" required onChange={handleChange} />
                <Typography className="-mb-2" variant="h6">{t('Correo Electrónico')}</Typography>
                <Input color="blue-gray" className="dark:text-gray-300" label={t('Correo Electrónico')} size="lg" name="email" type="email" required onChange={handleChange} />
                <Typography className="-mb-2" variant="h6">{t('Contraseña')}</Typography>
                <Input color="blue-gray" className="dark:text-gray-300" label={t('Contraseña')} size="lg" name="password" type="password" required autoComplete="current-password" onChange={handleChange} />
                <Typography className="-mb-2" variant="h6">{t('Confirmar Contraseña')}</Typography>
                <Input color="blue-gray" className="dark:text-gray-300" label={t('Confirmar Contraseña')} size="lg" name="confirmPassword" type="password" required autoComplete="current-password" onChange={handleChange} />
            </CardBody>
            <CardFooter className="pt-0">
                <Button variant="gradient" fullWidth type="submit">{t('Registrarse')}</Button>
                <Typography variant="small" className="mt-4 flex justify-center">
                    {t('¿Ya te registraste?')}
                </Typography>
                <Button color="white" size="lg" fullWidth onClick={() => openPopup("login")}>
                    {t('Iniciar sesión')}
                </Button>
            </CardFooter>
        </form>
    </Card>
</Dialog>


            {/* Popup de usuario ya registrado */}
            <Dialog
                size="xs"
                open={showUserExistsPopup}
                handler={() => setShowUserExistsPopup(false)}
                className="bg-transparent shadow-none"
            >
                <Card className="dark:bg-blue-gray-900 dark:text-white mx-auto w-full max-w-[24rem]">
                    <CardBody className="flex flex-col items-center">
                        <Typography variant="h4" color="red">
                            {t('Usuario Existente')}
                        </Typography>
                        <Typography className="text-center">
                            {t('El usuario ya está registrado. Intenta iniciar sesión')}
                        </Typography>
                    </CardBody>
                    <CardFooter>
                        <Button
                            variant="gradient"
                            fullWidth
                            onClick={() => setShowUserExistsPopup(false)}
                        >
                            {t('Cerrar')}
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>

            {/* Popup de error */}
            <Dialog
                size="xs"
                open={showErrorPopup}
                handler={() => setShowErrorPopup(false)}
                className="bg-transparent shadow-none"
            >
                <Card className="dark:bg-blue-gray-900 dark:text-white mx-auto w-full max-w-[24rem]">
                    <CardBody className="flex flex-col items-center">
                        <Typography variant="h4" color="red">
                            Error
                        </Typography>
                        <Typography className="text-center">
                            {t('Las contraseñas no coinciden')}
                        </Typography>
                    </CardBody>
                    <CardFooter>
                        <Button
                            variant="gradient"
                            fullWidth
                            onClick={() => setShowErrorPopup(false)}
                        >
                            {t('Cerrar')}
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>

            {/* Popup de éxito */}
            <Dialog
                size="xs"
                open={showSuccessPopup}
                handler={() => setShowSuccessPopup(false)}
                className="bg-transparent shadow-none"
            >
                <Card className="dark:bg-blue-gray-900 dark:text-white mx-auto w-full max-w-[24rem]">
                    <CardBody className="flex flex-col items-center">
                        <Typography variant="h4" color="green">
                            {t('Registro Exitoso')}
                        </Typography>
                    </CardBody>
                    <CardFooter>
                        <Button
                            variant="gradient"
                            fullWidth
                            onClick={() => setShowSuccessPopup(false)}
                        >
                            {t('Cerrar')}
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    );
};