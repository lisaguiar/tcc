import React from "react"
import { Link } from "react-router-dom"
import "../styles/Initial.css"
import desktop from "../images/área.png"
import notes from "../images/anotação.png"
import gadgets from "../images/calculadora.png"
import message from "../images/mensagem.png"
import { NaoLogado } from "../components/IsLogged"

const Initial = () => {

    function Functionality (props) {
        return (
            <div className="functionalities__content">
                <div className="functionalities__image">
                    <img src={props.image} alt=""/>
                </div>
                <div className="functionalities__description">
                    <p>{props.description}</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            {NaoLogado()}
            <div className="main">
                <div className="main__title">
                    <h1>Potencialize sua produtividade acadêmica com o Focus Task!</h1>
                </div>
                <div className="main__description">
                    <h3>Simplifique sua rotina acadêmica, elimine a papelada e concentre-se no que realmente importa: seus estudos.</h3>
                </div>
                <div className="main__button">
                    <button><h4>Começe já! →</h4></button>
                    <div className="main__free">
                        <p>Teste grátis ✦ Não é necessário cartão de crédito</p>
                    </div>
                </div>
            </div> 
            <div className="space"></div>
            <div className="functionalities">
                <div className="functionalities__title">
                    <h1>Funcionalidades que o nosso sistema oferece:</h1>
                </div>
                <Functionality image={desktop} description="Crie áreas de trabalho personalizadas para cada disciplina, projeto ou tarefa. Mantenha seus materiais e tarefas organizados em um espaço dedicado a cada contexto acadêmico."/>
                <Functionality image={notes} description="Faça anotações diretamente no sistema. Registre ideias, insights, lembretes e informações importantes relacionadas a projetos e disciplinas específicas. Tenha tudo em um só lugar para fácil acesso."/>
                <Functionality image={message} description="Receba notificações em tempo real sobre atividades relevantes nos seus quadros. Seja informado sobre comentários, atualizações e prazos. Fique sempre atualizado e não perca nenhum detalhe importante."/>
                <Functionality image={gadgets} description="Acesse gadgets úteis, como timers e calculadoras, diretamente no sistema. Otimize seu tempo de estudo, faça cálculos rápidos e tenha ferramentas convenientes ao seu alcance."/>
            </div>
        </div>
    )
}

export default Initial