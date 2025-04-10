import {Role} from './Role.ts';

export default interface UsuarioLogin {
    id: number;
    nome: string;
    email: string;
    senha: string;
    token: string;
    roles: Role[];
}

