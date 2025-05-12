import {Button, Card, Modal, ModalBody, ModalFooter, ModalHeader, TableCell, TableRow} from 'flowbite-react';
import {Link} from 'react-router-dom'
import Categoria from '../../../models/Categoria'
import {HiPencilAlt, HiTrash} from "react-icons/hi";
import {useState} from "react";
import {HiEye} from "react-icons/hi2";
import CategoriaImg from "../../../assets/images/categoria.png";
import DeletarCategoria from "../deletarCategoria/DeletarCategoria.tsx";
import ExibirCategoria from "../exibirCategoria/ExibirCategoria.tsx";
import {formatarCpfCnpj} from "../../../utils/formatters.tsx";

interface ListarCategoriasProps {
    categoria: Categoria;
    aoDeletar?: (id: number) => void;
    // aoExibir?: (id: number) => void;
}

function ListarCategorias({categoria, aoDeletar}: ListarCategoriasProps) {

    const [openModalExibir, setOpenModalExibir] = useState(false);
    const [openModalExcluir, setOpenModalExcluir] = useState(false);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria | null>(null);

    return (
        <>
            <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <TableCell
                    className='text-center font-medium text-gray-900 dark:text-white'>
                    <div className="w-40 break-words mx-auto">{categoria.nome}</div>
                </TableCell>

                <TableCell className="h-full align-middle">
                    <div className="flex gap-2 justify-center items-center h-full">
                        <Button size="xs" color="light"
                                onClick={() => {
                                    setCategoriaSelecionada(categoria)
                                    setOpenModalExibir(true)
                                }}
                                className="cursor-pointer focus:outline-none focus:ring-0 text-teal-600 dark:text-teal-400"
                        >
                            <HiEye className="h-4 w-4"/>
                            <span className="ml-1">Exibir</span>
                        </Button>

                        <Link to={`/editarCategoria/${categoria.id}`}>
                            <Button size="xs" color="light"
                                    onClick={() => {
                                        setCategoriaSelecionada(categoria);
                                    }}

                                    className='cursor-pointer focus:outline-none focus:ring-0 text-teal-600 dark:text-teal-400'>
                                <HiPencilAlt className="h-4 w-4"/>
                                <span className="ml-1">Editar</span>
                            </Button>
                        </Link>

                        <Button size="xs" color="light"
                                onClick={() => {
                                    setCategoriaSelecionada(categoria);
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

            {categoriaSelecionada && (
                <DeletarCategoria
                    isOpen={openModalExcluir}
                    onClose={() => setOpenModalExcluir(false)}
                    categoria={categoriaSelecionada}
                    aoDeletar={aoDeletar} // ✅ repassa para o modal

                />
            )}
            {categoriaSelecionada && (
                <ExibirCategoria
                    isOpen={openModalExibir}
                    onClose={() => setOpenModalExibir(false)}
                    categoria={categoriaSelecionada}
                />
            )}
        </>
    );
}

export default ListarCategorias;