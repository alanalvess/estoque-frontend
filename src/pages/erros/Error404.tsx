import {Link} from 'react-router-dom';

export default function Erro404() {
    return (
        <div className='flex flex-col items-center justify-center h-screen text-center p-4'>
            <h1 className='text-6xl font-bold text-red-600'>404</h1>
            <p className='text-2xl mt-4'>Página não encontrada</p>
            <p className='text-gray-600 mt-2'>A URL que você acessou não existe.</p>
            <Link to='/' className='mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'>
                Voltar para a Home
            </Link>
        </div>
    );
}
