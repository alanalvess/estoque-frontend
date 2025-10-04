import {useNavigate} from 'react-router-dom';
import {Button} from "flowbite-react";

export default function Erro500() {

    const navigate = useNavigate();

    function retornar() {
        navigate('/');
    }

    return (
        <div className='flex flex-col gap-4 items-center justify-center h-screen text-center p-4'>
            <h1 className='text-6xl font-bold text-rose-600'>500</h1>
            <p className='text-2xl text-gray-600 dark:text-gray-300 mt-4'>Erro interno do servidor</p>
            <p className='text-gray-600 dark:text-gray-300 mt-2 mb-10'>Algo deu errado. Tente novamente mais tarde.</p>

            <Button onClick={retornar} color='alternative' className='cursor-pointer hover:text-teal-700'>
                <span className='text-md '>Voltar ao Início</span>
            </Button>
        </div>
    )
}
