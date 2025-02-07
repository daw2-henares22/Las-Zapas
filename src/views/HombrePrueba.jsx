import { Dialog, Card, CardBody, CardFooter, Input, Typography, Button } from '@material-tailwind/react';
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalContext"; // Importamos el contexto global

export const Hombre = () => {
    const { fetchData, deleteItem } = useGlobalContext(); // Obtenemos las funciones del contexto
    const [zapatosDeVestirHombre, setZapatosDeVestirHombre] = useState([]); // Estado local para los zapatos

    // Función para obtener los zapatos de la base de datos
    const fetchZapatos = async () => {
        const data = await fetchData('ZapatosDeVestirHombre');
        setZapatosDeVestirHombre(data); // Actualizamos el estado con los zapatos
    };

    // Función para manejar la eliminación de un zapato
    const handleDelete = async (zapatoId) => {
        const result = await deleteItem('ZapatosDeVestirHombre', zapatoId); // Usamos deleteItem del GlobalContext
        if (result) {
            setZapatosDeVestirHombre(prevState => prevState.filter(zapato => zapato.id !== zapatoId)); // Actualizamos la lista local
            alert("Zapato eliminado exitosamente");
        } else {
            alert("Hubo un error al eliminar el zapato");
        }
    };

    // Usamos useEffect para cargar los datos de los zapatos al montar el componente
    useEffect(() => {
        fetchZapatos();
    }, []);

    return (
        <div>
            <h1>Zapatos de Vestir Hombre</h1>
            <ul>
                {zapatosDeVestirHombre.length > 0 ? ( //Comprobamos si hay zapatos
                    zapatosDeVestirHombre.map((zapato) => ( //Si hay zapatos, los renderizamos
                        <li key={zapato.id}>
                            {zapato.name} {/* Nombre del zapato */}
                            {/* Botón para eliminar cada zapato */}
                            <Button
                                color="red"
                                onClick={() => handleDelete(zapato.id)} // Llamamos a handleDelete pasando el id del zapato
                            >
                                Eliminar
                            </Button>
                        </li>
                    ))
                ) : (
                    <p>No hay zapatos disponibles</p> // Mensaje si no hay zapatos
                )}
            </ul>
        </div>
    );
};























import { Dialog, Card, CardBody, CardFooter, Input, Typography, Button } from '@material-tailwind/react';
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";

export function Hombre() {
    const { fetchTableData } = useGlobalContext();
    const [zapatos, setZapatos] = useState([]);

    const { activePopup, openPopup, closePopup, selectedItem, handleOpen, editData, setEditData, handleOpenEdit, deleteTableData, newZapatoBota, setNewZapatoBota, handleOpenPut, editTableData, handleSubmit, handleChange } = useGlobalContext();  // Obtenemos el contexto
    const [selectedZapatoDeVestirHombre, setSelectedZapatoDeVestirHombre] = useState(null);

    const { isAdmin } = useGlobalContext();



    useEffect(() => {
        const fetchZapatosHombre = async () => {
            const data = await fetchTableData("ZapatosDeVestirHombre");
            setZapatos(data);
        };
        fetchZapatosHombre();
    }, [fetchTableData]);

    return (
        <div className="container mx-auto py-20 pb-16">
            <h1 className="dark:text-white text-blue-gray-800 text-3xl font-bold mb-4">Zapatos de Vestir para Hombre</h1>
            {zapatos.length === 0 ? ( // Length revisa si hay o no datos
                <p className="text-blue-gray-600 dark:text-blue-gray-100">No hay zapatos disponibles</p>//Si no hay, lanza este párrafo
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {zapatos.map((zapato) => (
                        <div key={zapato.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col h-full">
                            <button className="w-full transition duration-150 hover:scale-x-105 hover:scale-y-105">
                                <img
                                    onClick={()=> handleOpen(zapato, "zapatoDetail")}
                                    src={zapato.imagen || "https://via.placeholder.com/150"} // Imagen placeholder si no hay URL
                                    alt={zapato.nombre}
                                    className="w-full h-48 object-cover mb-4 rounded-md"
                                />
                            </button>
                            <Dialog
                              size="xs"
                              open={activePopup ==="zapatoDetail" && selectedItem?.id === zapato.id}
                              handler={()=> openPopup(null)}// Para cerrar el popup
                              className="bg-transparent shadow-none"
                            >
                              <img src={selectedItem?.imagen} alt={selectedItem?.nombre} className="w-full mb-4 rounded-md" />
                            </Dialog>
                            <h2 className="text-xl font-semibold mb-2 dark:text-white">{zapato.nombre}</h2>
                            <div className="flex flex-col flex-grow">
                                <p className="text-blue-gray-600 dark:text-blue-gray-100 mb-2">Descripción: {zapato.descripcion}</p>
                                <p className="text-blue-gray-600 dark:text-blue-gray-100 mn-2">Talla: {zapato.talla}</p>
                                <p className="text-blue-gray-600 dark:text-blue-gray-100">Precio: {zapato.precio}</p>
                            </div>
                            {isAdmin && (
                              <div className="mt-4 flex justify-between">
                                <Button size="sm" color="blue" onClick={() => handleOpenEdit(zapato)}>Edit</Button>
                                <Button size="sm" color="red" onClick={() => deleteTableData(zapato.id)}>Delete</Button>
                              </div>
                            )}
                        </div>
                    ))}
                </div>
                )}

                {isAdmin && (
                    <div className="absolute bottom-20 right-4">
                      <Button onClick={handleOpenPut} variant="gradient">Añadir Zapatos de Vestir</Button>
                    </div>
                )}    

                {/* Popup para agregar o editar zapato */}
                <Dialog open={activePopup === "newZapatoBota" || activePopup === "editZapatoBota"} handler={closePopup} size="xs" className="bg-transparent shadow-none">
                <Card className="dark:bg-blue-gray-900 dark:text-white mx-auto w-full max-w-[24rem]">
                  
                  {/* En desarrollo */}

                  <form onSubmit={(editZapatoBota) => {
                    editZapatoBota.preventDefault();
                    handleSubmit ("ZapatosDeVestirHombre", newZapatoBota)}}>
                    <CardBody className="flex flex-col gap-4">
                      <Typography variant="h4">{editData ? 'Edit Painting' : 'Add New Painting'}</Typography>
                      {/* Form fields */}
                      <Input
                        label="Nombre"
                        size="lg"
                        color="blue-gray"
                        name="nombre"
                        required
                        value={newZapatoBota.nombre}
                        onChange={handleChange}
                        className="dark:text-gray-300"
                      />
                      <Input
                        label="Imagen"
                        size="lg"
                        color="blue-gray"
                        name="imagen"
                        required
                        value={newZapatoBota.imagen}
                        onChange={handleChange}
                        className="dark:text-gray-300"
                      />
                      <Input
                        label="Descripcion"
                        size="lg"
                        color="blue-gray"
                        name="descripcion"
                        required
                        value={newZapatoBota.descripcion}
                        onChange={handleChange}
                        className="dark:text-gray-300"
                      />
                      <Input
                        label="Talla"
                        size="lg"
                        color="blue-gray"
                        name="talla"
                        required
                        value={newZapatoBota.talla}
                        onChange={handleChange}
                        className="dark:text-gray-300"
                      />
                      <Input
                        label="Precio"
                        size="lg"
                        color="blue-gray"
                        name="precio"
                        required
                        value={newZapatoBota.precio}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                        
                          const numericValue = inputValue.replace(/\D/g, "");// Permitir solo números
                        
                          setNewZapatoBota((prev) => ({
                            ...prev,
                            precio: numericValue ? `${numericValue} €` : "", // Agrega "€" al final
                          }));
                        }}
                        className="dark:text-gray-300"
                      />
                      {/* Otros campos de entrada */}
                    </CardBody>
                    <CardFooter className="pt-0">
                      <Button variant="gradient" fullWidth type="submit">
                        {editData ? 'Update Painting' : 'Add Painting'}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
            </Dialog>
        </div>
    );
}



































import { Dialog, Card, CardBody, CardFooter, Input, Typography, Button } from '@material-tailwind/react';

import { useEffect, useState } from 'react';
import { supabase } from '../bd/supabase';
import { useGlobalContext } from '../context/GlobalContext';

export function Hombre(){

    const { activePopup, openPopup, closePopup, newZapatoBota, setNewZapatoBota, handleOpenPut } = useGlobalContext();  // Obtenemos el contexto
    const [selectedZapatoDeVestirHombre, setSelectedZapatoDeVestirHombre] = useState(null);

    const { isAdmin } = useGlobalContext();
    const [zapatosDeVestirHombre, setZapatosDeVestirHombre] = useState([]);

    const [newZapatoDeVestirHombre, setNewZapatoDeVestirHombre] = useState({
        nombre: '',
        descripcion: '',
        talla: '',
        imagen: '',
        precio: '',
      });
    
      const [editZapatoDeVestirHombre, setEditZapatoDeVestirHombre] = useState(null);
    
      const handleOpen = (zapatoDeVestirHombre) => {
        setSelectedZapatoDeVestirHombre(zapatoDeVestirHombre);
        openPopup(true);
      };
    
      const handleOpenN = () => { //putZapatoBota
        setEditZapatoDeVestirHombre(null);
        setNewZapatoDeVestirHombre({
          nombre: '',
          descripcion: '',
          talla: '',
          imagen: '',
          precio: '',
        });
        openPopup('newZapato');
      };
    
      const handleOpenEdit = (zapatoDeVestirHombre) => {
        setEditZapatoDeVestirHombre(zapatoDeVestirHombre);
        setNewZapatoDeVestirHombre({
          nombre: zapatoDeVestirHombre.nombre || '',
          descripcion: zapatoDeVestirHombre.descripcion || '',
          talla: zapatoDeVestirHombre.talla || '',
          imagen: zapatoDeVestirHombre.imagen || '',
          precio: zapatoDeVestirHombre.precio || ''
        });
        openPopup('editZapato');
      };

      //Datos del supabase

      useEffect(() => {
        const fetchZapatosDeVestirHombre = async () => {
          try {
            const { data: zapatosDeVestirHombre, error } = await supabase.from('ZapatosDeVestirHombre').select('*');
            if (error) {
              throw error;
            }
            setZapatosDeVestirHombre(zapatosDeVestirHombre);
          } catch (error) {
            console.error('Error fetching paintings:', error.message);
          }
        };
    
        fetchZapatosDeVestirHombre();
      }, []);
    
      const handleDelete = async (zapatoDeVestirHombreId) => {
        try {
          const { error } = await supabase.from('ZapatosDeVestirHombre').delete().eq('id', zapatoDeVestirHombreId);
          if (error) {
            throw error;
          }
          setZapatosDeVestirHombre(zapatosDeVestirHombre.filter(zapatoDeVestirHombre => zapatoDeVestirHombre.id !== zapatoDeVestirHombreId));
        } catch (error) {
          console.error('Error deleting painting:', error.message);
        }
      };
    
        const handleEditSubmit = async (e) => { //editTableData
            e.preventDefault();
            try {
            const { data, error } = await supabase.from('ZapatosDeVestirHombre').update(newZapatoDeVestirHombre).eq('id', editZapatoDeVestirHombre.id).select();
            if (error) {
                throw error;
              }
              if (!data || data.length === 0) {
                throw new Error('Update failed, no data returned.');
              }
              setZapatosDeVestirHombre(zapatosDeVestirHombre.map(zapatoDeVestirHombre => (zapatoDeVestirHombre.id === editZapatoDeVestirHombre.id ? data[0] : zapatoDeVestirHombre)));// setTableData
              setNewZapatoDeVestirHombre({ nombre: '', descripcion: '', talla: '', imagen: '', precio: '',});
              setEditZapatoDeVestirHombre(null);
              // setOpenN(false);
            } catch (error) {
              console.error('Error updating painting:', error.message);
            }
        };
    
        const handleChange = (e) => {
          setNewZapatoDeVestirHombre((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
          }));
        };
    
        const handleSubmit = async (e) => {
          e.preventDefault();
          try {
            const { data, error } = await supabase.from('ZapatosDeVestirHombre').insert([newZapatoDeVestirHombre]).select();
            if (error) {
              throw error;
            }
            if (!data || data.length === 0) {
              throw new Error('Insert failed, no data returned.');
            }
            setZapatosDeVestirHombre([...zapatosDeVestirHombre, data[0]]);
            setNewZapatoDeVestirHombre({ nombre: '', descripcion: '', talla: '', image: '', precio: '',});
            // setOpenN(false);
          } catch (error) {
            console.error('Error adding painting:', error.message);
          }
        };

    return(
        <div className="container mx-auto py-20 pb-16">
          <h1 className="dark:text-white text-blue-gray-800 text-3xl font-bold mb-4">Zapatos de Vestir</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {zapatosDeVestirHombre.map(zapatoDeVestirHombre => (
              <div key={zapatoDeVestirHombre.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col h-full">
                <button className="w-full transition duration-150 hover:scale-x-105 hover:scale-y-105">
                  <img onClick={() => handleOpen(zapatoDeVestirHombre)} src={zapatoDeVestirHombre.imagen} alt={zapatoDeVestirHombre.nombre} className="w-full h-48 object-cover mb-4 rounded-md" />
                </button>
                <Dialog
                  size="xs"
                  open={activePopup && selectedZapatoDeVestirHombre === zapatoDeVestirHombre}
                  handler={handleOpen}
                  className="bg-transparent shadow-none"
                >
                  <img src={selectedZapatoDeVestirHombre?.imagen} alt={selectedZapatoDeVestirHombre?.nombre} className="w-full mb-4 rounded-md" />
                </Dialog>
                <h2 className="text-xl font-semibold mb-2 dark:text-white">{zapatoDeVestirHombre.nombre}</h2>
                <div className="flex flex-col flex-grow">
                  <p className="text-blue-gray-600 dark:text-blue-gray-100 mb-2">Descripcion: {zapatoDeVestirHombre.descripcion}</p>
                  <p className="text-blue-gray-600 dark:text-blue-gray-100 mn-2">Talla: {zapatoDeVestirHombre.talla}</p>
                  <p className="text-blue-gray-600 dark:text-blue-gray-100">Precio: {zapatoDeVestirHombre.precio}</p>
                </div>
                {isAdmin && (
                  <div className="mt-4 flex justify-between">
                    <Button size="sm" color="blue" onClick={() => handleOpenEdit(zapatoDeVestirHombre)}>Edit</Button>
                    <Button size="sm" color="red" onClick={() => handleDelete(zapatoDeVestirHombre.id)}>Delete</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        
          {isAdmin && (
            <div className="absolute bottom-20 right-4">
              <Button onClick={handleOpenN} variant="gradient">Añadir Zapatos de Vestir</Button>
            </div>
          )}
    
          {/* Popup para agregar o editar zapato */}
        <Dialog open={activePopup === "newZapato" || activePopup === "editZapato"} handler={closePopup} size="xs" className="bg-transparent shadow-none">
          <Card className="dark:bg-blue-gray-900 dark:text-white mx-auto w-full max-w-[24rem]">
            <form onSubmit={editZapatoDeVestirHombre ? handleEditSubmit : handleSubmit}>
              <CardBody className="flex flex-col gap-4">
                <Typography variant="h4">{editZapatoDeVestirHombre ? 'Edit Painting' : 'Add New Painting'}</Typography>
                {/* Form fields */}
                <Input
                  label="Nombre"
                  size="lg"
                  color="blue-gray"
                  name="nombre"
                  required
                  value={newZapatoDeVestirHombre.nombre}
                  onChange={handleChange}
                  className="dark:text-gray-300"
                />
                <Input
                  label="Imagen"
                  size="lg"
                  color="blue-gray"
                  name="imagen"
                  required
                  value={newZapatoDeVestirHombre.imagen}
                  onChange={handleChange}
                  className="dark:text-gray-300"
                />
                <Input
                  label="Descripcion"
                  size="lg"
                  color="blue-gray"
                  name="descripcion"
                  required
                  value={newZapatoDeVestirHombre.descripcion}
                  onChange={handleChange}
                  className="dark:text-gray-300"
                />
                <Input
                  label="Talla"
                  size="lg"
                  color="blue-gray"
                  name="talla"
                  required
                  value={newZapatoDeVestirHombre.talla}
                  onChange={handleChange}
                  className="dark:text-gray-300"
                />
                <Input
                  label="Precio"
                  size="lg"
                  color="blue-gray"
                  name="precio"
                  required
                  value={newZapatoDeVestirHombre.precio}
                  onChange={(e) => {
                    const inputValue = e.target.value;

                    const numericValue = inputValue.replace(/\D/g, "");// Permitir solo números

                    setNewZapatoDeVestirHombre((prev) => ({
                      ...prev,
                      precio: numericValue ? `${numericValue} €` : "", // Agrega "€" al final
                    }));
                  }}
                  className="dark:text-gray-300"
                />
                {/* Otros campos de entrada */}
              </CardBody>
              <CardFooter className="pt-0">
                <Button variant="gradient" fullWidth type="submit">
                  {editZapatoDeVestirHombre ? 'Update Painting' : 'Add Painting'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </Dialog>
    </div>
    )
}