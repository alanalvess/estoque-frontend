import {Link} from 'react-router-dom';
import {Button} from "flowbite-react";
import Banner from '../../assets/images/banner-home.png'

export default function Home() {
    return (
        <div
            className="min-h-screen flex flex-col md:flex-row items-center justify-center px-4 sm:px-10 lg:px-20 py-32">
            <div
                className="flex-1 flex flex-col items-center text-center space-y-6 max-w-xl mb-10 p-4 sm:p-10 lg:p-20 bg-gray-300 dark:bg-gray-600 shadow-2xl rounded-2xl ">
                <h1 className="text-4xl md:text-5xl font-extrabold text-teal-500 dark:text-rose-500">
                    Gestok: Sistema de gestão de estoque!
                </h1>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 px-4 md:px-0">
                    Você tem o controle completo do seu estoque na palma da mão. Desenvolvido
                    especialmente para mercados de pequeno porte, o sistema permite cadastrar, acompanhar entradas e
                    saídas, monitorar validades e garantir que seus produtos estejam sempre disponíveis para seus
                    clientes.
                </p>

                <div className="flex justify-center md:justify-start">
                    <Link to="/produtos/all">
                        <Button
                            className="px-6 py-3 text-lg rounded-lg shadow-lg bg-rose-600 hover:bg-rose-700 dark:bg-teal-600 dark:hover:bg-teal-700 focus:ring-0 cursor-pointer">
                            Acessar Sistema
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex-1 flex justify-center">
                <img
                    src={Banner}
                    alt="Ilustração de estoque"
                    className="w-full max-w-lg"
                />
            </div>
        </div>
    )
}
