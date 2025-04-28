import Produto from "../../../models/Produto.ts";
import {useContext, useState} from "react";
import {AuthContext} from "../../../contexts/AuthContext.tsx";
import {buscar} from "../../../services/Service.ts";
import InputField from "../../form/InputField.tsx";
import {Button, Label, TextInput} from "flowbite-react";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {FiSearch, FiX} from "react-icons/fi";

interface SearchBarProps {
    onSearch: (produtos: Produto[]) => void;
    onClear: () => void;
}

function SearchBar({onSearch, onClear}: SearchBarProps) {

    const {usuario, handleLogout} = useContext(AuthContext);
    const token = usuario.token;

    const [nome, setNome] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNome(event.target.value);
    };

    async function handleSearch() {
        if (!nome.trim()) {
            onClear(); // Se nome vazio, traz tudo
            return;
        }

        try {
            const produtos: Produto[] = [];
            const setProdutos = (data: Produto[]) => produtos.push(...data);
            // await buscar(`/produtos/buscar/${nome}`, setProdutos, {
            await buscar(`/produtos/buscar/${encodeURIComponent(nome)}`, setProdutos, {

                headers: {
                    Authorization: token,
                },
            });
            onSearch(produtos);
        } catch (error) {
            if (error.toString().includes('400')) {
                // Se for erro 400, significa que não encontrou nenhum produto
                onSearch([]); // Manda lista vazia
            } else if (error.toString().includes('403')) {
                ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
                handleLogout();
            } else {
                ToastAlerta('Erro ao buscar produtos', Toast.Error);
            }
        }
    }

    function handleClear() {
        setNome('');
        onClear();
    }

    return (
        <div className="mt-5 p-5">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center w-full">
                <div className="relative w-full lg:mx-3">
                    <InputField
                        placeholder="Digite o nome do produto"
                        name="pesquisa"
                        value={nome}
                        onChange={handleInputChange}
                    />

                    <button
                        onClick={handleSearch}
                        type="button"
                        className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-azul-500"
                    >
                        <FiSearch size={22} />
                    </button>
                </div>

                <Button
                    onClick={handleClear}
                    className="h-10 flex items-center justify-center gap-2 px-3 rounded-md transition-all"
                    color="alternative"
                >
                    <FiX size={22} />
                </Button>
            </div>
        </div>
    );
}

export default SearchBar;