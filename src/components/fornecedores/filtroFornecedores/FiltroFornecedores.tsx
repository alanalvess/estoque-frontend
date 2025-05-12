import Fornecedor from '../../../models/Fornecedor'


interface FiltroFornecedoresProps {
    fornecedor: Fornecedor;
}

function FiltroFornecedores({fornecedor}: FiltroFornecedoresProps) {
    return (
        <>
            <div className="flex flex-wrap justify-between items-center w-full">
                <span
                    className='flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-start sm:break-words'
                    title={fornecedor.nome}
                >
                    {fornecedor.nome}
                </span>
            </div>
        </>
    )
}

export default FiltroFornecedores;