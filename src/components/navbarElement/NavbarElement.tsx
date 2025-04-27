import {useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {SignOut} from '@phosphor-icons/react'

import {AuthContext} from '../../contexts/AuthContext'
import {Toast, ToastAlerta} from '../../utils/ToastAlerta'

import Logo from '../../assets/images/gestok.png'

import {Button, DarkThemeToggle, Navbar, NavbarBrand} from 'flowbite-react'

function NavbarElement() {

    let navbarComponent;

    const navigate = useNavigate();

    const {usuario, handleLogout} = useContext(AuthContext);

    function logout() {
        handleLogout();
        ToastAlerta('Usuário deslogado', Toast.Success);
        navigate('/login');
    }

    if (usuario.token !== '') {
        navbarComponent = (
            <>
                <Navbar fluid className='bg-gray-800 fixed top-0 z-40 w-full justify-between '>
                    <NavbarBrand>
                        <Link to='/login' className='text-2xl font-bold uppercase'>
                            <div className='flex items-center justify-center gap-3'>
                                <img src={Logo} alt='Gestok' className='max-w-30 ml-2 my-3'/>

                            </div>
                        </Link>
                    </NavbarBrand>

                    <div className='flex justify-center'>
                        <Link to='' onClick={logout} className='flex items-center justify-center'>
                            <Button>
                                <span className='text-xl '>Sair</span>
                                <SignOut className='p-1 rounded-lg ' size={40} weight='fill'/>
                            </Button>
                        </Link>

                        <DarkThemeToggle className='bg-blue-100 mx-4 dark:bg-dark-400'/>
                    </div>
                </Navbar>
            </>
        );


    } else {
        navbarComponent = (
            <>
                <Navbar fluid className='bg-gray-800 fixed top-0 z-40 w-full '>
                    <NavbarBrand>
                        <Link to='/login' className='text-2xl font-bold uppercase'>
                            <div className='flex items-center justify-center gap-3'>
                                <img src={Logo} alt='Gestok' className='max-w-30 '/>

                            </div>
                        </Link>
                    </NavbarBrand>

                    <DarkThemeToggle className='bg-blue-100 mx-4 dark:bg-dark-400'/>

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