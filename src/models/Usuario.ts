import {Roles} from "../enums/Roles.ts";

export default interface Usuario {
    id: number;
    nome: string;
    email: string;
    senha: string;
    roles: Roles[]
}