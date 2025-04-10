import {useContext, useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router'
import {RotatingLines} from 'react-loader-spinner'

import {AuthContext} from '../../../contexts/AuthContext'
import {Toast, ToastAlerta} from '../../../utils/ToastAlerta'
import {buscar, deletar} from '../../../services/Service'

import Fornecedor from '../../../models/Fornecedor'
import {Button} from 'flowbite-react';

function DeletarFornecedor() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fornecedor, setFornecedor] = useState<Fornecedor>({} as Fornecedor);

    const {id} = useParams<{ id: string }>();

    const {usuario, handleLogout} = useContext(AuthContext);
    const token = usuario.token;

    async function buscarPorId(id: string) {
        try {
            await buscar(`/fornecedores/${id}`, setFornecedor, {headers: {Authorization: token}});
        } catch (error: any) {
            if (error.toString().includes('403')) {
                ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
                handleLogout();
            }
        }
    }

    async function deletarFornecedor() {
        setIsLoading(true);

        try {
            await deletar(`/fornecedores/${id}`, {headers: {Authorization: token}});
            ToastAlerta('Fornecedor apagada', Toast.Success);
        } catch (error) {
            ToastAlerta('Erro ao apagar a Fornecedor', Toast.Error);
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
                    <h4 className='text-2xl text-center my-4'>Deletar fornecedor?</h4>

                    <div className='border flex flex-col mx-20 my-5 rounded-xl overflow-auto justify-between'>
                        <p className='p-2 text-2xl text-center bg-gray-200 h-full'>{fornecedor.nome}</p>

                        <div className='flex'>
                            <Button className='text-gray-100 bg-gray-400 hover:bg-gray-700 w-full py-2'
                                    onClick={retornar}>Não</Button>

                            <Button
                                className='w-full text-gray-100 bg-gray-500 hover:bg-gray-700 flex items-center justify-center'
                                onClick={deletarFornecedor}>
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

export default DeletarFornecedor;