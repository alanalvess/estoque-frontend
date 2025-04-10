import {ChangeEvent, useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {RotatingLines} from 'react-loader-spinner';

import {AuthContext} from '../../../contexts/AuthContext';
import {Toast, ToastAlerta} from '../../../utils/ToastAlerta';
import {atualizar, buscar, cadastrar} from '../../../services/Service';

import Categoria from '../../../models/Categoria';
import {Button} from 'flowbite-react';
import InputField from '../../form/InputField.tsx';

function FormularioCategoria() {

    const navigate = useNavigate();

    const {id} = useParams<{ id: string }>();

    const {usuario, handleLogout} = useContext(AuthContext);
    const token = usuario.token;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [categoria, setCategoria] = useState<Categoria>({} as Categoria);

    async function buscarPorId(id: string) {
        await buscar(`/categorias/${id}`, setCategoria, {headers: {Authorization: token}});
    }

    async function atualizarCategoria() {
        await atualizar(`/categorias/${id}`, categoria, setCategoria, {headers: {Authorization: token}});
        ToastAlerta('Categoria atualizada', Toast.Success);
        retornar();
    }

    async function cadastrarCategoria() {
        await cadastrar(`/categorias/cadastrar`, categoria, setCategoria, {headers: {Authorization: token}});
        ToastAlerta('Categoria cadastrada', Toast.Success);
        retornar();
    }

    async function gerarNovaCategoria(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (id !== undefined) {
                await atualizarCategoria();
            } else {
                await cadastrarCategoria();
            }
        } catch (error: any) {
            handleCategoriaError(error);
        } finally {
            setIsLoading(false);
        }
    }

    function handleCategoriaError(error: any) {
        if (error.toString().includes('403')) {
            ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
            handleLogout();
        } else {
            ToastAlerta('Erro ao cadastrar/atualizar a Categoria', Toast.Error);
        }
    }

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setCategoria({
            ...categoria,
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
                      onSubmit={gerarNovaCategoria}>
                    <h1 className='text-4xl text-center my-8 text-gray-900'>
                        {id === undefined ? 'Cadastrar Categoria' : 'Editar Categoria'}
                    </h1>

                    <InputField
                        label='Nome da Categoria'
                        name='nome'
                        value={categoria.nome}
                        onChange={atualizarEstado}
                        required
                    />

                    <Button
                        disabled={id !== undefined && categoria.nome === ''}
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

export default FormularioCategoria;