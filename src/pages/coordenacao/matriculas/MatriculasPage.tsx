import {useContext, useEffect, useState} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {AuthContext} from "../../../contexts/AuthContext.tsx";
import type {Aluno, Disciplina, Matricula, Turma} from "../../../models";
import {buscar, cadastrar, deletar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {RotatingLines} from "react-loader-spinner";

export default function MatriculasPage() {
  const {usuario, isHydrated} = useContext(AuthContext);
  const token = usuario.token;

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);

  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<number | null>(null);
  const [alunoSelecionado, setAlunoSelecionado] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 🔹 Buscar turmas, disciplinas e alunos gerais
  useEffect(() => {
    if (!isHydrated || !token) return;
    buscar("/turmas", setTurmas, {headers: {Authorization: `Bearer ${token}`}});
    buscar("/disciplinas", setDisciplinas, {headers: {Authorization: `Bearer ${token}`}});
    buscar("/alunos", setAlunos, {headers: {Authorization: `Bearer ${token}`}});
  }, [isHydrated, token]);

  // 🔹 Buscar matriculas da turma selecionada
  useEffect(() => {
    if (!turmaSelecionada) return;
    buscar(`/alunos-disciplinas/turma/${turmaSelecionada}`, setMatriculas, {headers: {Authorization: `Bearer ${token}`}});
  }, [turmaSelecionada, token]);

  // 🔹 Filtrar matriculas por disciplina
  const matriculasFiltradas = disciplinaSelecionada
    ? matriculas.filter(m => m.disciplinaId === disciplinaSelecionada)
    : matriculas;

  // 🔹 Matricular aluno
  async function matricularAluno() {
    if (!alunoSelecionado || !turmaSelecionada || !disciplinaSelecionada) return;

    const body = {
      alunoId: alunoSelecionado,
      turmaId: turmaSelecionada,
      disciplinaId: disciplinaSelecionada,
    };

    try {
      await cadastrar("/alunos-disciplinas", body, (novaMatricula: Matricula) => {
        setMatriculas(prev => {
          const existe = prev.some(m =>
            m.alunoId === novaMatricula.alunoId &&
            m.turmaId === novaMatricula.turmaId &&
            m.disciplinaId === novaMatricula.disciplinaId
          );
          if (existe) return prev;
          return [...prev, novaMatricula];
        });
        setAlunoSelecionado(null);
        ToastAlerta("✅ Aluno matriculado", Toast.Success);
      }, {headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"}});
    } catch {
      ToastAlerta("Erro ao matricular aluno", Toast.Error);
    }
  }

  async function excluirMatricula(id: number) {
    try {
      await deletar(`/alunos-disciplinas/${id}`, {headers: {Authorization: `Bearer ${token}`}});
      setMatriculas(prev => prev.filter(m => m.id !== id));
      ToastAlerta("✅ Matrícula removida", Toast.Success);
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao excluir matrícula", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6 pt-28">
      <h1 className="text-2xl font-bold mb-6">Matrículas de Alunos</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select value={turmaSelecionada ?? ""} onChange={e => setTurmaSelecionada(Number(e.target.value))}
                className="border rounded p-2">
          <option value="">Selecione a turma</option>
          {turmas.map(t => <option key={t.id} value={t.id}>{t.nome} ({t.anoLetivo})</option>)}
        </select>

        <select value={disciplinaSelecionada ?? ""} onChange={e => setDisciplinaSelecionada(Number(e.target.value))}
                className="border rounded p-2">
          <option value="">Selecione a disciplina</option>
          {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
        </select>

        <select value={alunoSelecionado ?? ""} onChange={e => setAlunoSelecionado(Number(e.target.value))}
                className="border rounded p-2">
          <option value="">Selecione o aluno</option>
          {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
        </select>

        <Button color="success" onClick={matricularAluno}>
          {isLoading ?
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="24"
              visible={true}
            /> :
            <span>Matricular</span>}
        </Button>
      </div>

      {/* Tabela de matriculados */}
      {matriculasFiltradas.length > 0 && (
        <Table>
          <TableHead>
            <TableHeadCell>Aluno</TableHeadCell>
            <TableHeadCell>Turma</TableHeadCell>
            <TableHeadCell>Disciplina</TableHeadCell>
            <TableHeadCell>Ações</TableHeadCell>
          </TableHead>
          <TableBody>
            {matriculasFiltradas.map((m, i) => (
              <TableRow key={i}>
                <TableCell>{alunos.find(a => a.id === m.alunoId)?.nome || "—"}</TableCell>
                <TableCell>{turmas.find(t => t.id === m.turmaId)?.nome || "—"}</TableCell>
                <TableCell>{disciplinas.find(d => d.id === m.disciplinaId)?.nome || "—"}</TableCell>
                <TableCell>
                  <Button color="danger" size="xs" onClick={() => excluirMatricula(m.id)}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
