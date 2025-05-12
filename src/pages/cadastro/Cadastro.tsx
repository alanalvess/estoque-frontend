import {ChangeEvent, useContext, useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'

import {Toast, ToastAlerta} from '../../utils/ToastAlerta'
import {cadastrarUsuario} from '../../services/Service'

import Usuario from '../../models/Usuario'
import {Button, Spinner} from 'flowbite-react';
import InputField from '../../components/form/InputField.tsx';
import {AuthContext} from "../../contexts/AuthContext.tsx";

function Cadastro() {

    const navigate = useNavigate();

    const [confirmaSenha, setConfirmaSenha] = useState<string>('');
    const {isLoading} = useContext(AuthContext);

    const [usuario, setUsuario] = useState<Usuario>({
        id: 0,
        nome: '',
        email: '',
        senha: ''
    });

    const [usuarioResposta, setUsuarioResposta] = useState<Usuario>({
        id: 0,
        nome: '',
        email: '',
        senha: ''
    });

    async function cadastrarNovoUsuario(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();

        if (confirmaSenha === usuario.senha && usuario.senha.length >= 8) {
            try {
                await cadastrarUsuario(`/usuarios/cadastrar`, usuario, setUsuarioResposta);
                ToastAlerta('Usuário cadastrado', Toast.Success);
            } catch (error) {
                ToastAlerta('Erro ao cadastrar usuário', Toast.Error);
            }

        } else {
            ToastAlerta('Dados inconsistentes. Verifique as informações de cadastro.', Toast.Error);
            setUsuario({...usuario, senha: ''});
            setConfirmaSenha('');
        }
    }

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });
    }

    function handleConfirmarSenha(e: ChangeEvent<HTMLInputElement>) {
        setConfirmaSenha(e.target.value);
    }

    function retornar() {
        navigate('/login');
    }

    useEffect(() => {
        if (usuarioResposta.id !== 0) {
            retornar();
        }
    }, [usuarioResposta]);

    return (
        <>
            <div className='pt-40'>

                <div className='flex justify-center lg:mx-[20vw] font-bold border-gray-200 rounded-lg lg:shadow-lg'>
                    <form
                        className='flex justify-center items-center flex-col w-2/3 gap-3 py-10'
                        onSubmit={cadastrarNovoUsuario}
                    >
                        <h2 className='text-gray-900 text-5xl'>Cadastrar</h2>

                        <InputField
                            label='Nome'
                            name='nome'
                            value={usuario.nome}
                            onChange={atualizarEstado}
                            required
                        />

                        <InputField
                            label='E-mail'
                            name='email'
                            value={usuario.email}
                            onChange={atualizarEstado}
                            required
                        />

                        <InputField
                            label='Senha'
                            name='senha'
                            type='password'
                            value={usuario.senha}
                            onChange={atualizarEstado}
                            required
                        />

                        <InputField
                            label='Confirmar Senha'
                            name='confirmarSenha'
                            type='password'
                            value={confirmaSenha}
                            onChange={handleConfirmarSenha}
                            required
                        />

                        <Button type='submit'
                                className='cursor-pointer rounded bg-teal-500 hover:bg-teal-600 text-white w-1/2 py-2 flex justify-center focus:outline-none focus:ring-0 dark:bg-teal-600 dark:hover:bg-teal-700'
                        >
                            {isLoading ?
                                <Spinner aria-label="Default status example" size='md'/>
                                : <span>Cadastrar</span>
                            }
                        </Button>

                        <hr className='border-gray-800 w-full'/>

                        <p>
                            Já tem uma conta?{' '}
                            <Link to='/login'
                                  className='text-teal-500 dark:text-teal-800 hover:underline hover:text-teal-600 dark:hover:text-teal-900'>
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Cadastro;