import {ChangeEvent, useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'

import {Toast, ToastAlerta} from '../../utils/ToastAlerta'
import {cadastrarUsuario} from '../../services/Service'

import Usuario from '../../models/Usuario'
import {Button} from 'flowbite-react';
import InputField from '../../components/form/InputField.tsx';

function Cadastro() {

    const navigate = useNavigate();

    const [confirmaSenha, setConfirmaSenha] = useState<string>('');

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

                <div
                    className='flex justify-center lg:mx-[20vw] font-bold bg-white border border-gray-200 rounded-lg shadow-lg'>
                    <form className='flex justify-center items-center flex-col w-2/3 gap-3 py-10'
                          onSubmit={cadastrarNovoUsuario}>
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

                        <div className='flex justify-around w-full gap-8'>
                            <Button className='rounded text-white bg-gray-400 hover:bg-gray-900 w-1/2 py-2'
                                    type='submit'>
                                Cadastrar
                            </Button>
                        </div>

                        <hr className='border-gray-800 w-full'/>

                        <p>
                            Já tem uma conta?{' '}
                            <Link to='/login' className='text-gray-800 hover:underline'>
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