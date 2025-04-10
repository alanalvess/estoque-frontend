import {createContext, ReactNode, useState} from 'react'

import {Toast, ToastAlerta} from '../utils/ToastAlerta'
import {login} from '../services/Service'

import UsuarioLogin from '../models/UsuarioLogin'

// import Produto from '../models/Produto'

interface AuthContextProps {
    usuario: UsuarioLogin;

    handleLogout(): void;

    handleLogin(usuario: UsuarioLogin): Promise<void>;

    isLoading: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps)

export function AuthProvider({children}: AuthProviderProps) {

    const [isLoading, setIsLoading] = useState<boolean>(false);

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
            await login(`/usuarios/logar`, userLogin, setUsuario);
            ToastAlerta('Seja bem-vindo!', Toast.Success);
        } catch (error: any) {
            ToastAlerta('Usuário ou senha não encontrado', Toast.Warning);
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
    }

    return (
        <AuthContext.Provider
            value={{
                usuario,
                handleLogin,
                handleLogout,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}