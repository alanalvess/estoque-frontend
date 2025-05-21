import {JSX} from "react";
import {ListGroup, ListGroupItem} from "flowbite-react";
import InputField from "../form/InputField.tsx";

export default function FiltroList<T extends { id: any; nome: string }>({
                                                                            titulo,
                                                                            itens,
                                                                            selecionados,
                                                                            busca,
                                                                            onBuscaChange,
                                                                            onToggle,
                                                                            renderItem
                                                                        }: {
    titulo: string;
    itens: T[];
    selecionados: string[];
    busca: string;
    onBuscaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onToggle: (nome: string) => void;
    renderItem: (item: T) => JSX.Element;
}) {
    return (
        <ListGroup className="sm:w-48 mx-auto mb-4 max-h-[60vh] overflow-y-auto rounded-xl"
                   theme={{
                       base: "list-none rounded-none border-none border-gray-200 bg-gray-100 text-left text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white",

                   }}
        >
            <h4 className="text-2xl text-center py-2 bg-teal-700 dark:bg-gray-900 text-white">{titulo}</h4>
            <InputField
                name="search"
                value={busca}
                onChange={onBuscaChange}
                placeholder={`Buscar ${titulo}`}
                className="p-2 mb-2"
            />

            {itens.length > 0 ? (
                itens.map(item => (
                    <ListGroupItem
                        key={item.id}
                        onClick={() => onToggle(item.nome)}
                        active={selecionados.includes(item.nome)}
                        className={selecionados.includes(item.nome) ? 'font-bold' : ''}
                        theme={{
                            base: "[&>*]:first:rounded-none [&>*]:last:rounded-none [&>*]:last:border-none",
                            link: {
                                base: "flex w-full items-center border-b border-gray-200 px-4 py-2 dark:border-gray-600",
                                active: {
                                    off: "hover:bg-gray-200 hover:text-gray-700 focus:text-gray-700 focus:outline-none focus:ring-0 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500",
                                    on: "bg-gray-700 text-white dark:bg-gray-800"
                                },
                                disabled: {
                                    off: "",
                                    on: "cursor-not-allowed bg-gray-100 text-gray-900 hover:bg-gray-100 hover:text-gray-900 focus:text-gray-900"
                                },
                                href: {
                                    off: "",
                                    on: ""
                                },
                                icon: "mr-2 h-4 w-4 fill-current"
                            }
                        }}
                    >
                        {renderItem(item)}
                    </ListGroupItem>
                ))
            ) : (
                <ListGroupItem className="text-center text-gray-500">
                    {busca.trim() ? `${titulo} não localizado.` : `Não há ${titulo.toLowerCase()} cadastrada.`}
                </ListGroupItem>
            )}
        </ListGroup>
    )
}
