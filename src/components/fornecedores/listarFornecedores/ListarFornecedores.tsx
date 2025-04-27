import {Link} from 'react-router-dom'

import Fornecedor from '../../../models/Fornecedor'
import {Button, Dropdown, DropdownDivider, DropdownItem} from 'flowbite-react';
import {FaEdit, FaTrashAlt} from "react-icons/fa";

interface CardFornecedorProps {
    fornecedor: Fornecedor;
}

function ListarFornecedores({fornecedor}: CardFornecedorProps) {
    return (
        <>
            {/*<Dropdown label='' inline>*/}
            {/*    <DropdownItem>*/}
            {/*        <Link to={`/editarFornecedor/${fornecedor.id}`}*/}
            {/*              className='w-full'>Editar</Link>*/}
            {/*    </DropdownItem>*/}
            {/*    <DropdownDivider/>*/}
            {/*    <DropdownItem>*/}
            {/*        <Link to={`/deletarFornecedor/${fornecedor.id}`}*/}
            {/*              className='w-full '>Deletar</Link>*/}
            {/*    </DropdownItem>*/}
            {/*</Dropdown>*/}

            <div className="flex flex-wrap justify-between items-center w-full">
                <span
                    className='flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-start sm:break-words'
                    title={fornecedor.nome}
                >
                    {fornecedor.nome}
                </span>

                <div className="flex gap-2 ml-2">
                    <Link to={`/editarFornecedor/${fornecedor.id}`} className='w-full text-blue-600'>
                        <FaEdit/>
                    </Link>

                    <Link to={`/deletarFornecedor/${fornecedor.id}`} className='w-full text-red-600'>
                        <FaTrashAlt/>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default ListarFornecedores;