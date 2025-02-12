import React from "react";
import { useGlobalContext } from "../context/GlobalContext";

const Perfil = () => {
  const { compras, session } = useGlobalContext();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 border-b pb-4">Perfil</h1>
        <div className="mt-4 flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-xl">
            {session?.user?.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">{session?.user?.email}</h2>
            <p className="text-gray-500 text-sm">Mi historial de compras</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Mis Compras</h2>
          <div className="mt-4 space-y-4">
            {compras.length > 0 ? (
              compras.map((compra) => (
                <div key={compra.id} className="flex items-center bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
                  <img
                    src={compra.producto?.imagen || "https://via.placeholder.com/80"}
                    alt={compra.producto?.nombre}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">{compra.producto?.nombre}</h3>
                    <p className="text-gray-600">{compra.created_at.split("T")[0]}</p>
                    <p className="text-gray-800 font-bold">${compra.producto?.precio}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No tienes compras registradas.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;