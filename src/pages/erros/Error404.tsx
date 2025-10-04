import {useNavigate} from 'react-router-dom';
import {Button} from "flowbite-react";

export default function Erro404() {

    const navigate = useNavigate();

    function retornar() {
        navigate('/');
    }

    return (
        <div className='flex flex-col items-center justify-center h-screen text-center p-4'>
            <h1 className='text-6xl font-bold text-rose-600'>404</h1>
            <p className='text-2xl text-gray-600 dark:text-gray-300 mt-4'>Página não encontrada</p>
            <p className='text-gray-600 dark:text-gray-300 mt-2 mb-10'>A URL que você acessou não existe.</p>
            <Button onClick={retornar} color='alternative' className='cursor-pointer hover:text-teal-700'>
                <span className='text-md '>Voltar ao Início</span>
            </Button>
        </div>
    )
}
