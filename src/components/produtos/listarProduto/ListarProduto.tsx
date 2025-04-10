import {Button, TableCell, TableRow} from 'flowbite-react';
import {Link} from 'react-router-dom'
import Produto from '../../../models/Produto'

interface ListarProdutoProps {
    produto: Produto;
}

function ListarProduto({produto}: ListarProdutoProps) {

    const valorUnitario = produto.quantidade / produto.valor;

    return (
        <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
            <TableCell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                {produto.codigo}
            </TableCell>
            <TableCell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                {produto.nome}
            </TableCell>

            <TableCell>{produto.quantidade}</TableCell>
            <TableCell>{produto.unidadeMedida}</TableCell>
            <TableCell>R$ {produto.valor?.toFixed(2).replace('.', ',')}</TableCell>
            <TableCell>R$ {valorUnitario?.toFixed(2).replace('.', ',')}</TableCell>
            <TableCell>{produto.dataEntrada}</TableCell>
            <TableCell>{produto.validade}</TableCell>

            <TableCell className='text-center'>
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

            {/*<TableCell>{produto.dataSaida}</TableCell>*/}
            <TableCell>{produto.marca}</TableCell>
            <TableCell>{produto.categoria?.nome || '—'}</TableCell>
            <TableCell>{produto.fornecedor?.nome || '—'}</TableCell>
            <TableCell>{produto.descricao}</TableCell>
            {/*<TableCell>{produto.estoqueMinimo}</TableCell>*/}
            {/*<TableCell>{produto.estoqueMaximo}</TableCell>*/}

            <TableCell className='flex gap-2'>
                <Link to={`/editarProduto/${produto.id}`}>
                    <Button size='sm'>Editar</Button>
                </Link>
                <Link to={`/deletarProduto/${produto.id}`}>
                    <Button size='sm' color='red' className='text-white'>
                        Excluir
                    </Button>
                </Link>
            </TableCell>
        </TableRow>
    );
}

export default ListarProduto;
