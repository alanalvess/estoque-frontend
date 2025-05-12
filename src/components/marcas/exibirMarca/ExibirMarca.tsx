import {Card, Modal, ModalBody, ModalHeader} from 'flowbite-react';
import Marca from '../../../models/Marca'
import MarcaImg from "../../../assets/images/marca.png";

interface ExibirMarcaProps {
    isOpen: boolean;
    onClose: () => void;
    marca: Marca;
}

function ExibirMarca({isOpen, onClose, marca}: ExibirMarcaProps) {

    return (
        <>
            <Modal show={isOpen} onClose={onClose} popup>
                <ModalHeader/>
                <ModalBody>
                    <Card className="max-w-sm" imgSrc={MarcaImg} horizontal>
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {marca.nome}
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            <p className="mb-2">
                                <span className="font-bold">Nome: </span>
                                <span className='italic'>{marca.nome}</span>
                            </p>
                        </p>
                    </Card>
                </ModalBody>
            </Modal>
        </>
    );
}

export default ExibirMarca;