import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Home } from './views/Home'
import { Footer } from './components/Footer'
import { Hombre } from './views/Hombre'
import { Mujer } from './views/Mujer'
import { Login } from './components/Login'
import { Registro } from './components/Registro'
import { Usuarios } from './views/Usuarios'
import { ZapatosDeVestirHombre } from './components/hombre/ZapatosDeVestirHombre'
import { BotasHombre } from './components/hombre/BotasHombre'
import { ZapatosDeVestirMujer } from './components/mujer/ZapatosDeVestirMujer'
import { BotasMujer } from './components/mujer/BotasMujer'
import { ZapatillasMujer } from './components/mujer/ZapatillasMujer'
import { ZapatillasHombre } from './components/hombre/ZapatillasHombre'
import { Comprar } from './views/Comprar'

export default function App() {

  return (
    <>
    <div className="bg-gray-100 dark:bg-blue-gray-900 min-h-screen">
    <Header/>
    {/* Enrutamiento */}
      <Routes> 
        <Route path='/' element={<Home />} />
        <Route path='/registro' element={<Registro />} />
        <Route path='/login' element={<Login />} />
        <Route path='/hombre' element={<Hombre />} />
        <Route path='/botasHombre' element={<BotasHombre />} />
        <Route path='/zapatillasHombre' element={<ZapatillasHombre />} />
        <Route path='/zapatosHombre' element={<ZapatosDeVestirHombre />} />
        <Route path='/botasHombre' element={<BotasHombre />} />
        <Route path='/mujer' element={<Mujer />} />
        <Route path='/botasMujer' element={<BotasMujer />} />
        <Route path='/zapatillasMujer' element={<ZapatillasMujer />} />
        <Route path='/zapatosMujer' element={<ZapatosDeVestirMujer />} />
        <Route path='/usuarios' element={<Usuarios />} />
        <Route path='/comprar/:tableName/:nombre' element={<Comprar />} />
        <Route path='/footer' element={<Footer />} />
      </Routes>
    <Footer/>
      </div>
    </>
  )
}