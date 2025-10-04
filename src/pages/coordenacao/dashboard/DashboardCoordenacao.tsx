import { useEffect, useState, useContext } from "react";

import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from "chart.js";
import {AuthContext} from "../../../contexts/AuthContext.tsx";
import {buscar} from "../../../services/Service.ts";
import {Card} from "flowbite-react";
import type {Aluno, Disciplina, Observacao, Professor, Turma} from "../../../models";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function DashboardCoordenacaoPage() {
  const { usuario, isHydrated } = useContext(AuthContext);
  const token = usuario.token;

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [observacoes, setObservacoes] = useState<Observacao[]>([]);

  useEffect(() => {
    if (!isHydrated || !token) return;
    buscar("/turmas", setTurmas, { headers: { Authorization: `Bearer ${token}` } });
    buscar("/professores", setProfessores, { headers: { Authorization: `Bearer ${token}` } });
    buscar("/alunos", setAlunos, { headers: { Authorization: `Bearer ${token}` } });
    buscar("/disciplinas", setDisciplinas, { headers: { Authorization: `Bearer ${token}` } });
    buscar("/observacoes", setObservacoes, { headers: { Authorization: `Bearer ${token}` } });
  }, [isHydrated, token]);

  // 🔹 Alunos por turma
  const alunosPorTurma = turmas.map(t => ({
    turma: t.nome,
    count: alunos.filter(a => a.turmaId === t.id).length
  }));
  const dataAlunosPorTurma = {
    labels: alunosPorTurma.map(a => a.turma),
    datasets: [{ label: "Alunos por Turma", data: alunosPorTurma.map(a => a.count), backgroundColor: "rgba(54, 162, 235, 0.6)" }]
  };

  // 🔹 Disciplinas por turma
  const disciplinasPorTurma = turmas.map(t => ({
    turma: t.nome,
    count: disciplinas.filter(disciplina => disciplina.id === t.id).length
  }));
  const dataDisciplinasPorTurma = {
    labels: disciplinasPorTurma.map(d => d.turma),
    datasets: [{ label: "Disciplinas por Turma", data: disciplinasPorTurma.map(d => d.count), backgroundColor: "rgba(255, 206, 86, 0.6)" }]
  };

  // 🔹 Professores por turma
  const professoresPorTurma = turmas.map(t => ({
    turma: t.nome,
    count: professores.filter(professor => professor.turmaIds.includes(t.id)).length
  }));
  const dataProfessoresPorTurma = {
    labels: professoresPorTurma.map(p => p.turma),
    datasets: [{ label: "Professores por Turma", data: professoresPorTurma.map(p => p.count), backgroundColor: "rgba(75, 192, 192, 0.6)" }]
  };

  // 🔹 Observações por categoria
  const categoriasCount: Record<string, number> = {};
  observacoes.forEach(o => {
    categoriasCount[o.categoria] = (categoriasCount[o.categoria] || 0) + 1;
  });
  const dataObservacoes = {
    labels: Object.keys(categoriasCount),
    datasets: [{ data: Object.values(categoriasCount), backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"] }]
  };

  return (
    <div className="p-6 pt-28">
      <h1 className="text-2xl font-bold mb-6">Dashboard da Coordenação</h1>

      {/* Indicadores principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-4 border rounded shadow"><h2>Total de Turmas</h2><p className="font-bold text-xl">{turmas.length}</p></div>
        <div className="p-4 border rounded shadow"><h2>Total de Professores</h2><p className="font-bold text-xl">{professores.length}</p></div>
        <div className="p-4 border rounded shadow"><h2>Total de Alunos</h2><p className="font-bold text-xl">{alunos.length}</p></div>
        <div className="p-4 border rounded shadow"><h2>Total de Disciplinas</h2><p className="font-bold text-xl">{disciplinas.length}</p></div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <h2 className="font-bold mb-2">Alunos por Turma</h2>
          <Bar data={dataAlunosPorTurma} />
        </Card>
        <Card>
          <h2 className="font-bold mb-2">Disciplinas por Turma</h2>
          <Bar data={dataDisciplinasPorTurma} />
        </Card>
        <Card>
          <h2 className="font-bold mb-2">Professores por Turma</h2>
          <Bar data={dataProfessoresPorTurma} />
        </Card>
        <Card>
          <h2 className="font-bold mb-2">Observações por Categoria</h2>
          <Pie data={dataObservacoes} />
        </Card>
      </div>
    </div>
  );
}
