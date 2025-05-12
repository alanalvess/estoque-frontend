import Marca from '../../../models/Marca'

interface FiltroMarcasProps {
    marca: Marca;
}

function FiltroMarcas({marca}: FiltroMarcasProps) {

    return (
        <>
            <div className="flex flex-wrap justify-between items-center w-full">
                <span
                    className='flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-start sm:break-words'
                    title={marca.nome}
                >
                    {marca.nome}
                </span>
            </div>
        </>
    )
}

export default FiltroMarcas;