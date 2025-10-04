import {useContext} from 'react'
import {Link} from 'react-router-dom'
import {PiSignInDuotone} from "react-icons/pi"

import {AuthContext} from '../../contexts/AuthContext'

import Logo from '../../assets/images/dia.png'

import {
  Badge,
  Button,
  DarkThemeToggle,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle
} from 'flowbite-react'
import DropdownPerfil from "./dropdownPerfil/DropdownPerfil.tsx";
import {Roles} from "../../enums/Roles.ts";
import {FaBell, FaBook, FaChartBar, FaClipboardList, FaGraduationCap, FaUsers} from "react-icons/fa";

function NavbarElement() {

  let navbarComponent;
  let notificationsCount;

  const {usuario} = useContext(AuthContext);

  const renderMenuLinks = () => {
    if (!usuario?.roles) return null;

    if (usuario.roles.includes(Roles.PROFESSOR)) {
      return (
        <>
          <NavbarLink href="/dashboardProfessor"><FaGraduationCap className="inline mr-1"/> Dashboard</NavbarLink>
          <NavbarLink href="/presenca"><FaClipboardList className="inline mr-1"/> Presença / QR</NavbarLink>
          <NavbarLink href="/notas"><FaClipboardList className="inline mr-1"/> Notas</NavbarLink>
          <NavbarLink href="/observacoes"><FaClipboardList className="inline mr-1"/> Observações</NavbarLink>
          <NavbarLink href="/avaliacoes"><FaClipboardList className="inline mr-1"/> Avaliações</NavbarLink>
        </>
      )
    }

    if (usuario.roles.includes(Roles.COORDENADOR)) {
      return (
        <>
          <div className="flex flex-col gap-4 text-center">
            <div className="flex gap-10 text-center">
              <NavbarLink href="/alunos"><FaGraduationCap className="inline mr-1"/> Alunos</NavbarLink>
              <NavbarLink href="/professores"><FaUsers className="inline mr-1"/> Professores</NavbarLink>
              <NavbarLink href="/turmas"><FaUsers className="inline mr-1"/> Turmas</NavbarLink>
              <NavbarLink href="/disciplinas"><FaBook className="inline mr-1"/> Disciplinas</NavbarLink>
            </div>

            <div className="flex gap-10">
              <NavbarLink href="/dashboardCoordenacao"><FaChartBar className="inline mr-1"/> Dashboard</NavbarLink>
              <NavbarLink href="/relatorios"><FaChartBar className="inline mr-1"/> Relatórios</NavbarLink>
              <NavbarLink href="/matriculas"><FaUsers className="inline mr-1"/> Matriculas</NavbarLink>
              <NavbarLink href="/alertas"><FaBell className="inline mr-1"/> Alertas</NavbarLink>
            </div>
          </div>
        </>
      )
    }

    if (usuario.roles.includes(Roles.RESPONSAVEL)) {
      return (
        <>
          <NavbarLink href="/dashboard"><FaGraduationCap className="inline mr-1"/> Dashboard</NavbarLink>
          <NavbarLink href="/notas"><FaClipboardList className="inline mr-1"/> Notas</NavbarLink>
          <NavbarLink href="/presenca"><FaClipboardList className="inline mr-1"/> Presença</NavbarLink>
          <NavbarLink href="/observacoes"><FaClipboardList className="inline mr-1"/> Observações</NavbarLink>
          <NavbarLink href="/alertas"><FaBell className="inline mr-1"/> Alertas</NavbarLink>
        </>
      )
    }

    return null;
  }


  if (usuario.token !== '') {
    navbarComponent = (
      <>
        <DropdownPerfil/>
      </>
    );

  } else {
    navbarComponent = (
      <Link to='/login' className='flex items-center justify-center'>
        <Button
          className='bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700 focus:outline-none focus:ring-0 cursor-pointer'>
          <span className='text-xl '>Entrar</span>
          <PiSignInDuotone className='p-1 rounded-lg ' size={40}/>
        </Button>
      </Link>

    )
  }

  return (
    <>
      <Navbar
        fluid
        className='bg-gray-800 fixed top-0 py-3 z-40 w-full justify-between'
      >
        <NavbarBrand>
          <Link to='/home' className='text-2xl font-bold uppercase'>
            <div className='flex items-center justify-center gap-3'>
              <img src={Logo} alt='Dia A+' className='max-w-30 ml-2 my-3 h-10'/>
            </div>
          </Link>
        </NavbarBrand>

        <div className="flex md:order-2 items-center space-x-4">
          {navbarComponent}

          <div className="relative flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-700 ">
            <FaBell className="text-gray-700 text-2xl"/>
            {notificationsCount > 0 && (
              <Badge
                color="failure"
                size="sm"
                className="absolute -top-1 -right-2"
              >
                {notificationsCount}
              </Badge>
            )}
          </div>

          <DarkThemeToggle className="cursor-pointer hover:bg-gray-700 focus:outline-none focus:ring-0"/>
          <NavbarToggle className="cursor-pointer focus:outline-none focus:ring-0"/>
        </div>

        <NavbarCollapse>
          {renderMenuLinks()}
        </NavbarCollapse>
      </Navbar>
    </>
  )
}

export default NavbarElement;