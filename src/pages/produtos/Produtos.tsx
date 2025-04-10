import {useContext, useEffect, useState} from 'react'
import {DNA} from 'react-loader-spinner'

import {AuthContext} from '../../contexts/AuthContext'
import {Toast, ToastAlerta} from '../../utils/ToastAlerta'
import {buscar} from '../../services/Service'

import Categoria from '../../models/Categoria'
import Produto from '../../models/Produto'
import ListarProduto from '../../components/produtos/listarProduto/ListarProduto.tsx'
import {
    Button,
    ListGroup,
    ListGroupItem,
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

function Produtos() {

    const navigate = useNavigate();

    const {usuario, handleLogout} = useContext(AuthContext);
    const token = usuario.token;

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

    const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
    const [fornecedorSelecionado, setFornecedorSelecionado] = useState<string | null>(null);

    const categoriasOrdenadas = [...categorias].sort((a, b) => a.nome.localeCompare(b.nome));
    const fornecedoresOrdenados = [...fornecedores].sort((a, b) => a.nome.localeCompare(b.nome));

    let produtosParaExibir = [...produtos];

    if (categoriaSelecionada) {
        produtosParaExibir = produtosParaExibir.filter(
            (produto) => produto.categoria?.nome === categoriaSelecionada
        );
    }

    if (fornecedorSelecionado) {
        produtosParaExibir = produtosParaExibir.filter(
            (produto) => produto.fornecedor?.nome === fornecedorSelecionado
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
            await buscar('/produtos/all', setProdutos, {headers: {Authorization: token}});
        } catch (error: any) {
            if (error.toString().includes('403')) {
                ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
                handleLogout();
            }
        }
    }

    function handleCategoriaClick(categoriaNome: string) {
        setCategoriaSelecionada(prev => prev === categoriaNome ? null : categoriaNome);
    }

    function handleFornecedorClick(fornecedorNome: string) {
        setFornecedorSelecionado(prev => prev === fornecedorNome ? null : fornecedorNome);
    }


    useEffect(() => {
        if (token === '') {
            ToastAlerta('Você precisa estar logado', Toast.Warning);
            navigate('/login');
        }
    }, [token]);

    useEffect(() => {
        buscarCategorias();
        buscarFornecedores()
        buscarProdutos();
    }, []);

    return (
        <>
            <div className='pt-32 pb-20 flex-col min-h-[95vh]  '>
                <div className='flex'>
                    <div className='xs:min-w-[10vw] '>
                        <div className='flex flex-col justify-center'>
                            <ListGroup className='sm:w-48 m-4 xs:w-32'>
                                <div>
                                    <div className='flex flex-wrap gap-3 m-5'>
                                        <Button>
                                            <Link to={'/cadastroCategoria'}>Cadastrar Categoria</Link>
                                        </Button>
                                        <Button>
                                            <Link to={'/cadastroFornecedor'}>Cadastrar Fornecedor</Link>
                                        </Button>
                                        <Button>
                                            <Link to={'/cadastroProduto'}>Cadastrar Produto</Link>
                                        </Button>
                                    </div>
                                </div>
                            </ListGroup>

                            <ListGroup className='sm:w-48 m-4 xs:w-32'>
                                <h4 className='text-2xl text-center py-2 rounded-t-lg bg-blue-700 text-blue-50'>Categorias</h4>
                                {categoriasOrdenadas.map((categoria) => (
                                    <ListGroupItem
                                        key={categoria.id}
                                        onClick={() => handleCategoriaClick(categoria.nome)}
                                        className={`${categoria.nome === categoriaSelecionada ? 'font-bold' : ''}`}
                                        active={categoria.nome === categoriaSelecionada}
                                    >
                                        <ListarCategorias categoria={categoria} key={categoria.id}/>

                                        {categoria.nome}
                                    </ListGroupItem>
                                ))}
                            </ListGroup>

                            <ListGroup className='sm:w-48 m-4 xs:w-32'>
                                <h4 className='text-2xl text-center py-2 rounded-t-lg bg-blue-700 text-blue-50'>Fornecedores</h4>

                                {fornecedoresOrdenados.map((fornecedor) => (
                                    <ListGroupItem
                                        key={fornecedor.id}
                                        onClick={() => handleFornecedorClick(fornecedor.nome)}
                                        className={`${fornecedor.nome === fornecedorSelecionado ? 'font-bold' : ''}`}
                                        active={fornecedor.nome === fornecedorSelecionado}
                                    >
                                        <ListarFornecedores fornecedor={fornecedor} key={fornecedor.id}/>

                                        {fornecedor.nome}
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        </div>
                    </div>

                    <div className='mx-6  overflow-x-auto'>
                        {produtos.length === 0 && (
                            <DNA
                                visible={true}
                                height='200'
                                width='200'
                                ariaLabel='dna-loading'
                                wrapperStyle={{}}
                                wrapperClass='dna-wrapper mx-auto'
                            />
                        )}

                        <div className='mx-auto py-4 overflow-x-auto'>
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
                                        {/*<TableHeadCell>Data de Saída</TableHeadCell>*/}
                                        <TableHeadCell>Marca</TableHeadCell>
                                        <TableHeadCell>Categoria</TableHeadCell>
                                        <TableHeadCell>Fornecedor</TableHeadCell>
                                        <TableHeadCell>Observações</TableHeadCell>
                                        {/*<TableHeadCell>Estoque Mínimo</TableHeadCell>*/}
                                        {/*<TableHeadCell>Estoque Máximo</TableHeadCell>*/}
                                        <TableHeadCell>Ações</TableHeadCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody className='divide-y'>
                                    {produtosParaExibir.length > 0 ? (
                                        produtosParaExibir.map((produto) => (
                                            <ListarProduto key={produto.id} produto={produto}/>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className='text-center py-4'>
                                                Não há produtos
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Produtos;
