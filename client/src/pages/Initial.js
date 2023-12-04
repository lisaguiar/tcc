import React from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import "../styles/Initial.css"
import desktop from "../images/área.png"
import notes from "../images/anotação.png"
import gadgets from "../images/calculadora.png"
import message from "../images/mensagem.png"
import { NaoLogado } from "../components/IsLogged"
import background from "../images/svg_2.png"
import landing_image from "../images/Learning-cuate.png"
import waves from "../images/stacked-waves-haikei.png"
import Slider from "react-slick"
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Initial = () => {

    const navigate = useNavigate()

    function Functionality (props) {
        return (
            <div className="w-slick-card card block h-[300px]">
                <div className="w-full h-10 bg-light-purple">
                   
                </div>
                <div className="relative pt-6 pr-4 pb-4 pl-4">
                    <div className="rounded-lg border-1 h-12 left-4 absolute top-[-1.5rem] w-14 bg-white flex items-center justify-center">
                        <img src={props.image} className="w-[60%]"/>
                    </div>
                    <div className="w-full text-start font-semibold my-1">
                        <p>{props.title}</p>
                    </div>
                    <div className="text-justify mt-3 flex-grow">
                        <p>{props.description}</p>
                    </div>
                </div>
              
                {/*<div className="w-full flex justify-start items-center mt-6 space-x-2">
                    <a className="text-list">Aprenda mais</a>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 26 24" fill="none">
                        <g clip-path="url(#clip0_213_205)">
                        <path d="M23.124 9.90711L19.245 6.02911C19.0575 5.84164 18.8032 5.73633 18.538 5.73633C18.2728 5.73633 18.0185 5.84164 17.831 6.02911C17.6435 6.21664 17.5382 6.47095 17.5382 6.73611C17.5382 7.00128 17.6435 7.25559 17.831 7.44311L21.386 11.0001H1C0.734784 11.0001 0.48043 11.1055 0.292893 11.293C0.105357 11.4805 0 11.7349 0 12.0001H0C0 12.2653 0.105357 12.5197 0.292893 12.7072C0.48043 12.8948 0.734784 13.0001 1 13.0001H21.447L17.831 16.6151C17.738 16.708 17.6643 16.8183 17.6139 16.9397C17.5636 17.0611 17.5377 17.1912 17.5377 17.3226C17.5377 17.454 17.5636 17.5842 17.6139 17.7056C17.6643 17.827 17.738 17.9372 17.831 18.0301C18.0185 18.2176 18.2728 18.3229 18.538 18.3229C18.8032 18.3229 19.0575 18.2176 19.245 18.0301L23.125 14.1511C23.6859 13.5873 24.0007 12.8242 24.0006 12.0289C24.0004 11.2336 23.6852 10.4707 23.124 9.90711Z" fill="#8185DA"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_213_205">
                            <rect width="24" height="24" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                </div>*/}
            </div>
        )
    }

    const Title = () => {
        return (
            <>
                <div className="w-1/2 flex flex-wrap items-center justify-start text-white">
                    <div className="flex flex-wrap h-1/5">
                        <h1 className="">focustastic</h1>
                        <h2 className="mt-4">Simplifique sua rotina acadêmica, elimine a papelada e concentre-se no que realmente importa: seus estudos.</h2>
                    </div>
                    <div className="flex h-1/5 w-full flex-wrap">
                        <button className="button-white w-1/2" onClick={() => navigate("/logastro")}><h4>Comece já! →</h4></button>
                    </div>
                </div> 
                <div className="w-1/2 h-full flex flex-wrap">
                    <img src={landing_image} alt="imagem descritiva do sistema" className="ml-auto max-w-md h-auto rounded-full bg-white"/>
                </div>
            </> 
        )
    } 

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
    };
    
    const backgroundStyle = {
        backgroundImage: `url(${waves})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        adaptiveHeight: true,
       /* prevArrow: <SeuBotaoPrev />, 
        nextArrow: <SeuBotaoNext />,*/
    }

    return (
        <div className="flex justify-center flex-wrap bg-light">
            {NaoLogado()}
            <div className="flex w-full px-96 p-header-top" style={backgroundStyle}>
               <Title/>
            </div>
            
            <div className="w-full p-header-top flex flex-wrap justify-center text-center items-center px-96">
                <div className="flex flex-wrap items-center text-center">
                    <h2 className="w-full text-list">Noções básicas do nosso sistema</h2>
                    <p className="w-full px-20">Nós proporcionamos aos jovens oportunidades para o desenvolvimento de carreira em suas práticas. Além disso, oferecemos suporte a uma ampla gama de serviços para garantir a satisfação do cliente.</p>
                </div>
                <div className="w-full p-header-top">
                    <Slider {...settings} className="slick-no-hover">
                        <Functionality image={desktop} title="Melhor organização" description="Crie áreas de trabalho personalizadas para cada disciplina, projeto ou tarefa. Mantenha seus materiais organizados em um espaço dedicado a cada contexto acadêmico."/>
                        <Functionality image={notes} title="Faça Anotações" description="Faça anotações diretamente no sistema. Registre ideias, insights, lembretes e informações importantes relacionadas a projetos e disciplinas específicas."/>
                        <Functionality image={message} title="Alertas de projeto" description="Receba notificações em tempo real sobre atividades relevantes nos seus quadros. Seja informado sobre comentários, atualizações e prazos."/>
                        <Functionality image={gadgets} title="Maior controle de tempo" description="Acesse gadgets úteis, como timers e calculadoras, diretamente no sistema. Otimize seu tempo de estudo, faça cálculos rápidos e tenha ferramentas convenientes ao seu alcance."/>
                    </Slider>
                    
                </div> 
            </div>

            <div className="w-full pt-48 mx-96 flex flex-wrap justify-center text-center items-center">
            </div>
        </div>
    )
}

export default Initial