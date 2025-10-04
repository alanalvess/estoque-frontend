import './App.css'
import {AuthProvider} from "./contexts/AuthContext.tsx";
import NavbarElement from "./components/navbarElement/NavbarElement.tsx";
import Home from "./pages/home/Home.tsx";
import RegistroPresencaPage from "./pages/professores/registroPresenca/RegistroPresencaPage.tsx";
import RegistroNotasPage from "./pages/professores/registroNotas/RegistroNotasPage.tsx";
import AvaliacoesPage from "./pages/professores/avaliacoes/AvaliacoesPage.tsx";
import RegistroObservacoesPage from "./pages/professores/Observacoes/RegistroObservacoesPage.tsx";
import DashboardProfessorPage from "./pages/professores/dashboard/DashboardProfessorPage.tsx";
import TurmasPage from "./pages/coordenacao/turmas/TurmasPage.tsx";
import ProfessoresPage from "./pages/coordenacao/Professores/ProfessoresPage.tsx";
import AlunosPage from "./pages/coordenacao/alunos/AlunosPage.tsx";
import DisciplinasPage from "./pages/coordenacao/disciplinas/DisciplinasPage.tsx";
import MatriculasPage from "./pages/coordenacao/matriculas/MatriculasPage.tsx";
import DashboardCoordenacaoPage from "./pages/coordenacao/dashboard/DashboardCoordenacao.tsx";
import RelatoriosPage from "./pages/coordenacao/relatorios/RelatoriosPage.tsx";
import Login from "./pages/login/Login.tsx";
import Cadastro from "./pages/cadastro/Cadastro.tsx";
import FormularioUsuario from "./components/usuarios/formularioUsuario/FormularioUsuario.tsx";
import Perfil from "./pages/usuario/perfil/Perfil.tsx";
import Usuarios from "./pages/usuarios/Usuarios.tsx";
import EditarUsuario from "./pages/usuario/editarUsuario/EditarUsuario.tsx";
import Admin from "./pages/usuario/admin/Admin.tsx";
import Sobre from "./pages/sobre/Sobre.tsx";
import Duvidas from "./pages/duvidas/Duvidas.tsx";
import Erro500 from "./pages/erros/Erro500.tsx";
import Erro404 from "./pages/erros/Error404.tsx";
import FooterElement from "./components/footerElement/FooterElement.tsx";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {ToastContainer} from "react-toastify";

function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter>

          <ToastContainer/>

          <div className='min-w-full m-0 p-0  dark:bg-gray-500 min-h-screen'>

            <NavbarElement/>
            <div className='dark:bg-gray-500 min-h-[90vh]'>

              <Routes>

                <Route path='/' element={<Home/>}/>
                <Route path='/home' element={<Home/>}/>

                <Route path='/presenca' element={<RegistroPresencaPage/>}/>
                <Route path='/notas' element={<RegistroNotasPage/>}/>
                <Route path='/avaliacoes' element={<AvaliacoesPage/>}/>
                <Route path='/observacoes' element={<RegistroObservacoesPage/>}/>
                <Route path='/dashboardProfessor' element={<DashboardProfessorPage/>}/>

                <Route path='/turmas' element={<TurmasPage/>}/>
                <Route path='/professores' element={<ProfessoresPage/>}/>
                <Route path='/alunos' element={<AlunosPage/>}/>
                <Route path='/disciplinas' element={<DisciplinasPage/>}/>
                <Route path='/matriculas' element={<MatriculasPage/>}/>
                <Route path='/dashboardCoordenacao' element={<DashboardCoordenacaoPage/>}/>
                <Route path='/relatorios' element={<RelatoriosPage/>}/>


                <Route path='/login' element={<Login/>}/>
                <Route path='/cadastro' element={<Cadastro/>}/>
                <Route path='/cadastroUsuario' element={<FormularioUsuario/>}/>

                <Route path='/presenca' element={<RegistroPresencaPage/>}/>

                <Route path="/perfil" element={<Perfil/>}/>
                <Route path="/perfil/:id" element={<Perfil/>}/>

                <Route path='/usuarios/all' element={<Usuarios/>}/>
                <Route path='/cadastroUsuarios' element={<FormularioUsuario/>}/>
                <Route path='/editarUsuario/:id' element={<FormularioUsuario/>}/>
                <Route path="/editarUsuarios/:id" element={<EditarUsuario/>}/>

                <Route path="/admin" element={<Admin/>}/>

                <Route path='/sobre' element={<Sobre/>}/>
                <Route path='/duvidas' element={<Duvidas/>}/>

                <Route path='/erro' element={<Erro500/>}/>
                <Route path='*' element={<Erro404/>}/>

              </Routes>
            </div>

            <div className='relative w-full '>
              <FooterElement/>
            </div>

          </div>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
