import {ChangeEvent, useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import {AuthContext} from '../../../contexts/AuthContext';
import {Toast, ToastAlerta} from '../../../utils/ToastAlerta';
import {atualizar, buscar, cadastrar} from '../../../services/Service';

import Fornecedor from '../../../models/Fornecedor';
import {Button, HelperText, Spinner} from 'flowbite-react';
import InputField from '../../form/InputField.tsx';
import {HiChevronLeft} from "react-icons/hi2";
import {formatarCpfCnpj, formatarTelefone} from "../../../utils/formatters.tsx";
import {validarCNPJ, validarCPF} from "../../../utils/Validators.tsx";

const fornecedorInicial: Fornecedor = {
    id: 0, nome: '', cnpj: '', email: '', telefone: '', endereco: ''
};

function FormularioFornecedor() {

    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();
    const {usuario, handleLogout} = useContext(AuthContext);
    const token = usuario.token;

    const [estado, setEstado] = useState({
        isLoading: false, fornecedor: fornecedorInicial
    });

    const [validacaoCampos, setValidacaoCampos] = useState({
        nome: null as 'success' | 'failure' | null,
        cnpj: null as 'success' | 'failure' | null,
        email: null as 'success' | 'failure' | null,
        telefone: null as 'success' | 'failure' | null,
        endereco: null as 'success' | 'failure' | null,
    });

    const authHeaders = {headers: {Authorization: token}};

    useEffect(() => {
        if (!token) {
            ToastAlerta('Você precisa estar logado', Toast.Warning);
            navigate('/login');
        } else {
            carregarDados();
        }
    }, [token, id]);

    useEffect(() => {
        setEstado(prev => ({
            ...prev, fornecedor: {
                ...prev.fornecedor
            }
        }));
    }, []);

    async function carregarDados() {
        try {
            if (id) {
                await buscar(`/fornecedores/${id}`, (data) => {
                    const fornecedorFormatado = {
                        ...data, cnpj: formatarCpfCnpj(data.cnpj), telefone: formatarTelefone(data.telefone)
                    };

                    const apenasNumeros = fornecedorFormatado.cnpj.replace(/\D/g, '');
                    const ehCpf = apenasNumeros.length === 11;
                    const documentoValido = ehCpf ? validarCPF(apenasNumeros) : validarCNPJ(apenasNumeros);

                    setEstado(prev => ({
                        ...prev, fornecedor: fornecedorFormatado
                    }));

                    setValidacaoCampos({
                        nome: fornecedorFormatado.nome.length >= 3 ? 'success' : 'failure',
                        cnpj: documentoValido ? 'success' : 'failure',
                        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fornecedorFormatado.email) ? 'success' : 'failure',
                        telefone: fornecedorFormatado.telefone.replace(/\D/g, '').length >= 11 ? 'success' : 'failure',
                        endereco: fornecedorFormatado.endereco.length >= 5 ? 'success' : 'failure',
                    });
                }, authHeaders);
            }
        } catch (error) {
            ToastAlerta('Erro ao buscar dados iniciais', Toast.Error);
        }
    }

    function atualizarCampo(e: ChangeEvent<HTMLInputElement>) {
        const {name, value} = e.target;
        let novoValor = value;

        if (name === 'cnpj') {
            novoValor = formatarCpfCnpj(value);
        } else if (name === 'telefone') {
            novoValor = formatarTelefone(value);
        }
        setEstado(prev => ({
            ...prev, fornecedor: {
                ...prev.fornecedor, [name]: novoValor
            }
        }));

        switch (name) {
            case 'nome':
                setValidacaoCampos(prev => ({
                    ...prev, nome: value.length >= 3 ? 'success' : 'failure'
                }));
                break;

            case 'email':
                setValidacaoCampos(prev => ({
                    ...prev, email: value ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'success' : 'failure') : null
                }));
                break;

            case 'telefone':
                setValidacaoCampos(prev => ({
                    ...prev, telefone: value ? (value.replace(/\D/g, '').length >= 11 ? 'success' : 'failure') : null
                }));
                break;

            case 'cnpj':
                const apenasNumeros = value.replace(/\D/g, '');
                const ehCpf = apenasNumeros.length === 11;
                const valido = ehCpf ? validarCPF(apenasNumeros) : validarCNPJ(apenasNumeros);
                setValidacaoCampos(prev => ({
                    ...prev, cnpj: value ? (valido ? 'success' : 'failure') : null
                }));
                break;

            case 'endereco':
                setValidacaoCampos(prev => ({
                    ...prev, endereco: value ? (value.length >= 5 ? 'success' : 'failure') : null
                }));
                break;
        }
    }

    function handleFornecedorError(error: any) {
        if (error.toString().includes('403')) {
            ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
            handleLogout();
        } else {
            ToastAlerta('Erro ao cadastrar/atualizar o Fornecedor', Toast.Error);
        }
    }

    async function salvarFornecedor() {
        const endpoint = id ? `/fornecedores/${id}` : '/fornecedores/cadastrar';
        const metodo = id ? atualizar : cadastrar;
        const mensagem = id ? 'Fornecedor atualizado' : 'Fornecedor cadastrado';

        const fornecedorLimpo = {
            ...estado.fornecedor,
            cnpj: estado.fornecedor.cnpj.replace(/\D/g, ''),
            telefone: estado.fornecedor.telefone.replace(/\D/g, ''),
        };

        try {
            await metodo(endpoint, fornecedorLimpo, (data: any) => setEstado(prev => ({
                ...prev,
                fornecedor: data
            })), authHeaders);

            ToastAlerta(mensagem, Toast.Success);
            retornar();
        } catch (error: any) {
            handleFornecedorError(error);
        }
    }

    async function gerarNovoFornecedor(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        setEstado(prev => ({...prev, isLoading: true}));

        if (validacaoCampos.nome !== 'success') {
            ToastAlerta('O campo nome é obrigatório e deve ter ao menos 3 caracteres', Toast.Warning);
            setEstado(prev => ({...prev, isLoading: false}));
            return;
        }

        try {
            await salvarFornecedor();
        } catch (error: any) {
            handleFornecedorError(error);
        } finally {
            setEstado(prev => ({...prev, isLoading: false}));
        }
    }

    function retornar() {
        navigate('/fornecedores/all');
    }

    function voltarFormulario() {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/categorias/all'); // ou qualquer rota padrão
        }
    }

    const camposValidos = Object.values(validacaoCampos).every((status) => status === 'success');

    return (<>
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
                    {id === undefined ? 'Cadastrar Fornecedor' : 'Editar Fornecedor'}
                </h2>

                <form
                    onSubmit={gerarNovoFornecedor}
                    className='flex justify-center items-center mx-auto flex-col w-2/3 gap-3 py-10'
                >

                    <InputField
                        label='Nome do Fornecedor'
                        name='nome'
                        value={estado.fornecedor.nome}
                        onChange={atualizarCampo}
                        required
                    />
                    {estado.fornecedor.nome && validacaoCampos.nome === 'failure' && (
                        <HelperText color="failure">
                            <span className="font-medium">Atenção!</span> CNPJ ou CPF inválido!
                        </HelperText>
                    )}

                    <InputField
                        label='CPF ou CNPJ do Fornecedor'
                        name="cnpj"
                        value={estado.fornecedor.cnpj}
                        onChange={atualizarCampo}
                    />
                    {estado.fornecedor.cnpj && validacaoCampos.cnpj === 'failure' && (
                        <HelperText color="failure">
                            <span className="font-medium">Atenção!</span> CNPJ ou CPF inválido!
                        </HelperText>
                    )}

                    <InputField
                        label='E-mail do Fornecedor'
                        name='email'
                        type='email'
                        value={estado.fornecedor.email}
                        onChange={atualizarCampo}
                    />
                    {estado.fornecedor.email && validacaoCampos.email === 'failure' && (
                        <HelperText color="failure">
                            <span className="font-medium">Atenção!</span> E-Mail inválido!
                        </HelperText>
                    )}

                    <InputField
                        label='Telefone do Fornecedor'
                        name='telefone'
                        value={estado.fornecedor.telefone}
                        onChange={atualizarCampo}
                    />
                    {estado.fornecedor.telefone && validacaoCampos.telefone === 'failure' && (
                        <HelperText color="failure">
                            <span className="font-medium">Atenção!</span> Telefone inválido!
                        </HelperText>
                    )}

                    <InputField
                        label='Endereço do Fornecedor'
                        name='endereco'
                        value={estado.fornecedor.endereco}
                        onChange={atualizarCampo}
                    />
                    {estado.fornecedor.endereco && validacaoCampos.endereco === 'failure' && (
                        <HelperText color="failure">
                            <span className="font-medium">Atenção!</span> Telefone inválido!
                        </HelperText>
                    )}

                    <Button
                        disabled={validacaoCampos.nome !== 'success' || estado.isLoading}
                        className='disabled:bg-gray-400 disabled:text-gray-800 cursor-pointer rounded text-gray-100 bg-teal-500 hover:bg-teal-700 w-1/2 py-2 mx-auto flex justify-center dark:bg-teal-600 dark:hover:bg-teal-800 focus:ring-0'

                        type='submit'
                    >
                        {estado.isLoading ? <Spinner aria-label="Default status example"/> : id !== undefined ?
                            <span>Editar</span> : <span>Cadastrar</span>}
                    </Button>
                </form>
            </div>
        </div>
    </>)
}

export default FormularioFornecedor;