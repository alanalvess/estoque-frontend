import {ChangeEvent, useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {RotatingLines} from 'react-loader-spinner';

import {AuthContext} from '../../../contexts/AuthContext';
import {Toast, ToastAlerta} from '../../../utils/ToastAlerta';
import {atualizar, buscar, cadastrar} from '../../../services/Service';

import Fornecedor from '../../../models/Fornecedor';
import {Button} from 'flowbite-react';
import InputField from '../../form/InputField.tsx';

function FormularioFornecedor() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fornecedor, setFornecedor] = useState<Fornecedor>({} as Fornecedor);

    const {id} = useParams<{ id: string }>();

    const {usuario, handleLogout} = useContext(AuthContext);
    const token = usuario.token;

    async function buscarPorId(id: string) {
        await buscar(`/fornecedores/${id}`, setFornecedor, {headers: {Authorization: token}});
    }

    async function atualizarFornecedor() {
        await atualizar(`/fornecedores/${id}`, fornecedor, setFornecedor, {headers: {Authorization: token}});
        ToastAlerta('Fornecedor atualizado', Toast.Success);
        retornar();
    }

    async function cadastrarFornecedor() {
        await cadastrar(`/fornecedores/cadastrar`, fornecedor, setFornecedor, {headers: {Authorization: token}});
        ToastAlerta('Fornecedor cadastrado', Toast.Success);
        retornar();
    }

    async function gerarNovaFornecedor(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (id !== undefined) {
                await atualizarFornecedor();
            } else {
                await cadastrarFornecedor();
            }
        } catch (error: any) {
            handleFornecedorError(error);
        } finally {
            setIsLoading(false);
        }
    }

    function handleFornecedorError(error: any) {
        if (error.toString().includes('403')) {
            ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
            handleLogout();
        } else {
            ToastAlerta('Erro ao cadastrar/atualizar a Fornecedor', Toast.Error);
        }
    }

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setFornecedor({
            ...fornecedor,
            [e.target.name]: e.target.value
        })
    }

    function retornar() {
        navigate('/produtos/all');
    }

    useEffect(() => {
        if (id !== undefined) {
            buscarPorId(id);
        }
    }, [id]);

    useEffect(() => {
        if (token === '') {
            ToastAlerta('Você precisa estar logado', Toast.Warning);
            navigate('/login');
        }
    }, [token]);

    return (
        <div className='pt-40'>


            <div
                className='flex justify-center lg:mx-[20vw] font-bold bg-white border border-gray-200 rounded-lg shadow-lg'>
                <form className='flex justify-center items-center flex-col w-2/3 gap-3 py-10'
                      onSubmit={gerarNovaFornecedor}>
                    <h1 className='text-4xl text-center my-8 text-gray-900'>
                        {id === undefined ? 'Cadastrar Fornecedor' : 'Editar Fornecedor'}
                    </h1>

                    <InputField
                        label='Nome do Fornecedor'
                        name='nome'
                        value={fornecedor.nome}
                        onChange={atualizarEstado}
                        required
                    />

                    <InputField
                        label='CNPJ do Fornecedor'
                        name='cnpj'
                        value={fornecedor.cnpj}
                        onChange={atualizarEstado}
                        required
                    />

                    <InputField
                        label='E-mail do Fornecedor'
                        name='email'
                        value={fornecedor.email}
                        onChange={atualizarEstado}
                        required
                    />

                    <InputField
                        label='Telefone do Fornecedor'
                        name='telefone'
                        value={fornecedor.telefone}
                        onChange={atualizarEstado}
                        required
                    />

                    <InputField
                        label='Endereço do Fornecedor'
                        name='endereco'
                        value={fornecedor.endereco}
                        onChange={atualizarEstado}
                        required
                    />

                    <Button
                        disabled={id !== undefined && fornecedor.nome === ''}
                        className='rounded text-gray-100 bg-gray-500 hover:bg-gray-700 w-1/2 py-2 mx-auto flex justify-center'
                        type='submit'
                    >
                        {isLoading ?
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
    )
}

export default FormularioFornecedor;