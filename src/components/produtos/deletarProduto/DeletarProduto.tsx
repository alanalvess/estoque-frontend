import {useContext, useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {RotatingLines} from 'react-loader-spinner'

import {AuthContext} from '../../../contexts/AuthContext'
import {Toast, ToastAlerta} from '../../../utils/ToastAlerta'
import {buscar, deletar} from '../../../services/Service'

import Produto from '../../../models/Produto'
import {Button} from 'flowbite-react';

function DeletarProduto() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [produto, setProduto] = useState<Produto>({} as Produto);

    const {id} = useParams<{ id: string }>();

    const {usuario, handleLogout} = useContext(AuthContext);
    const token = usuario.token;

    async function buscarPorId(id: string) {
        try {
            await buscar(`/produtos/${id}`, setProduto, {headers: {Authorization: token}});
        } catch (error: any) {
            if (error.toString().includes('403')) {
                ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
                handleLogout();
            }
        }
    }

    async function deletarProduto() {
        setIsLoading(true);

        try {
            await deletar(`/produtos/${id}`, {headers: {Authorization: token}});
            ToastAlerta('Produto apagado', Toast.Success);
        } catch (error) {
            ToastAlerta('Erro ao apagar o Produto', Toast.Error);
        }

        setIsLoading(false);
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
            <div className="pt-40 px-4">
                <div className="lg:w-1/3 mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
                    <h4 className="text-3xl font-bold text-center text-gray-800 mb-6">Deletar Produto?</h4>

                    <div className="bg-gray-50 flex flex-col gap-4 rounded-xl overflow-auto p-6">
                        <div>
                            <h4 className="text-xl font-semibold uppercase text-gray-700">{produto.nome}</h4>
                            <p className="text-gray-600 mt-2">{produto.descricao}</p>
                        </div>

                        <div className="flex gap-4 mt-4">
                            <Button
                                className="w-full bg-gray-300 text-gray-800 hover:bg-gray-400 transition-all duration-300 p-2 rounded-md font-medium"
                                onClick={retornar}
                            >
                                Não
                            </Button>

                            <Button
                                className="w-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300 p-2 rounded-md font-medium flex items-center justify-center"
                                onClick={deletarProduto}
                            >
                                {isLoading ? (
                                    <RotatingLines
                                        strokeColor="white"
                                        strokeWidth="5"
                                        animationDuration="0.75"
                                        width="24"
                                        visible={true}
                                    />
                                ) : (
                                    <span>Sim</span>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeletarProduto;