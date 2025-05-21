import {Button, TableCell, TableRow} from 'flowbite-react';
import {Link} from 'react-router-dom'
import Fornecedor from '../../../models/Fornecedor'
import {HiPencilAlt, HiTrash} from "react-icons/hi";
import {useState} from "react";
import {HiEye} from "react-icons/hi2";
import DeletarFornecedor from "../deletarFornecedor/DeletarFornecedor.tsx";
import ExibirFornecedor from "../exibirFornecedor/ExibirFornecedor.tsx";
import {formatarCpfCnpj} from "../../../utils/formatters.tsx";

interface ListarFornecedoresProps {
    fornecedor: Fornecedor;
    aoDeletar?: (id: number) => void;
}

function ListarFornecedores({fornecedor, aoDeletar}: ListarFornecedoresProps) {

    const [openModalExibir, setOpenModalExibir] = useState(false);
    const [openModalExcluir, setOpenModalExcluir] = useState(false);
    const [fornecedorSelecionado, setFornecedorSelecionado] = useState<Fornecedor | null>(null);

    return (
        <>
            <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <TableCell
                    className='text-center font-medium text-gray-900 dark:text-white'>
                    <div className="w-40 break-words mx-auto">{fornecedor.nome}</div>
                </TableCell>

                <TableCell
                    className='text-center font-medium text-gray-900 dark:text-white'>
                    <div className="w-40 break-words mx-auto">{formatarCpfCnpj(fornecedor.cnpj)}</div>
                </TableCell>

                <TableCell className="h-full align-middle">
                    <div className="flex gap-2 justify-center items-center h-full">
                        <Button size="xs" color="light"
                                onClick={() => {
                                    setFornecedorSelecionado(fornecedor)
                                    setOpenModalExibir(true)
                                }}
                                className="cursor-pointer focus:outline-none focus:ring-0 text-teal-600 dark:text-teal-400"
                        >
                            <HiEye className="h-4 w-4"/>
                            <span className="ml-1">Exibir</span>
                        </Button>

                        <Link to={`/editarFornecedor/${fornecedor.id}`}>
                            <Button size="xs" color="light"
                                    onClick={() => {
                                        setFornecedorSelecionado(fornecedor);
                                    }}

                                    className='cursor-pointer focus:outline-none focus:ring-0 text-teal-600 dark:text-teal-400'>
                                <HiPencilAlt className="h-4 w-4"/>
                                <span className="ml-1">Editar</span>
                            </Button>
                        </Link>

                        <Button size="xs" color="light"
                                onClick={() => {
                                    setFornecedorSelecionado(fornecedor);
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

            {fornecedorSelecionado && (
                <DeletarFornecedor
                    isOpen={openModalExcluir}
                    onClose={() => setOpenModalExcluir(false)}
                    fornecedor={fornecedorSelecionado}
                    aoDeletar={aoDeletar} // ✅ repassa para o modal

                />
            )}

            {fornecedorSelecionado && (
                <ExibirFornecedor
                    isOpen={openModalExibir}
                    onClose={() => setOpenModalExibir(false)}
                    fornecedor={fornecedorSelecionado}
                />
            )}
        </>
    );
}

export default ListarFornecedores;