export function formatarCpfCnpj(valor: string): string {
    const numeros = valor.replace(/\D/g, '').slice(0, 14);

    if (numeros.length <= 11) {
        return numeros
            .replace(/^(\d{3})(\d)/, '$1.$2')
            .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d*)/, '$1.$2.$3-$4');
    } else {
        return numeros
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
            .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d*)/, '$1.$2.$3/$4-$5');
    }
}

export function formatarTelefone(valor: string): string {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    if (numeros.length <= 2) {
        return `(${numeros}`;
    } else if (numeros.length <= 3) {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    } else if (numeros.length <= 7) {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 3)} ${numeros.slice(3)}`;
    } else {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 3)} ${numeros.slice(3, 7)}-${numeros.slice(7)}`;
    }
}

export function formatarData(data: string | undefined): string {
    if (!data) return '—';

    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}
