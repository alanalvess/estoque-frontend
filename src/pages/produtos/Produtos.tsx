import {useContext, useEffect, useState} from 'react'
import {DNA} from 'react-loader-spinner'

import {AuthContext} from '../../contexts/AuthContext'
import {Toast, ToastAlerta} from '../../utils/ToastAlerta'
import {buscar} from '../../services/Service'

import Categoria from '../../models/Categoria'
import Produto from '../../models/Produto'
import ListarProduto from '../../components/produtos/listarProduto/ListarProduto.tsx'
import {
    Button, Drawer, DrawerHeader, DrawerItems,
    ListGroup,
    ListGroupItem, Spinner,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow
} from 'flowbite-react'
import {Link, useNavigate} from 'react-router-dom'
import Fornecedor from '../../models/Fornecedor.ts';
import ListarCategorias from '../../components/categorias/listarCategorias/ListarCategorias.tsx';
import ListarFornecedores from '../../components/fornecedores/listarFornecedores/ListarFornecedores.tsx';
import {HiChevronDoubleRight} from "react-icons/hi2";
import {FaEdit, FaTrashAlt} from "react-icons/fa";
import {node} from "globals";
import SearchBar from "../../components/produtos/searchBar/SearchBar.tsx";
import InputField from "../../components/form/InputField.tsx";

"use client";

function Produtos() {

    const navigate = useNavigate();

    const {usuario, handleLogout} = useContext(AuthContext);
    const token = usuario.token;

    const [loading, setLoading] = useState(true);

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);
    const [fornecedoresSelecionados, setFornecedoresSelecionados] = useState<string[]>([]);

    const categoriasOrdenadas = [...categorias].sort((a, b) => a.nome.localeCompare(b.nome));
    const fornecedoresOrdenados = [...fornecedores].sort((a, b) => a.nome.localeCompare(b.nome));

    const handleSearch = (produtos: Produto[]) => {
        setProdutos(produtos);
    }

    let produtosParaExibir = [...produtos];

    if (categoriasSelecionadas.length > 0) {
        produtosParaExibir = produtosParaExibir.filter(
            (produto) => produto.categoria && categoriasSelecionadas.includes(produto.categoria.nome)
        );
    }

    if (fornecedoresSelecionados.length > 0) {
        produtosParaExibir = produtosParaExibir.filter(
            (produto) => produto.fornecedor && fornecedoresSelecionados.includes(produto.fornecedor.nome)
        );
    }


    produtosParaExibir = produtosParaExibir
        .sort((a, b) => a.nome.localeCompare(b.nome))
        .sort((a, b) => Number(b.disponivel) - Number(a.disponivel)); // Disponíveis primeiro

    async function buscarCategorias() {
        try {
            await buscar('/categorias/all', setCategorias, {headers: {Authorization: token}});
        } catch (error: any) {
            if (error.toString().includes('403')) {
                ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
                handleLogout();
            }
        }
    }

    async function buscarFornecedores() {
        try {
            await buscar('/fornecedores/all', setFornecedores, {headers: {Authorization: token}});
        } catch (error: any) {
            if (error.toString().includes('403')) {
                ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
                handleLogout();
            }
        }
    }

    async function buscarProdutos() {
        try {
            setLoading(true);
            await buscar('/produtos/all', setProdutos, {headers: {Authorization: token}});
        } catch (error: any) {
            if (error.toString().includes('403')) {
                ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
                handleLogout();
            } else {
                ToastAlerta("Não há produtos", Toast.Info);
            }
        } finally {
            setLoading(false);
        }
    }


    function handleCategoriaClick(categoriaNome: string) {
        setCategoriasSelecionadas(prev =>
            prev.includes(categoriaNome)
                ? prev.filter(nome => nome !== categoriaNome)
                : [...prev, categoriaNome]
        );
    }

    function handleFornecedorClick(fornecedorNome: string) {
        setFornecedoresSelecionados(prev =>
            prev.includes(fornecedorNome)
                ? prev.filter(nome => nome !== fornecedorNome) // Remove se já estiver selecionado
                : [...prev, fornecedorNome] // Adiciona se ainda não estiver selecionado
        );
    }

    useEffect(() => {
        if (token === '') {
            ToastAlerta('Você precisa estar logado', Toast.Warning);
            navigate('/login');
        }
    }, [token]);

    useEffect(() => {
        buscarCategorias();
        buscarFornecedores();
        buscarProdutos();
    }, []);

    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => setIsOpen(false);

    const renderizarFiltros = () => (
        <div className='xs:min-w-[10vw]'>
            <div className='flex flex-col justify-center'>
                {/* Seus ListGroup, Botões de Cadastro, Categorias, Fornecedores */}
            </div>
        </div>
    );

    function renderizarMenuCompleto() {
        // Estado para armazenar o termo de busca para categorias e fornecedores
        const [searchTermCategorias, setSearchTermCategorias] = useState('');
        const [searchTermFornecedores, setSearchTermFornecedores] = useState('');

        // Função para lidar com a mudança no campo de busca de categorias
        const handleSearchChangeCategorias = (event) => {
            setSearchTermCategorias(event.target.value);
        };

        // Função para lidar com a mudança no campo de busca de fornecedores
        const handleSearchChangeFornecedores = (event) => {
            setSearchTermFornecedores(event.target.value);
        };

        // Filtrando as categorias com base no searchTermCategorias
        const categoriasFiltradas = categoriasOrdenadas.filter(categoria =>
            categoria.nome.toLowerCase().includes(searchTermCategorias.toLowerCase())
        );

        // Filtrando os fornecedores com base no searchTermFornecedores
        const fornecedoresFiltrados = fornecedoresOrdenados.filter(fornecedor =>
            fornecedor.nome.toLowerCase().includes(searchTermFornecedores.toLowerCase())
        );

        return (
            <div className="flex flex-col w-full overflow-y-auto">
                {/* Botões de Cadastro */}
                <ListGroup className="sm:w-48 mt-0 mx-4 mb-4 xs:w-32 overflow-y-auto">
                    <div className="flex flex-col gap-3 m-5">
                        <Button className="w-full">
                            <Link to="/cadastroCategoria" className="w-full block text-center">
                                Cadastrar Categoria
                            </Link>
                        </Button>
                        <Button className="w-full">
                            <Link to="/cadastroFornecedor" className="w-full block text-center">
                                Cadastrar Fornecedor
                            </Link>
                        </Button>
                        <Button className="w-full">
                            <Link to="/cadastroProduto" className="w-full block text-center">
                                Cadastrar Produto
                            </Link>
                        </Button>
                    </div>
                </ListGroup>

                {/* Filtro de Categorias */}
                <ListGroup className='sm:w-48 mt-0 mx-4 mb-4 xs:w-32 max-h-[60vh] overflow-y-auto'>
                    <h4 className='text-2xl text-center py-2 rounded-t-lg bg-blue-700 text-blue-50'>Categorias</h4>
                    <InputField
                        name="search"
                        value={searchTermCategorias}
                        onChange={handleSearchChangeCategorias}
                        placeholder="Buscar Categorias"
                        className='w-full p-2 mb-2'
                    />
                    {categoriasFiltradas.length > 0 ? (
                        categoriasFiltradas.map((categoria) => (
                            <ListGroupItem
                                key={categoria.id}
                                onClick={() => handleCategoriaClick(categoria.nome)}
                                className={`${categoriasSelecionadas.includes(categoria.nome) ? 'font-bold' : ''}`}
                                active={categoriasSelecionadas.includes(categoria.nome)}
                            >
                                <ListarCategorias categoria={categoria} />
                            </ListGroupItem>
                        ))
                    ) : (
                        <ListGroupItem className="text-center text-gray-500">
                            Categoria não localizada.
                        </ListGroupItem>
                    )}
                </ListGroup>

                {/* Filtro de Fornecedores */}
                <ListGroup className='sm:w-48 mt-0 mx-4 mb-4 xs:w-32 max-h-[60vh] overflow-y-auto'>
                    <h4 className='text-2xl text-center py-2 rounded-t-lg bg-blue-700 text-blue-50'>Fornecedores</h4>
                    <InputField
                        name="search"
                        value={searchTermFornecedores}
                        onChange={handleSearchChangeFornecedores}
                        placeholder="Buscar Fornecedores"
                        className='w-full p-2 mb-2'
                    />
                    {fornecedoresFiltrados.length > 0 ? (
                        fornecedoresFiltrados.map((fornecedor) => (
                            <ListGroupItem
                                key={fornecedor.id}
                                onClick={() => handleFornecedorClick(fornecedor.nome)}
                                className={`${fornecedoresSelecionados.includes(fornecedor.nome) ? 'font-bold' : ''}`}
                                active={fornecedoresSelecionados.includes(fornecedor.nome)}
                            >
                                <ListarCategorias categoria={fornecedor} />
                            </ListGroupItem>
                        ))
                    ) : (
                        <ListGroupItem className="text-center text-gray-500">
                            Fornecedor não localizado.
                        </ListGroupItem>
                    )}
                </ListGroup>

                {/* Filtros adicionais */}
                <div className="m-4">
                    {renderizarFiltros()}
                </div>
            </div>
        );
    }


    return (
        <>
            {!isOpen && (
                <div
                    className="flex fixed mt-24 items-center z-50 bg-gray-300 rounded-r-lg p-4 justify-center sm:hidden">
                    <HiChevronDoubleRight onClick={() => setIsOpen(true)}/>
                </div>
            )}

            <Drawer open={isOpen} onClose={handleClose}>
                <DrawerHeader title="" titleIcon={() => <></>}/>
                <DrawerItems>
                    {renderizarMenuCompleto()}
                </DrawerItems>
            </Drawer>

            <div className='pt-32 pb-20 flex-col min-h-[95vh]  '>
                <SearchBar onSearch={handleSearch} onClear={buscarProdutos}/>
                <div className='flex'>
                    <div className="hidden sm:block w-64">
                        <div className=" top-32 left-4 p-4 overflow-y-auto">
                            {renderizarMenuCompleto()}
                        </div>
                    </div>


                    <div
                        className="flex-1 mx-6 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-400">
                        {loading ? (
                            <DNA
                                visible={true}
                                height="200"
                                width="200"
                                ariaLabel="dna-loading"
                                wrapperStyle={{}}
                                wrapperClass="dna-wrapper mx-auto"
                            />
                        ) : (
                            <div
                                className="mx-auto py-4 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-400">
                                <Table hoverable>
                                    <TableHead>
                                        <TableRow>
                                            <TableHeadCell>Código do Produto</TableHeadCell>
                                            <TableHeadCell>Nome</TableHeadCell>
                                            <TableHeadCell>Quantidade</TableHeadCell>
                                            <TableHeadCell>Unidade de Medida</TableHeadCell>
                                            <TableHeadCell>Valor</TableHeadCell>
                                            <TableHeadCell>Valor Unitário</TableHeadCell>
                                            <TableHeadCell>Data de Entrada</TableHeadCell>
                                            <TableHeadCell>Validade</TableHeadCell>
                                            <TableHeadCell>Status</TableHeadCell>
                                            <TableHeadCell>Marca</TableHeadCell>
                                            <TableHeadCell>Categoria</TableHeadCell>
                                            <TableHeadCell>Fornecedor</TableHeadCell>
                                            <TableHeadCell>Observações</TableHeadCell>
                                            <TableHeadCell>Ações</TableHeadCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody className="divide-y">
                                        {produtosParaExibir.length > 0 ? (
                                            produtosParaExibir.map((produto) => (
                                                <ListarProduto key={produto.id} produto={produto}/>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={14} className="text-center py-4">
                                                    Não há produtos
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    )
}

export default Produtos;
