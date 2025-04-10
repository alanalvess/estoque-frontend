import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export const cadastrarUsuario = async (url: string, dados: Object, setDados: Function) => {
    const resposta = await api.post(url, dados);
    setDados(resposta.data);
}

export const login = async (url: string, dados: Object, setDados: Function) => {
    const resposta = await api.post(url, dados);
    setDados(resposta.data);
}

export const buscar = async (url: string, setDados: Function, header?: Object) => {
    const resposta = await api.get(url, header);
    setDados(resposta.data);
}

export const cadastrar = async (url: string, dados: Object, setDados: Function, header: Object) => {
    const resposta = await api.post(url, dados, header);
    setDados(resposta.data);
}

export const atualizar = async (url: string, dados: Object, setDados: Function, header: Object) => {
    const resposta = await api.put(url, dados, header);
    setDados(resposta.data);
}

export const atualizarAtributo = async (url: string, dados: Object, setDados: Function, header: Object) => {
    const resposta = await api.patch(url, dados, header);
    setDados(resposta.data);
}

// export async function atualizarAtributo<T>(
//     url: string,
//     dados: Partial<T>,
//     callback: (resposta: T) => void,
//     config = {}
// ) {
//     try {
//         const resposta = await axios.patch(url, dados, config);
//         callback(resposta.data);
//     } catch (error: any) {
//         console.error("Erro no atualizarAtributo:", error.response?.data || error.message);
//         throw error;
//     }
// }


export const deletar = async (url: string, header: Object) => {
    await api.delete(url, header);
}

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 500) {
                window.location.href = '/erro';
            }
        }
        return Promise.reject(error);
    }
);