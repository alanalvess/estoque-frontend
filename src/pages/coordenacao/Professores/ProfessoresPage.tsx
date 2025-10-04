import {useContext, useEffect, useState} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {AuthContext} from "../../../contexts/AuthContext.tsx";
import type {Disciplina, Professor, Turma} from "../../../models";
import {buscar, cadastrar, deletar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {RotatingLines} from "react-loader-spinner";

export default function ProfessoresPage() {
  const {usuario, isHydrated} = useContext(AuthContext);
  const token = usuario.token;

  const [professores, setProfessores] = useState<Professor[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [disciplinaIdsSelecionadas, setDisciplinaIdsSelecionadas] = useState<number[]>([]);
  const [turmaIdsSelecionadas, setTurmaIdsSelecionadas] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 🔹 Buscar dados iniciais
  useEffect(() => {
    if (!isHydrated || !token) return;
    buscar("/professores", setProfessores, {headers: {Authorization: `Bearer ${token}`}});
    buscar("/disciplinas", setDisciplinas, {headers: {Authorization: `Bearer ${token}`}});
    buscar("/turmas", setTurmas, {headers: {Authorization: `Bearer ${token}`}});
  }, [isHydrated, token]);

  // 🔹 Criar professor
  async function salvarProfessor() {
    if (!nome || !email || disciplinaIdsSelecionadas.length === 0) {
      ToastAlerta("⚠️ Nome, e-mail e ao menos uma disciplina são obrigatórios", Toast.Error);
      return;
    }

    const body = {
      nome,
      email,
      disciplinaIds: disciplinaIdsSelecionadas,
      turmaIds: turmaIdsSelecionadas.length > 0 ? turmaIdsSelecionadas : []
    };

    try {
      await cadastrar("/professores", body, (novoProfessor: Professor) => {
        setProfessores(prev => [...prev, novoProfessor]);
        setNome("");
        setEmail("");
        setDisciplinaIdsSelecionadas([]);
        setTurmaIdsSelecionadas([]);
        ToastAlerta("✅ Professor criado com sucesso", Toast.Success);
      }, {
        headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"}
      });
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao criar professor", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // 🔹 Excluir professor
  async function excluirProfessor(id: number) {
    try {
      await deletar(`/professores/${id}`, {headers: {Authorization: `Bearer ${token}`}});
      setProfessores(prev => prev.filter(p => p.id !== id));
      ToastAlerta("✅ Professor excluído", Toast.Success);
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao excluir professor", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // 🔹 Helpers para exibir nomes
  function getDisciplinaNome(id: number) {
    return disciplinas.find(d => d.id === id)?.nome || "N/A";
  }

  function getTurmaNome(id: number) {
    return turmas.find(t => t.id === id)?.nome || "N/A";
  }

  return (
    <div className="p-6 pt-28">
      <h1 className="text-2xl font-bold mb-6">Gestão de Professores</h1>

      {/* Formulário */}
      <div className="flex flex-col gap-2 mb-6">
        <input
          type="text"
          placeholder="Nome do professor"
          value={nome}
          onChange={e => setNome(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="email"
          placeholder="E-mail do professor"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border rounded p-2"
        />

        {/* Seleção de Disciplinas (OBRIGATÓRIO) */}
        <label className="font-semibold mt-2">Disciplinas *</label>
        <select
          multiple
          value={disciplinaIdsSelecionadas.map(String)}
          onChange={e => {
            const values = Array.from(e.target.selectedOptions, opt => Number(opt.value));
            setDisciplinaIdsSelecionadas(values);
          }}
          className="border rounded p-2"
        >
          {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
        </select>

        {/* Seleção de Turmas (OPCIONAL) */}
        <label className="font-semibold mt-2">Turmas (opcional)</label>
        <select
          multiple
          value={turmaIdsSelecionadas.map(String)}
          onChange={e => {
            const values = Array.from(e.target.selectedOptions, opt => Number(opt.value));
            setTurmaIdsSelecionadas(values);
          }}
          className="border rounded p-2"
        >
          {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
        </select>

        <Button color="success" onClick={salvarProfessor}>
          {isLoading ?
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="24"
              visible={true}
            /> :
            <span>Adicionar Professor</span>}
        </Button>
      </div>

      {/* Tabela */}
      {professores.length > 0 && (
        <Table>
          <TableHead>
            <TableHeadCell>Nome</TableHeadCell>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Disciplinas</TableHeadCell>
            <TableHeadCell>Turmas</TableHeadCell>
            <TableHeadCell>Ações</TableHeadCell>
          </TableHead>
          <TableBody>
            {professores.map((professor, i) => (
              <TableRow key={i}>
                <TableCell>{professor.nome}</TableCell>
                <TableCell>{professor.email}</TableCell>
                <TableCell>{professor.disciplinaIds.map(id => getDisciplinaNome(id)).join(", ")}</TableCell>
                <TableCell>{professor.turmaIds.map(id => getTurmaNome(id)).join(", ")}</TableCell>
                <TableCell>
                  <Button color="failure" size="xs" onClick={() => excluirProfessor(professor.id)}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
