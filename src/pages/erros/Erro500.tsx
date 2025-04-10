import {Link} from 'react-router-dom';

export default function Erro500() {
    return (
        <div className='flex flex-col items-center justify-center h-screen text-center p-4'>
            <h1 className='text-6xl font-bold text-red-600'>500</h1>
            <p className='text-2xl mt-4'>Erro interno do servidor</p>
            <p className='text-gray-600 mt-2'>Algo deu errado. Tente novamente mais tarde.</p>
            <Link to='/produtos/all'
                  className='mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'>
                Voltar para a Home
            </Link>
        </div>
    );
}
