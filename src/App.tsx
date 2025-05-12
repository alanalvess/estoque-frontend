import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';

import {AuthProvider} from './contexts/AuthContext';

import NavbarElement from './components/navbarElement/NavbarElement';
import FooterElement from './components/footerElement/FooterElement';
import Login from './pages/login/Login';
import Cadastro from './pages/cadastro/Cadastro';

import FormularioCategoria from './components/categorias/formularioCategoria/FormularioCategoria';
import DeletarCategoria from './components/categorias/deletarCategoria/DeletarCategoria';

import Produtos from './pages/produtos/Produtos';
import FormularioProduto from './components/produtos/formularioProduto/FormularioProduto';
import DeletarProduto from './components/produtos/deletarProduto/DeletarProduto';

import Sobre from './pages/sobre/Sobre';

import 'react-toastify/dist/ReactToastify.css';
import Erro500 from './pages/erros/Erro500.tsx';
import Erro404 from './pages/erros/Error404.tsx';
import FormularioFornecedor from './components/fornecedores/formularioFornecedor/FormularioFornecedor.tsx';
import DeletarFornecedor from './components/fornecedores/deletarFornecedor/DeletarFornecedor.tsx';
import Duvidas from './pages/duvidas/Duvidas.tsx';
import Home from "./pages/home/Home.tsx";
import FiltroFornecedores from "./components/fornecedores/filtroFornecedores/FiltroFornecedores.tsx";
import Fornecedores from "./pages/fornecedores/Fornecedores.tsx";
import Categorias from "./pages/categorias/Categorias.tsx";
import Marcas from "./pages/marcas/Marcas.tsx";
import FormularioMarca from "./components/marcas/formularioMarca/FormularioMarca.tsx";
import DeletarMarca from "./components/marcas/deletarMarca/DeletarMarca.tsx";

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

                                <Route path='/login' element={<Login/>}/>
                                <Route path='/cadastro' element={<Cadastro/>}/>

                                <Route path='/categorias/all' element={<Categorias/>}/>
                                <Route path='/cadastroCategoria' element={<FormularioCategoria/>}/>
                                <Route path='/editarCategoria/:id' element={<FormularioCategoria/>}/>
                                {/*<Route path='/deletarCategoria/:id' element={<DeletarCategoria/>}/>*/}

                                <Route path='/fornecedores/all' element={<Fornecedores/>}/>
                                <Route path='/cadastroFornecedor' element={<FormularioFornecedor/>}/>
                                <Route path='/editarFornecedor/:id' element={<FormularioFornecedor/>}/>
                                {/*<Route path='/deletarFornecedor/:id' element={<DeletarFornecedor/>}/>*/}

                                <Route path='/marcas/all' element={<Marcas/>}/>
                                <Route path='/cadastroMarca' element={<FormularioMarca/>}/>
                                <Route path='/editarMarca/:id' element={<FormularioMarca/>}/>
                                {/*<Route path='/deletarMarca/:id' element={<DeletarMarca/>}/>*/}

                                <Route path='/produtos/all' element={<Produtos/>}/>
                                <Route path='/cadastroProduto' element={<FormularioProduto/>}/>
                                <Route path='/editarProduto/:id' element={<FormularioProduto/>}/>
                                {/*<Route path='/deletarProduto/:id' element={<DeletarProduto/>}/>*/}

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