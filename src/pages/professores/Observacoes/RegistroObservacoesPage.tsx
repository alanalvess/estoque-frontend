import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../contexts/AuthContext.tsx";
import {Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {buscar, cadastrar, deletar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import type {Aluno, Disciplina, Observacao, Turma} from "../../../models";
import {RotatingLines} from "react-loader-spinner";

// export default function RegistroObservacoesPage() {
//   const { usuario, isHydrated } = useContext(AuthContext);
//   const token = usuario.token;
//
//   const [turmas, setTurmas] = useState<Turma[]>([]);
//   const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
//   const [alunos, setAlunos] = useState<Aluno[]>([]);
//   const [observacoes, setObservacoes] = useState<Observacao[]>([]);
//
//   const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);
//   const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<number | null>(null);
//   const [alunoSelecionado, setAlunoSelecionado] = useState<number | null>(null);
//   const [descricao, setDescricao] = useState("");
//   const [categoria, setCategoria] = useState("");
//   const [observacao, setObservacao] = useState<Observacao>();
//   const [data, setData] = useState(new Date().toISOString().split("T")[0]);
//
//   // 🔹 Buscar turmas do professor
//   useEffect(() => {
//     if (isHydrated && token) {
//       buscar("/turmas", setTurmas, { headers: { Authorization: `Bearer ${token}` } });
//     }
//   }, [token, isHydrated]);
//
//
//   // 🔹 Buscar disciplinas da turmas selecionada
//   async function buscarDisciplinas() {
//     if (!turmaSelecionada) return;
//     await buscar(`/disciplinas/turmas/${turmaSelecionada}`, setDisciplinas, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//   }
//
//   // 🔹 Buscar alunos da disciplina
//   async function buscarAlunos() {
//     if (!disciplinaSelecionada) return;
//     await buscar(`/alunos/disciplina/${disciplinaSelecionada}`, setAlunos, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//   }
//
//   useEffect(() => {
//     if (turmaSelecionada && token) buscarDisciplinas();
//   }, [turmaSelecionada, token]);
//
//   useEffect(() => {
//     if (disciplinaSelecionada && token) {
//       buscarAlunos();
//     }
//   }, [disciplinaSelecionada, token]);
//
//   async function salvarObservacao() {
//     if (!alunoSelecionado || !turmaSelecionada || !disciplinaSelecionada) return;
//
//     const body = {
//       // não precisa do id para criação
//       data,
//       descricao,
//       categoria,
//       alunoId: alunoSelecionado,
//       // professorId: usuario.id,
//       turmaId: turmaSelecionada,
//       disciplinaId: disciplinaSelecionada,
//     };
//
//     console.log("Observação a enviar:", {
//       data,
//       descricao,
//       categoria,
//       alunoId: alunoSelecionado,
//       professorId: usuario.id,
//       turmaId: turmaSelecionada,
//       disciplinaId: disciplinaSelecionada,
//     });
//
//
//     try {
//       await cadastrar("/observacoes", body, (novaObs: any) => {
//         // adiciona a observação retornada do backend na lista
//         setObservacoes(prev => [...prev, novaObs]);
//         // limpa campos
//         setDescricao("");
//         setCategoria("");
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//
//       ToastAlerta("✅ Observação salva", Toast.Success);
//     } catch (err) {
//       ToastAlerta("Erro ao salvar observação", Toast.Error);
//     }
//   }
//
//
//
//   return (
//     <div className="p-6 pt-28">
//       <h1 className="text-2xl font-bold mb-6">Registro de Observações</h1>
//
//       {/* Filtros */}
//       <div className="flex flex-wrap gap-4 mb-6">
//         <select value={turmaSelecionada ?? ""} onChange={e => setTurmaSelecionada(Number(e.target.value))}>
//           <option value="">Selecione a turmas</option>
//           {turmas.map(t => <option key={t.id} value={t.id}>{t.nome} ({t.ano})</option>)}
//         </select>
//
//         <select value={disciplinaSelecionada ?? ""} onChange={e => setDisciplinaSelecionada(Number(e.target.value))}>
//           <option value="">Selecione a disciplina</option>
//           {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
//         </select>
//
//         <select value={alunoSelecionado ?? ""} onChange={e => setAlunoSelecionado(Number(e.target.value))}>
//           <option value="">Selecione o aluno</option>
//           {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
//         </select>
//       </div>
//
//       {/* Formulário de observação */}
//       <div className="flex flex-col gap-2 mb-6">
//         <input type="date" value={data} onChange={e => setData(e.target.value)} className="border rounded p-2"/>
//         <input type="text" placeholder="Categoria" value={categoria} onChange={e => setCategoria(e.target.value)} className="border rounded p-2"/>
//         <textarea placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} className="border rounded p-2"/>
//
//         <Button
//           color="success"
//           onClick={salvarObservacao}
//         >
//           Salvar Observação
//         </Button>
//       </div>
//
//       {/* Tabela de observações */}
//       {observacoes.length > 0 && (
//         <Table>
//           <TableHead>
//             <TableHeadCell>Data</TableHeadCell>
//             <TableHeadCell>Categoria</TableHeadCell>
//             <TableHeadCell>Descrição</TableHeadCell>
//           </TableHead>
//           <TableBody>
//             {observacoes.map((observacao, i) => (
//               <TableRow key={i}>
//                 <TableCell>{observacao.data}</TableCell>
//                 <TableCell>{observacao.categoria}</TableCell>
//                 <TableCell>{observacao.descricao}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//     </div>
//   );
// }

export default function RegistroObservacoesPage() {
  const {usuario, isHydrated} = useContext(AuthContext);
  const token = usuario.token;

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [observacoes, setObservacoes] = useState<Observacao[]>([]);

  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<number | null>(null);
  const [alunoSelecionado, setAlunoSelecionado] = useState<number | null>(null);
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);

  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Buscar turmas do professor
  useEffect(() => {
    if (isHydrated && token) {
      buscar("/turmas", setTurmas, {headers: {Authorization: `Bearer ${token}`}});
    }
  }, [token, isHydrated]);

  // 🔹 Buscar disciplinas da turmas
  useEffect(() => {
    if (!turmaSelecionada) return;
    buscar(`/disciplinas/turma/${turmaSelecionada}`, setDisciplinas, {
      headers: {Authorization: `Bearer ${token}`},
    });
  }, [turmaSelecionada, token]);

  // 🔹 Buscar alunos da disciplina
  useEffect(() => {
    if (!disciplinaSelecionada) return;
    buscar(`/alunos/disciplina/${disciplinaSelecionada}`, setAlunos, {
      headers: {Authorization: `Bearer ${token}`},
    });
  }, [disciplinaSelecionada, token]);

  // 🔹 Buscar observações da turmas + disciplina (opcional filtro por aluno)
  useEffect(() => {
    if (!disciplinaSelecionada || !turmaSelecionada) return;

    let url = `/observacoes`;
    if (alunoSelecionado) {
      url = `/observacoes/aluno/${alunoSelecionado}`;
    }

    buscar(url, setObservacoes, {headers: {Authorization: `Bearer ${token}`}});
  }, [turmaSelecionada, disciplinaSelecionada, alunoSelecionado, token]);

  // 🔹 Salvar nova observação
  async function salvarObservacao() {
    if (!alunoSelecionado || !turmaSelecionada || !disciplinaSelecionada) return;

    const body = {
      alunoId: alunoSelecionado,
      turmaId: turmaSelecionada,
      disciplinaId: disciplinaSelecionada,
      descricao,
      categoria,
      data,
    };

    try {
      await cadastrar("/observacoes", body, (novaObs: Observacao) => {
        setObservacoes(prev => [...prev, novaObs]);
        setDescricao("");
        setCategoria("");
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      ToastAlerta("✅ Observação salva", Toast.Success);
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao salvar observação", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // 🔹 Excluir observação
  async function excluirObservacao(id: number) {
    try {
      await deletar(`/observacoes/${id}`, {
        method: "DELETE",
        headers: {Authorization: `Bearer ${token}`},
      });
      setObservacoes(prev => prev.filter(observacao => observacao.id !== id));
      ToastAlerta("✅ Observação excluída", Toast.Success);
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao excluir observação", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6 pt-28">
      <h1 className="text-2xl font-bold mb-6">Registro de Observações</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select value={turmaSelecionada ?? ""} onChange={e => setTurmaSelecionada(Number(e.target.value))}>
          <option value="">Selecione a turma</option>
          {turmas.map(t => <option key={t.id} value={t.id}>{t.nome} ({t.anoLetivo})</option>)}
        </select>

        <select value={disciplinaSelecionada ?? ""} onChange={e => setDisciplinaSelecionada(Number(e.target.value))}>
          <option value="">Selecione a disciplina</option>
          {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
        </select>

        <select value={alunoSelecionado ?? ""} onChange={e => setAlunoSelecionado(Number(e.target.value))}>
          <option value="">Selecione o aluno</option>
          {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
        </select>
      </div>

      {/* Formulário de observação */}
      <div className="flex flex-col gap-2 mb-6">
        <input type="date" value={data} onChange={e => setData(e.target.value)} className="border rounded p-2"/>
        <input type="text" placeholder="Categoria" value={categoria} onChange={e => setCategoria(e.target.value)}
               className="border rounded p-2"/>
        <textarea placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)}
                  className="border rounded p-2"/>

        <Button color="success" onClick={salvarObservacao}>
          {isLoading ?
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="24"
              visible={true}
            /> :
            <span>Salvar Observação</span>}
        </Button>
      </div>

      {/* Tabela de observações */}
      {observacoes.length > 0 && (
        <Table>
          <TableHead>
            <TableHeadCell>Aluno</TableHeadCell>
            <TableHeadCell>Data</TableHeadCell>
            <TableHeadCell>Categoria</TableHeadCell>
            <TableHeadCell>Descrição</TableHeadCell>
            <TableHeadCell>Ações</TableHeadCell>
          </TableHead>
          <TableBody>
            {observacoes.map((obs, i) => (
              <TableRow key={i}>
                <TableCell>{alunos.find(a => a.id === obs.alunoId)?.nome || "—"}</TableCell>
                <TableCell>{obs.data}</TableCell>
                <TableCell>{obs.categoria}</TableCell>
                <TableCell>{obs.descricao}</TableCell>
                <TableCell>
                  <Button color="danger" size="xs" onClick={() => excluirObservacao(obs.id)}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
