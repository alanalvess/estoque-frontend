import {Card, Modal, ModalBody, ModalHeader} from 'flowbite-react';
import Categoria from '../../../models/Categoria'
import CategoriaImg from "../../../assets/images/categoria.png";

interface ExibirCategoriaProps {
    isOpen: boolean;
    onClose: () => void;
    categoria: Categoria;
}

function ExibirCategoria({isOpen, onClose, categoria}: ExibirCategoriaProps) {

    return (
        <>
            <Modal show={isOpen} onClose={onClose} popup>
                <ModalHeader/>
                <ModalBody>
                    <Card className="max-w-sm" imgSrc={CategoriaImg} horizontal>
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {categoria.nome}
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            <p className="mb-2">
                                <span className="font-bold">Nome: </span>
                                <span className='italic'>{categoria.nome}</span>
                            </p>
                        </p>
                    </Card>
                </ModalBody>
            </Modal>
        </>
    );
}

export default ExibirCategoria;