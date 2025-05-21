import {useContext, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {Button, Card, Spinner, Table, TableHead, TableHeadCell, TableRow
} from 'flowbite-react';

import {AuthContext} from '../../../contexts/AuthContext';
import {ToastAlerta, Toast} from '../../../utils/ToastAlerta';

import Usuario from "../../../models/Usuario.ts";
import {buscar} from "../../../services/Service.ts";

export default function Perfil() {

    const {usuario, handleLogout, isHydrated} = useContext(AuthContext);
    const token = usuario.token;
    const id = useParams<{ id: string }>();

    const [isLoading, setIsLoading] = useState(true);

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    async function buscarUsuario() {
        try {
            setIsLoading(true);
            await buscar(`/usuarios/${id}`, setUsuarios, {headers: {Authorization: token}});
        } catch (error: any) {
            if (error.toString().includes('403')) {
                ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
                handleLogout();
            } else {
                ToastAlerta("Erro ao buscar usuário", Toast.Info);
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="py-20 px-5 md:px-40 space-y-4 mt-10">

                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Usuários</h1>

                    <div className="flex items-center gap-4">
                        <Link to={`/editarUsuario/${usuario.id}`}
                              className="border-b-2 text-teal-800 hover:text-teal-600 dark:text-gray-200 dark:hover:text-teal-400">
                            Editar Meu Perfil
                        </Link>

                        <Button>
                            teste
                        </Button>

                    </div>
                </div>

                {isLoading ? (
                    <Spinner aria-label="Default status example"/>
                ) : (
                    <Card className="p-0 overflow-x-auto">
                        <Table
                            hoverable
                            theme={{
                                head: {
                                    cell: {
                                        base: "bg-gray-300 px-6 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-gray-900"
                                    }
                                },
                            }}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableHeadCell className="text-center">Nome</TableHeadCell>
                                    <TableHeadCell className="text-center">Ações</TableHeadCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </Card>
                )}
            </div>
        </>
    )
}
