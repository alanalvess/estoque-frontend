import Categoria from './Categoria';
import Fornecedor from './Fornecedor.ts';
import Marca from "./Marca.ts";

export enum UnidadeMedida {
    UNIDADE = 'UNIDADE',
    DUZIA = 'DUZIA',
    QUILOGRAMA = 'QUILOGRAMA',
    GRAMA = 'GRAMA',
    MILIGRAMA = 'MILIGRAMA',
    LITRO = 'LITRO',
    MILILITRO = 'MILILITRO',
    PACOTE = 'PACOTE',
    CAIXA = 'CAIXA',
    FRASCO = 'FRASCO',
    GARRAFA = 'GARRAFA',
    LATA = 'LATA',
    SACHE = 'SACHE',
    ROLO = 'ROLO',
    PAR = 'PAR',
    KIT = 'KIT',
    FARDO = 'FARDO',
    OUTROS = 'OUTROS'
}

export default interface Produto {
    id: number;
    nome: string;
    descricao: string;
    valor: number;
    quantidade: number;
    disponivel: boolean;

    unidadeMedida: UnidadeMedida | null;
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