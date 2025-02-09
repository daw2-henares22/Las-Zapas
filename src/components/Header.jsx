import { useState } from "react";
import { Button } from "@material-tailwind/react";
import { useGlobalContext } from "../context/GlobalContext";
import { Login } from "./Login";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ImContrast } from "react-icons/im";
import { supabase } from "../bd/supabase";
import { LanguageToggleButton } from "./LanguageToggleButton";
import { useTranslation } from "react-i18next";

export const Header = () => {
  const { t } = useTranslation();

  const { isButtonDisabled, handleButtonClick, session, setSession, isAdmin, setIsAdmin, openPopup, logout } = useGlobalContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para abrir/cerrar el menú móvil
  let navigate = useNavigate();
  const location = useLocation(); // Hook para obtener la ruta actual

  function changeDarkMode() {
    document.documentElement.classList.toggle("dark");
  }

  async function handleLogout() {
    // Cierra cualquier popup activo
    openPopup(null);

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during logout:", error);
    } else {
      await logout(); // Llama a la función de logout del contexto
      openPopup(null); // Cierra cualquier popup activo
      setSession(null); // Limpia la sesión
      setIsAdmin(false); // Asegúrate de que el usuario no es administrador
      navigate("/"); // Redirige a la página principal
    }
  }
  
  function handleLoginClick() {
    setIsMenuOpen(false); // Cierra el menú móvil al abrir el popup
    handleButtonClick(() => {
      openPopup("login");
    });
  }

  // Sirve para hacer un .map para las rutas. NO ENRUTA y se necesita si o si el enrutamiento del Router en App.jsx
  const menuRoutes = [
    { path: "/hombre", label: t('Hombre') },
    { path: "/mujer", label: t('Mujer') },
  ]

  return (
    <header className="bg-gray-900 text-white p-4 shadow-md fixed left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="md:text-2xl lg:text-3xl xl:text-3xl font-bold md:mr-[10px] lg-mr-0 xl:mr-0">
          <Link to="/">Las Zapas</Link>
        </h1>
        {session && session.user && session.user.user_metadata && (
          <p className="hidden md:block hover:text-gray-400 md:mr-[0px] lg:mr-[0px] xl:ml-[70px] md:flex-1 lg:flex-1 xl:flex-1">{t('Bienvenido')} {session.user.user_metadata.name}</p>
        )}
        {/* Menú para pantallas grandes */}
        <nav className="hidden md:block">
          <ul className="flex space-x-4 items-center">
            {!session && (
              <li className="hover:text-gray-400">
                <Login/>
              </li>
            )}
            {session && (
              <>
                {menuRoutes.map(item => 
                  location.pathname !== item.path && (
                    <li key={item.path} className="hover:text-gray-400">
                      <Link to={item.path}>{item.label}</Link>
                    </li>
                  )
                )}
              </>
            )}
            {isAdmin && (
              <li>
                <Link
                  to="/usuarios"
                  className="text-white hover:text-gray-400"
                >
                  {t('Usuarios')}
                </Link>
              </li>
            )}
            <li><LanguageToggleButton/></li>
            {session && (
              <li>
                <Button onClick={handleLogout}>{t('Cerrar Sesión')}</Button>
              </li>
            )}
            <button
              onClick={changeDarkMode}
              className="h-7 w-7 bg-white dark:bg-blue-gray-800 rounded-md shadow-lg"
              aria-hidden="true"
            >
              <ImContrast className="w-full dark:text-white text-blue-gray-800" />
            </button>
          </ul>
        </nav>

        {/* Botón del menú hamburguesa para pantallas pequeñas */}
        <button
          className="block md:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Menú desplegable para pantallas pequeñas */}
      {isMenuOpen && (
        <nav className="md:hidden bg-gray-800 text-white text-center p-4 mt-2 rounded-lg">
          <ul className="space-y-2">
            {session && session.user && session.user.user_metadata && (
              <li className="hover:text-gray-400">{t('Bienvenido')} {session.user.user_metadata.name}</li>
            )}
            {!session && (
              <li className="hover:text-gray-400">
                <Button disabled={isButtonDisabled} onClick={handleLoginClick}>Login</Button>
              </li>
            )}
            {session && (
              <>
                {menuRoutes.map(item => 
                  location.pathname !== item.path && (
                    <li key={item.path} className="hover:text-gray-400">
                      <Link to={item.path}>{item.label}</Link>
                    </li>
                  )
                )}
              </>
            )}
            {isAdmin && (
              <li>
                <Link
                  to="/usuarios"
                  className="text-white hover:text-gray-400"
                >
                  {t('Usuarios')}
                </Link>
              </li>
            )}
            <li><LanguageToggleButton/></li>
            {session && (
              <li>
                <Button onClick={handleLogout}>Logout</Button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};