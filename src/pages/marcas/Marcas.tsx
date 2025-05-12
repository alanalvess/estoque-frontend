import {useContext, useEffect, useState} from 'react'

import {AuthContext} from '../../contexts/AuthContext'
import {Toast, ToastAlerta} from '../../utils/ToastAlerta'
import {buscar} from '../../services/Service'
import Marca from '../../models/Marca'

import {
    Button, Card, Dropdown, DropdownHeader, DropdownItem, Spinner,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow
} from 'flowbite-react'
import {Link, useNavigate} from 'react-router-dom'

import SearchBarMarca from "../../components/marcas/searchBarMarca/SearchBarMarca.tsx";
import {HiChevronDown} from "react-icons/hi";
import ListarMarcas from "../../components/marcas/listarMarcas/ListarMarcas.tsx";

"use client";

function Marcas() {

    const navigate = useNavigate();

    const {usuario, handleLogout, isHydrated} = useContext(AuthContext);
    const token = usuario.token;

    const [isLoading, setIsLoading] = useState(true);

    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [tipoBusca, setTipoBusca] = useState<'nome' | 'todos'>('todos');

    const removerMarcaPorId = (id: number) => {
        setMarcas(prev => prev.filter(f => f.id !== id));
    }

    async function buscarMarcas() {
        try {
            setIsLoading(true);
            await buscar('/marcas/all', setMarcas, {headers: {Authorization: token}});
        } catch (error: any) {
            if (error.toString().includes('403')) {
                ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
                handleLogout();
            } else {
                ToastAlerta("Não há marcas", Toast.Info);
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
            buscarMarcas();
        }
    }, [token, isHydrated]);

    const marcasParaExibir = [...marcas].sort((a, b) => {
        const aNum = parseFloat(a.nome);
        const bNum = parseFloat(b.nome);

        const ambosSaoNumeros = !isNaN(aNum) && !isNaN(bNum);

        if (ambosSaoNumeros) {
            return order === 'asc' ? aNum - bNum : bNum - aNum;
        }

        return order === 'asc'
            ? a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })
            : b.nome.localeCompare(a.nome, 'pt', { sensitivity: 'base' });
    });

    const handleSearch = (marcas: Marca[], tipo: 'nome' | 'todos') => {
        setTipoBusca(tipo);
        setMarcas(marcas);
    }

    return (
        <div className="py-20 px-5 md:px-40 space-y-4">
            <SearchBarMarca onSearch={handleSearch} onClear={buscarMarcas}/>

            <div className="flex justify-between items-center gap-4 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Marcas</h1>

                <div className="flex items-center gap-4">
                    <Link to="/cadastroMarca"
                          className="border-b-2 text-teal-800 hover:text-teal-600 dark:text-gray-200 dark:hover:text-teal-400">
                        Nova Marca
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
                <Spinner aria-label="Default status example" />
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
                                {/*<TableHeadCell>Ações</TableHeadCell>*/}
                                <TableHeadCell className="text-center">Ações</TableHeadCell>
                            </TableRow>

                        </TableHead>
                        <TableBody className="divide-y">
                            {marcasParaExibir.length > 0 ? (
                                marcasParaExibir.map((marca) => (
                                    <ListarMarcas
                                        key={marca.id}
                                        marca={marca}
                                        aoDeletar={removerMarcaPorId}
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={14} className="text-center py-4 text-gray-800">
                                        {tipoBusca === 'nome'
                                            ? 'Não há marcas com este nome'
                                            : 'Não há marcas cadastradas'
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

export default Marcas;
