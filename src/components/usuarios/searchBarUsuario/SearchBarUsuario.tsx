import {useContext, useState} from "react";
import {AuthContext} from "../../../contexts/AuthContext.tsx";
import {buscar} from "../../../services/Service.ts";
import InputField from "../../form/InputField.tsx";
import {Button} from "flowbite-react";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {FiSearch, FiX} from "react-icons/fi";
import Usuario from "../../../models/Usuario.ts";

interface SearchBarUsuarioProps {
    onSearch: (usuarios: Usuario[], tipoBusca: 'nome' | 'todos') => void;
    onClear: () => void;
}

function SearchBarUsuario({onSearch, onClear}: SearchBarUsuarioProps) {

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

            const usuarios: Usuario[] = [];
            const setUsuarios = (data: Usuario[]) => usuarios.push(...data);

            await buscar(`/usuarios/buscar/${encodeURIComponent(pesquisa)}`, setUsuarios, authHeaders);
            onSearch(usuarios, 'nome');


        } catch (error) {
            if (error.toString().includes('400')) {
                onSearch([], 'nome'); // Manda lista vazia
            } else if (error.toString().includes('403')) {
                ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
                handleLogout();
            } else {
                ToastAlerta('Erro ao buscar Usuários', Toast.Error);
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
                e.preventDefault();
                handleSearch();
            }}
            className="mt-5 py-5"
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center w-full">
                <div className="relative w-full">
                    <InputField
                        placeholder="Digite o nome do Usuário"
                        name="pesquisa"
                        value={query}
                        onChange={handleInputChange}
                    />

                    <button
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

export default SearchBarUsuario;