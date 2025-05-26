import {useContext, useEffect, useMemo, useState} from 'react'

import {AuthContext} from '../../contexts/AuthContext'
import {Toast, ToastAlerta} from '../../utils/ToastAlerta'
import {buscar} from '../../services/Service'

import Categoria from '../../models/Categoria'
import Produto from '../../models/Produto'
import ListarProdutos from '../../components/produtos/listarProdutos/ListarProdutos.tsx'
import {
    Button,
    Card,
    Drawer,
    DrawerHeader,
    DrawerItems,
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
import Fornecedor from '../../models/Fornecedor.ts';
import FiltroCategorias from '../../components/categorias/filtroCategorias/FiltroCategorias.tsx';
import FiltroFornecedores from '../../components/fornecedores/filtroFornecedores/FiltroFornecedores.tsx';
import SearchBarProduto from "../../components/produtos/searchBarProduto/SearchBarProduto.tsx";
import FiltroMarcas from "../../components/marcas/filtroMarcas/FiltroMarcas.tsx";
import FiltroList from "../../components/filtroList/FiltroList.tsx";
import {HiChevronDown, HiChevronRight} from "react-icons/hi";
import Marca from "../../models/Marca.ts";

"use client";

function useFiltro<T extends { nome: string }>(itens: T[]) {
    const [selecionados, setSelecionados] = useState<string[]>([]);
    const [busca, setBusca] = useState('');

    const filtrados = useMemo(() => {
        const isNumeric = (str: string) => /^\d+$/.test(str);

        const sorted = [...itens].sort((a, b) => {
            if (isNumeric(a.nome) && isNumeric(b.nome)) {
                return Number(a.nome) - Number(b.nome);
            }
            return a.nome.localeCompare(b.nome);
        });

        return sorted.filter(item => item.nome.toLowerCase().includes(busca.toLowerCase()));
    }, [busca, itens]);


    const toggle = (nome: string) =>
        setSelecionados(prev =>
            prev.includes(nome) ? prev.filter(n => n !== nome) : [...prev, nome]
        );

    return {selecionados, filtrados, busca, setBusca, toggle};
}

async function buscarComAutenticacao<T>(url: string, setter: (data: T[]) => void, token: string, handleLogout: () => void) {
    try {
        await buscar(url, setter, {headers: {Authorization: token}});
    } catch (error: any) {
        if (error.toString().includes('403')) {
            ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
            handleLogout();
        }
    }
}


function Produtos() {

    const navigate = useNavigate();

    const {usuario, handleLogout, isHydrated} = useContext(AuthContext);
    const token = usuario.token;

    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

    const filtroCategorias = useFiltro(categorias);
    const filtroMarcas = useFiltro(marcas);
    const filtroFornecedores = useFiltro(fornecedores);

    const [tipoBusca, setTipoBusca] = useState<'codigo' | 'nome' | 'todos'>('todos');


    const buscarProdutos = async () => {
        try {
            setIsLoading(true);
            await buscar('/produtos/all', setProdutos, {headers: {Authorization: token}});
        } catch (error: any) {
            if (error.toString().includes('403')) {
                ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
                handleLogout();
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isHydrated) return;

        if (token === '') {
            ToastAlerta('Você precisa estar logado', Toast.Warning);
            navigate('/login');
            return;
        }

        buscarComAutenticacao('/categorias/all', setCategorias, token, handleLogout);
        buscarComAutenticacao('/marcas/all', setMarcas, token, handleLogout);
        buscarComAutenticacao('/fornecedores/all', setFornecedores, token, handleLogout);
        buscarProdutos();
    }, [token, isHydrated]);

    const produtosParaExibir = useMemo(() => {
        let resultado = [...produtos];

        if (filtroCategorias.selecionados.length > 0) {
            resultado = resultado.filter(p => p.categoria && filtroCategorias.selecionados.includes(p.categoria.nome));
        }
        if (filtroMarcas.selecionados.length > 0) {
            resultado = resultado.filter(p => p.marca && filtroMarcas.selecionados.includes(p.marca.nome));
        }
        if (filtroFornecedores.selecionados.length > 0) {
            resultado = resultado.filter(p => p.fornecedor && filtroFornecedores.selecionados.includes(p.fornecedor.nome));
        }

        resultado.sort((a, b) => {
            const disponivelCompare = Number(b.disponivel) - Number(a.disponivel);
            if (disponivelCompare !== 0) return disponivelCompare;

            return order === 'asc'
                ? a.nome.localeCompare(b.nome)
                : b.nome.localeCompare(a.nome);
        });


        return resultado;
    }, [produtos, filtroCategorias, filtroMarcas, filtroFornecedores]);

    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => setIsOpen(false);

    const handleSearch = (produtos: Produto[], tipo: 'codigo' | 'nome' | 'todos') => {
        setTipoBusca(tipo);
        setProdutos(produtos);
    }

    const removerProdutoPorId = (id: number) => {
        setProdutos(prev => prev.filter(f => f.id !== id));
    }

    return (
        <>
            <Drawer open={isOpen} onClose={handleClose}>
                <DrawerHeader title="Filtro de Produtos" titleIcon={() => <></>}/>
                <DrawerItems>

                    <Dropdown
                        label={`Ordem: ${order === 'asc' ? 'A-Z' : 'Z-A'}`}
                        inline
                        dismissOnClick={true}
                        renderTrigger={() => (
                            <Button color="gray"
                                    className="w-full mx-auto my-3 cursor-pointer focus:outline-none focus:ring-0">
                                Ordem <HiChevronDown className="ml-2 h-4 w-4"/>
                            </Button>
                        )}
                    >
                        <DropdownHeader>Ordenar por</DropdownHeader>
                        <DropdownItem onClick={() => setOrder('asc')}>A - Z</DropdownItem>
                        <DropdownItem onClick={() => setOrder('desc')}>Z - A</DropdownItem>
                    </Dropdown>

                    <FiltroList
                        titulo="Categoria"
                        itens={filtroCategorias.filtrados}
                        selecionados={filtroCategorias.selecionados}
                        busca={filtroCategorias.busca}
                        onBuscaChange={e => filtroCategorias.setBusca(e.target.value)}
                        onToggle={filtroCategorias.toggle}
                        renderItem={categoria => <FiltroCategorias categoria={categoria}/>}
                    />

                    <FiltroList
                        titulo="Marca"
                        itens={filtroMarcas.filtrados}
                        selecionados={filtroMarcas.selecionados}
                        busca={filtroMarcas.busca}
                        onBuscaChange={e => filtroMarcas.setBusca(e.target.value)}
                        onToggle={filtroMarcas.toggle}
                        renderItem={marca => <FiltroMarcas marca={marca}/>}
                    />

                    <FiltroList
                        titulo="Fornecedor"
                        itens={filtroFornecedores.filtrados}
                        selecionados={filtroFornecedores.selecionados}
                        busca={filtroFornecedores.busca}
                        onBuscaChange={e => filtroFornecedores.setBusca(e.target.value)}
                        onToggle={filtroFornecedores.toggle}
                        renderItem={fornecedor => <FiltroFornecedores fornecedor={fornecedor}/>}
                    />

                </DrawerItems>
            </Drawer>

            <div className="py-20 px-5 md:px-40 space-y-4">

                <SearchBarProduto onSearch={handleSearch} onClear={buscarProdutos}/>

                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Produtos</h1>

                    <div className="flex items-center gap-4">
                        <Link to="/cadastroProduto"
                              className="border-b-2 text-teal-800 hover:text-teal-600 dark:text-gray-200 dark:hover:text-teal-400">
                            Novo Produto
                        </Link>

                        <Button
                            onClick={() => setIsOpen(true)}
                            color='gray'
                            className="cursor-pointer items-center bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 rounded-r-lg p-4 justify-center focus:outline-none focus:ring-0 "
                        >
                            <span>Filtros</span> <HiChevronRight className="ml-2 h-4 w-4"/>

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
                                    <TableHeadCell className="text-center">Código do Produto</TableHeadCell>
                                    <TableHeadCell className="text-center">Nome</TableHeadCell>
                                    <TableHeadCell className="text-center">Quantidade</TableHeadCell>
                                    <TableHeadCell className="text-center">Unidade de Medida</TableHeadCell>
                                    <TableHeadCell className="text-center">Valor Total</TableHeadCell>
                                    <TableHeadCell className="text-center">Valor Unitário</TableHeadCell>
                                    <TableHeadCell className="text-center">Data de Entrada</TableHeadCell>
                                    <TableHeadCell className="text-center">Data de Validade</TableHeadCell>
                                    <TableHeadCell className="text-center">Status</TableHeadCell>
                                    <TableHeadCell className="text-center">Ações</TableHeadCell>
                                </TableRow>
                            </TableHead>

                            <TableBody className="divide-y">
                                {produtosParaExibir.length > 0 ? (
                                    produtosParaExibir.map((produto) => (
                                        <ListarProdutos
                                            key={produto.id}
                                            produto={produto}
                                            aoDeletar={removerProdutoPorId}
                                        />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={14} className="text-center py-4 text-gray-800">
                                            {tipoBusca === 'codigo'
                                                ? 'Não há produtos com este código'
                                                : tipoBusca === 'nome'
                                                    ? 'Não há produtos com este nome'
                                                    : 'Não há produtos cadastrados'
                                            }
                                        </TableCell>
                                    </TableRow>)}
                            </TableBody>
                        </Table>
                    </Card>
                )}
            </div>
        </>
    )
}

export default Produtos;
