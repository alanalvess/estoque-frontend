import {useContext, useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router'
import DeleteImg from "../../../assets/images/delete.png";

import {AuthContext} from '../../../contexts/AuthContext'
import {Toast, ToastAlerta} from '../../../utils/ToastAlerta'
import {buscar, deletar} from '../../../services/Service'

import Fornecedor from '../../../models/Fornecedor'
import {Button, Card, Modal, ModalBody, ModalHeader, Spinner} from 'flowbite-react';
import {formatarCpfCnpj, formatarTelefone} from "../../../utils/formatters.tsx";

interface DeletarFornecedorProps {
    isOpen: boolean;
    onClose: () => void;
    fornecedor: Fornecedor;
    aoDeletar: (id: number) => void; // ✅ nova prop
}

export function DeletarFornecedor({isOpen, onClose, fornecedor, aoDeletar}: DeletarFornecedorProps) {

    const {usuario} = useContext(AuthContext);
    const token = usuario.token;

    const [isLoading, setIsLoading] = useState(false);

    async function deletarFornecedor() {
        setIsLoading(true);

        try {
            await deletar(`/fornecedores/${fornecedor.id}`, {headers: {Authorization: token}});
            ToastAlerta('Fornecedor apagado', Toast.Success);

            aoDeletar(fornecedor.id); // ✅ chama callback passando ID do excluído
            onClose(); // fecha o modal

        } catch (error) {
            ToastAlerta('Erro ao apagar o fornecedor', Toast.Error);
        }

        setIsLoading(false);
    }

    return (
        <Modal show={isOpen} onClose={onClose} popup>
            <ModalHeader/>
            <ModalBody>
                <Card className="max-w-sm mx-auto lg:gap-10" imgSrc={DeleteImg} horizontal>
                    <div className="text-center lg:text-left">
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                            Deletar fornecedor?
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-500">
                            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 italic">
                                {fornecedor.nome}
                            </p>
                            <p className="mb-2">
                                <span className="font-semibold">CNPJ/CPF: </span>
                                <span className='italic'>{formatarCpfCnpj(fornecedor.cnpj)}</span>
                            </p>
                            <p className="mb-2">
                                <span className="font-bold">E-Mail: </span>
                                <span className='italic'>{fornecedor.email}</span>
                            </p>
                            <p className="mb-2">
                                <span className="font-bold">Telefone: </span>
                                <span className='italic'>{formatarTelefone(fornecedor.telefone)}</span>
                            </p>
                        </p>
                        <div className="flex gap-2 mt-10 justify-center">
                            <Button
                                className="cursor-pointer text-white bg-gray-400 hover:bg-gray-600 w-24 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-0"
                                onClick={onClose}
                            >
                                Não
                            </Button>
                            <Button
                                className="cursor-pointer text-white bg-rose-600 hover:bg-rose-800 w-24 dark:bg-rose-600 dark:hover:bg-rose-700 flex justify-center focus:outline-none focus:ring-0"
                                onClick={deletarFornecedor}
                            >
                                {isLoading ? (
                                    <Spinner aria-label="Default status example" />
                                ) : (
                                    <span>Sim</span>
                                )}
                            </Button>
                        </div>
                    </div>
                </Card>
            </ModalBody>
        </Modal>

    );
}

export default DeletarFornecedor;