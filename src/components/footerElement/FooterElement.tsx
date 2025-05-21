import {
    Footer,
    FooterCopyright,
    FooterDivider,
    FooterLinkGroup
} from 'flowbite-react';

import {CiCalculator2} from "react-icons/ci";
import {Calculadora} from "../calculadora/Calculadora.tsx";
import {useState} from "react";
import {Link} from "react-router-dom";

function FooterElement() {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);

    return (
        <Footer container className='rounded-none bg-gray-300 w-full overflow-x-auto'>
            <div className='w-full px-4'>
                <div className='w-full flex flex-row justify-between items-center'>
                    <FooterLinkGroup className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                        <Link to='/duvidas'>Dúvidas</Link>
                        <Link to='/sobre'>Sobre</Link>
                    </FooterLinkGroup>

                    <div className='flex items-center bg-gray-500 hover:bg-gray-600 dark:bg-gray-900 dark:hover:bg-gray-700 rounded-lg p-1'>
                        <CiCalculator2
                            size={30}
                            onClick={() => setIsOpen(true)}
                            className="cursor-pointer text-white"
                        />
                        <Calculadora open={isOpen} onClose={handleClose}/>
                    </div>
                </div>

                <FooterDivider/>

                <div className="flex justify-center w-full">
                    <FooterCopyright
                        href='/produtos/all'
                        by='Gestok™'
                        year={2025}
                    />
                </div>
            </div>
        </Footer>
    );
}

export default FooterElement;