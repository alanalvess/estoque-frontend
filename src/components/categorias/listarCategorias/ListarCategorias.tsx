import {Link} from 'react-router-dom'

import Categoria from '../../../models/Categoria'

'use client';

import {
    Dropdown,
    DropdownDivider,
    DropdownItem
} from 'flowbite-react';
import {FaEdit, FaTrashAlt} from "react-icons/fa";

interface CardCategoriaProps {
    categoria: Categoria;
}

function ListarCategorias({categoria}: CardCategoriaProps) {

    return (
        <>
            {/*<Dropdown label='' inline>*/}
            {/*    <DropdownItem>*/}
            {/*        <Link to={`/editarCategoria/${categoria.id}`}*/}
            {/*              className='w-full'>Editar</Link>*/}
            {/*    </DropdownItem>*/}
            {/*    <DropdownDivider/>*/}
            {/*    <DropdownItem>*/}
            {/*        <Link to={`/deletarCategoria/${categoria.id}`}*/}
            {/*              className='w-full '>Deletar</Link>*/}
            {/*    </DropdownItem>*/}
            {/*</Dropdown>*/}
            <div className="flex flex-wrap justify-between items-center w-full">
                <span
                    className='flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-start sm:break-words'
                    title={categoria.nome}
                >
                    {categoria.nome}
                </span>

                <div className="flex gap-2 ml-2">
                    <Link to={`/editarFornecedor/${categoria.id}`} className='w-full text-blue-600'>
                        <FaEdit/>
                    </Link>

                    <Link to={`/deletarFornecedor/${categoria.id}`} className='w-full text-red-600'>
                        <FaTrashAlt/>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default ListarCategorias;