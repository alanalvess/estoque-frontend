import { useContext, useEffect, useState } from "react";
import { Button, Table, TableHead, TableHeadCell, TableRow, TableBody, TableCell } from "flowbite-react";
import {AuthContext} from "../../../contexts/AuthContext.tsx";
import type {Avaliacao, Disciplina, Turma} from "../../../models";
import {buscar, cadastrar, deletar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";

export default function AvaliacoesPage() {
  const { usuario, isHydrated } = useContext(AuthContext);
  const token = usuario.token;

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);

  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<number | null>(null);

  // Formulário para nova avaliação
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [peso, setPeso] = useState(1);

  // 🔹 Buscar turmas
  useEffect(() => {
    if (isHydrated && token) {
      buscar("/turmas", setTurmas, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  }, [token, isHydrated]);

  // 🔹 Buscar disciplinas da turmas
  useEffect(() => {
    if (turmaSelecionada && token) {
      buscar(`/disciplinas/turma/${turmaSelecionada}`, setDisciplinas, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  }, [turmaSelecionada, token]);

  // 🔹 Buscar avaliações da disciplina
  useEffect(() => {
    if (disciplinaSelecionada && token) {
      buscar(`/avaliacoes/disciplina/${disciplinaSelecionada}`, setAvaliacoes, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  }, [disciplinaSelecionada, token]);

  // Criar avaliação
  async function salvarAvaliacao() {
    if (!disciplinaSelecionada || !turmaSelecionada) {
      ToastAlerta("Selecione uma turmas e disciplina", Toast.Error);
      return;
    }

    const body = {
      titulo,
      data,
      peso,
      turmaId: turmaSelecionada,
      disciplinaId: disciplinaSelecionada,
    };

    try {
      await cadastrar("/avaliacoes", body, () => {}, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      ToastAlerta("✅ Avaliação cadastrada", Toast.Success);
      setTitulo("");
      setData("");
      setPeso(1);
      buscar(`/avaliacoes/disciplina/${disciplinaSelecionada}`, setAvaliacoes, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      ToastAlerta("Erro ao salvar avaliação", Toast.Error);
    }
  }

  async function excluirAvaliacao(id: number) {
    try {
      await deletar(`/avaliacoes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      ToastAlerta("🗑️ Avaliação excluída", Toast.Success);
      setAvaliacoes((prev) => prev.filter((a) => a.id !== id));
    } catch {
      ToastAlerta("Erro ao excluir avaliação", Toast.Error);
    }
  }

  return (
    <div className="p-6 pt-28">
      <h1 className="text-2xl font-bold mb-6">Avaliações</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border rounded p-2 flex-1"
          value={turmaSelecionada ?? ""}
          onChange={(e) => setTurmaSelecionada(Number(e.target.value))}
        >
          <option value="">Selecione a turma</option>
          {turmas.map((turma) => (
            <option key={turma.id} value={turma.id}>
              {turma.nome} ({turma.anoLetivo})
            </option>
          ))}
        </select>

        <select
          className="border rounded p-2 flex-1"
          value={disciplinaSelecionada ?? ""}
          onChange={(e) => setDisciplinaSelecionada(Number(e.target.value))}
        >
          <option value="">Selecione a disciplina</option>
          {disciplinas.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Formulário de Avaliação */}
      {disciplinaSelecionada && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Título"
            className="border rounded p-2 flex-1"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <input
            type="date"
            className="border rounded p-2"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
          <input
            type="number"
            className="border rounded p-2 w-24"
            value={peso}
            onChange={(e) => setPeso(Number(e.target.value))}
            min={1}
          />
          <Button color="success" onClick={salvarAvaliacao}>
            Salvar Avaliação
          </Button>
        </div>
      )}

      {/* Lista de Avaliações */}
      {avaliacoes.length > 0 && (
        <Table>
          <TableHead>
            <TableHeadCell>Título</TableHeadCell>
            <TableHeadCell>Data</TableHeadCell>
            <TableHeadCell>Peso</TableHeadCell>
            <TableHeadCell>Média</TableHeadCell>
            <TableHeadCell>Ações</TableHeadCell>
          </TableHead>
          <TableBody>
            {avaliacoes.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.titulo}</TableCell>
                <TableCell>{a.data}</TableCell>
                <TableCell>{a.peso}</TableCell>
                <TableCell>{a.media?.toFixed(2)}</TableCell>
                <TableCell>
                  <Button size="xs" color="failure" onClick={() => excluirAvaliacao(a.id)}>
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

