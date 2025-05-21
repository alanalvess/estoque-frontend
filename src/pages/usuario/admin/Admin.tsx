import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {
    Accordion,
    AccordionContent,
    AccordionPanel,
    AccordionTitle,
    Button,
    Modal,
    ModalBody,
    ModalHeader
} from "flowbite-react";
import {ArrowSquareOut} from "@phosphor-icons/react";
import {FcCheckmark} from "react-icons/fc";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {buscar} from "../../../services/Service.ts";
import Usuario from "../../../models/Usuario.ts";


function Admin() {

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    const [openModal, setOpenModal] = useState(false);

    async function buscarUsuarios() {
        try {
            await buscar("/usuarios/all", setUsuarios);
        } catch (error: any) {
            ToastAlerta("Erro ao buscar os usuarios", Toast.Warning);
        }
    }

    useEffect(() => {
        buscarUsuarios();
    }, [usuarios.length])

    useEffect(() => {
        buscarUsuarios();
    }, [])

    return (
        <>
            <div className='container mx-auto rounded-b-2xl pb-24'>
                <div className=" w-full flex flex-col justify-center px-6">
                    <div className="container">
                        <div className='flex flex-col font-bold text-3xl mt-14 border-b-2 py-5'>
                            <div className='flex items-center justify-between '>
                                <h2 className="font-bold text-xl lg:text-4xl dark:text-cinza-100">
                                    Painel Administrativo
                                </h2>
                                <button
                                    onClick={() => setOpenModal(true)}
                                    className=" text-center text-xl lg:text-2xl font-semibold text-white bg-rosa-200 rounded p-2 w-100"
                                >
                                    <Link to="/admin" className="flex items-center gap-2">
                                        <ArrowSquareOut size={30}/>
                                        Retirar valores
                                    </Link>
                                </button>

                                <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup dismissible>
                                    <ModalHeader/>
                                    <ModalBody>
                                        <div className="text-center">
                                            <FcCheckmark
                                                className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                Transferência de R$ realizada com sucesso para a Conta Empresarial
                                            </h3>
                                            <div className="flex justify-center gap-4">
                                                <Button color="success" onClick={() => setOpenModal(false)}>
                                                    {"Voltar"}
                                                </Button>

                                            </div>
                                        </div>
                                    </ModalBody>
                                </Modal>

                            </div>
                        </div>
                    </div>

                    <div className="my-12">
                        <Accordion collapseAll>
                            <AccordionPanel>
                                <AccordionTitle>Total de arrecadações em projetos na plataforma: </AccordionTitle>
                                <AccordionContent>
                                    <p className="mb-2 text-gray-500 dark:text-gray-400">R$ </p>
                                </AccordionContent>
                            </AccordionPanel>
                            <AccordionPanel>
                                <AccordionTitle>Total de arrecadações para a Zerone:</AccordionTitle>
                                <AccordionContent>
                                    <p className="mb-2 text-gray-500 dark:text-gray-400">R$ </p>
                                </AccordionContent>
                            </AccordionPanel>
                        </Accordion>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Admin;