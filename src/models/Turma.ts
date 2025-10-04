export interface Turma {
  id: number;
  nome: string;
  anoLetivo: string;
  mediaTurma?: number;
  frequenciaMedia?: number;
  professorIds: number[];
  disciplinaIds: number[];
  alunoIds: number[];
}
