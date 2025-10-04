import {type ChangeEvent, useContext, useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Button, Spinner} from "flowbite-react";

import {AuthContext} from "../../../contexts/AuthContext";
import {atualizar, buscar} from "../../../services/Service";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta";
import type {Usuario} from "../../../models"

import InputField from "../../../components/form/InputField.tsx";

function EditarUsuario() {
    const navigate = useNavigate();

    const [perfil, setPerfil] = useState<Usuario>({} as Usuario);
    const [isLoading, setIsLoading] = useState(false);

    const {id} = useParams<{ id: string }>();

    const {usuario, handleLogout} = useContext(AuthContext);
    const token = usuario.token;

    async function buscarPorId(id: string) {
        await buscar(`/usuarios/${id}`, (data) => {
            setPerfil({...data, senha: ''});
        }, {
            headers: {
                Authorization: token,
            },
        })
    }

    async function editarPerfil(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        if (id !== undefined) {
            try {
                await atualizar(`/usuarios/atualizar`, perfil, setPerfil, {
                    headers: {
                        Authorization: token,
                    },
                })

                ToastAlerta('Usuario atualizado com sucesso', Toast.Success);
                retornar();

            } catch (error) {
                if (error.toString().includes("403")) {
                    ToastAlerta('O token expirou, favor logar novamente', Toast.Info);
                    handleLogout();

                } else {
                    ToastAlerta('Erro ao atualizar o usuario', Toast.Warning);
                }

                setIsLoading(false);
            }
        } else {
            ToastAlerta('Id indefinido', Toast.Info);
        }

        retornar();
    }

    function retornar() {
        navigate("/perfil");
    }

    useEffect(() => {
        if (id !== undefined) {
            buscarPorId(id);
        }
    }, [id])

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setPerfil({
            ...perfil,
            [e.target.name]: e.target.value,
        })
    }

    useEffect(() => {
        if (token === "") {
            ToastAlerta("Você precisa estar logado", Toast.Info);
            navigate("/login");
        }
    }, [token])

    return (
        <>
            <div className="justify-center lg:py-14">
                <div className='my-2'>
                    <Link to="/perfil" className='hover:underline m-[10vw] lg:m-[30vw] dark:text-cinza-100 my-6'>
                        Voltar
                    </Link>
                </div>

                <div
                    className="flex justify-center mx-[10vw] lg:mx-[30vw] shadow-xl dark:shadow-lg shadow-cinza-300 dark:shadow-preto-600 bg-cinza-100 dark:bg-preto-300 py-[3vh] lg:py-[10vh] rounded-2xl font-bold">

                    <form className="flex max-w-md flex-col gap-4 w-[80%]" onSubmit={editarPerfil}>
                        <h2 className="text-slate-900 dark:text-cinza-100 my-4 text-center text-2xl lg:text-4xl">
                            Editar Perfil
                        </h2>

                        <div>
                            <InputField
                                label='Nome'
                                name='nome'
                                required
                                value={perfil.nome}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                            />

                        </div>

                        <div>
                            <InputField
                                label='Email'
                                name='email'
                                required
                                value={perfil.email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                            />
                        </div>

                        <div>
                            <InputField
                                label='Senha'
                                name='senha'
                                required
                                value={perfil.senha}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    atualizarEstado(e)
                                }/>
                        </div>

                        <Button type="submit" className="bg-rosa-200">
                            {isLoading
                                ? <Spinner aria-label="Default status example"/>
                                : <span>Editar</span>
                            }
                        </Button>
                    </form>

                </div>
            </div>
        </>
    )
}

export default EditarUsuario;

