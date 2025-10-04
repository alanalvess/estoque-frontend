export interface Presenca {
  id: number;
  data: string;
  presente: boolean;
  alunoId: number;
  alunoNome: string;
  turmaId: number;
  metodoChamada: 'MANUAL' | 'QRCODE';
}
