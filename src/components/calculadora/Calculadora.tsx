import {useState} from 'react';
import {Drawer, Button, DrawerHeader, DrawerItems, Label, TextInput, Select} from 'flowbite-react';
import InputField from "../form/InputField.tsx";
import SelectField from "../form/SelectField.tsx";

export function Calculadora({open, onClose}) {
    const [modo, setModo] = useState(''); // modo padrão
    const [custo, setCusto] = useState('');
    const [venda, setVenda] = useState('');
    const [margem, setMargem] = useState('');
    const [lucro, setLucro] = useState('');

    const custoNum = parseFloat(custo);
    const vendaNum = parseFloat(venda);
    const margemNum = parseFloat(margem);
    const lucroNum = parseFloat(lucro);

    const modosDeCalculo = [
        {value: 'venda-com-margem', label: 'Margem Desejada (%)'},
        {value: 'venda-com-lucro', label: 'Lucro Desejado (R$)'},
        {value: 'lucro-com-venda', label: 'Valor de Venda (R$)'},
    ];


    let resultado = null;

    if (modo === 'lucro-com-venda' && !isNaN(custoNum) && !isNaN(vendaNum)) {
        const lucro = vendaNum - custoNum;
        const margemLucro = (lucro / custoNum) * 100;
        resultado = (
            <>
                <p>Lucro: <strong>R$ {lucro.toFixed(2)}</strong></p>
                <p>Margem: <strong>{margemLucro.toFixed(2)}%</strong></p>
            </>
        );
    }

    if (modo === 'venda-com-margem' && !isNaN(custoNum) && !isNaN(margemNum)) {
        const precoVenda = custoNum * (1 + margemNum / 100);
        const lucro = precoVenda - custoNum;
        resultado = (
            <>
                <p>Preço de Venda: <strong>R$ {precoVenda.toFixed(2)}</strong></p>
                <p>Lucro: <strong>R$ {lucro.toFixed(2)}</strong></p>
            </>
        );
    }

    if (modo === 'venda-com-lucro' && !isNaN(custoNum) && !isNaN(lucroNum)) {
        const precoVenda = custoNum + lucroNum;
        const margemLucro = (lucroNum / custoNum) * 100;
        resultado = (
            <>
                <p>Preço de Venda: <strong>R$ {precoVenda.toFixed(2)}</strong></p>
                <p>Margem: <strong>{margemLucro.toFixed(2)}%</strong></p>
            </>
        );
    }

    return (
        <Drawer open={open} onClose={onClose} position="right">
            <DrawerHeader title="Calculadora de Lucro"/>
            <DrawerItems>
                <div className="flex flex-col gap-4 p-4">

                    <SelectField
                        label="Modo de Cálculo"
                        name="modo"
                        value={modo}
                        onChange={(e) => setModo(e.target.value)}
                        options={modosDeCalculo}
                        required
                    />

                    <InputField
                        label='Valor de Custo (R$)'
                        name="custo"
                        type="number"
                        value={custo}
                        onChange={(e) => setCusto(e.target.value)}
                        placeholder="Ex: 50.00"
                    />

                    {modo === 'lucro-com-venda' && (
                        <InputField
                            label='Valor de Venda (R$)'
                            name="venda"
                            type="number"
                            value={venda}
                            onChange={(e) => setVenda(e.target.value)}
                            placeholder="Ex: 80.00"
                        />
                    )}

                    {modo === 'venda-com-margem' && (
                        <InputField
                            label="Margem Desejada (%)"
                            name="margem"
                            type="number"
                            value={margem}
                            onChange={(e) => setMargem(e.target.value)}
                            placeholder="Ex: 60"
                        />
                    )}

                    {modo === 'venda-com-lucro' && (
                        <InputField
                            label='Lucro Desejado (R$)'
                            name="lucro"
                            type="number"
                            value={lucro}
                            onChange={(e) => setLucro(e.target.value)}
                            placeholder="Ex: 30.00"
                        />
                    )}

                    {resultado && (
                        <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-lg">
                            {resultado}
                        </div>
                    )}

                    <Button className='bg-rose-600 dark:bg-rose-600 hover:bg-rose-700 dark:hover:bg-rose-700 focus:outline-none focus:ring-0 cursor-pointer' onClick={onClose}>Fechar</Button>
                </div>
            </DrawerItems>
        </Drawer>
    );
}
