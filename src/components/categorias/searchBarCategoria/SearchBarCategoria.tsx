import {useContext, useState} from "react";
import {AuthContext} from "../../../contexts/AuthContext.tsx";
import {buscar} from "../../../services/Service.ts";
import InputField from "../../form/InputField.tsx";
import {Button} from "flowbite-react";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {FiSearch, FiX} from "react-icons/fi";
import Categoria from "../../../models/Categoria.ts";
import {Form} from "react-router-dom";

interface SearchBarCategoriaProps {
    onSearch: (categorias: Categoria[], tipoBusca: 'nome' | 'todos') => void;
    onClear: () => void;
}

function SearchBarCategoria({onSearch, onClear}: SearchBarCategoriaProps) {

    const {usuario, handleLogout} = useContext(AuthContext);
    const token = usuario.token;

    const [query, setQuery] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    async function handleSearch() {
        if (!query.trim()) {
            onClear(); // Se nome vazio, traz tudo
            return;
        }

        const pesquisa = query.trim();

        const authHeaders = {headers: {Authorization: token}};

        try {

            const categorias: Categoria[] = [];
            const setCategorias = (data: Categoria[]) => categorias.push(...data);

            await buscar(`/categorias/buscar/${encodeURIComponent(pesquisa)}`, setCategorias, authHeaders);
            onSearch(categorias, 'nome');


        } catch (error) {
            if (error.toString().includes('400')) {
                // Se for erro 400, significa que não encontrou nenhumacategoria
                onSearch([], 'nome'); // Manda lista vazia
            } else if (error.toString().includes('403')) {
                ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
                handleLogout();
            } else {
                ToastAlerta('Erro ao buscar categorias', Toast.Error);
            }
        }
    }

    function handleClear() {
        setQuery('');
        onClear();
        onSearch([], 'todos');
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault(); // Impede o reload da página
                handleSearch();     // Chama a função de busca
            }}
            className="mt-5 py-5"
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center w-full">
                <div className="relative w-full">
                    <InputField
                        placeholder="Digite o nome da categoria"
                        name="pesquisa"
                        value={query}
                        onChange={handleInputChange}
                    />

                    <button
                        // onClick={handleSearch}
                        type="submit"
                        className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-azul-500"
                    >
                        <FiSearch size={22}/>
                    </button>
                </div>

                <Button
                    onClick={handleClear}
                    className="cursor-pointer h-10 flex items-center justify-center gap-2 px-3 rounded-md transition-all hover:text-rose-500 dark:hover:text-rose-500 focus:outline-none focus:ring-0"
                    color="alternative"
                >
                    <FiX size={22}/>
                </Button>
            </div>
        </form>
    );
}

export default SearchBarCategoria;