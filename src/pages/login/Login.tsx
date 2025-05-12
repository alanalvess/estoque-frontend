import {ChangeEvent, useContext, useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'

import {AuthContext} from '../../contexts/AuthContext'

import UsuarioLogin from '../../models/UsuarioLogin'
import {Button, Spinner} from 'flowbite-react';
import InputField from '../../components/form/InputField.tsx';

function Login() {

    const navigate = useNavigate();

    const [usuarioLogin, setUsuarioLogin] = useState<UsuarioLogin>({} as UsuarioLogin);

    const {usuario, handleLogin, isLoading} = useContext(AuthContext);

    function login(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        handleLogin(usuarioLogin);
    }

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setUsuarioLogin({
            ...usuarioLogin,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        if (usuario.token !== '') {
            navigate('/produtos/all');
        }
    }, [usuario]);

    return (
        <>
            <div className='pt-40'>

                <div className='flex justify-center lg:mx-[20vw] font-bold border-gray-200 rounded-lg lg:shadow-lg'>
                    <form
                        className='flex justify-center items-center flex-col w-2/3 gap-3 py-10'
                        onSubmit={login}
                    >
                        <h2 className='text-gray-900 text-5xl '>Entrar</h2>

                        <InputField
                            label='E-mail'
                            name='email'
                            value={usuarioLogin.email}
                            onChange={atualizarEstado}
                            required
                        />

                        <InputField
                            label='Senha'
                            name='senha'
                            type='password'
                            value={usuarioLogin.senha}
                            onChange={atualizarEstado}
                            required
                        />

                        <Button type='submit'
                                className='cursor-pointer rounded bg-teal-500 hover:bg-teal-600 text-white w-1/2 py-2 flex justify-center focus:outline-none focus:ring-0 dark:bg-teal-600 dark:hover:bg-teal-700'
                        >
                            {isLoading ?
                                <Spinner aria-label="Default status example" size='md'/>
                                : <span>Entrar</span>
                            }
                        </Button>

                        <hr className='border-gray-800 w-full'/>

                        <p>
                            Ainda não tem uma conta?{' '}
                            <Link to='/cadastro'
                                  className='text-teal-500 dark:text-teal-800 hover:underline hover:text-teal-600 dark:hover:text-teal-900'>
                                Cadastre-se
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;