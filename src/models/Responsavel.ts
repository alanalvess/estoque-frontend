export interface Responsavel {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  alunoIds: number[];
}
