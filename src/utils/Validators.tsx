export function validarCPF(cpf: string): boolean {
    const numeros = cpf.replace(/\D/g, '');
    if (numeros.length !== 11 || /^(\d)\1+$/.test(numeros)) return false;

    const calcDigito = (base: string, pesoInicial: number) =>
        base.split('').reduce((soma, num, i) => soma + parseInt(num) * (pesoInicial - i), 0) % 11;

    const dig1 = calcDigito(numeros.substring(0, 9), 10);
    const ver1 = dig1 < 2 ? 0 : 11 - dig1;

    const dig2 = calcDigito(numeros.substring(0, 9) + ver1, 11);
    const ver2 = dig2 < 2 ? 0 : 11 - dig2;

    return numeros.endsWith(`${ver1}${ver2}`);
}

export function validarCNPJ(cnpj: string): boolean {
    const numeros = cnpj.replace(/\D/g, '');
    if (numeros.length !== 14 || /^(\d)\1+$/.test(numeros)) return false;

    const calcDigito = (base: string, pesos: number[]) =>
        base.split('').reduce((soma, num, i) => soma + parseInt(num) * pesos[i], 0) % 11;

    const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const dig1 = calcDigito(numeros.substring(0, 12), pesos1);
    const ver1 = dig1 < 2 ? 0 : 11 - dig1;

    const pesos2 = [6, ...pesos1];
    const dig2 = calcDigito(numeros.substring(0, 12) + ver1, pesos2);
    const ver2 = dig2 < 2 ? 0 : 11 - dig2;

    return numeros.endsWith(`${ver1}${ver2}`);
}
