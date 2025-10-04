import {Card, Modal, ModalBody, ModalHeader} from 'flowbite-react';
import UsuarioImg from "../../../assets/images/user.png";
import type {Usuario} from "../../../models"

interface ExibirUsuarioProps {
    isOpen: boolean;
    onClose: () => void;
    exibindo: Usuario;
}

function ExibirUsuario({isOpen, onClose, exibindo}: ExibirUsuarioProps) {

    return (
        <>
            <Modal show={isOpen} onClose={onClose} popup>
                <ModalHeader/>
                <ModalBody>
                    <Card className="max-w-sm" imgSrc={UsuarioImg} horizontal>
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {exibindo.nome}
                        </h5>

                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            <p className="mb-2">
                                <span className="font-bold">Nome: </span>
                                <span className='italic'>{exibindo.nome}</span>
                            </p>

                            <p className="mb-2">
                                <span className="font-bold">Email: </span>
                                <span className='italic'>{exibindo.email}</span>
                            </p>

                            <p>
                                <span className="font-bold">Autorizações: </span>
                                <span className='italic'>
                                    {exibindo.roles}
                                </span>
                            </p>
                        </p>
                    </Card>
                </ModalBody>
            </Modal>
        </>
    )
}

export default ExibirUsuario;