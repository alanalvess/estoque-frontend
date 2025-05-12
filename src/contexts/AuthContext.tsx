import {createContext, ReactNode, useEffect, useState} from 'react'

import {Toast, ToastAlerta} from '../utils/ToastAlerta'
import {login} from '../services/Service'

import UsuarioLogin from '../models/UsuarioLogin'

interface AuthContextProps {
    usuario: UsuarioLogin;
    handleLogout(): void;
    handleLogin(usuario: UsuarioLogin): Promise<void>;
    isLoading: boolean;
    isHydrated: boolean;
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
                localStorage.setItem("usuario", JSON.stringify(usuarioRetornado)); // 🔸 Salva o usuário
            });
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
        localStorage.removeItem("usuario"); // 🔸 Remove ao sair
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