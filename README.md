<h1>Como hice el proyecto?</h1>
------------------------------------------------------------------
<h2>Mas información detallada y del código, en la <a href="https://daw2-henares22.github.io/Las-Zapas/Memory_Las-Zapas_Spanish.pdf" target="_blank">Memoria</a>.</h2>

<h2>Explicación breve de instalaciones</h2>


<h3>Creo un proyecto con react + vite + javascript:</h3>

    npm i create vite .
        react
        javascript
    npm i
    npm run dev

<h3>instalamos react-router-dom</h3>
    
    Sirve para navegar entre vistas y utilizar componentes

    App.jsx:
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/footer' element={<Footer />} />
        </Routes>

<h3>instalamos tailwind.css</h3>
    
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p

Quito el contenido del index.css y App.css.Y añado contenido del tailwind al index.css

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

<h3>Instalo material tailwind</h3>
    
    npm i @material-tailwind/react

    edito tailwind.config.js:
        
        ESM (ECMAScript 6 es lo que utilizo):
            import withMT from "@material-tailwind/react/utils/withMT.js";
            export default withMT({})

        CJS (CommonJS por si lo usas):
            const withMT = require("@material-tailwind/react/utils/withMT");
            module.exports = withMT({})

    Para saber si tienes ESM o CJS, en el packagejson debes de tener "type": "module" si es ESM, y si es CJS, entonces tienes "type": "require"

<h3>Insalo react icons</h3>
    
    npm i react-icons

<h3>Añadí dark mode al proyecto</h3>
    tailwind.js añadir esto:
        darkMode=['class']
    
    Quedaría así:
        /** @type {import('tailwindcss').Config} */
        import withMT from "@material-tailwind/react/utils/withMT.js";
        export default withMT({
        content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
        ],
        darkMode: ['class'],
        theme: {
            extend: {},
        },
        plugins: [],
        })

    Luego metí un estado y una función en el Header.jsx:

        // Estado para el modo oscuro
        const [isDarkMode, setIsDarkMode] = useState(() => {
          return localStorage.getItem("theme") === "dark";
        });

        // Aplicar el modo oscuro al cargar la página
        useEffect(() => {
          if (isDarkMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }, [isDarkMode]);

        // Función para cambiar el modo
        function changeDarkMode() {
          const newMode = !isDarkMode;
          setIsDarkMode(newMode);
          localStorage.setItem("theme", newMode ? "dark" : "light");
        }

    Y puse un onclick a un botton para utilizar el darkMode
        export function LanguageToggleButton() {
            const { i18n } = useTranslation();
    
            const toggleLanguage = () => {
              const newLanguage = i18n.language === 'es' ? 'en' : 'es';
              i18n.changeLanguage(newLanguage);
            };
    
            return (
              <button
                onClick={toggleLanguage}
                className="sm:py-1 sm:px-1 lg:py-1 lg:px-2 xl:py-1 xl:px-2 text-white           hover:text-blue-gray-400 hover:scale-105 active:scale-95 transition-transform   duration-150    border-double border-4 border-white rounded"
              >
                {i18n.language === 'es' ? 'ES' : 'EN'}
              </button>
            );
        }