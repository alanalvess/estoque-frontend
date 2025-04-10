import {useContext, useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router'
import {RotatingLines} from 'react-loader-spinner'

import {AuthContext} from '../../../contexts/AuthContext'
import {Toast, ToastAlerta} from '../../../utils/ToastAlerta'
import {buscar, deletar} from '../../../services/Service'

import Categoria from '../../../models/Categoria'
import {Button} from 'flowbite-react';

function DeletarCategoria() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [categoria, setCategoria] = useState<Categoria>({} as Categoria);

    const {id} = useParams<{ id: string }>();

    const {usuario, handleLogout} = useContext(AuthContext);
    const token = usuario.token;

    async function buscarPorId(id: string) {
        try {
            await buscar(`/categorias/${id}`, setCategoria, {headers: {Authorization: token}});
        } catch (error: any) {
            if (error.toString().includes('403')) {
                ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
                handleLogout();
            }
        }
    }

    async function deletarCategoria() {
        setIsLoading(true);

        try {
            await deletar(`/categorias/${id}`, {headers: {Authorization: token}});
            ToastAlerta('Categoria apagada', Toast.Success);
        } catch (error) {
            ToastAlerta('Erro ao apagar a Categoria', Toast.Error);
        }

        retornar();
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
        if (id !== undefined) {
            buscarPorId(id);
        }
    }, [id]);

    return (
        <>
            <div className='pt-40'>

                <div className='lg:w-1/3 mx-auto lg:bg-white lg:border border-gray-200 rounded-lg lg:shadow-lg '>
                    <h4 className='text-2xl text-center my-4'>Deletar categoria?</h4>

                    <div className='border flex flex-col mx-20 my-5 rounded-xl overflow-auto justify-between'>
                        <p className='p-2 text-2xl text-center bg-gray-200 h-full'>{categoria.nome}</p>

                        <div className='flex'>
                            <Button color='green' className='text-gray-100 bg-gray-400 hover:bg-gray-700 w-full py-2'
                                    onClick={retornar}>Não</Button>

                            <Button
                                color='red'
                                className='w-full text-gray-100 bg-gray-500 hover:bg-gray-700 flex items-center justify-center'
                                onClick={deletarCategoria}>
                                {isLoading ?
                                    <RotatingLines
                                        strokeColor='white'
                                        strokeWidth='5'
                                        animationDuration='0.75'
                                        width='24'
                                        visible={true}
                                    /> :
                                    <span>Sim</span>
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeletarCategoria;