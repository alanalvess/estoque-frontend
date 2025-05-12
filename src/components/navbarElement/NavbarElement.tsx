import {useContext} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {SignIn, SignOut} from '@phosphor-icons/react'

import {AuthContext} from '../../contexts/AuthContext'
import {Toast, ToastAlerta} from '../../utils/ToastAlerta'

import Logo from '../../assets/images/gestok.png'

import {Button, DarkThemeToggle, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle} from 'flowbite-react'

function NavbarElement() {

    let navbarComponent;

    const navigate = useNavigate();

    const {usuario, handleLogout} = useContext(AuthContext);

    const location = useLocation();

    const links = [
        // {to: '/home', label: 'Home'},
        {to: '/produtos/all', label: 'Produtos'},
        {to: '/categorias/all', label: 'Categorias'},
        {to: '/fornecedores/all', label: 'Fornecedores'},
        {to: '/marcas/all', label: 'Marcas'},
    ]

    function logout() {
        handleLogout();
        ToastAlerta('Usuário deslogado', Toast.Success);
        navigate('/home');
    }

    if (usuario.token !== '') {
        navbarComponent = (
            <>
                <Navbar fluid className='bg-gray-800 fixed top-0 py-3 z-40 w-full justify-between'>
                    <NavbarBrand>
                        <Link to='/home' className='text-2xl font-bold uppercase'>
                            <div className='flex items-center justify-center gap-3'>
                                <img src={Logo} alt='Gestok' className='max-w-30 ml-2 my-3 h-10'/>
                            </div>
                        </Link>
                    </NavbarBrand>

                    <div className="flex md:order-2">
                        <Link to='/home' onClick={logout} className='flex items-center justify-center'>
                            <Button
                                className='bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700 focus:outline-none focus:ring-0 cursor-pointer'>
                                <span className='text-xl '>Sair</span>
                                <SignOut className='p-1 rounded-lg ' size={40} weight='fill'/>
                            </Button>
                        </Link>
                        <DarkThemeToggle
                            className='cursor-pointer mx-4 hover:bg-gray-700 focus:outline-none focus:ring-0'/>
                        <NavbarToggle className='focus:outline-none focus:ring-0'/>
                    </div>

                    <NavbarCollapse>

                        {links.map(link => (
                            <Link key={link.to} to={link.to}>
                                <NavbarLink
                                    active={location.pathname === link.to}
                                    className='text-gray-400'
                                    theme={{
                                        active: {
                                            on: "text-xl border-b-2 border-teal-600 font-bold bg-teal-700 text-white md:bg-transparent md:text-white dark:text-white",
                                            off: "text-xl border-b border-gray-100 text-gray-700 hover:bg-gray-50 md:border-0 md:hover:bg-transparent md:hover:text-white dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-white"
                                        }
                                    }}
                                >
                                    {link.label}
                                </NavbarLink>
                            </Link>
                        ))}
                    </NavbarCollapse>
                </Navbar>
            </>
        );

    } else {
        navbarComponent = (
            <>
                <Navbar fluid className='bg-gray-800 fixed top-0 z-40 w-full '>
                    <NavbarBrand>
                        <Link to='/home' className='text-2xl font-bold uppercase'>
                            <div className='flex items-center justify-center gap-3'>
                                <img src={Logo} alt='Gestok' className='max-w-30 '/>
                            </div>
                        </Link>
                    </NavbarBrand>

                    <div className="flex md:order-2">
                        <Link to='/login' className='flex items-center justify-center'>
                            <Button
                                className='bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700 focus:outline-none focus:ring-0 cursor-pointer'>
                                <span className='text-xl '>Entrar</span>
                                <SignIn className='p-1 rounded-lg ' size={40} weight='fill'/>
                            </Button>
                        </Link>
                        <DarkThemeToggle className='cursor-pointer mx-4 hover:bg-gray-700 focus:outline-none focus:ring-0'/>
                        {/*<NavbarToggle className='focus:outline-none focus:ring-0'/>*/}
                    </div>
                </Navbar>
            </>
        )
    }

    return (
        <>
            {navbarComponent}
        </>
    )
}

export default NavbarElement;