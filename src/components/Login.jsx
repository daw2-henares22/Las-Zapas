import { Button, Card, CardBody, CardFooter, Dialog, Typography, Input } from "@material-tailwind/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";
import { supabase } from "../bd/supabase";
import { useTranslation } from "react-i18next";

export const Login = () => {
    const { t } = useTranslation()
    const { activePopup, openPopup, setSession } = useGlobalContext();  // Obtenemos el contexto
    const handleOpen = () => openPopup("login"); // Abre el popup de login

    let navigate = useNavigate();

    const [dialogData, setDialogData] = useState({
        email: '', password: ''
    });

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            let { data, error } = await supabase.auth.signInWithPassword({
                email: dialogData.email,
                password: dialogData.password
            });
            if (error) throw error;
            setSession(data.session); // Establece la sesión en el contexto
            navigate('/');
        } catch (error) {
            console.error('Error logging in:', error.message);
            if (error.message.includes('Invalid login credentials')) {
                openPopup('loginError')
            } else {
                alert('Error logging in');
            }
        }
    }

    function handleChange(event) {
        setDialogData((prevDialogData) => ({
            ...prevDialogData,
            [event.target.name]: event.target.value
        }));
    }

    return (
        <>
            <Button onClick={handleOpen}>{t('Iniciar Sesión')}</Button>
            <Dialog
                size="xs"
                open={activePopup === "login"} // Abre el popup solo si activePopup es "login"
                handler={openPopup}
                className="bg-transparent shadow-none"
            >
                <div className="card bg-blue-400 shadow-lg w-full h-full rounded-3xl absolute transform -rotate-6"></div>
                <div className="card bg-red-400 shadow-lg w-full h-full rounded-3xl absolute transform rotate-6"></div>
                <Card className="dark:bg-blue-gray-900 dark:text-white mx-auto w-full max-w-[24rem]">
                    <form onSubmit={handleSubmit}>
                        <CardBody className="flex flex-col gap-4">
                            <Typography variant="h4">{t('Iniciar Sesión')}</Typography>
                            <Typography className="mb-3 font-normal text-gray-600 dark:text-gray-300" variant="paragraph">
                                {t('Ingrese su correo electrónico y contraseña para iniciar sesión')}
                            </Typography>
                            <Typography className="-mb-2" variant="h6">{t('Tu Correo')}</Typography>
                            <Input color="blue-gray" className="dark:text-gray-300" label="Email" size="lg" name="email" type="email" required onChange={handleChange} />
                            <Typography className="-mb-2" variant="h6">{t('Tu Contraseña')}</Typography>
                            <Input color="blue-gray" className="dark:text-gray-300" label="Password" size="lg" name="password" type="password" required autoComplete="current-password" onChange={handleChange} />
                        </CardBody>
                        <CardFooter className="pt-0">
                            <Button variant="gradient" fullWidth type="submit">{t('Iniciar Sesión')}</Button>
                            <Typography variant="small" className="mt-4 flex justify-center">
                                {t('¿Eres Nuevo?')}
                            </Typography>
                            <Link to="/registro" onClick={() => openPopup("registro")}>
                                <Button 
                                    color="white" 
                                    size="lg" 
                                    fullWidth 
                                    type="submit">{t('Registro')}</Button>
                            </Link>
                        </CardFooter>
                    </form>
                </Card>
            </Dialog>

            {/* Popup para errores de login */}
            <Dialog
                size="xs"
                open={activePopup === "loginError"} // Abre el popup solo si activePopup es "loginError"
                handler={() => openPopup(null)} // Cierra el popup al hacer clic fuera
                className="bg-transparent shadow-none"
            >
                <Card className="dark:bg-blue-gray-900 dark:text-white mx-auto w-full max-w-[24rem]">
                    <CardBody className="flex flex-col items-center gap-4">
                        <Typography variant="h4" color="red">
                            Error
                        </Typography>
                        <Typography className="mb-3 font-normal text-gray-600 dark:text-gray-300 text-center" variant="paragraph">
                            {t('Correo o contraseña equivocada')}
                        </Typography>
                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button
                            variant="gradient"
                            fullWidth
                            onClick={() => openPopup(null)} // Cierra el popup
                        >
                            {t('Cerrar')}
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    );
};