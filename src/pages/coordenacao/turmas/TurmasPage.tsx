import React, {useContext, useEffect, useState} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {AuthContext} from "../../../contexts/AuthContext.tsx";
import {buscar, cadastrar, deletar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import type {Disciplina, Professor, Turma} from "../../../models";
import {RotatingLines} from "react-loader-spinner";

export default function TurmasPage() {
  const {usuario, isHydrated} = useContext(AuthContext);
  const token = usuario.token;

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);

  const [nome, setNome] = useState("");
  const [anoLetivo, setAnoLetivo] = useState(new Date().getFullYear().toString());
  const [professorIdsSelecionados, setProfessorIdsSelecionados] = useState<number[]>([]);
  const [disciplinaIdsSelecionadas, setDisciplinaIdsSelecionadas] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Buscar turmas
  useEffect(() => {
    if (!isHydrated || !token) return;
    buscar("/turmas", setTurmas, {headers: {Authorization: `Bearer ${token}`}});
    buscar("/professores", setProfessores, {headers: {Authorization: `Bearer ${token}`}});
    buscar("/disciplinas", setDisciplinas, {headers: {Authorization: `Bearer ${token}`}});
  }, [isHydrated, token]);

  // 🔹 Criar nova turmas
  async function salvarTurma() {
    if (!nome || !anoLetivo) return;

    const body = {
      nome,
      anoLetivo,
      professorIds: professorIdsSelecionados,
      disciplinaIds: disciplinaIdsSelecionadas
    };

    try {
      await cadastrar("/turmas", body, (novaTurma: Turma) => {
        setTurmas(prev => [...prev, novaTurma]);
        setNome("");
        setAnoLetivo(new Date().getFullYear().toString());
        setProfessorIdsSelecionados([]);
        setDisciplinaIdsSelecionadas([]);
        ToastAlerta("✅ Turma criada com sucesso", Toast.Success);
      }, {
        headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"}
      });
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao criar turmas", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // 🔹 Excluir turmas
  async function excluirTurma(id: number) {
    try {
      await deletar(`/turmas/${id}`, {
        method: "DELETE",
        headers: {Authorization: `Bearer ${token}`},
      });

      // Atualiza a tabela local
      setTurmas(prev => prev.filter(turma => turma.id !== id));
      ToastAlerta("✅ Turma excluída", Toast.Success);
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao excluir turmas", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="p-6 pt-28">
      <h1 className="text-2xl font-bold mb-6">Gestão de Turmas</h1>

      {/* Formulário de criação */}
      <div className="flex flex-col gap-2 mb-6">
        <input
          type="text"
          placeholder="Nome da turma"
          value={nome}
          onChange={e => setNome(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Ano letivo"
          value={anoLetivo}
          onChange={e => setAnoLetivo(e.target.value)}
          className="border rounded p-2"
        />

        {/* Seleção de professores */}
        <select
          multiple
          value={professorIdsSelecionados.map(String)}
          onChange={e => {
            const values = Array.from(e.target.selectedOptions, opt => Number(opt.value));
            setProfessorIdsSelecionados(values);
          }}
          className="border rounded p-2"
        >
          {professores.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>

        {/* Seleção de disciplinas */}
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

        <Button color="success" onClick={salvarTurma}>
          {isLoading ?
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="24"
              visible={true}
            /> :
            <span>Adicionar Turma</span>
          }
          </Button>
      </div>

      {/* Tabela de turmas */}
      {turmas.length > 0 && (
        <Table>
          <TableHead>
            <TableHeadCell>Nome</TableHeadCell>
            <TableHeadCell>Ano Letivo</TableHeadCell>
            <TableHeadCell>Professores</TableHeadCell>
            <TableHeadCell>Disciplinas</TableHeadCell>
            <TableHeadCell>Ações</TableHeadCell>
          </TableHead>
          <TableBody>
            {turmas.map((t, i) => (
              <TableRow key={i}>
                <TableCell>{t.nome}</TableCell>
                <TableCell>{t.anoLetivo}</TableCell>
                <TableCell>{t.professorIds.join(", ")}</TableCell>
                <TableCell>{t.disciplinaIds.join(", ")}</TableCell>
                <TableCell>
                  <Button color="danger" size="xs" onClick={() => excluirTurma(t.id)}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
