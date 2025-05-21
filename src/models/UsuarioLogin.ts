import {Roles} from '../enums/Roles.ts';

export default interface UsuarioLogin {
    id: number;
    nome: string;
    email: string;
    senha: string;
    token: string;
    roles: Roles[];
}
