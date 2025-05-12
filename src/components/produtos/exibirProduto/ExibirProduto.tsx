import {Card, Modal, ModalBody, ModalHeader} from 'flowbite-react';
import Produto from '../../../models/Produto'
import ProdutoImg from "../../../assets/images/produto.png";
import {XCircle} from "@phosphor-icons/react";
import {FiAlertTriangle} from "react-icons/fi";
import {HiBadgeCheck} from "react-icons/hi";
import {AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineExclamationCircle} from "react-icons/ai";
import {formatarData} from "../../../utils/formatters.tsx";

interface ExibirProdutoProps {
    isOpen: boolean;
    onClose: () => void;
    produto: Produto;
}

function ExibirProduto({isOpen, onClose, produto}: ExibirProdutoProps) {

    const validade = new Date(produto.dataValidade);
    const hoje = new Date();
    const diasParaValidade = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 3600 * 24));

    let corValidade = 'bg-green-100 text-green-800';
    let textoValidade = 'Produto com validade ok';
    let IconeValidade = AiOutlineCheckCircle;

    if (diasParaValidade < 0) {
        corValidade = 'bg-red-100 text-red-800';
        textoValidade = 'Produto vencido';
        IconeValidade = AiOutlineCloseCircle;
    } else if (diasParaValidade <= 10) {
        corValidade = 'bg-yellow-100 text-yellow-800';
        textoValidade = `Vence em ${diasParaValidade} dia${diasParaValidade === 1 ? '' : 's'}`;
        IconeValidade = AiOutlineExclamationCircle;
    }
    return (
        <>
            <Modal show={isOpen} onClose={onClose} popup>
                <ModalHeader/>
                <ModalBody>
                    <Card className="max-w-md p-4" imgSrc={ProdutoImg} horizontal>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center mb-2">
                                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {produto.nome}
                                </h5>
                                <span
                                    className={`text-xs font-semibold px-2.5 py-0.5 rounded ${produto.disponivel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>

                                    {produto.disponivel ? 'Disponível' : 'Indisponível'}
                                </span>
                            </div>

                            <p className="text-gray-700 dark:text-gray-400 italic">{produto.descricao}</p>

                            <div className={`flex items-center gap-2 px-2 py-1 rounded ${corValidade} w-fit`}>
                                <IconeValidade className="w-5 h-5"/>
                                <span className="text-sm font-medium">{textoValidade}</span>
                            </div>

                            <div className="mt-4 space-y-1 text-sm dark:text-gray-200">
                                <p><span className="font-bold">Valor:</span> R$ {produto.valor.toFixed(2)}</p>
                                <p><span className="font-bold">Quantidade:</span> {produto.quantidade}</p>
                                <p><span className="font-bold">Código:</span> {produto.codigo}</p>
                                <p><span
                                    className="font-bold">Unidade de Medida:</span> {produto.unidadeMedida || 'N/A'}</p>
                                <hr/>
                                <p><span className="font-bold">Estoque Mínimo:</span> {produto.estoqueMinimo}</p>
                                <p><span className="font-bold">Estoque Máximo:</span> {produto.estoqueMaximo}</p>
                                <hr/>
                                <p><span className="font-bold">Data de Entrada:</span> {formatarData(produto.dataEntrada)}</p>
                                <p><span className="font-bold">Data de Validade:</span> {formatarData(produto.dataValidade)}</p>
                                <hr/>
                                <p><span className="font-bold">Categoria:</span> {produto.categoria?.nome || 'N/A'}</p>
                                <p><span className="font-bold">Marca:</span> {produto.marca?.nome || 'N/A'}</p>
                                <p><span className="font-bold">Fornecedor:</span> {produto.fornecedor?.nome || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </Card>


                </ModalBody>
            </Modal>
        </>

    );
}

export default ExibirProduto;