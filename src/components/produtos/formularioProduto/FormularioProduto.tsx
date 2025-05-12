import {ChangeEvent, useContext, useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import {AuthContext} from '../../../contexts/AuthContext'
import {Toast, ToastAlerta} from '../../../utils/ToastAlerta'
import {atualizar, buscar, cadastrar} from '../../../services/Service'

import Categoria from '../../../models/Categoria'
import Produto from '../../../models/Produto'
import {Button, Spinner, ToggleSwitch} from 'flowbite-react'
import Fornecedor from '../../../models/Fornecedor.ts';
import InputField from '../../form/InputField.tsx';
import TextAreaField from '../../form/TextInputField.tsx';
import SelectField from '../../form/SelectField.tsx';
import {UnidadeDeMedida} from '../../../utils/UnidadeDeMedida.ts';
import {HiChevronLeft} from "react-icons/hi2";
import DatePickerField from "../../form/DatePickerField.tsx";
import ToggleSwitchField from "../../form/ToggleSwitchField.tsx";
import Marca from "../../../models/Marca.ts";

'use client';

const categoriaInicial: Categoria = {
    id: 0,
    nome: ''
};

const marcaInicial: Marca = {
    id: 0,
    nome: ''
};

const fornecedorInicial: Fornecedor = {
    id: 0,
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: ''
};

const produtoInicial: Produto = {
    id: 0,
    nome: '',
    descricao: '',
    valor: 0,
    quantidade: 0,
    disponivel: true,
    unidadeMedida: null,
    codigo: '',
    estoqueMinimo: 0,
    estoqueMaximo: 0,
    dataValidade: '',
    dataEntrada: new Date().toISOString().split('T')[0],
    dataSaida: '',
    categoria: null,
    marca: null,
    fornecedor: null
};

function FormularioProduto() {

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;

    const [estado, setEstado] = useState({
        isLoading: false,
        categorias: [] as Categoria[],
        marcas: [] as Marca[],
        fornecedores: [] as Fornecedor[],
        categoria: categoriaInicial,
        marca: marcaInicial,
        fornecedor: fornecedorInicial,
        produto: produtoInicial
    });

    const authHeaders = { headers: { Authorization: token } };

    useEffect(() => {
        if (!token) {
            ToastAlerta('Você precisa estar logado', Toast.Warning);
            navigate('/login');
        } else {
            carregarDados();
        }
    }, [token, id]);

    useEffect(() => {
        setEstado(prev => ({
            ...prev,
            produto: {
                ...prev.produto,
                categoria: prev.categoria,
                marca: prev.marca,
                fornecedor: prev.fornecedor
            }
        }));
    }, [estado.categoria, estado.marca, estado.fornecedor]);

    async function carregarDados() {
        try {
            await Promise.all([
                buscar('/categorias/all', (data) => setEstado(
                    prev => (
                        { ...prev, categorias: data })),
                    authHeaders
                ),

                buscar('/marcas/all', (data) => setEstado(
                        prev => (
                            { ...prev, marcas: data })),
                    authHeaders
                ),

                buscar('/fornecedores/all', (data) => setEstado(
                    prev => (
                        { ...prev, fornecedores: data })),
                    authHeaders
                ),

                id ? buscar(`/produtos/${id}`, (data) => setEstado(
                    prev => (
                        { ...prev, produto: data })),
                    authHeaders
                ) : null
            ]);
        } catch (error) {
            ToastAlerta('Erro ao buscar dados iniciais', Toast.Error);
        }
    }

    function atualizarCampo(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value, type } = e.target;

        const novoValor = (type === 'number') ? Number(value) : value;

        setEstado(prev => ({
            ...prev,
            produto: {
                ...prev.produto,
                [name]: novoValor
            }
        }));
    }


    function handleCheckboxChange(checked: boolean) {
        setEstado(prev => ({
            ...prev,
            produto: {
                ...prev.produto,
                disponivel: checked
            }
        }));
    }

    function handleProdutoError(error: any) {
        if (error.toString().includes('403')) {
            ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
            handleLogout();
        } else {
            ToastAlerta('Erro ao cadastrar/atualizar o Produto', Toast.Error);
        }
    }

    async function salvarProduto() {

        if (!validarProduto()) return; // impede envio se houver erro

        const endpoint = id ? `/produtos/${id}` : '/produtos/cadastrar';
        const metodo = id ? atualizar : cadastrar;
        const mensagem = id ? 'Produto atualizado' : 'Produto cadastrado';

        await metodo(endpoint, estado.produto, (data) => setEstado(
            prev => (
                { ...prev, produto: data })),
            authHeaders
        );
        ToastAlerta(mensagem, Toast.Success);
        retornar();
    }

    async function gerarNovoProduto(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        setEstado(prev => ({ ...prev, isLoading: true }));

        try {
            await salvarProduto();
        } catch (error: any) {
            handleProdutoError(error);
        } finally {
            setEstado(prev => ({ ...prev, isLoading: false }));
        }
    }

    function retornar() {
        navigate('/produtos/all');
    }

    function voltarFormulario() {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/categorias/all'); // ou qualquer rota padrão
        }
    }

    function validarProduto(): boolean {
        const produto = estado.produto;

        const valor = Number(produto.valor);
        const quantidade = Number(produto.quantidade);
        const estoqueMinimo = Number(produto.estoqueMinimo);
        const estoqueMaximo = Number(produto.estoqueMaximo);

        if (isNaN(valor) || valor < 0) {
            ToastAlerta('O valor do produto não pode ser negativo.', Toast.Warning);
            return false;
        }

        if (isNaN(quantidade) || quantidade < 0) {
            ToastAlerta('A quantidade do produto não pode ser negativa.', Toast.Warning);
            return false;
        }

        if (isNaN(estoqueMinimo) || isNaN(estoqueMaximo)) {
            ToastAlerta('Estoque mínimo e máximo devem ser números válidos.', Toast.Warning);
            return false;
        }

        if (estoqueMaximo < estoqueMinimo) {
            ToastAlerta('O estoque máximo não pode ser menor que o estoque mínimo.', Toast.Warning);
            return false;
        }

        return true;
    }


    return (
        <>
            <div className="py-30 px-4  min-h-screen">
                <div className="max-w-4xl mx-auto  rounded-2xl shadow-xl p-10">
                    <Button
                        onClick={voltarFormulario} // volta uma página no histórico
                        color='light'
                        className="cursor-pointer border-none flex items-center text-sm text-gray-600 dark:text-gray-300 hover:underline hover:text-gray-800 dark:hover:text-white dark:bg-gray-500 dark:hover:bg-gray-600 transition-all"
                    >
                        <HiChevronLeft className="mr-2 h-5 w-5"/>
                        Voltar
                    </Button>

                    <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
                        {id !== undefined ? 'Editar Produto' : 'Cadastrar Produto'}
                    </h2>

                    <form
                        onSubmit={gerarNovoProduto}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        <InputField
                            label="Código do Produto"
                            name="codigo"
                            value={estado.produto.codigo}
                            onChange={atualizarCampo}
                            required
                        />

                        <InputField
                            label="Nome do Produto"
                            name="nome"
                            value={estado.produto.nome}
                            onChange={atualizarCampo}
                            required
                        />

                        <InputField
                            label="Quantidade do Produto"
                            name="quantidade"
                            value={estado.produto.quantidade}
                            onChange={atualizarCampo}
                            required
                        />

                        <SelectField
                            label="Unidade de Medida"
                            name="unidadeMedida"
                            value={estado.produto.unidadeMedida || ''}
                            options={UnidadeDeMedida}
                            onChange={atualizarCampo}
                            required
                        />

                        <InputField
                            label="Valor do Produto"
                            name="valor"
                            value={estado.produto.valor}
                            onChange={atualizarCampo}
                            required
                        />

                        <SelectField
                            label="Marca do Produto"
                            name="marca"
                            value={estado.produto.marca?.id || ''}
                            options={estado.marcas.map((cat) => ({ value: cat.id, label: cat.nome }))}
                            onChange={(e) => buscar(`/marcas/${e.currentTarget.value}`, (data) => setEstado(prev => ({ ...prev, marca: data })), authHeaders)}
                            required
                        />

                        <DatePickerField
                            label="Data de Entrada"
                            name="dataEntrada"
                            value={estado.produto.dataEntrada}
                            // onChange={atualizarCampo}
                            onChange={() => {}} // impede qualquer alteração
                            required
                            disabled

                        />

                        <DatePickerField
                            label="Validade"
                            name="dataValidade"
                            // title='Data de Validade'
                            value={estado.produto.dataValidade}
                            onChange={atualizarCampo}
                            minDate={new Date()}  // Aqui você usa a data no formato local
                            required
                        />

                        <InputField
                            label="Estoque Mínimo"
                            name="estoqueMinimo"
                            value={estado.produto.estoqueMinimo}
                            onChange={atualizarCampo}
                            required
                        />

                        <InputField
                            label="Estoque Máximo"
                            name="estoqueMaximo"
                            value={estado.produto.estoqueMaximo}
                            onChange={atualizarCampo}
                            required
                        />

                        <SelectField
                            label="Categoria do Produto"
                            name="categoria"
                            value={estado.produto.categoria?.id || ''}
                            options={estado.categorias.map((cat) => ({ value: cat.id, label: cat.nome }))}
                            onChange={(e) => buscar(`/categorias/${e.currentTarget.value}`, (data) => setEstado(prev => ({ ...prev, categoria: data })), authHeaders)}
                            required
                        />

                        <SelectField
                            label="Fornecedor do Produto"
                            name="fornecedor"
                            value={estado.produto.fornecedor?.id || ''}
                            options={estado.fornecedores.map((forn) => ({ value: forn.id, label: forn.nome }))}
                            onChange={(e) => buscar(`/fornecedores/${e.currentTarget.value}`, (data) => setEstado(prev => ({ ...prev, fornecedor: data })), authHeaders)}
                            required
                        />

                        <div className="md:col-span-2">
                            <TextAreaField
                                label="Observações do Produto"
                                name="descricao"
                                value={estado.produto.descricao}
                                onChange={atualizarCampo}
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-start">
                            <ToggleSwitchField
                                name="disponivel"
                                label='Produto Disponível?'
                                checked={estado.produto.disponivel}
                                onChange={handleCheckboxChange}
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-center mt-6">
                            <Button
                                disabled={id !== undefined && estado.produto.nome === ''}
                                className='cursor-pointer rounded text-gray-100 bg-teal-500 hover:bg-teal-700 w-1/2 py-2 mx-auto flex justify-center dark:bg-teal-600 dark:hover:bg-teal-800 focus:ring-0'
                                type="submit"
                            >
                                {estado.isLoading ? (
                                    <Spinner aria-label="Default status example" />
                                ) : id !== undefined ? (
                                    <span>Editar</span>
                                ) : (
                                    <span>Cadastrar</span>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default FormularioProduto;