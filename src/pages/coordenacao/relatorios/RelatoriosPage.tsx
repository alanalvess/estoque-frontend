import {useContext, useEffect, useState} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {jsPDF} from "jspdf";
import * as XLSX from "xlsx";
import {AuthContext} from "../../../contexts/AuthContext.tsx";
import {buscar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import type {Filtro, Relatorio} from "../../../models";
import {RotatingLines} from "react-loader-spinner";

export default function RelatoriosPage() {
  const {usuario, isHydrated} = useContext(AuthContext);
  const token = usuario.token;

  const [filtros, setFiltros] = useState<Filtro>({
    anoLetivo: new Date().getFullYear().toString(),
    turmaId: null,
    disciplinaId: null,
  });

  const [turmas, setTurmas] = useState<{ id: number; nome: string; anoLetivo: string }[]>([]);
  const [disciplinas, setDisciplinas] = useState<{ id: number; nome: string }[]>([]);
  const [professores, setProfessores] = useState<{ id: number; nome: string }[]>([]);
  const [relatorio, setRelatorio] = useState<Relatorio[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 🔹 Buscar opções de filtro iniciais
  useEffect(() => {
    if (!isHydrated || !token) return;

    buscar("/turmas", setTurmas, {headers: {Authorization: `Bearer ${token}`}});
    buscar("/professores", setProfessores, {headers: {Authorization: `Bearer ${token}`}});
  }, [isHydrated, token]);

  // 🔹 Buscar disciplinas quando seleciona uma turma
  useEffect(() => {
    if (!isHydrated || !token || !filtros.turmaId) {
      setDisciplinas([]);
      return;
    }

    buscar(`/disciplinas/turma/${filtros.turmaId}`, setDisciplinas, {headers: {Authorization: `Bearer ${token}`}});
  }, [filtros.turmaId, token, isHydrated]);

  // 🔹 Gerar relatório PDF ou Excel
  async function gerarRelatorio(tipo: "pdf" | "xlsx") {
    try {
      const query = new URLSearchParams({
        tipo,
        ...(filtros.turmaId ? {turmaId: filtros.turmaId.toString()} : {}),
        ...(filtros.disciplinaId ? {disciplinaId: filtros.disciplinaId.toString()} : {}),
      });

      const response = await fetch(`http://localhost:8080/relatorios?${query.toString()}`, {
        headers: {Authorization: `Bearer ${token}`},
      });

      if (!response.ok) throw new Error("Erro ao gerar relatório");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio.${tipo}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      ToastAlerta("✅ Relatório gerado", Toast.Success);
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao gerar relatório", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // 🔹 Exportar PDF direto da tabela (exemplo alternativo)
  function exportarPDF() {
    const doc = new jsPDF();
    doc.text("Relatório de Alunos", 10, 10);

    relatorio.forEach((item, index) => {
      const y = 20 + index * 10;
      doc.text(
        `${item.alunoNome} | ${item.turma} | ${item.disciplina} || ""} | Nota: ${item.nota} | Freq: ${item.frequencia} | Obs: ${item.observacoes}`,
        10,
        y
      );
    });

    doc.save("relatorio_alunos.pdf");
  }

  // 🔹 Exportar Excel direto da tabela (exemplo alternativo)
  function exportarExcel() {
    const ws = XLSX.utils.json_to_sheet(relatorio);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatorio");
    XLSX.writeFile(wb, "relatorio_alunos.xlsx");
  }

  return (
    <div className="p-6 pt-28">
      <h1 className="text-2xl font-bold mb-6">Relatórios da Coordenação</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Ano Letivo"
          value={filtros.anoLetivo}
          onChange={(e) => setFiltros(prev => ({...prev, anoLetivo: e.target.value}))}
          className="border rounded p-2"
        />
        <select
          value={filtros.turmaId ?? ""}
          onChange={(e) => setFiltros(prev => ({...prev, turmaId: Number(e.target.value) || null}))}
          className="border rounded p-2"
        >
          <option value="">Todas as Turmas</option>
          {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
        </select>
        <select
          value={filtros.disciplinaId ?? ""}
          onChange={(e) => setFiltros(prev => ({...prev, disciplinaId: Number(e.target.value) || null}))}
          className="border rounded p-2"
        >
          <option value="">Todas as Disciplinas</option>
          {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
        </select>
        <Button color="success" onClick={() => gerarRelatorio("pdf")}>
          {isLoading ?
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="24"
              visible={true}
            /> :
            <span>Gerar PDF</span>
          }
          </Button>
        <Button color="info" onClick={() => gerarRelatorio("xlsx")}>
          {isLoading ?
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="24"
              visible={true}
            /> :
            <span>Gerar Excel</span>
          }
          </Button>
      </div>

      {/* Tabela */}
      {relatorio.length > 0 && (
        <Table>
          <TableHead>
            <TableHeadCell>Aluno</TableHeadCell>
            <TableHeadCell>Turma</TableHeadCell>
            <TableHeadCell>Disciplina</TableHeadCell>
            <TableHeadCell>Nota</TableHeadCell>
            <TableHeadCell>Frequência</TableHeadCell>
            <TableHeadCell>Observações</TableHeadCell>
          </TableHead>
          <TableBody>
            {relatorio.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.alunoNome}</TableCell>
                <TableCell>{item.turma}</TableCell>
                <TableCell>{item.disciplina}</TableCell>
                <TableCell>{item.nota}</TableCell>
                <TableCell>{item.frequencia}</TableCell>
                <TableCell>{item.observacoes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}