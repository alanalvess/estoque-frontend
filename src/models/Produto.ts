import Categoria from './Categoria';
import Fornecedor from './Fornecedor.ts';
import Marca from "./Marca.ts";
import {UnidadesDeMedidas} from "../enums/UnidadesDeMedidas.ts";

export default interface Produto {
    id: number;
    nome: string;
    descricao: string;
    valor: number;
    quantidade: number;
    disponivel: boolean;

    unidadeMedida: UnidadesDeMedidas | null;
    codigo: string;
    estoqueMinimo: number;
    estoqueMaximo: number;
    dataValidade: string;
    dataEntrada: string;
    dataSaida: string;

    categoria: Categoria | null;
    marca: Marca | null;
    fornecedor: Fornecedor | null;
}