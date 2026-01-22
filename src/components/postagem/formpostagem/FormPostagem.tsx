import { useState, useContext, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { AuthContext } from "../../../contexts/AuthContext";
import type Postagem from "../../../models/Postagem";
import type Tema from "../../../models/Tema";
import { buscar, atualizar, cadastrar } from "../../../services/Service";

function FormPostagem() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [temas, setTemas] = useState<Tema[]>([]) // Lista de temas para o select

    const [tema, setTema] = useState<Tema>({ id: 0, descricao: '', }) // Tema selecionado
    const [postagem, setPostagem] = useState<Postagem>({} as Postagem) // Postagem a ser criada ou editada

    const { id } = useParams<{ id: string }>() // Pega o id da postagem pela URL

    const { usuario, handleLogout } = useContext(AuthContext) // Contexto de autenticação
    const token = usuario.token // Pega o token do usuário logado

    // Atualização de postagem - Função para buscar postagem por ID
    async function buscarPostagemPorId(id: string) { // Cria uma função assíncrona chamada buscarPostagemPorId que recebe um parâmetro id do tipo string. Ela é assíncrona porque vai fazer uma chamada à API (requisição HTTP).
        try { // Inicia um bloco de tratamento de erros. Tudo dentro do try será executado normalmente. Se ocorrer erro, vai para o catch.
            await buscar(`/postagens/${id}`, setPostagem, { // Chama a função buscar (provavelmente um helper de requisição). await faz a função esperar a resposta da API antes de continuar. /postagens/${id} monta a URL dinâmica (ex: /postagens/5). setPostagem é a função que vai atualizar o estado com os dados recebidos.
                headers: { Authorization: token } // Envia o token de autenticação no cabeçalho da requisição. Isso serve para provar que o usuário está logado/autorizado.
            }) // Fecha o objeto de configurações e a chamada da função buscar.
        } catch (error: any) { // Se acontecer algum erro na requisição, o código entra aqui. error: any indica que o erro pode ser de qualquer tipo.
            if (error.toString().includes('401')) { // Converte o erro para texto e verifica se ele contém 401(mais comum) ou 404. O código 401 significa: Não autorizado (token inválido ou expirado). ou o 404 Not Found (recurso não encontrado).
                handleLogout() // Executa a função que desloga o usuário, limpando sessão/token.
            } // Fecha o if.
        } // Fecha o catch.
    } // Fecha a função.

    // Atualização e Cadastro - Função para buscar tema por ID
    async function buscarTemaPorId(id: string) {
        try {
            await buscar(`/temas/${id}`, setTema, {
                headers: { Authorization: token }
            })
        } catch (error: any) {
            if (error.toString().includes('401')) {
                handleLogout()
            }
        }
    }

    // Atualização e Cadastro da Postagem - Função para buscar todos os temas
    async function buscarTemas() {
        try {
            await buscar('/temas', setTemas, {
                headers: { Authorization: token }
            })
        } catch (error: any) {
            if (error.toString().includes('401')) {
                handleLogout()
            }
        }
    }

    useEffect(() => {
        if (token === '') {
            alert('Você precisa estar logado');
            navigate('/');
        }
    }, [token])

    useEffect(() => {
        buscarTemas()

        if (id !== undefined) {
            buscarPostagemPorId(id)
        }
    }, [id])

    useEffect(() => {
        setPostagem({
            ...postagem, // Está espalhando as propriedades atuais do objeto postagem para garantir que nenhuma informação seja perdida.
            tema: tema,
        })
    }, [tema])

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setPostagem({
            ...postagem,
            [e.target.name]: e.target.value,
            tema: tema,
            usuario: usuario,
        });
    }

    function retornar() {
        navigate('/postagens');
    }

    async function gerarNovaPostagem(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        if (id !== undefined) {
            try {
                await atualizar(`/postagens`, postagem, setPostagem, {
                    headers: {
                        Authorization: token,
                    },
                });

                alert('Postagem atualizada com sucesso')

            } catch (error: any) {
                if (error.toString().includes('401')) {
                    handleLogout()
                } else {
                    alert('Erro ao atualizar a Postagem')
                }
            }

        } else {
            try {
                await cadastrar(`/postagens`, postagem, setPostagem, {
                    headers: {
                        Authorization: token,
                    },
                })

                alert('Postagem cadastrada com sucesso');

            } catch (error: any) {
                if (error.toString().includes('401')) {
                    handleLogout()
                } else {
                    alert('Erro ao cadastrar a Postagem');
                }
            }
        }

        setIsLoading(false)
        retornar()
    }

    const carregandoTema = tema.descricao === '';

    return (
        <div className="container flex flex-col mx-auto items-center">
            <h1 className="text-4xl text-center my-8">
                {id !== undefined ? 'Editar Postagem' : 'Cadastrar Postagem'}
            </h1>

            <form className="flex flex-col w-1/2 gap-4" onSubmit={gerarNovaPostagem}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="titulo">Título da Postagem</label>
                    <input
                        type="text"
                        placeholder="Titulo"
                        name="titulo"
                        required
                        className="border-2 border-slate-700 rounded p-2"
                        value={postagem.titulo}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="titulo">Texto da Postagem</label>
                    <input
                        type="text"
                        placeholder="Texto"
                        name="texto"
                        required
                        className="border-2 border-slate-700 rounded p-2"
                        value={postagem.texto}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <p>Tema da Postagem</p>
                    <select
                        name="tema"
                        id="tema"
                        className='border p-2 border-slate-800 rounded'
                        onChange={(e) => buscarTemaPorId(e.currentTarget.value)}
                    >
                        <option value="" selected disabled>Selecione um Tema</option>

                        {temas.map((tema) => (
                            <option key={tema.id} value={tema.id}>
                                {tema.descricao}
                            </option>
                        ))}

                    </select>
                </div>

                <button
                    type='submit'
                    className='rounded disabled:bg-slate-200 bg-indigo-400 hover:bg-indigo-800 
                     text-white font-bold w-1/2 mx-auto py-2 flex justify-center' disabled={carregandoTema}
                >
                    { isLoading ? 
                        <ClipLoader
                            color="#ffffff" size={24}
                        /> :
                        <span>{id !== undefined ? 'Cadastrar' : 'Atualizar'}</span>
                    }
                </button>
            </form>
        </div>
    );
}

export default FormPostagem;