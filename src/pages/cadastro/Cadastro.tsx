import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import type Usuario from "../../models/Usuario";
import { cadastrarUsuario } from "../../services/Service";

function Cadastro() {

  const navigate = useNavigate() //é um hook(useNavigate) do React Router que cria uma função para mudar de página via código. Ele permite redirecionar o usuário para outra rota sem recarregar a aplicação.
  
  const [isLoading, setIsLoading] = useState<boolean>(false) // Deste ponto -

  const[confirmarSenha, setConfirmarSenha] = useState<string>("")

  const [usuario, setUsuario] = useState<Usuario>({
    id: 0,
    nome: '',
    usuario: '',
    senha: '',
    foto: ''
  }) // - até este ponto, definimos que é Essa estrutura usa useState para criar estados no React com tipagem TypeScript. Ela controla carregamento (isLoading), confirmação de senha (confirmarSenha) e dados do usuário (usuario). Cada estado tem uma variável para leitura e uma função para atualização.
  
  useEffect(() => { // Deste ponto -
    if (usuario.id !== 0){
      retornar()
    }
  }, [usuario]) // - até este ponto, o useEffect executa uma ação sempre que o estado usuario muda. Se o id do usuário for diferente de zero, a função retornar() é chamada automaticamente. (uma análogia é: O usuario loga no linkedIn, e o efeito colateral é carregar o feed)

  function retornar(){
    navigate('/')
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>){ // Deste ponto -
    setUsuario({
      ...usuario, // (... os três pontos sigfinica -> expred operator): Ele copia todos os atributos do objeto usuario para o novo objeto que está sendo criado.
      [e.target.name]: e.target.value // "[e.target.name]": pega o nome do input e usa como chave do objeto dinamicamente. Já o "e.target.value" pega o valor digitado que será salvo no estado.
    })

  } // até este ponto: a função atualizarEstado recebe um parametro "e:"(evento), (quando o usuário clica em um botão é um evento). Esse evento que cuida dessas alteraçõe é o ChangeEvent.

  function handleConfirmarSenha(e: ChangeEvent<HTMLInputElement>){
    setConfirmarSenha(e.target.value)
  }

  async function cadastrarNovoUsuario(e: FormEvent<HTMLFormElement>){  // Essa função é assíncrona para permitir operações como requisições HTTP usando await.
    e.preventDefault() // "e.preventDefault()" impede o recarregamento da página ao enviar o formulário.

    if(confirmarSenha === usuario.senha && usuario.senha.length >= 8){ // Essa condição verifica se a senha digitada é igual à confirmação de senha. Também garante que a senha tenha pelo menos 8 caracteres antes de continuar.


      setIsLoading(true)

      try{ 
        await cadastrarUsuario(`/usuarios/cadastrar`, usuario, setUsuario)
        alert('Usuário cadastrado com sucesso!') // O try tenta executar o cadastro do usuário e exibe sucesso se funcionar.
      }catch(error){ 
        alert('Erro ao cadastrar o usuário!') // O catch captura erros e mostra uma mensagem caso a requisição falhe.
      }
    }else{ // Deste ponto -
      alert('Dados do usuário inconsistentes! Verifique as informações do cadastro.')
      setUsuario({...usuario, senha: ''})
      setConfirmarSenha('')
    } // - até este ponto: Esse bloco é executado quando os dados estão inválidos e mostra um alerta de erro. Ele limpa a senha e a confirmação para o usuário digitar novamente.


    setIsLoading(false)
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen 
            place-items-center font-bold">
        <div
          className="bg-[url('https://i.imgur.com/ZZFAmzo.jpg')] lg:block hidden bg-no-repeat 
                    w-full min-h-screen bg-cover bg-center"
        ></div>
        <form className='flex justify-center items-center flex-col w-2/3 gap-3' // <fomr> é o elemento HTML que cria um formulário para entrada de dados pelo usuário.
              onSubmit={cadastrarNovoUsuario}> {/* O onSubmit liga o envio do formulário à função cadastrarNovoUsuario, que lida com o processo de cadastro. */}

          <h2 className='text-slate-900 text-5xl'>Cadastrar</h2>
          <div className="flex flex-col w-full">
            <label htmlFor="nome">Nome</label>
            <input // Deste ponto -
              type="text"
              id="nome"
              name="nome"
              placeholder="Nome"
              className="border-2 border-slate-700 rounded p-2"
              value = {usuario.nome}
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)} // - até este ponto: Esse input está ligado ao estado `usuario.nome`, então o valor exibido vem do React (input controlado). O `onChange` chama `atualizarEstado` sempre que o usuário digita, atualizando o estado automaticamente.
            /> 
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              placeholder="Usuario"
              className="border-2 border-slate-700 rounded p-2"
              value = {usuario.usuario}
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="foto">Foto</label>
            <input
              type="text"
              id="foto"
              name="foto"
              placeholder="Foto"
              className="border-2 border-slate-700 rounded p-2"
              value = {usuario.foto}
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Senha"
              className="border-2 border-slate-700 rounded p-2"
              value = {usuario.senha}
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="confirmarSenha">Confirmar Senha</label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              placeholder="Confirmar Senha"
              className="border-2 border-slate-700 rounded p-2"
              value={confirmarSenha}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleConfirmarSenha(e)}
            />
          </div>
          <div className="flex justify-around w-full gap-8">
            <button 
                type='reset'
                className='rounded text-white bg-red-400 hover:bg-red-700 w-1/2 py-2'
                onClick={retornar}
             >
                Cancelar
            </button>
            <button 
                type='submit'
                className='rounded text-white bg-indigo-400 
                           hover:bg-indigo-900 w-1/2 py-2
                           flex justify-center' 
                >
                { isLoading ? 
                  <ClipLoader 
                    color="#ffffff" 
                    size={24}
                  /> : 
                  <span>Cadastrar</span> // Esse código usa renderização condicional: se `isLoading` for true, mostra o spinner `ClipLoader`. Se for false, exibe o texto **Cadastrar** no lugar.
                }
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Cadastro