import {Card, Modal, ModalBody, ModalHeader} from 'flowbite-react';
import Fornecedor from '../../../models/Fornecedor'
import FornecedorImg from "../../../assets/images/fornecedor.png";

import {formatarCpfCnpj, formatarTelefone} from "../../../utils/formatters.tsx";

interface ExibirFornecedorProps {
    isOpen: boolean;
    onClose: () => void;
    fornecedor: Fornecedor;
}

function ExibirFornecedor({isOpen, onClose, fornecedor}: ExibirFornecedorProps) {

    return (
        <>
            <Modal show={isOpen} onClose={onClose} popup>
                <ModalHeader/>
                <ModalBody>
                    <Card className="max-w-sm" imgSrc={FornecedorImg} horizontal>
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {fornecedor.nome}
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            <p className="mb-2">
                                <span className="font-bold">Nome: </span>
                                <span className='italic'>{fornecedor.nome}</span>
                            </p>
                            <p className="mb-2">
                                <span className="font-semibold">CNPJ/CPF: </span>
                                <span className='italic'>{formatarCpfCnpj(fornecedor.cnpj)}</span>
                            </p>
                            <p className="mb-2">
                                <span className="font-bold">Email: </span>
                                <span className='italic'>{fornecedor.email}</span>
                            </p>
                            <p className="mb-2">
                                <span className="font-bold">Telefone: </span>
                                <span className='italic'>{formatarTelefone(fornecedor.telefone)}</span>
                            </p>
                            <p>
                                <span className="font-bold">Endereço: </span>
                                <span className='italic'>{fornecedor.endereco}</span>
                            </p>
                        </p>
                    </Card>
                </ModalBody>
            </Modal>
        </>
    );
}

export default ExibirFornecedor;