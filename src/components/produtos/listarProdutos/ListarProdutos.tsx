import {Button, Card, Modal, ModalBody, ModalFooter, ModalHeader, TableCell, TableRow} from 'flowbite-react';
import {Link} from 'react-router-dom'
import Produto from '../../../models/Produto'
import {HiPencilAlt, HiTrash} from "react-icons/hi";
import {useState} from "react";
import {HiEye} from "react-icons/hi2";
import ProdutoImg from "../../../assets/images/produto.png";
import DeletarProduto from "../deletarProduto/DeletarProduto.tsx";
import ExibirProduto from "../exibirProduto/ExibirProduto.tsx";
import {formatarCpfCnpj, formatarData} from "../../../utils/formatters.tsx";

interface ListarProdutosProps {
    produto: Produto;
    aoDeletar?: (id: number) => void;
    // aoExibir?: (id: number) => void;
}

function ListarProdutos({produto, aoDeletar}: ListarProdutosProps) {

    const [openModalExibir, setOpenModalExibir] = useState(false);
    const [openModalExcluir, setOpenModalExcluir] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

    const valorUnitario = produto.valor / produto.quantidade;

    function getCorValidade(dataValidade: string | undefined): string {
        if (!dataValidade) return 'text-gray-500';

        const hoje = new Date();
        const [ano, mes, dia] = dataValidade.split('-').map(Number);
        const validade = new Date(ano, mes - 1, dia);

        const diffMs = validade.getTime() - hoje.getTime();
        const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diffDias < 0) return 'text-red-600 font-semibold';        // Vencido
        if (diffDias <= 10) return 'text-yellow-400 font-semibold';   // Próximo do vencimento
        return 'text-green-700 font-semibold';                        // Válido
    }

    return (
        <>
            <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <TableCell
                    className='text-center font-medium text-gray-900 dark:text-white'>
                    <div className="w-40 break-words mx-auto">{produto.codigo}</div>
                </TableCell>
                <TableCell
                    className='text-center font-medium text-gray-900 dark:text-white'>
                    <div className="w-40 break-words mx-auto">{produto.nome}</div>
                </TableCell>
                <TableCell
                    className='text-center font-medium text-gray-900 dark:text-white'>
                    <div className="w-40 break-words mx-auto">{produto.quantidade}</div>
                </TableCell>
                <TableCell
                    className='text-center font-medium text-gray-900 dark:text-white'>
                    <div className="w-40 break-words mx-auto">{produto.unidadeMedida}</div>
                </TableCell>
                <TableCell
                    className='text-center font-medium text-gray-900 dark:text-white'>
                    <div className="w-40 break-words mx-auto">R$ {produto.valor?.toFixed(2).replace('.', ',')}</div>
                </TableCell>
                <TableCell
                    className='text-center font-medium text-gray-900 dark:text-white'>
                    <div className="w-40 break-words mx-auto">R$ {valorUnitario?.toFixed(2).replace('.', ',')}</div>
                </TableCell>
                <TableCell
                    className='text-center font-medium text-gray-900 dark:text-white'>
                    <div className="w-40 break-words mx-auto">{formatarData(produto.dataEntrada)}</div>
                </TableCell>
                <TableCell
                    className='text-center font-medium text-gray-900 dark:text-white'>
                    <div
                        className={`w-40 break-words mx-auto ${getCorValidade(formatarData(produto.dataValidade))}`}>{formatarData(produto.dataValidade)}</div>
                </TableCell>
                <TableCell
                    className="w-40 break-words mx-auto">
                    {produto.disponivel ? (
                        produto.quantidade < produto.estoqueMinimo ? (
                            <span className='px-2 py-1 rounded text-black bg-yellow-400 font-semibold'>DISPONÍVEL</span>
                        ) : (
                            <span className='px-2 py-1 rounded text-white bg-green-600 font-semibold'>DISPONÍVEL</span>
                        )
                    ) : (
                        <span className='px-2 py-1 rounded text-white bg-red-600 font-semibold'>INDISPONÍVEL</span>
                    )}
                </TableCell>

                <TableCell className="h-full align-middle">
                    <div className="flex gap-2 justify-center items-center h-full">
                        <Button size="xs" color="light"
                                onClick={() => {
                                    setProdutoSelecionado(produto)
                                    setOpenModalExibir(true)
                                }}
                                className="cursor-pointer focus:outline-none focus:ring-0 text-teal-600 dark:text-teal-400"
                        >
                            <HiEye className="h-4 w-4"/>
                            <span className="ml-1">Exibir</span>
                        </Button>

                        <Link to={`/editarProduto/${produto.id}`}>
                            <Button size="xs" color="light"
                                    onClick={() => {
                                        setProdutoSelecionado(produto);
                                    }}

                                    className='cursor-pointer focus:outline-none focus:ring-0 text-teal-600 dark:text-teal-400'>
                                <HiPencilAlt className="h-4 w-4"/>
                                <span className="ml-1">Editar</span>
                            </Button>
                        </Link>

                        <Button size="xs" color="light"
                                onClick={() => {
                                    setProdutoSelecionado(produto);
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

            {produtoSelecionado && (
                <DeletarProduto
                    isOpen={openModalExcluir}
                    onClose={() => setOpenModalExcluir(false)}
                    produto={produtoSelecionado}
                    aoDeletar={aoDeletar} // ✅ repassa para o modal

                />
            )}
            {produtoSelecionado && (
                <ExibirProduto
                    isOpen={openModalExibir}
                    onClose={() => setOpenModalExibir(false)}
                    produto={produtoSelecionado}
                />
            )}
        </>
    );
}

export default ListarProdutos;