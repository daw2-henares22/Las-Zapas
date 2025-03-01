import { Dialog, Card, CardBody, CardFooter, Input, Typography, Button } from '@material-tailwind/react';
import { useEffect } from "react";
import { useGlobalContext } from '../../context/GlobalContext';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { MdAddToPhotos } from 'react-icons/md';

export function ZapatosDeVestirMujer() {
    const { t } = useTranslation();
    const { 
        fetchTableData,
        zapass,
        setZapass,
        activePopup,
        openPopup,
        editData,
        handleOpenEdit,
        deleteTableData,
        newZapatoBota,
        setNewZapatoBota,
        handleOpenPut,
        handleSubmit,
        errorSubmit,
        handleChange,
        isAdmin
    } = useGlobalContext();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchZapatosBotas = async () => {
            const data = await fetchTableData("ZapatosDeVestirMujer");
            setZapass(data);
        };
        fetchZapatosBotas();
    }, [fetchTableData]);

    return (
        <div className="min-h-screen bg-gradient-to-bl from-gray-200 dark:from-gray-800">
        <div className="container mx-auto py-20 pb-16">
            <h1 className="dark:text-white text-blue-gray-800 text-3xl font-bold mt-14 mb-4">{t('Zapatos para Mujer')}</h1>
            {zapass.length === 0 ? (
                <p className="text-blue-gray-600 dark:text-blue-gray-100">{t('No hay zapatos disponibles')}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {zapass.map((zapatoBota) => (
                        <div
                            key={zapatoBota.nombre}
                            className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col h-full cursor-pointer"
                            onClick={() => navigate(`/comprar/ZapatosDeVestirMujer/${zapatoBota.nombre}`)}
                        >
                            <img
                                src={zapatoBota.imagen || "https://via.placeholder.com/150"}
                                alt={zapatoBota.nombre}
                                className="w-full h-48 object-cover mb-4 rounded-md transition duration-150 hover:scale-x-105 hover:scale-y-105"
                            />
                            
                            <h2 className="text-xl font-semibold mb-2 dark:text-white">{zapatoBota.nombre}</h2>
                            <div className="flex flex-col flex-grow">
                                <p className="text-blue-gray-600 dark:text-blue-gray-100 mb-2">{t('Descripción')}: {zapatoBota.descripcion}</p>
                                <p className="text-blue-gray-600 dark:text-blue-gray-100">{t('Precio')}: {zapatoBota.precio}</p>
                            </div>
                            {isAdmin && (
                                <div className="mt-4 flex justify-between">
                                    <Button size="sm" color="blue" onClick={(e) => { e.stopPropagation(); handleOpenEdit("ZapatosDeVestirMujer", zapatoBota); }}>{t('Editar')}</Button>
                                    <Button size="sm" color="red" onClick={(e) => { e.stopPropagation(); deleteTableData("ZapatosDeVestirMujer", zapatoBota.id); }}>{t('Borrar')}</Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {isAdmin && (
                <div className="fixed bottom-20 right-4">
                    <Button
                        onClick={handleOpenPut}
                        variant="gradient"
                    >
                    <span className="hidden xl:inline">{t('Añadir Zapatos de Vestir')}</span>
                    <span className="text-[16px] xl:hidden h-full w-full transition duration-150 hover:scale-105"><MdAddToPhotos /></span>
                    </Button>
                </div>
            )}

            <Dialog open={activePopup === "newZapatoBota" || activePopup === "editZapatoBota"} handler={openPopup} size="xs" className="bg-transparent shadow-none">
                <Card className="dark:bg-blue-gray-900 dark:text-white mx-auto w-full max-w-[24rem]">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit("ZapatosDeVestirMujer", newZapatoBota);
                    }}>
                        <CardBody className="flex flex-col gap-4">
                            <Typography variant="h4">{editData ? 'Editar Zapato' : 'Añadir Nuevo Zapato'}</Typography>
                            <Input
                                label={t('Nombre')}
                                size="lg"
                                color="blue-gray"
                                name="nombre"
                                required
                                value={newZapatoBota.nombre}
                                onChange={handleChange}
                                className="dark:text-gray-300"
                            />
                            <Input
                                label={t('Imagen')}
                                size="lg"
                                color="blue-gray"
                                name="imagen"
                                required
                                value={newZapatoBota.imagen}
                                onChange={handleChange}
                                className="dark:text-gray-300"
                            />
                            <Input
                                label={t('Descripción')}
                                size="lg"
                                color="blue-gray"
                                name="descripcion"
                                required
                                value={newZapatoBota.descripcion}
                                onChange={handleChange}
                                className="dark:text-gray-300"
                            />
                            <Input
                                label={t('Precio')}
                                size="lg"
                                color="blue-gray"
                                name="precio"
                                required
                                value={newZapatoBota.precio}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    const numericValue = inputValue.replace(/\D/g, "");
                                    setNewZapatoBota((prev) => ({
                                        ...prev,
                                        precio: numericValue ? `${numericValue} €` : "",
                                    }));
                                }}
                                className="dark:text-gray-300"
                            />
                        </CardBody>
                        <CardFooter className="pt-0">
                            {errorSubmit && (
                                <Typography variant="small" color="red" className="text-center">
                                    {errorSubmit}
                                </Typography>
                            )}
                            <Button variant="gradient" fullWidth type="submit">
                                {editData ? t('Actualizar Zapato') : t('Añadir Zapato')}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </Dialog>
        </div>
        </div>
    );
}