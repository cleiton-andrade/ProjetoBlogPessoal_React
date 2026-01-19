import { useState, useContext, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { AuthContext } from "../../../contexts/AuthContext";
import type Tema from "../../../models/Tema";
import { buscar, atualizar, cadastrar } from "../../../services/Service";

function FormTema() {

    const navigate = useNavigate(); // useNavigate() cria uma função para navegar entre páginas do sistema.
    const [tema, setTema] = useState<Tema>({} as Tema) // useState<Tema> cria um estado para armazenar dados do objeto Tema.
    const [isLoading, setIsLoading] = useState<boolean>(false) // useState<boolean> controla o estado de carregamento (loading) da aplicação.
    const { usuario, handleLogout } = useContext(AuthContext) // useContext(AuthContext) acessa os dados globais do usuário logado e a função de logout.
    const token = usuario.token // usuario.token extrai o token de autenticação para usar nas requisições à API.
    const { id } = useParams<{ id: string }>(); // useParams<{ id: string }>() define que o parâmetro id é do tipo string (TypeScript). E o { id } faz a desestruturação para usar o valor diretamente no componente.

    async function buscarPorId(id: string) {
        try {
            await buscar(`/temas/${id}`, setTema, {
                headers: { Authorization: token }
            })
        } catch (error: any) {
            if (error.toString().includes('401')) { // Verifica se o erro contém o código 401, indicando falha de autenticação ou token inválido. Já o erro 403 significa que o token expirou ou é inválido.
                handleLogout()
            }
        }
    }

    useEffect(() => { // - Deste ponto
        if (token === '') {
            alert('Você precisa estar logado!')
            navigate('/')
        }
    }, [token]) // - Até esse ponto: Faz o bloqueio de acesso à página caso o usuário não esteja logado.

    useEffect(() => { // - Deste ponto
        if (id !== undefined) {
            buscarPorId(id)
        }
    }, [id]) // - Até esse ponto: Esse useEffect executa a função buscarPorId(id) sempre que o id mudar. Ele garante que os dados sejam buscados apenas quando o parâmetro id existir.

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) { // Desse ponto
        setTema({
            ...tema,
            [e.target.name]: e.target.value
        })
    } // Até ess ponto: Essa função atualiza o estado tema conforme o usuário digita no input. Ela usa o name do campo como chave e mantém os outros valores com o operador spread (...tema).

    function retornar() { // Desse ponto
        navigate("/temas")
    } // Até esse ponto: Essa função usa o **navigate** para redirecionar o usuário para a rota **"/temas"**. Ela é usada para **voltar para a página de listagem de temas**.


    async function gerarNovoTema(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        if (id !== undefined) {
            try {
                await atualizar(`/temas`, tema, setTema, {
                    headers: { 'Authorization': token }
                })
                alert('O Tema foi atualizado com sucesso!')
            } catch (error: any) {
                if (error.toString().includes('401')) {
                    handleLogout()
                } else {
                    alert('Erro ao atualizar o tema.')
                }
            }
        } else {
            try {
                await cadastrar(`/temas`, tema, setTema, {
                    headers: { 'Authorization': token }
                })
                alert('O Tema foi cadastrado com sucesso!')
            } catch (error: any) {
                if (error.toString().includes('401')) {
                    handleLogout()
                } else {
                    alert('Erro ao cadastrar o tema.')
                }
            }
        }
        setIsLoading(false)
        retornar()
    }

    return (
        <div className="container flex flex-col items-center justify-center mx-auto">
            <h1 className="text-4xl text-center my-8">
                {id === undefined ? 'Cadastrar Tema' : "Editar Tema"}
            </h1>

            <form className="w-1/2 flex flex-col gap-4"
                onSubmit={gerarNovoTema} >
                <div className="flex flex-col gap-2">
                    <label htmlFor="descricao">Descrição do Tema</label>
                    <input
                        type="text"
                        placeholder="Descreva aqui seu tema"
                        name='descricao'
                        className="border-2 border-slate-700 rounded p-2"
                        value={tema.descricao}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>
                <button
                    className="rounded text-slate-100 bg-indigo-400 
                    hover:bg-indigo-800 w-1/2 py-2 mx-auto flex justify-center"
                    type="submit">
                    {isLoading ? <ClipLoader color="#ffffff" size={24} /> :
                        <span>{id === undefined ? 'Cadastrar' : 'Atualizar'}</span>
                    }
                </button>
            </form>
        </div>
    );
}

export default FormTema;