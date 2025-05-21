import {ChangeEvent, useContext, useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import {AuthContext} from "../../../contexts/AuthContext.tsx";
import {Toast, ToastAlerta} from '../../../utils/ToastAlerta'
import {atualizarAtributo, buscar, cadastrar} from '../../../services/Service'

import Usuario from '../../../models/Usuario'
import {Button, HelperText, Spinner} from 'flowbite-react';
import InputField from '../../../components/form/InputField.tsx';
import {HiChevronLeft} from "react-icons/hi2";
import SelectField from "../../form/SelectField.tsx";
import {Roles} from "../../../enums/Roles.ts";
import {Role} from "../../../utils/Role.ts";

const usuarioInicial: Usuario = {
    id: 0,
    nome: '',
    email: '',
    senha: '',
    roles: [] as Roles[], // array de enums
};

function FormularioUsuario() {

    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();
    const {usuario} = useContext(AuthContext);
    const token = usuario.token;
    const [confirmaSenha, setConfirmaSenha] = useState<string>('');

    const [estado, setEstado] = useState({
        isLoading: false,
        usuario: usuarioInicial
    });

    const [validacaoCampos, setValidacaoCampos] = useState({
        nome: null as 'success' | 'failure' | null,
        email: null as 'success' | 'failure' | null,
        senha: null as 'success' | 'failure' | null,
        roles: [] as 'success' | 'failure' | [],
    });

    const authHeaders = {headers: {Authorization: token}};

    useEffect(() => {
        if (!token) {
            ToastAlerta('Você precisa estar logado', Toast.Warning);
        } else {
            carregarDados();
        }
    }, [token, id]);

    useEffect(() => {
        setEstado(prev => ({
            ...prev,
            usuario: {
                ...prev.usuario,
                token
            }
        }));
    }, []);

    async function carregarDados() {
        try {
            if (id) {
                await buscar(`/usuarios/${id}`, (data) => {
                    const usuarioFormatado = {
                        ...data,
                        senha: '',
                        token: usuario.token
                    };

                    setEstado(prev => ({
                        ...prev,
                        usuario: usuarioFormatado
                    }));

                    localStorage.setItem('usuario-logado', JSON.stringify(usuarioFormatado));

                    setValidacaoCampos({
                        nome: usuarioFormatado.nome.length >= 3 ? 'success' : 'failure',
                        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuarioFormatado.email) ? 'success' : 'failure',
                        senha: 'success',
                        roles: usuarioFormatado.roles ? 'success' : 'failure',
                    });
                }, authHeaders);
            }
        } catch (error) {
            ToastAlerta('Erro ao buscar dados iniciais', Toast.Error);
        }
    }

    function atualizarCampo(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        const novoUsuario = {
            ...estado.usuario,
            [name]: name === 'roles' ? [value as Roles] : value,
        };

        setEstado(prev => ({
            ...prev,
            usuario: novoUsuario,
        }));

        switch (name) {
            case 'nome':
                setValidacaoCampos(prev => ({ ...prev, nome: value.length >= 3 ? 'success' : 'failure' }));
                break;
            case 'email':
                setValidacaoCampos(prev => ({ ...prev, email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'success' : 'failure' }));
                break;
            case 'senha':
                setValidacaoCampos(prev => ({ ...prev, senha: value.length >= 8 ? 'success' : 'failure' }));
                break;
            case 'roles':
                setValidacaoCampos(prev => ({ ...prev, roles: value ? 'success' : 'failure' }));
                break;
        }
    }

    function handleUsuarioError(error: any) {
        if (error?.response?.status === 403 || error?.toString().includes('403')) {
            ToastAlerta('Você não tem permissão para essa ação.', Toast.Error);
        } else {
            ToastAlerta('Erro ao cadastrar/atualizar Usuário', Toast.Error);
        }
    }


    async function salvarUsuario() {
        const endpoint = id ? `/usuarios/atualizar` : '/usuarios/cadastrar';
        const metodo = id ? atualizarAtributo : cadastrar;
        const mensagem = id ? 'Usuário atualizado' : 'Usuário cadastrado';

        try {
            await metodo(
                endpoint,
                estado.usuario,
                (data: any) => setEstado(prev => ({
                    ...prev,
                    usuario: {
                        ...data,
                        senha: '',
                        token: usuario.token,
                    },
                })),
                authHeaders
            );
            console.log("Contexto depois de salvar:", usuario);

            ToastAlerta(mensagem, Toast.Success);
            retornar();
        } catch (error: any) {
            handleUsuarioError(error);
        }
    }


    async function gerarNovoUsuario(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        setEstado(prev => ({...prev, isLoading: true}));

        const { nome, email, senha, roles } = validacaoCampos;
        const senhaPreenchida = estado.usuario.senha?.trim().length > 0;

        if (
            nome !== 'success' ||
            email !== 'success' ||
            roles !== 'success' ||
            (id === undefined && senha !== 'success') ||
            (id !== undefined && senhaPreenchida && senha !== 'success')
        ) {
            ToastAlerta('Preencha todos os campos corretamente', Toast.Warning);
            setEstado(prev => ({ ...prev, isLoading: false }));
            return;
        }


        try {
            await salvarUsuario();
        } catch (error: any) {
            handleUsuarioError(error);
        } finally {
            setEstado(prev => ({...prev, isLoading: false}));
        }
    }

    function retornar() {
        const isCadastro = id === undefined;
        const isAdminPadrao = usuario.email === import.meta.env.VITE_ADMIN_EMAIL;
        const isEdicaoProprioUsuario = id !== undefined && Number(id) === usuario.id;

        if (isCadastro || isAdminPadrao) {
            navigate('/usuarios/all');
        } else if (isEdicaoProprioUsuario) {
            navigate('/perfil');
        } else {
            navigate('/usuarios/all');
        }
    }


    function voltarFormulario() {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/perfil');
        }
    }

    const camposValidos = Object.values(validacaoCampos).every(status => status === 'success');

    function handleConfirmarSenha(e: ChangeEvent<HTMLInputElement>) {
        setConfirmaSenha(e.target.value);
    }


    return (
        <>
            <div className="py-30 px-4  min-h-screen">
                <div className="max-w-4xl mx-auto  rounded-2xl shadow-xl p-10">
                    <Button
                        onClick={voltarFormulario}
                        color='light'
                        className="cursor-pointer border-none flex items-center text-sm text-gray-600 dark:text-gray-300 hover:underline hover:text-gray-800 dark:hover:text-white dark:bg-gray-500 dark:hover:bg-gray-600 transition-all"
                    >
                        <HiChevronLeft className="mr-2 h-5 w-5"/>

                        Voltar
                    </Button>

                    <h2 className='text-4xl font-bold text-center text-gray-800 mb-10'>
                        {id === undefined ? 'Cadastrar Usuário' : 'Editar Usuário'}
                    </h2>

                    <form
                        onSubmit={gerarNovoUsuario}
                        className='flex justify-center items-center mx-auto flex-col w-2/3 gap-3 py-10'
                    >

                        <InputField
                            label='Nome do Usuário'
                            name='nome'
                            value={estado.usuario.nome}
                            onChange={atualizarCampo}
                            required
                        />
                        {estado.usuario.nome && validacaoCampos.nome === 'failure' && (
                            <HelperText color="failure">
                                <span className="font-medium">Atenção!</span> CNPJ ou CPF inválido!
                            </HelperText>
                        )}

                        <InputField
                            label='E-mail'
                            name='email'
                            value={estado.usuario.email}
                            onChange={atualizarCampo}
                            required
                        />

                        <SelectField
                            label="Tipo de Usuário"
                            name="roles"
                            value={estado.usuario.roles[0] || ''}
                            options={Role}
                            onChange={atualizarCampo}
                            required
                        />

                        <InputField
                            label={`${id === undefined ? "Senha": "Informe sua senha"}`}
                            name='senha'
                            type='password'
                            value={estado.usuario.senha}
                            onChange={atualizarCampo}
                            required={id === undefined}
                        />

                        <InputField
                            label={`${id === undefined ? "Confirmar Senha": ""}`}
                            name='confirmarSenha'
                            type='password'
                            value={confirmaSenha}
                            onChange={handleConfirmarSenha}
                            required={id === undefined}
                            className={`${id !== undefined ? "hidden": ""}`}
                        />

                        <Button
                            type='submit'
                            disabled={validacaoCampos.nome !== 'success' || estado.isLoading}
                            className='disabled:bg-gray-400 disabled:text-gray-800 cursor-pointer rounded text-gray-100 bg-teal-500 hover:bg-teal-700 w-1/2 py-2 mx-auto flex justify-center dark:bg-teal-600 dark:hover:bg-teal-800 focus:ring-0'
                        >
                            {estado.isLoading
                                ? <Spinner aria-label="Default status example"/>
                                : id !== undefined ? <span>Editar</span> : <span>Cadastrar</span>
                            }
                        </Button>

                    </form>
                </div>
            </div>
        </>
    )
}

export default FormularioUsuario;