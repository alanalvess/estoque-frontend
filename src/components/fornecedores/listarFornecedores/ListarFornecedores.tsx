import {Link} from 'react-router-dom'

import Fornecedor from '../../../models/Fornecedor'
import {Dropdown, DropdownDivider, DropdownItem} from 'flowbite-react';

interface CardFornecedorProps {
    fornecedor: Fornecedor;
}

function ListarFornecedores({fornecedor}: CardFornecedorProps) {
    return (
        <>
            <Dropdown label='' inline>
                <DropdownItem>
                    <Link to={`/editarFornecedor/${fornecedor.id}`}
                          className='w-full'>Editar</Link>
                </DropdownItem>
                <DropdownDivider/>
                <DropdownItem>
                    <Link to={`/deletarFornecedor/${fornecedor.id}`}
                          className='w-full '>Deletar</Link>
                </DropdownItem>
            </Dropdown>
        </>
    )
}

export default ListarFornecedores;