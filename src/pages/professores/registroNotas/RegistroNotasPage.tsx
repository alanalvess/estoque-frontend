import {useContext, useEffect, useState} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {buscar, cadastrar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {AuthContext} from "../../../contexts/AuthContext.tsx";
import type {Aluno, Avaliacao, Disciplina, Nota, Turma} from "../../../models";
import {RotatingLines} from "react-loader-spinner";

// export default function RegistroNotasPage() {
//   const {usuario, handleLogout, isHydrated} = useContext(AuthContext);
//   const token = usuario.token;
//
//   const [turmas, setTurmas] = useState<Turma[]>([]);
//   const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
//   const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
//   const [alunos, setAlunos] = useState<Aluno[]>([]);
//
//   const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);
//   const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<number | null>(null);
//   const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState<number | null>(null);
//
//   const [notas, setNotas] = useState<Nota[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//
//   // 🔹 Buscar turmas do professor
//   useEffect(() => {
//     if (isHydrated && token !== "") {
//       buscar("/turmas", setTurmas, {
//         headers: {Authorization: `Bearer ${token}`},
//       });
//     }
//   }, [token, isHydrated]);
//
//   // 🔹 Buscar disciplinas da turmas selecionada
//   async function buscarDisciplinas() {
//     if (!turmaSelecionada) return;
//     await buscar(`/disciplinas/turmas/${turmaSelecionada}`, setDisciplinas, {
//       headers: {Authorization: `Bearer ${token}`},
//     });
//   }
//
//
//   // 🔹 Buscar avaliações da disciplina selecionada
//   async function buscarAvaliacoes() {
//     if (!disciplinaSelecionada) return;
//
//     await buscar(`/avaliacoes/disciplina/${disciplinaSelecionada}`, setAvaliacoes, {
//       headers: {Authorization: `Bearer ${token}`},
//     });
//   }
//
//
//   async function buscarAlunos() {
//     if (!disciplinaSelecionada) return;
//     await buscar(`/alunos/disciplina/${disciplinaSelecionada}`, setAlunos, {
//       headers: {Authorization: `Bearer ${token}`},
//     });
//   }
//
//   // 🔹 Buscar notas por avaliação
//   async function buscarNotas() {
//     if (!avaliacaoSelecionada) return;
//     setIsLoading(true);
//     try {
//       await buscar(`/notas/avaliacao/${avaliacaoSelecionada}`, setNotas, {
//         headers: {Authorization: `Bearer ${token}`},
//       });
//     } catch (err) {
//       ToastAlerta("Erro ao carregar notas", Toast.Error);
//     } finally {
//       setIsLoading(false);
//     }
//   }
//
//   // 🔹 Salvar uma nota
//   // async function salvarNota(nota: Nota) {
//   //   const body = {
//   //     id: nota.id,
//   //     valor: nota.valor,
//   //     alunoId: nota.alunoId,
//   //     disciplinaId: disciplinaSelecionada,
//   //     avaliacaoId: avaliacaoSelecionada,
//   //     dataLancamento: new Date().toISOString().split("T")[0],
//   //   };
//   //
//   //   try {
//   //     await cadastrar("/notas", body, () => {
//   //     }, {
//   //       headers: {
//   //         Authorization: `Bearer ${token}`,
//   //         "Content-Type": "application/json",
//   //       },
//   //     });
//   //     ToastAlerta(`✅ Nota de ${nota.alunoNome} salva`, Toast.Success);
//   //   } catch (err) {
//   //     ToastAlerta("Erro ao salvar nota", Toast.Error);
//   //   }
//   // }
//   async function salvarNota(nota: typeof notasComAlunos[0]) {
//     const body = {
//       id: nota.id, // pode ser null se ainda não existir
//       valor: nota.valor,
//       alunoId: nota.alunoId,
//       disciplinaId: disciplinaSelecionada,
//       avaliacaoId: avaliacaoSelecionada,
//       dataLancamento: new Date().toISOString().split("T")[0],
//     };
//
//     try {
//       await cadastrar("/notas", body, () => {
//         // Atualizar notas depois de salvar
//         buscarNotas();
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       ToastAlerta(`✅ Nota de ${nota.alunoNome} salva`, Toast.Success);
//     } catch (err) {
//       ToastAlerta("Erro ao salvar nota", Toast.Error);
//     }
//   }
//
// // Quando mudar a turmas → buscar disciplinas
//   useEffect(() => {
//     if (turmaSelecionada && token) {
//       buscarDisciplinas();
//     }
//   }, [turmaSelecionada, token]);
//
// // // Quando mudar a disciplina → buscar avaliações
// //   useEffect(() => {
// //     if (disciplinaSelecionada && token) {
// //       buscarAvaliacoes();
// //       buscarAlunos();
// //     }
// //   }, [disciplinaSelecionada, token]);
// //
// // // Quando mudar a avaliação → buscar notas
// //   useEffect(() => {
// //     if (avaliacaoSelecionada && token) {
// //       buscarNotas();
// //     }
// //   }, [avaliacaoSelecionada, token]);
//
//   // Quando mudar a disciplina → buscar alunos
//   useEffect(() => {
//     if (disciplinaSelecionada && token) {
//       buscarAlunos();
//       buscarAvaliacoes();
//     }
//   }, [disciplinaSelecionada, token]);
//
// // Quando mudar a avaliação → buscar notas
//   useEffect(() => {
//     if (avaliacaoSelecionada && token) {
//       buscarNotas();
//     }
//   }, [avaliacaoSelecionada, token]);
//
//
// // Combinar alunos e notas
//   const notasComAlunos = alunos.map(aluno => {
//     const notaExistente = notas.find(n => n.alunoId === aluno.id);
//     return {
//       alunoId: aluno.id,
//       alunoNome: aluno.nome,
//       id: notaExistente?.id ?? null,
//       valor: notaExistente?.valor ?? null,
//     };
//   });
//
//
//
//   return (
//     <div className="p-6 pt-28">
//       <h1 className="text-2xl font-bold mb-6">Registro de Notas</h1>
//
//       {/* Filtros */}
//       <div className="flex flex-wrap gap-4 mb-6">
//         <select
//           className="border rounded p-2 flex-1"
//           value={turmaSelecionada ?? ""}
//           onChange={(e) => {
//             setTurmaSelecionada(Number(e.target.value));
//             // buscarDisciplinas();
//           }}
//         >
//           <option value="">Selecione a turmas</option>
//           {turmas.map((t) => (
//             <option key={t.id} value={t.id}>
//               {t.nome} ({t.ano})
//             </option>
//           ))}
//         </select>
//
//         <select
//           className="border rounded p-2 flex-1"
//           value={disciplinaSelecionada ?? ""}
//           onChange={(e) => {
//             setDisciplinaSelecionada(Number(e.target.value));
//             // buscarAvaliacoes();
//           }}
//         >
//           <option value="">Selecione a disciplina</option>
//           {disciplinas.map((d) => (
//             <option key={d.id} value={d.id}>
//               {d.nome}
//             </option>
//           ))}
//         </select>
//
//         <select
//           className="border rounded p-2 flex-1"
//           value={avaliacaoSelecionada ?? ""}
//           onChange={(e) => setAvaliacaoSelecionada(Number(e.target.value))}
//         >
//           <option value="">Selecione a avaliação</option>
//           {avaliacoes.map((a) => (
//             <option key={a.id} value={a.id}>
//               {a.titulo}
//             </option>
//           ))}
//         </select>
//
//         <Button color="success" onClick={buscarNotas} disabled={!avaliacaoSelecionada}>
//           Carregar notas
//         </Button>
//       </div>
//
//       {/* Tabela de notas */}
//       {notas.length > 0 && (
//         <Table>
//           <TableHead>
//             <TableHeadCell>Aluno</TableHeadCell>
//             <TableHeadCell>Nota</TableHeadCell>
//             <TableHeadCell>Ações</TableHeadCell>
//           </TableHead>
//           {/*<TableBody>*/}
//           {/*  {notasComAlunos.map((n) => (*/}
//           {/*    <TableRow key={n.id}>*/}
//           {/*      <TableCell>{n.alunoNome}</TableCell>*/}
//           {/*      <TableCell>*/}
//           {/*        <input*/}
//           {/*          type="number"*/}
//           {/*          value={n.valor ?? ""}*/}
//           {/*          className="border rounded p-1 w-20"*/}
//           {/*          onChange={(e) =>*/}
//           {/*            setNotas((prev) =>*/}
//           {/*              prev.map((x) =>*/}
//           {/*                x.id === n.id ? {...x, valor: Number(e.target.value)} : x*/}
//           {/*              )*/}
//           {/*            )*/}
//           {/*          }*/}
//           {/*        />*/}
//           {/*      </TableCell>*/}
//           {/*      <TableCell>*/}
//           {/*        <Button size="xs" color="blue" onClick={() => salvarNota(n)}>*/}
//           {/*          Salvar*/}
//           {/*        </Button>*/}
//           {/*      </TableCell>*/}
//           {/*    </TableRow>*/}
//           {/*  ))}*/}
//           {/*</TableBody>*/}
//           <TableBody>
//             {notasComAlunos.map(n => (
//               <TableRow key={n.alunoId}>
//                 <TableCell>{n.alunoNome}</TableCell>
//                 <TableCell>
//                   <input
//                     type="number"
//                     value={n.valor ?? ""}
//                     onChange={(e) => {
//                       const novoValor = Number(e.target.value);
//                       setNotas(prev => {
//                         const existe = prev.find(x => x.alunoId === n.alunoId);
//                         if (existe) {
//                           return prev.map(x =>
//                             x.alunoId === n.alunoId ? {...x, valor: novoValor} : x
//                           );
//                         } else {
//                           return [...prev, {alunoId: n.alunoId, valor: novoValor, id: null}];
//                         }
//                       });
//                     }}
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <Button size="xs" color="blue" onClick={() => salvarNota(n)}>
//                     Salvar
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//
//
//         </Table>
//       )}
//     </div>
//   );
// }

export default function RegistroNotasPage() {
  const {usuario, isHydrated} = useContext(AuthContext);
  const token = usuario.token;

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);

  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<number | null>(null);
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Buscar turmas do professor
  useEffect(() => {
    if (isHydrated && token) {
      buscar("/turmas", setTurmas, {headers: {Authorization: `Bearer ${token}`}});
    }
  }, [token, isHydrated]);

  // 🔹 Buscar disciplinas da turmas selecionada
  async function buscarDisciplinas() {
    if (!turmaSelecionada) return;
    await buscar(`/disciplinas/turma/${turmaSelecionada}`, setDisciplinas, {
      headers: {Authorization: `Bearer ${token}`},
    });
  }

  // 🔹 Buscar avaliações da disciplina selecionada
  async function buscarAvaliacoes() {
    if (!disciplinaSelecionada) return;
    await buscar(`/avaliacoes/disciplina/${disciplinaSelecionada}`, setAvaliacoes, {
      headers: {Authorization: `Bearer ${token}`},
    });
  }

  // 🔹 Buscar alunos da disciplina
  async function buscarAlunos() {
    if (!disciplinaSelecionada) return;
    await buscar(`/alunos/disciplina/${disciplinaSelecionada}`, setAlunos, {
      headers: {Authorization: `Bearer ${token}`},
    });
  }

  // 🔹 Buscar notas por avaliação
  async function buscarNotas() {
    if (!avaliacaoSelecionada) return;
    setIsLoading(true);
    try {
      await buscar(`/notas/avaliacao/${avaliacaoSelecionada}`, setNotas, {
        headers: {Authorization: `Bearer ${token}`},
      });

    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao carregar notas", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Depois de buscar alunos e notas
  useEffect(() => {
    if (alunos.length > 0) {
      setNotas((prevNotas) => {
        return alunos.map((aluno) => {
          const notaExistente = prevNotas.find(n => n.alunoId === aluno.id);
          return notaExistente ?? {
            id: 0, // id 0 indica novo registro
            alunoId: aluno.id,
            alunoNome: aluno.nome,
            disciplinaId: disciplinaSelecionada!,
            valor: 0
          };
        });
      });
    }
  }, [alunos, disciplinaSelecionada]);


  async function salvarNota(nota: Nota) {
    const body = {
      id: nota.id !== 0 ? nota.id : undefined, // undefined para novo registro
      alunoId: nota.alunoId,
      disciplinaId: disciplinaSelecionada,
      avaliacaoId: avaliacaoSelecionada,
      valor: nota.valor,
      dataLancamento: new Date().toISOString().split("T")[0],
    };

    try {
      await cadastrar("/notas", body, () => {
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      ToastAlerta(`✅ Nota de ${nota.alunoNome} salva`, Toast.Success);
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao salvar nota", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }


  // 🔹 Efeitos
  useEffect(() => {
    if (turmaSelecionada && token) buscarDisciplinas();
  }, [turmaSelecionada, token]);

  useEffect(() => {
    if (disciplinaSelecionada && token) {
      buscarAlunos().then(() => buscarNotas());
      buscarAvaliacoes();
      setAvaliacaoSelecionada(null); // resetar avaliação ao mudar disciplina
      setNotas([]);
    }
  }, [disciplinaSelecionada, token]);

  useEffect(() => {
    if (avaliacaoSelecionada && token) buscarNotas();
  }, [avaliacaoSelecionada, token]);

  // 🔹 Combinar alunos + notas existentes
  const notasComAlunos = alunos.map(aluno => {
    const notaExistente = notas.find(n => n.alunoId === aluno.id);
    return {
      alunoId: aluno.id,
      alunoNome: aluno.nome,
      disciplinaId: disciplinaSelecionada,
      id: notaExistente?.id ?? null,
      valor: notaExistente?.valor ?? null,
    };
  });

  return (
    <div className="p-6 pt-28">
      <h1 className="text-2xl font-bold mb-6">Registro de Notas</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border rounded p-2 flex-1"
          value={turmaSelecionada ?? ""}
          onChange={(e) => setTurmaSelecionada(Number(e.target.value))}
        >
          <option value="">Selecione a turma</option>
          {turmas.map(t => (
            <option key={t.id} value={t.id}>
              {t.nome} ({t.anoLetivo})
            </option>
          ))}
        </select>

        <select
          className="border rounded p-2 flex-1"
          value={disciplinaSelecionada ?? ""}
          onChange={(e) => setDisciplinaSelecionada(Number(e.target.value))}
        >
          <option value="">Selecione a disciplina</option>
          {disciplinas.map(d => (
            <option key={d.id} value={d.id}>
              {d.nome}
            </option>
          ))}
        </select>

        <select
          className="border rounded p-2 flex-1"
          value={avaliacaoSelecionada ?? ""}
          onChange={(e) => setAvaliacaoSelecionada(Number(e.target.value))}
        >
          <option value="">Selecione a avaliação</option>
          {avaliacoes.map(a => (
            <option key={a.id} value={a.id}>
              {a.titulo}
            </option>
          ))}
        </select>

        <Button color="success" onClick={buscarNotas} disabled={!avaliacaoSelecionada}>
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

      {/* Tabela de notas */}
      {alunos.length > 0 ? (
        <Table>
          <TableHead>
            <TableHeadCell>Aluno</TableHeadCell>
            <TableHeadCell>Nota</TableHeadCell>
            <TableHeadCell>Ações</TableHeadCell>
          </TableHead>
          <TableBody>
            {notasComAlunos.map(nota => (
              <TableRow key={nota.alunoId}>
                <TableCell>{nota.alunoNome}</TableCell>
                <TableCell>
                  <input
                    type="number"
                    value={nota.valor ?? ""}
                    className="border rounded p-1 w-20"
                    onChange={(e) => {
                      const novoValor = Number(e.target.value);

                      setNotas(prev => {
                        const existe = prev.find(x => x.alunoId === nota.alunoId);

                        if (existe) {
                          // Atualiza a nota existente
                          return prev.map(x =>
                            x.alunoId === nota.alunoId ? {...x, valor: novoValor} : x
                          );
                        } else {
                          // Cria nova nota para aluno que ainda não tem
                          return [
                            ...prev,
                            {
                              id: 0, // ou null, dependendo do backend
                              alunoId: nota.alunoId,
                              alunoNome: nota.alunoNome,
                              disciplinaId: disciplinaSelecionada!, // garante que não é null
                              valor: novoValor,
                            }
                          ];
                        }
                      });
                    }}

                  />
                </TableCell>
                <TableCell>
                  <Button size="xs" color="blue" onClick={() => salvarNota(nota)}>
                    Salvar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>Nenhum aluno encontrado para esta disciplina.</p>
      )}
    </div>
  );
}
