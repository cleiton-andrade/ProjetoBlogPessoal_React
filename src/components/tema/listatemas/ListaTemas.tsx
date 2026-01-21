import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { AuthContext } from "../../../contexts/AuthContext";
import type Tema from "../../../models/Tema";
import { buscar } from "../../../services/Service";
import CardTema from "../cardtema/CardTema";

function ListaTemas() {

    const navigate = useNavigate(); //é um hook(useNavigate) do React Router que cria uma função para mudar de página via código. Ele permite redirecionar o usuário para outra rota sem recarregar a aplicação.

    const [isLoading, setIsLoading] = useState<boolean>(false) // Deste ponto: (estado de carregamento)

    const [temas, setTemas] = useState<Tema[]>([]) // (estado para armazenar a lista de temas (começa como array vazio))

    const { usuario, handleLogout } = useContext(AuthContext)
    const token = usuario.token // (obtém o token de autenticação do contexto de autenticação) | Até este ponto: Cria estados para controlar carregamento (isLoading) e lista de temas (temas). Acessa os dados do usuário autenticado via Context e obtém o token para autenticação.

    useEffect(() => { // Hook que executa efeito colateral (navegação) quando o token muda
        if (token === '') { // Se o token estiver vazio (usuário não autenticado)
            alert('Você precisa estar logado!') // Mostra um alerta informando que o usuário precisa estar logado
            navigate('/') // Redireciona o usuário para a página inicial (login)
        }
    }, [token]) // Executa o efeito sempre que o token mudar

    useEffect(() => { // Hook que executa efeito colateral (busca de temas) quando o comprimento da lista de temas muda
        buscarTemas() // Chama a função para buscar temas da API
    }, [temas.length]) // Executa o efeito sempre que o comprimento da lista de temas mudar

    async function buscarTemas() { // função assincrona para buscar temas da API
        try { // bloco try-catch para tratar erros

            setIsLoading(true) // Define o estado de carregamento como verdadeiro antes de iniciar a busca

            await buscar('/temas', setTemas, { // Chama a função buscar para obter a lista de temas da API
                headers: { Authorization: token } // Inclui o token de autenticação no cabeçalho da requisição
            })
        } catch (error: any) { // captura qualquer erro que ocorra durante a busca
            if (error.toString().includes('401')) { // Se o erro for 401 (não autorizado)
                handleLogout() // Chama a função de logout para deslogar o usuário
            }
        }finally { // bloco finally que sempre será executado
            setIsLoading(false) // Define o estado de carregamento como falso após a conclusão da busca, independentemente do sucesso ou falha
        }
    }

    return (
        <>

            {isLoading && ( // Deste ponto:
                <div className="flex justify-center w-full my-8">
                    <SyncLoader
                        color="#312e81"
                        size={32}
                    />
                </div> // Até este ponto: Abre e fecha chaves para indicar o código JavaScript. Verifica se isLoading é verdadeiro. Se for, renderiza o componente SyncLoader (um spinner de carregamento) centralizado na tela.
            )} 

            <div className="flex justify-center w-full my-4"> {/* Deste ponto: */}
                <div className="container flex flex-col">

                    {(!isLoading && temas.length === 0) && (
                            <span className="text-3xl text-center my-8">
                                Nenhum Tema foi encontrado!
                            </span>
                    )} {/* Até este ponto: Cria um container centralizado usando Tailwind CSS. Exibe a mensagem “Nenhum Tema foi encontrado!” somente quando não está carregando e a lista de temas está vazia.*/}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Deste ponto: */}
                            {
                                temas.map((tema) => (
                                    <CardTema key={tema.id} tema={tema}/>
                                ))
                            }
                    </div> {/* Até este ponto: Cria um grid responsivo (1, 2 ou 3 colunas conforme o tamanho da tela). Percorre o array temas e renderiza um CardTema para cada item, usando o id como chave. */}
                </div>
            </div>
        </>
    )
}
export default ListaTemas;