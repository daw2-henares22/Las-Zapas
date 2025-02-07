import { Dialog, Card, CardBody, CardFooter, Input, Typography, Button } from '@material-tailwind/react';
import { useEffect } from 'react';
import { useGlobalContext } from '../context/GlobalContext';

export function Hombre() {
  const {
    zapatosDeVestirHombre,
    setZapatosDeVestirHombre,
    newZapatoDeVestirHombre,
    setNewZapatoDeVestirHombre,
    editZapatoDeVestirHombre,
    setEditZapatoDeVestirHombre,
    fetchData,
    addItem,
    updateItem,
    deleteItem,
    openPopup,
    closePopup,
    activePopup,
    isAdmin
  } = useGlobalContext(); // Usamos el contexto global para acceder a los datos y funciones

  // Usamos useEffect para cargar los datos de los zapatos al montar el componente
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Solo se ejecuta una vez, al montar el componente

  // Función para manejar la eliminación de un zapato
  const handleDelete = async (zapatoId) => {
    const result = await deleteItem(zapatoId);
    if (result) {
      alert("Zapato eliminado exitosamente");
    } else {
      alert("Hubo un error al eliminar el zapato");
    }
  };

  // Función para abrir el popup de detalles del zapato
  const handleOpen = (zapato) => {
    setEditZapatoDeVestirHombre(zapato);
    openPopup("editZapato"); // Abrimos el popup de editar zapato
  };

  // Función para abrir el popup de nuevo zapato
  const handleOpenN = () => {
    setEditZapatoDeVestirHombre(null); // Limpiamos el estado de editar
    setNewZapatoDeVestirHombre({
      nombre: '',
      descripcion: '',
      talla: '',
      imagen: '',
      precio: ''
    });
    openPopup("newZapato"); // Abrimos el popup de nuevo zapato
  };

  // Función para manejar el cambio de los valores en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewZapatoDeVestirHombre((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Función para manejar el envío del formulario de nuevo zapato
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await addItem(newZapatoDeVestirHombre);
    if (result) {
      closePopup();
      alert('Zapato añadido exitosamente');
    } else {
      alert('Hubo un error al añadir el zapato');
    }
  };

  // Función para manejar el envío del formulario de editar zapato
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const result = await updateItem(editZapatoDeVestirHombre.id, newZapatoDeVestirHombre);
    if (result) {
      closePopup();
      alert('Zapato editado exitosamente');
    } else {
      alert('Hubo un error al editar el zapato');
    }
  };

  return (
    <div className="container mx-auto py-20 pb-16">
      <h1 className="dark:text-white text-blue-gray-800 text-3xl font-bold mb-4">Zapatos de Vestir</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {zapatosDeVestirHombre.length > 0 ? (
          zapatosDeVestirHombre.map((zapato) => (
            <div
              key={zapato.id}
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col h-full"
            >
              <button className="w-full transition duration-150 hover:scale-x-105 hover:scale-y-105">
                <img
                  onClick={() => handleOpen(zapato)}
                  src={zapato.imagen}
                  alt={zapato.nombre}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
              </button>
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold">{zapato.nombre}</h2>
                {isAdmin && (
                  <button onClick={() => handleDelete(zapato.id)} className="text-red-500">Eliminar</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No hay zapatos disponibles.</p>
        )}
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
              <Typography variant="h4">
                {editZapatoDeVestirHombre ? 'Editar Zapato de Vestir' : 'Añadir Nuevo Zapato de Vestir'}
              </Typography>
              {/* Campos del formulario */}
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
                  const numericValue = inputValue.replace(/\D/g, ""); // Permitir solo números
                  setNewZapatoDeVestirHombre((prev) => ({
                    ...prev,
                    precio: numericValue ? `${numericValue} €` : "", // Agregar "€" al final
                  }));
                }}
                className="dark:text-gray-300"
              />
            </CardBody>
            <CardFooter className="pt-0">
              <Button variant="gradient" fullWidth type="submit">
                {editZapatoDeVestirHombre ? 'Actualizar Zapato' : 'Añadir Zapato'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </div>
  );
}