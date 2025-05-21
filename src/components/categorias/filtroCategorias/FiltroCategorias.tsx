import Categoria from '../../../models/Categoria'

'use client';

interface FiltroCategoriasProps {
    categoria: Categoria;
}

function FiltroCategorias({categoria}: FiltroCategoriasProps) {

    return (
        <>
            <div className="flex flex-wrap justify-between items-center w-full">
                <span
                    className='flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-start sm:break-words'
                    title={categoria.nome}
                >
                    {categoria.nome}
                </span>
            </div>
        </>
    )
}

export default FiltroCategorias;