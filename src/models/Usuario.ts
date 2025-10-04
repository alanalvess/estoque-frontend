import {Roles} from "../enums/Roles.ts";

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    senha: string;
    roles: Roles[]
}