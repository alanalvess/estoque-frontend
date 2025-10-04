import {useContext, useEffect, useState} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {AuthContext} from "../../../contexts/AuthContext.tsx";
import type {Aluno, Turma} from "../../../models";
import {buscar, cadastrar, deletar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {RotatingLines} from "react-loader-spinner";

export default function AlunosPage() {
  const {usuario, isHydrated} = useContext(AuthContext);
  const token = usuario.token;

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);

  // Formulário
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [turmaId, setTurmaId] = useState<number | "">("");

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 🔹 Buscar alunos e turmas
  useEffect(() => {
    if (!isHydrated || !token) return;
    buscar("/alunos", setAlunos, {headers: {Authorization: `Bearer ${token}`}});
    buscar("/turmas", setTurmas, {headers: {Authorization: `Bearer ${token}`}});
  }, [isHydrated, token]);

  // 🔹 Criar aluno
  async function salvarAluno() {
    if (!nome || !matricula || !dataNascimento || !turmaId) {
      ToastAlerta("⚠️ Nome, matrícula, data de nascimento e turma são obrigatórios", Toast.Error);
      return;
    }

    const body = {
      nome,
      matricula,
      dataNascimento,
      turmaId
    };

    try {
      await cadastrar("/alunos", body, (novoAluno: Aluno) => {
        setAlunos(prev => [...prev, novoAluno]);
        setNome("");
        setMatricula("");
        setDataNascimento("");
        setTurmaId("");
        ToastAlerta("✅ Aluno cadastrado com sucesso", Toast.Success);
      }, {
        headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"}
      });
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao criar aluno", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // 🔹 Excluir aluno
  async function excluirAluno(id: number) {
    try {
      await deletar(`/alunos/${id}`, {headers: {Authorization: `Bearer ${token}`}});
      setAlunos(prev => prev.filter(a => a.id !== id));
      ToastAlerta("✅ Aluno excluído", Toast.Success);
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao excluir aluno", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // 🔹 Helper para nome da turma
  function getTurmaNome(id: number) {
    return turmas.find(t => t.id === id)?.nome || "N/A";
  }

  return (
    <div className="p-6 pt-28">
      <h1 className="text-2xl font-bold mb-6">Gestão de Alunos</h1>

      {/* Formulário */}
      <div className="flex flex-col gap-2 mb-6">
        <input
          type="text"
          placeholder="Nome do aluno"
          value={nome}
          onChange={e => setNome(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Matrícula"
          value={matricula}
          onChange={e => setMatricula(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="date"
          value={dataNascimento}
          onChange={e => setDataNascimento(e.target.value)}
          className="border rounded p-2"
        />

        <select
          value={turmaId}
          onChange={e => setTurmaId(Number(e.target.value))}
          className="border rounded p-2"
        >
          <option value="">Selecione a turma</option>
          {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
        </select>

        <Button color="success" onClick={salvarAluno}>
          {isLoading ?
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="24"
              visible={true}
            /> :
            <span>Adicionar Aluno</span>}
        </Button>
      </div>

      {/* Tabela */}
      {alunos.length > 0 && (
        <Table>
          <TableHead>
            <TableHeadCell>Nome</TableHeadCell>
            <TableHeadCell>Matrícula</TableHeadCell>
            <TableHeadCell>Data de Nascimento</TableHeadCell>
            <TableHeadCell>Turma</TableHeadCell>
            <TableHeadCell>Ações</TableHeadCell>
          </TableHead>
          <TableBody>
            {alunos.map((aluno, i) => (
              <TableRow key={i}>
                <TableCell>{aluno.nome}</TableCell>
                <TableCell>{aluno.matricula}</TableCell>
                <TableCell>{new Date(aluno.dataNascimento).toLocaleDateString()}</TableCell>
                <TableCell>{getTurmaNome(aluno.turmaId)}</TableCell>
                <TableCell>
                  <Button color="failure" size="xs" onClick={() => excluirAluno(aluno.id)}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
