import {useContext, useEffect, useState} from 'react'

import {AuthContext} from '../../contexts/AuthContext'
import {Toast, ToastAlerta} from '../../utils/ToastAlerta'
import {buscar} from '../../services/Service'

import {
    Button,
    Card,
    Dropdown,
    DropdownHeader,
    DropdownItem,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow
} from 'flowbite-react'
import {Link, useNavigate} from 'react-router-dom'

import SearchBarUsuario from "../../components/usuarios/searchBarUsuario/SearchBarUsuario.tsx";
import {HiChevronDown} from "react-icons/hi";
import ListarUsuarios from "../../components/usuarios/listarUsuarios/ListarUsuarios.tsx";
import type {Usuario} from "../../models"

function Usuarios() {

    const navigate = useNavigate();

    const {usuario, handleLogout, isHydrated} = useContext(AuthContext);
    const token = usuario.token;

    const [isLoading, setIsLoading] = useState(true);

    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [tipoBusca, setTipoBusca] = useState<'nome' | 'todos'>('todos');

    const removerUsuarioPorId = (id: number) => {
        setUsuarios(prev => prev.filter(f => f.id !== id));
    }

    async function buscarUsuarios() {
        try {
            setIsLoading(true);
            await buscar('/usuarios/all', setUsuarios, {headers: {Authorization: token}});
        } catch (error: any) {
            if (error.toString().includes('403')) {
                ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
                handleLogout();
            } else {
                ToastAlerta("Não há usuarios", Toast.Info);
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!isHydrated) return;

        if (token === '') {
            ToastAlerta('Você precisa estar logado', Toast.Warning);
            navigate('/login');
        }
    }, [token, isHydrated]);

    useEffect(() => {
        if (isHydrated && token !== '') {
            buscarUsuarios();
        }
    }, [token, isHydrated]);

    const usuariosParaExibir = [...usuarios].sort((a, b) => {
        const aNum = parseFloat(a.nome);
        const bNum = parseFloat(b.nome);

        const ambosSaoNumeros = !isNaN(aNum) && !isNaN(bNum);

        if (ambosSaoNumeros) {
            return order === 'asc' ? aNum - bNum : bNum - aNum;
        }

        return order === 'asc'
            ? a.nome.localeCompare(b.nome, 'pt', {sensitivity: 'base'})
            : b.nome.localeCompare(a.nome, 'pt', {sensitivity: 'base'});
    });

    const handleSearch = (usuarios: Usuario[], tipo: 'nome' | 'todos') => {
        setTipoBusca(tipo);
        setUsuarios(usuarios);
    }

    return (
        <div className="py-20 px-5 md:px-40 space-y-4">
            <SearchBarUsuario onSearch={handleSearch} onClear={buscarUsuarios}/>

            <div className="flex justify-between items-center gap-4 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Usuários</h1>

                <div className="flex items-center gap-4">
                    <Link to="/cadastroUsuario"
                          className="border-b-2 text-teal-800 hover:text-teal-600 dark:text-gray-200 dark:hover:text-teal-400">
                        Novo Usuário
                    </Link>

                    <Dropdown
                        label={`Ordem: ${order === 'asc' ? 'A-Z' : 'Z-A'}`}
                        inline
                        dismissOnClick={true}
                        renderTrigger={() => (
                            <Button color="gray" className='cursor-pointer focus:outline-none focus:ring-0'>
                                Ordem <HiChevronDown className="ml-2 h-4 w-4"/>
                            </Button>
                        )}
                    >
                        <DropdownHeader>Ordenar por</DropdownHeader>
                        <DropdownItem onClick={() => setOrder('asc')}>A - Z</DropdownItem>
                        <DropdownItem onClick={() => setOrder('desc')}>Z - A</DropdownItem>
                    </Dropdown>
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
                                <TableHeadCell className="text-center">E-Mail</TableHeadCell>
                                <TableHeadCell className="text-center">Tipo</TableHeadCell>
                                <TableHeadCell className="text-center">Ações</TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="divide-y">
                            {usuariosParaExibir.length > 0 ? (
                                usuariosParaExibir.map((usuario) => (
                                    <ListarUsuarios
                                        key={usuario.id}
                                        listando={usuario}
                                        aoDeletar={removerUsuarioPorId}
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={14} className="text-center py-4 text-gray-800">
                                        {tipoBusca === 'nome'
                                            ? 'Não há usuarios com este nome'
                                            : 'Não há usuarios cadastradas'
                                        }
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    )
}

export default Usuarios;
