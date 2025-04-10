import {
    Footer,
    FooterBrand,
    FooterCopyright,
    FooterDivider,
    FooterLink,
    FooterLinkGroup
} from 'flowbite-react';

import Logo from '../../assets/images/logo.png';

function FooterElement() {

    return (
        <>
            <Footer container className='rounded-none bg-gray-300 w-full overflow-x-auto'>
                <div className='w-full text-center overflow-x-auto'>
                    <div className='w-full justify-between sm:flex sm:items-center sm:justify-between'>
                        <FooterBrand
                            href={Logo}
                            src={Logo}
                            alt='Controle de Estoque'
                            // name='Controle de Estoque'
                        />
                        <FooterLinkGroup>
                            <FooterLink href='/duvidas'>Dúvidas</FooterLink>
                            <FooterLink href='sobre'>Sobre</FooterLink>

                        </FooterLinkGroup>
                    </div>

                    <FooterDivider/>

                    <FooterCopyright
                        href='produtos/all'
                        by='Controle de Estoque™'
                        year={2025}
                    />
                </div>
            </Footer>
        </>
    )
}

export default FooterElement;