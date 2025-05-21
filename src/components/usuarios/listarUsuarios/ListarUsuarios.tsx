import {Button, TableCell, TableRow} from 'flowbite-react';
import Usuario from '../../../models/Usuario.ts'
import {useState} from "react";
import {HiPencilAlt, HiTrash} from "react-icons/hi";
import {HiEye} from "react-icons/hi2";
import {Link} from "react-router-dom";

import DeletarUsuario from "../deletarUsuario/DeletarUsuario.tsx";
import ExibirUsuario from "../exibirUsuario/ExibirUsuario.tsx";

interface ListarUsuariosProps {
    listando: Usuario;
    aoDeletar?: (id: number) => void;
}

function ListarUsuarios({listando, aoDeletar}: ListarUsuariosProps) {

    const [openModalExibir, setOpenModalExibir] = useState(false);
    const [openModalExcluir, setOpenModalExcluir] = useState(false);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);

    return (
        <>
            <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <TableCell
                    className='text-center font-medium text-gray-900 dark:text-white'>
                    <div className="w-40 break-words mx-auto">{listando.nome}</div>
                </TableCell>
                <TableCell
                    className='text-center font-medium text-gray-900 dark:text-white'>
                    <div className="w-40 break-words mx-auto">{listando.email}</div>
                </TableCell>
                <TableCell
                    className='text-center font-medium text-gray-900 dark:text-white'>
                    <div className="w-40 break-words mx-auto">
                        {listando.roles.map((role: string) =>
                            role === 'ADMIN' ? 'Administrador' :
                                role === 'USER' ? 'Funcionário' :
                                    role
                        ).join(', ')}
                    </div>
                </TableCell>

                <TableCell className="h-full align-middle">
                    <div className="flex gap-2 justify-center items-center h-full">
                        <Button size="xs" color="light"
                                onClick={() => {
                                    setUsuarioSelecionado(listando)
                                    setOpenModalExibir(true)
                                }}
                                className="cursor-pointer focus:outline-none focus:ring-0 text-teal-600 dark:text-teal-400"
                        >
                            <HiEye className="h-4 w-4"/>
                            <span className="ml-1">Exibir</span>
                        </Button>

                        <Link to={`/editarUsuario/${listando.id}`}>
                            <Button size="xs" color="light"
                                    onClick={() => {
                                        setUsuarioSelecionado(listando);
                                    }}

                                    className='cursor-pointer focus:outline-none focus:ring-0 text-teal-600 dark:text-teal-400'>
                                <HiPencilAlt className="h-4 w-4"/>
                                <span className="ml-1">Editar</span>
                            </Button>
                        </Link>

                        <Button size="xs" color="light"
                                onClick={() => {
                                    setUsuarioSelecionado(listando);
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

            {usuarioSelecionado && (
                <DeletarUsuario
                    isOpen={openModalExcluir}
                    onClose={() => setOpenModalExcluir(false)}
                    excluindo={usuarioSelecionado}
                    aoDeletar={aoDeletar}

                />
            )}

            {usuarioSelecionado && (
                <ExibirUsuario
                    isOpen={openModalExibir}
                    onClose={() => setOpenModalExibir(false)}
                    exibindo={usuarioSelecionado}
                />
            )}

        </>
    )
}

export default ListarUsuarios;