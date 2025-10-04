import {useZxing} from "react-zxing";

export default function QRCodeScanner({ onScan }: { onScan: (text: string) => void }) {
  const { ref } = useZxing({
    onDecodeResult(result) {
      onScan(result.getText());
    },
    onError(err) {
      console.error("Erro ao acessar câmera:", err);
      alert("❌ Erro ao acessar câmera: " + err);
    },
    constraints: {
      video: { facingMode: "environment", width: 1280, height: 720 },
    },
  });

  // async function salvarTodasPresencas() {
  //   try {
  //     await Promise.all(
  //       presencas.map(presenca => {
  //         const body = {
  //           data: dataChamada,
  //           presente: presenca.presente,
  //           alunoId: presenca.alunoId,
  //           turmaId: presenca.turmaId,
  //           metodoChamada: "MANUAL",
  //         };
  //
  //         return cadastrar("/presencas/batch", body, () => {
  //         }, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json",
  //           },
  //         });
  //       })
  //     );
  //
  //     ToastAlerta("✅ Todas as presenças salvas", Toast.Success);
  //   } catch (error) {
  //     console.error("Erro ao salvar presenças", error);
  //     ToastAlerta("Erro ao salvar presenças", Toast.Error);
  //   }
  // }

  return (
    <video ref={ref} style={{ width: "100%", borderRadius: "8px" }} />
  );
}
