import {Button, Card, Modal, ModalBody, ModalFooter, ModalHeader, TableCell, TableRow} from 'flowbite-react';
import {Link} from 'react-router-dom'
import Marca from '../../../models/Marca'
import {HiPencilAlt, HiTrash} from "react-icons/hi";
import {useState} from "react";
import {HiEye} from "react-icons/hi2";
import MarcaImg from "../../../assets/images/marca.png";
import DeletarMarca from "../deletarMarca/DeletarMarca.tsx";
import ExibirMarca from "../exibirMarca/ExibirMarca.tsx";
import {formatarCpfCnpj} from "../../../utils/formatters.tsx";

interface ListarMarcasProps {
    marca: Marca;
    aoDeletar?: (id: number) => void;
    // aoExibir?: (id: number) => void;
}

function ListarMarcas({marca, aoDeletar}: ListarMarcasProps) {

    const [openModalExibir, setOpenModalExibir] = useState(false);
    const [openModalExcluir, setOpenModalExcluir] = useState(false);
    const [marcaSelecionada, setMarcaSelecionada] = useState<Marca | null>(null);

    return (
        <>
            <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <TableCell
                    className='text-center font-medium text-gray-900 dark:text-white'>
                    <div className="w-40 break-words mx-auto">{marca.nome}</div>
                </TableCell>

                <TableCell className="h-full align-middle">
                    <div className="flex gap-2 justify-center items-center h-full">
                        <Button size="xs" color="light"
                                onClick={() => {
                                    setMarcaSelecionada(marca)
                                    setOpenModalExibir(true)
                                }}
                                className="cursor-pointer focus:outline-none focus:ring-0 text-teal-600 dark:text-teal-400"
                        >
                            <HiEye className="h-4 w-4"/>
                            <span className="ml-1">Exibir</span>
                        </Button>

                        <Link to={`/editarMarca/${marca.id}`}>
                            <Button size="xs" color="light"
                                    onClick={() => {
                                        setMarcaSelecionada(marca);
                                    }}

                                    className='cursor-pointer focus:outline-none focus:ring-0 text-teal-600 dark:text-teal-400'>
                                <HiPencilAlt className="h-4 w-4"/>
                                <span className="ml-1">Editar</span>
                            </Button>
                        </Link>

                        <Button size="xs" color="light"
                                onClick={() => {
                                    setMarcaSelecionada(marca);
                                    setOpenModalExcluir(true);
                                }}
                                className='cursor-pointer focus:outline-none focus:ring-0 text-rose-600 dark:text-rose-400'
                        >
                            <HiTrash className="h-4 w-4"/>
                            <span className="ml-1">Excluir</span>
                        </Button>
                    </div>
                </TableCell>
            </TableRow>

            {marcaSelecionada && (
                <DeletarMarca
                    isOpen={openModalExcluir}
                    onClose={() => setOpenModalExcluir(false)}
                    marca={marcaSelecionada}
                    aoDeletar={aoDeletar} // ✅ repassa para o modal

                />
            )}
            {marcaSelecionada && (
                <ExibirMarca
                    isOpen={openModalExibir}
                    onClose={() => setOpenModalExibir(false)}
                    marca={marcaSelecionada}
                />
            )}
        </>
    );
}

export default ListarMarcas;