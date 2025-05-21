import {useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem} from "flowbite-react";

import {AuthContext} from '../../../contexts/AuthContext';
import {Toast, ToastAlerta} from '../../../utils/ToastAlerta';
import User from "../../../assets/images/user.png";

function DropdownPerfil() {
    const navigate = useNavigate();
    const {usuario, handleLogout} = useContext(AuthContext);

    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

    function logout() {
        handleLogout();
        ToastAlerta('Usuário deslogado com sucesso', Toast.Success);
        navigate('/login');
    }

    return (
        <>
            <Dropdown
                label={<Avatar alt="User settings" className='cursor-pointer border-2 border-gray-400 hover:bg-gray-700'
                               img={User} rounded/>}
                arrowIcon={false}
                inline
            >
                <DropdownHeader>
                    <span className="block text-sm">{usuario.nome}</span>
                    <span className="block truncate text-sm font-medium">{usuario.email}</span>

                    {usuario.email !== adminEmail ?
                        '' :
                        <span className="block truncate text-sm font-medium">
                            <Link to='admin'>Administração</Link>
                        </span>
                    }
                </DropdownHeader>

                <DropdownDivider/>

                <Link to={`/perfil/${usuario.id}`} className="hover:underline">
                    <DropdownItem>
                        Meu Perfil
                    </DropdownItem>
                </Link>

                {usuario.email === import.meta.env.VITE_ADMIN_EMAIL
                    ? (<Link to="/usuarios/all" className="hover:underline">
                            <DropdownItem>
                                Demais Usuários
                            </DropdownItem>
                        </Link>
                    ) : ("")
                }

                <DropdownDivider/>

                <Link to="/home" onClick={logout} className="hover:underline">
                    <DropdownItem>
                        Sair
                    </DropdownItem>
                </Link>
            </Dropdown>
        </>
    )
}

export default DropdownPerfil;