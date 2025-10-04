import {Card} from "flowbite-react";

import {Bar, Line, Pie} from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

// Registrar módulos do Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

export default function DashboardProfessorPage() {
  const presencasData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai"],
    datasets: [
      {
        label: "Presenças",
        data: [28, 26, 29, 30, 27],
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
      },
      {
        label: "Faltas",
        data: [2, 4, 1, 0, 3],
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.2)",
      },
    ],
  };

  // 1️⃣ Observações por categoria (Pie)
  const observacoesData = {
    labels: ["Comportamento", "Atraso", "Disciplina", "Destaque"],
    datasets: [
      {
        label: "Observações",
        data: [12, 7, 5, 3],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  // 2️⃣ Média de notas por disciplina (Bar)
  const notasData = {
    labels: ["Matemática", "Português", "História", "Ciências"],
    datasets: [
      {
        label: "Média de Notas",
        data: [7.8, 8.5, 6.9, 7.2],
        backgroundColor: "#36A2EB",
      },
    ],
  };

  // const notasData = {
  //   labels: ["Matemática", "Português", "História", "Ciências"],
  //   datasets: [
  //     {
  //       label: "Média das Notas",
  //       data: [7.5, 8.2, 6.9, 7.8],
  //       backgroundColor: "#3b82f6",
  //     },
  //   ],
  // };


  // 3️⃣ Frequência de presença por aluno (Horizontal Bar)
  const freqData = {
    labels: ["João", "Maria", "Pedro", "Ana", "Lucas"],
    datasets: [
      {
        label: "Frequência (%)",
        data: [95, 87, 92, 78, 88],
        backgroundColor: "#FFCE56",
      },
    ],
  };

  // 4️⃣ Evolução de notas ao longo do tempo (Line)
  const evolucaoData = {
    labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4", "Semana 5"],
    datasets: [
      {
        label: "Média da Turma",
        data: [7.2, 7.5, 7.8, 8.0, 7.9],
        borderColor: "#FF6384",
        backgroundColor: "#FF6384",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-6 pt-28 space-y-6">
      <h1 className="text-2xl font-bold">📊 Dashboard do Professor</h1>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h2 className="text-lg font-semibold">Alunos</h2>
          <p className="text-3xl font-bold text-blue-600">32</p>
          <p className="text-sm text-gray-500">Total na turma</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Média Geral</h2>
          <p className="text-3xl font-bold text-green-600">7.6</p>
          <p className="text-sm text-gray-500">Todas disciplinas</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Observações</h2>
          <p className="text-3xl font-bold text-red-600">25</p>
          <p className="text-sm text-gray-500">No último mês</p>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Card>
          <h2 className="font-bold mb-2">Evolução de Notas ao Longo do Tempo</h2>
          <Line data={evolucaoData}/>
        </Card>

      </div>

      <div className="p-6 pt-28 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-bold mb-2">Observações por Categoria</h2>
          <Pie data={observacoesData}/>
        </Card>

        <Card>
          <h2 className="font-bold mb-2">Média de Notas por Disciplina</h2>
          <Bar data={notasData} options={{indexAxis: "x"}}/>
        </Card>

        <Card>
          <h2 className="font-bold mb-2">Frequência de Presença por Aluno</h2>
          <Bar data={freqData} options={{indexAxis: "y"}}/>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-2">📅 Presenças e Faltas</h2>
          <Line data={presencasData}/>
        </Card>


      </div>
    </div>
  );
}
