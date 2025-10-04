export interface Nota {
  id: number;
  alunoId: number;
  alunoNome: string;
  disciplinaId: number;
  valor: number;
  observacao?: string;
}
