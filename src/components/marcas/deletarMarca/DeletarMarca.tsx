import {useContext, useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router'

import {AuthContext} from '../../../contexts/AuthContext'
import {Toast, ToastAlerta} from '../../../utils/ToastAlerta'
import {buscar, deletar} from '../../../services/Service'

import Marca from '../../../models/Marca'
import {Button, Card, Modal, ModalBody, ModalHeader, Spinner} from 'flowbite-react';
import DeleteImg from "../../../assets/images/delete.png";
import {formatarCpfCnpj, formatarTelefone} from "../../../utils/formatters.tsx";

interface DeletarMarcaProps {
    isOpen: boolean;
    onClose: () => void;
    marca: Marca;
    aoDeletar: (id: number) => void; // ✅ nova prop
}

function DeletarMarca({ isOpen, onClose, marca, aoDeletar }:  DeletarMarcaProps) {

    const {usuario} = useContext(AuthContext);
    const token = usuario.token;

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function deletarMarca() {
        setIsLoading(true);

        try {
            await deletar(`/marcas/${marca.id}`, {headers: {Authorization: token}});
            ToastAlerta('Marca apagada', Toast.Success);

            aoDeletar(marca.id);
            onClose();

        } catch (error: any) {
            ToastAlerta('Erro ao apagar a Marca', Toast.Error);
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
                            Deletar Marca?
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-500">
                            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 italic">
                                {marca.nome}
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
                                onClick={deletarMarca}
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
    )
}

export default DeletarMarca;