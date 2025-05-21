import {ChangeEvent, useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import {AuthContext} from '../../../contexts/AuthContext';
import {Toast, ToastAlerta} from '../../../utils/ToastAlerta';
import {atualizar, buscar, cadastrar} from '../../../services/Service';

import Marca from '../../../models/Marca';
import {Button, Spinner} from 'flowbite-react';
import InputField from '../../form/InputField.tsx';
import {HiChevronLeft} from "react-icons/hi2";

'use client';

const marcaInicial: Marca = {
    id: 0,
    nome: ''
};

function FormularioMarca() {

    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();
    const {usuario, handleLogout} = useContext(AuthContext);
    const token = usuario.token;

    const [estado, setEstado] = useState({
        isLoading: false,
        marca: marcaInicial,
    });

    const authHeaders = {headers: {Authorization: token}};

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
            marca: {
                ...prev.marca
            }
        }));
    }, []);

    async function carregarDados() {
        try {
            await Promise.all([
                id ? buscar(`/marcas/${id}`,
                    (data) => setEstado(prev => (
                        {...prev, marca: data})),
                    authHeaders
                ) : null
            ]);
        } catch (error) {
            ToastAlerta('Erro ao buscar dados iniciais', Toast.Error);
        }
    }

    function atualizarCampo(e: ChangeEvent<HTMLInputElement>) {
        const {name, value} = e.target;
        setEstado(prev => ({
            ...prev,
            marca: {
                ...prev.marca,
                [name]: value
            }
        }));
    }

    function handleMarcaError(error: any) {
        if (error?.response?.status === 403) {
            ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
            handleLogout();
        } else if (error?.response?.data?.message) {
            ToastAlerta(error.response.data.message, Toast.Warning); // aqui a mensagem do backend
        } else {
            ToastAlerta('Erro ao cadastrar/atualizar a Marca', Toast.Error);
        }
    }

    async function salvarMarca() {
        const endpoint = id ? `/marcas/${id}` : '/marcas/cadastrar';
        const metodo = id ? atualizar : cadastrar;
        const mensagem = id ? 'Marca atualizada' : 'Marca cadastrada';

        await metodo(endpoint, estado.marca, (data) => setEstado(
                prev => (
                    {...prev, marca: data})),
            authHeaders
        );
        ToastAlerta(mensagem, Toast.Success);
        retornar();
    }

    async function gerarNovaMarca(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        setEstado(prev => ({...prev, isLoading: true}));

        try {
            await salvarMarca();
        } catch (error: any) {
            handleMarcaError(error);
        } finally {
            setEstado(prev => ({...prev, isLoading: false}));
        }
    }

    function retornar() {
        navigate('/marcas/all');
    }

    function voltarFormulario() {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/categorias/all'); // ou qualquer rota padrão
        }
    }

    return (
        <>
            <div className="py-30 px-4 min-h-screen">
                <div className="max-w-4xl mx-auto rounded-2xl shadow-xl p-10">
                    <Button
                        onClick={voltarFormulario}
                        color='light'
                        className="cursor-pointer border-none flex items-center text-sm text-gray-600 dark:text-gray-300 hover:underline hover:text-gray-800 dark:hover:text-white dark:bg-gray-500 dark:hover:bg-gray-600 transition-all"
                    >
                        <HiChevronLeft className="mr-2 h-5 w-5"/>
                        Voltar
                    </Button>

                    <h2 className="text-4xl font-bold text-center text-gray-700 mb-10">
                        {id === undefined ? 'Cadastrar Marca' : 'Editar Marca'}
                    </h2>

                    <form
                        className='flex justify-center items-center mx-auto flex-col w-2/3 gap-3 py-10'
                        onSubmit={gerarNovaMarca}
                    >
                        <InputField
                            label='Nome da Marca'
                            name='nome'
                            className="focus:outline-none focus:ring-0 focus:border-none"
                            value={estado.marca.nome}
                            onChange={atualizarCampo}
                            required
                        />

                        <Button
                            disabled={id !== undefined && estado.marca.nome === ''}
                            className='cursor-pointer rounded text-gray-100 bg-teal-500 hover:bg-teal-700 w-1/2 py-2 mx-auto flex justify-center dark:bg-teal-600 dark:hover:bg-teal-800 focus:ring-0'
                            type='submit'
                        >
                            {estado.isLoading
                                ? <Spinner aria-label="Default status example"/>
                                : id !== undefined ? <span>Editar</span> : <span>Cadastrar</span>
                            }
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default FormularioMarca;