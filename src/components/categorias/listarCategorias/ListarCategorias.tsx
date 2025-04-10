import {Link} from 'react-router-dom'

import Categoria from '../../../models/Categoria'

'use client';

import {
    Dropdown,
    DropdownDivider,
    DropdownItem
} from 'flowbite-react';

interface CardCategoriaProps {
    categoria: Categoria;
}

function ListarCategorias({categoria}: CardCategoriaProps) {

    return (
        <>
            <Dropdown label='' inline>
                <DropdownItem>
                    <Link to={`/editarCategoria/${categoria.id}`}
                          className='w-full'>Editar</Link>
                </DropdownItem>
                <DropdownDivider/>
                <DropdownItem>
                    <Link to={`/deletarCategoria/${categoria.id}`}
                          className='w-full '>Deletar</Link>
                </DropdownItem>
            </Dropdown>
        </>
    )
}

export default ListarCategorias;