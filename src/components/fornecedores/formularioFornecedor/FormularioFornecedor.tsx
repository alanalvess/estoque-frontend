import {ChangeEvent, useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {RotatingLines} from 'react-loader-spinner';

import {AuthContext} from '../../../contexts/AuthContext';
import {Toast, ToastAlerta} from '../../../utils/ToastAlerta';
import {atualizar, buscar, cadastrar} from '../../../services/Service';

import Fornecedor from '../../../models/Fornecedor';
import {Button} from 'flowbite-react';
import InputField from '../../form/InputField.tsx';
import Categoria from "../../../models/Categoria.ts";
import {HiChevronLeft} from "react-icons/hi2";

const fornecedorInicial: Fornecedor = {
    id: 0,
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: ''
};

function FormularioFornecedor() {

    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();
    const {usuario, handleLogout} = useContext(AuthContext);
    const token = usuario.token;

    const [estado, setEstado] = useState({
        isLoading: false,
        fornecedor: fornecedorInicial
    });

    const authHeaders = {headers: {Authorization: token}};
    // const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [fornecedor, setFornecedor] = useState<Fornecedor>({} as Fornecedor);

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
            fornecedor: {
                ...prev.fornecedor
            }
        }));
    }, []);

    async function carregarDados() {
        try {
            await Promise.all([
                id ? buscar(`/fornecedores/${id}`, (data) => setEstado(prev => ({
                    ...prev,
                    fornecedor: data
                })), authHeaders) : null
            ]);
        } catch (error) {
            ToastAlerta('Erro ao buscar dados iniciais', Toast.Error);
        }
    }

    function atualizarCampo(e: ChangeEvent<HTMLInputElement>) {
        const {name, value} = e.target;
        setEstado(prev => ({
            ...prev,
            fornecedor: {
                ...prev.fornecedor,
                [name]: value
            }
        }));
    }

    function handleFornecedorError(error: any) {
        if (error.toString().includes('403')) {
            ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
            handleLogout();
        } else {
            ToastAlerta('Erro ao cadastrar/atualizar o Fornecedor', Toast.Error);
        }
    }

    async function salvarFornecedor() {
        const endpoint = id ? `/fornecedores/${id}` : '/fornecedores/cadastrar';
        const metodo = id ? atualizar : cadastrar;
        const mensagem = id ? 'Fornecedor atualizado' : 'Fornecedor cadastrado';

        await metodo(endpoint, estado.fornecedor, (data) => setEstado(prev => ({
            ...prev,
            fornecedor: data
        })), authHeaders);
        ToastAlerta(mensagem, Toast.Success);
        retornar();
    }

    async function gerarNovoFornecedor(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        setEstado(prev => ({...prev, isLoading: true}));

        try {
            await salvarFornecedor();
        } catch (error: any) {
            handleFornecedorError(error);
        } finally {
            setEstado(prev => ({...prev, isLoading: false}));
        }
    }

    function retornar() {
        navigate('/produtos/all');
    }

    return (
        <>
            <div className="py-30 px-4  min-h-screen">
                <div className="max-w-4xl mx-auto  rounded-2xl shadow-xl p-10">
                    <Button
                        onClick={retornar} // volta uma página no histórico
                        className='bg-gray-300 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 font-bold px-6 py-3 transition-all duration-300 cursor-pointer'
                    >
                        <HiChevronLeft className="mr-2 h-5 w-5"/>

                        Voltar
                    </Button>

                    <h2 className='text-4xl font-bold text-center text-gray-800 mb-10'>
                        {id === undefined ? 'Cadastrar Fornecedor' : 'Editar Fornecedor'}
                    </h2>

                    <form
                        onSubmit={gerarNovoFornecedor}
                        className='flex justify-center items-center mx-auto flex-col w-2/3 gap-3 py-10'
                    >

                        <InputField
                            label='Nome do Fornecedor'
                            name='nome'
                            value={estado.fornecedor.nome}
                            onChange={atualizarCampo}
                            required
                        />

                        <InputField
                            label='CNPJ do Fornecedor'
                            name='cnpj'
                            value={estado.fornecedor.cnpj}
                            onChange={atualizarCampo}
                            required
                        />

                        <InputField
                            label='E-mail do Fornecedor'
                            name='email'
                            value={estado.fornecedor.email}
                            onChange={atualizarCampo}
                        />

                        <InputField
                            label='Telefone do Fornecedor'
                            name='telefone'
                            value={estado.fornecedor.telefone}
                            onChange={atualizarCampo}
                        />

                        <InputField
                            label='Endereço do Fornecedor'
                            name='endereco'
                            value={estado.fornecedor.endereco}
                            onChange={atualizarCampo}
                        />

                        <Button
                            disabled={id !== undefined && estado.fornecedor.nome === ''}
                            className='rounded text-gray-100 bg-gray-500 hover:bg-gray-700 w-1/2 py-2 mx-auto flex justify-center'
                            type='submit'
                        >
                            {estado.isLoading ?
                                <RotatingLines
                                    strokeColor='white'
                                    strokeWidth='5'
                                    animationDuration='0.75'
                                    width='24'
                                    visible={true}
                                /> :
                                id !== undefined ? <span>Editar</span> : <span>Cadastrar</span>
                            }
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default FormularioFornecedor;