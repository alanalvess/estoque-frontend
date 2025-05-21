import {useContext, useEffect, useState} from 'react'

import {AuthContext} from '../../contexts/AuthContext'
import {Toast, ToastAlerta} from '../../utils/ToastAlerta'
import {buscar} from '../../services/Service'
import Categoria from '../../models/Categoria'

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

import SearchBarCategoria from "../../components/categorias/searchBarCategoria/SearchBarCategoria.tsx";
import {HiChevronDown} from "react-icons/hi";
import ListarCategorias from "../../components/categorias/listarCategorias/ListarCategorias.tsx";

"use client";

function Categorias() {

    const navigate = useNavigate();

    const {usuario, handleLogout, isHydrated} = useContext(AuthContext);
    const token = usuario.token;

    const [isLoading, setIsLoading] = useState(true);

    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [tipoBusca, setTipoBusca] = useState<'nome' | 'todos'>('todos');

    const removerCategoriaPorId = (id: number) => {
        setCategorias(prev => prev.filter(f => f.id !== id));
    }

    async function buscarCategorias() {
        try {
            setIsLoading(true);
            await buscar('/categorias/all', setCategorias, {headers: {Authorization: token}});
        } catch (error: any) {
            if (error.toString().includes('403')) {
                ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
                handleLogout();
            } else {
                ToastAlerta("Não há categorias", Toast.Info);
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
            buscarCategorias();
        }
    }, [token, isHydrated]);

    const categoriasParaExibir = [...categorias].sort((a, b) => {
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

    const handleSearch = (categorias: Categoria[], tipo: 'nome' | 'todos') => {
        setTipoBusca(tipo);
        setCategorias(categorias);
    }

    return (
        <div className="py-20 px-5 md:px-40 space-y-4">
            <SearchBarCategoria onSearch={handleSearch} onClear={buscarCategorias}/>

            <div className="flex justify-between items-center gap-4 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Categorias</h1>

                <div className="flex items-center gap-4">
                    <Link to="/cadastroCategoria"
                          className="border-b-2 text-teal-800 hover:text-teal-600 dark:text-gray-200 dark:hover:text-teal-400">
                        Nova Categoria
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
                                <TableHeadCell className="text-center">Ações</TableHeadCell>
                            </TableRow>

                        </TableHead>
                        <TableBody className="divide-y">
                            {categoriasParaExibir.length > 0 ? (
                                categoriasParaExibir.map((categoria) => (
                                    <ListarCategorias
                                        key={categoria.id}
                                        categoria={categoria}
                                        aoDeletar={removerCategoriaPorId}
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={14} className="text-center py-4 text-gray-800">
                                        {tipoBusca === 'nome'
                                            ? 'Não há categorias com este nome'
                                            : 'Não há categorias cadastradas'
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

export default Categorias;
