import {ChangeEvent, useContext, useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {RotatingLines} from 'react-loader-spinner'

import {AuthContext} from '../../../contexts/AuthContext'
import {Toast, ToastAlerta} from '../../../utils/ToastAlerta'
import {atualizar, buscar, cadastrar} from '../../../services/Service'

import Categoria from '../../../models/Categoria'
import Produto from '../../../models/Produto'
import {Button, ToggleSwitch} from 'flowbite-react'
import Fornecedor from '../../../models/Fornecedor.ts';
import InputField from '../../form/InputField.tsx';
import TextAreaField from '../../form/TextInputField.tsx';
import SelectField from '../../form/SelectField.tsx';
import {UnidadeDeMedida} from '../../../utils/UnidadeDeMedida.ts';

'use client';


function FormularioProduto() {

    const navigate = useNavigate();

    const {id} = useParams<{ id: string }>();

    const {usuario, handleLogout} = useContext(AuthContext);
    const token = usuario.token;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

    const categoriaInicial: Categoria = {id: 0, nome: ''};
    const fornecedorInicial: Fornecedor = {
        id: 0, nome: '', cnpj: '', email: '', telefone: '', endereco: ''
    };
    const produtoInicial: Produto = {
        id: 0,
        nome: '', descricao: '', valor: 0, quantidade: 0, disponivel: true,
        unidadeMedida: null, codigo: '', marca: '', estoqueMinimo: 0, estoqueMaximo: 0,
        validade: '', dataEntrada: '', dataSaida: '',
        categoria: null, fornecedor: null
    };

    const [categoria, setCategoria] = useState<Categoria>(categoriaInicial);
    const [fornecedor, setFornecedor] = useState<Fornecedor>(fornecedorInicial);
    const [produto, setProduto] = useState<Produto>(produtoInicial);

    const authHeaders = {headers: {Authorization: token}};

    async function buscarProdutoPorId(id: string) {
        await buscar(`/produtos/${id}`, setProduto, authHeaders);
    }

    async function buscarCategoriaPorId(id: string) {
        await buscar(`/categorias/${id}`, setCategoria, authHeaders);
    }

    async function buscarFornecedorPorId(id: string) {
        await buscar(`/fornecedores/${id}`, setFornecedor, authHeaders);
    }

    async function buscarCategorias() {
        await buscar('/categorias/all', setCategorias, authHeaders);
    }

    async function buscarFornecedores() {
        await buscar('/fornecedores/all', setFornecedores, authHeaders);
    }


    async function gerarNovoProduto(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (id !== undefined) {
                await atualizarProduto();
            } else {
                await cadastrarProduto();
            }
        } catch (error: any) {
            handleProdutoError(error);
        } finally {
            setIsLoading(false);
        }
    }


    async function atualizarProduto() {
        await atualizar(`/produtos/${id}`, produto, setProduto, authHeaders);
        ToastAlerta('Produto atualizado', Toast.Success);
        retornar();
    }

    async function cadastrarProduto() {
        await cadastrar(`/produtos/cadastrar`, produto, setProduto, authHeaders);
        ToastAlerta('Produto cadastrado', Toast.Success);
        retornar();
    }

    function handleCheckboxChange(checked: boolean) {
        setProduto((prevProduto) => ({...prevProduto, disponivel: checked}));
    }

    function handleProdutoError(error: any) {
        if (error.toString().includes('403')) {
            ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
            handleLogout();
        } else {
            ToastAlerta('Erro ao cadastrar/atualizar o Produto', Toast.Error);
        }
    }

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setProduto(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    function atualizarEstadoTexto(e: ChangeEvent<HTMLTextAreaElement>) {
        setProduto(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    function atualizarEstadoSelect(e: ChangeEvent<HTMLSelectElement>) {
        setProduto(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    function retornar() {
        navigate('/produtos/all');
    }

    useEffect(() => {
        if (token === '') {
            ToastAlerta('Você precisa estar logado', Toast.Warning);
            navigate('/login');
        }
    }, [token]);

    useEffect(() => {
        buscarCategorias();
        if (id !== undefined) {
            buscarProdutoPorId(id);
        }
    }, [id]);

    useEffect(() => {
        buscarFornecedores();
        if (id !== undefined) {
            buscarProdutoPorId(id);
        }
    }, [id]);

    useEffect(() => {
        setProduto(prev => ({
            ...prev,
            categoria,
            fornecedor
        }));
    }, [categoria, fornecedor]);

    return (
        <>
            <div className=' py-40'>
                <div className='flex justify-center lg:mx-[20vw] font-bold border-gray-200 rounded-lg lg:shadow-lg'>
                    <form className='flex flex-col gap-4'
                          onSubmit={gerarNovoProduto}>
                        <h2 className='text-4xl text-center my-8 text-gray-900'>
                            {id !== undefined ? 'Editar Produto' : 'Cadastrar Produto'}
                        </h2>

                        <InputField
                            label='Código do Produto'
                            placeholder='Código do produto'
                            name='codigo'
                            value={produto.codigo}
                            onChange={atualizarEstado}
                            required
                        />

                        <InputField
                            label='Nome do Produto'
                            name='nome'
                            value={produto.nome}
                            onChange={atualizarEstado}
                            required
                        />

                        <InputField
                            label='Quantidade do Produto'
                            name='quantidade'
                            value={produto.quantidade}
                            onChange={atualizarEstado}
                            required
                        />

                        <SelectField
                            label='Unidade de Medida'
                            name='unidadeMedida'
                            value={produto.unidadeMedida || ''}
                            options={UnidadeDeMedida}
                            onChange={atualizarEstadoSelect}
                            required
                        />

                        <InputField
                            label='Valor do Produto'
                            name='valor'
                            value={produto.valor}
                            onChange={atualizarEstado}
                            required
                        />

                        <InputField
                            label='Data de Entrada'
                            name='dataEntrada'
                            value={produto.dataEntrada}
                            onChange={atualizarEstado}
                            required
                        />

                        <InputField
                            label='Validade do Produto'
                            name='validade'
                            value={produto.validade}
                            onChange={atualizarEstado}
                            required
                        />

                        <InputField
                            label='Marca do Produto'
                            name='marca'
                            value={produto.marca}
                            onChange={atualizarEstado}
                            required
                        />

                        <InputField
                            label='Estoque Mínimo'
                            name='estoqueMinimo'
                            value={produto.estoqueMinimo}
                            onChange={atualizarEstado}
                            required
                        />

                        <InputField
                            label='Estoque Máximo'
                            name='estoqueMaximo'
                            value={produto.estoqueMaximo}
                            onChange={atualizarEstado}
                            required
                        />

                        {/*<InputField*/}
                        {/*    label='Data de Saida'*/}
                        {/*    name='dataSaida'*/}
                        {/*    value={produto.dataSaida}*/}
                        {/*    onChange={atualizarEstado}*/}
                        {/*    required*/}
                        {/*/>*/}

                        <TextAreaField
                            label='Observações do Produto'
                            name='descricao'
                            value={produto.descricao}
                            onChange={atualizarEstadoTexto}
                            required
                        />

                        <SelectField
                            label='Categoria do Produto'
                            name='categoria'
                            value={produto.categoria?.id || ''}
                            options={categorias.map((cat) => ({value: cat.id, label: cat.nome}))}
                            onChange={(e) => buscarCategoriaPorId(e.currentTarget.value)}
                            required
                        />

                        <SelectField
                            label='Fornecedor do Produto'
                            name='fornecedor'
                            value={produto.fornecedor?.id || ''}
                            options={fornecedores.map((cat) => ({value: cat.id, label: cat.nome}))}
                            onChange={(e) => buscarFornecedorPorId(e.currentTarget.value)}
                            required
                        />

                        <div className='flex max-w-md flex-col gap-4'>
                            <ToggleSwitch checked={produto.disponivel} label='Produto Disponível?'
                                          onChange={handleCheckboxChange}/>
                        </div>

                        <Button
                            disabled={id !== undefined && produto.nome === ''}
                            className='rounded disabled:bg-slate-200 bg-gray-500 hover:bg-gray-700 text-white font-bold w-1/2 mx-auto py-2 flex justify-center'
                            type='submit'
                        >
                            {isLoading ?
                                <RotatingLines
                                    strokeColor='white'
                                    strokeWidth='5'
                                    animationDuration='0.75'
                                    width='24'
                                    visible={true}
                                /> : id !== undefined ? <span>Editar</span> : <span>Cadastrar</span>
                            }
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default FormularioProduto;