import React from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import "../styles/Initial.css"
import desktop from "../images/área.png"
import notes from "../images/anotação.png"
import gadgets from "../images/calculadora.png"
import message from "../images/mensagem.png"
import { NaoLogado } from "../components/IsLogged"
import background from "../images/svg_2.png"
import foto from "../images/201560.png"

const Initial = () => {

    const navigate = useNavigate()

    function Functionality (props) {
        return (
            <div className="w-1/5 mt-9">
                <div className="w-full flex justify-center">
                    <img src={props.image} alt=""/>
                </div>
                <div className="text-justify mt-4">
                    <p>{props.description}</p>
                </div>
            </div>
        )
    }
    
    const backgroundStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '700px'
    }

    return (
        <div className="flex justify-center flex-wrap" style={backgroundStyle}>
            {NaoLogado()}
            <div className="max-w-7xl p-header-top flex items-center justify-center mx-80">
                <div className="w-1/2 h-full p-header-top flex flex-wrap">
                    <div className="h-4/5">
                        <h1>focustastic</h1>
                        <h2 className="mt-4">Simplifique sua rotina acadêmica, elimine a papelada e concentre-se no que realmente importa: seus estudos.</h2>
                    </div>
                    <div className="flex h-1/5 w-full flex-wrap items-end">
                        <button className="w-1/2" onClick={() => navigate("/logastro")}><h4>Começe já! →</h4></button>
                        <p className="w-full text-alert">Teste grátis ✦ Não é necessário cartão de crédito</p>
                    </div>
                </div> 
                <div className="w-1/2 h-full p-header-top flex flex-wrap">
                    <img src={foto} alt="imagem descritiva do sistema" className="ml-auto max-w-sm h-auto"/>
                </div>
            </div>
            
            <div className="w-full pt-48 flex flex-wrap justify-center text-center mx-80 items-center">
                <div className="flex items-start flex-wrap">
                    <h3 className="w-full font-medium text-list">Noções básicas do nosso sistema</h3>
                    <h2 className="w-full mt-3">Funcionalidades que o <span className="font-medium">focustastic</span> oferece:</h2>
                </div>
                <div className="flex flex-wrap w-full justify-between">
                    <Functionality image={desktop} description="Crie áreas de trabalho personalizadas para cada disciplina, projeto ou tarefa. Mantenha seus materiais e tarefas organizados em um espaço dedicado a cada contexto acadêmico."/>
                    <Functionality image={notes} description="Faça anotações diretamente no sistema. Registre ideias, insights, lembretes e informações importantes relacionadas a projetos e disciplinas específicas. Tenha tudo em um só lugar para fácil acesso."/>
                    <Functionality image={message} description="Receba notificações em tempo real sobre atividades relevantes nos seus quadros. Seja informado sobre comentários, atualizações e prazos. Fique sempre atualizado e não perca nenhum detalhe importante."/>
                    <Functionality image={gadgets} description="Acesse gadgets úteis, como timers e calculadoras, diretamente no sistema. Otimize seu tempo de estudo, faça cálculos rápidos e tenha ferramentas convenientes ao seu alcance."/>
                </div> 
            </div>

            <div className="w-full pt-48 flex flex-wrap justify-center text-center mx-80 items-center">
            </div>
        </div>
    )
}

export default Initial