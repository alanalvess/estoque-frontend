import {createContext, type ReactNode, useEffect, useState} from 'react'

import {Toast, ToastAlerta} from '../utils/ToastAlerta'
import {login} from '../services/Service'
import type {UsuarioLogin} from "../models";

interface AuthContextProps {
    usuario: UsuarioLogin;
    isLoading: boolean;
    isHydrated: boolean;

    handleLogout(): void;

    handleLogin(usuario: UsuarioLogin): Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps)

export function AuthProvider({children}: AuthProviderProps) {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isHydrated, setIsHydrated] = useState<boolean>(false);

    const [usuario, setUsuario] = useState<UsuarioLogin>({
        id: 0,
        nome: '',
        email: '',
        senha: '',
        token: '',
        roles: []
    });

    async function handleLogin(userLogin: UsuarioLogin) {
        setIsLoading(true);

        try {
            await login(`/usuarios/logar`, userLogin, (usuarioRetornado) => {
                setUsuario(usuarioRetornado);
                localStorage.setItem("usuario", JSON.stringify(usuarioRetornado));
            });
            ToastAlerta('Seja bem-vindo!', Toast.Success);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 404) {
                ToastAlerta('Usuário ou senha inválidos', Toast.Warning);
            } else {
                ToastAlerta('Erro inesperado ao tentar fazer login', Toast.Error);
                console.error('Erro no login:', error);
            }
        } finally {
            setIsLoading(false);
        }
    }

    function handleLogout() {
        setUsuario({
            id: 0,
            nome: '',
            email: '',
            senha: '',
            token: '',
            roles: []
        });
        localStorage.removeItem("usuario");
    }

    useEffect(() => {
        const usuarioSalvo = localStorage.getItem("usuario");
        if (usuarioSalvo) {
            setUsuario(JSON.parse(usuarioSalvo));
        }
        setIsHydrated(true); // agora sabemos que carregou (com ou sem usuário)
    }, []);

    return (
        <AuthContext.Provider
            value={{
                usuario,
                handleLogin,
                handleLogout,
                isLoading,
                isHydrated,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
