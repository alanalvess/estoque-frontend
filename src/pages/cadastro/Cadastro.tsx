import {type ChangeEvent, type FormEvent, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Label, TextInput} from "flowbite-react";

import type {Usuario} from "../../models";
import {cadastrarUsuario} from "../../services/Service.ts";
import {Toast, ToastAlerta} from "../../utils/ToastAlerta.ts";

import {RotatingLines} from "react-loader-spinner";
import {Roles} from "../../enums/Roles.ts";

function Cadastro() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [confirmarSenha, setConfirmarSenha] = useState<string>("");

  const [usuario, setUsuario] = useState<Usuario>({
    id: 0,
    nome: "",
    email: "",
    senha: "",
    roles: [] as Roles[],
  })

  async function cadastrarNovoUsuario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (confirmarSenha === usuario.senha && usuario.senha.length >= 8) {
      setIsLoading(true);

      try {
        await cadastrarUsuario(`/usuarios/cadastrar`, usuario, setUsuario);
        ToastAlerta("Usuário cadastrado com sucesso", Toast.Success);
      } catch (error) {
        if (error instanceof Error) {
          ToastAlerta("Erro ao cadastrar usuário", Toast.Error);
        }
      } finally {
        setIsLoading(false);
      }

    } else {
      ToastAlerta("Dados inconsistentes. Verifique as informações de cadastro.", Toast.Warning);
      setUsuario({...usuario, senha: ""});
      setConfirmarSenha("");
    }

    setIsLoading(false);
  }

  function retornar() {
    navigate("/login");
  }

  function handleConfirmarSenha(e: ChangeEvent<HTMLInputElement>) {
    setConfirmarSenha(e.target.value);
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const {name, value} = e.target;

    if (name === "roles") {
      setUsuario({...usuario, roles: [value as Roles]});
    } else {
      setUsuario({...usuario, [name]: value});
    }
  }

  useEffect(() => {
    if (usuario.id !== 0) {
      retornar();
    }
  }, [usuario])

  return (
    <>
      <div className='justify-center lg:py-14 pt-28'>
        <div
          className="flex justify-center mx-[10vw] lg:mx-[30vw] shadow-xl shadow-cinza-300 dark:shadow-preto-600 bg-cinza-100 dark:bg-preto-300 py-[3vh] lg:py-[10vh] rounded-2xl font-bold">
          <form className="flex w-[80%] flex-col gap-4" onSubmit={cadastrarNovoUsuario}>
            <h2 className="text-slate-900 dark:text-cinza-100 my-4 text-center text-4xl">
              Cadastro
            </h2>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="nome"/>
              </div>

              <TextInput
                id="nome"
                name="nome"
                type="text"
                autoComplete="nome"
                placeholder="Nome"
                required
                value={usuario.nome}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  atualizarEstado(e)
                }
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="email"/>
              </div>

              <TextInput
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="email@email.com"
                required
                value={usuario.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  atualizarEstado(e)
                }
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="senha"/>
              </div>

              <TextInput
                id="senha"
                name="senha"
                type="password"
                autoComplete="senha"
                placeholder="senha"
                required
                value={usuario.senha}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  atualizarEstado(e)
                }
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="confirmarSenha"/>
              </div>

              <TextInput
                id="confirmarSenha"
                name="confirmarSenha"
                placeholder="confirmarSenha"
                type="password"
                required
                value={confirmarSenha}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleConfirmarSenha(e)
                }
              />
            </div>

            {/* Tipo de Usuário */}
            <div>
              <Label htmlFor="roles"/>
              <select
                id="roles"
                name="roles"
                value={usuario.roles[0] || ""}
                onChange={atualizarEstado}
                className="border rounded p-2 w-full"
                required
              >
                <option value="">Selecione o tipo</option>
                {Object.values(Roles).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" className='bg-rosa-200 mt-6'>
              {isLoading ?
                <RotatingLines
                  strokeColor="white"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="24"
                  visible={true}
                /> :
                <span>Cadastrar</span>}
            </Button>

            <hr className="border-cinza-200 w-full"/>
          </form>
        </div>
      </div>
    </>
  )
}

export default Cadastro;
