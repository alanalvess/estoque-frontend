export interface Matricula {
  id: number;
  alunoId: number;
  alunoNome: string;
  disciplinaId: number;
  disciplinaNome: string;
  turmaId: number;
  turmaNome: string;
  notaFinal?: number;
  frequencia?: number;
  observacoes?: string;
}