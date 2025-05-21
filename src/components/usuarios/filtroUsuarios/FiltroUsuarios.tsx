import Usuario from '../../../models/Usuario'

'use client';

interface FiltroUsuariosProps {
    filtrando: Usuario;
}

function FiltroUsuarios({filtrando}: FiltroUsuariosProps) {

    return (
        <>

            <div className="flex flex-wrap justify-between items-center w-full">
                <span
                    className='flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-start sm:break-words'
                    title={filtrando.nome}
                >
                    {filtrando.nome}
                </span>

            </div>
        </>
    )
}

export default FiltroUsuarios;