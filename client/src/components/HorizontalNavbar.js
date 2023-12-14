import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MdPerson2, MdLogout } from 'react-icons/md'
import { useContext, useState } from 'react'
import { AuthContext } from '../contexts/auth'
import { CiLogout } from 'react-icons/ci'

import '../styles/HorizontalNavbar.css'
import { AiOutlineLogout, AiOutlineUser } from 'react-icons/ai'

const HorizontalNavbar = () => {
    const { currentUser, logout } = useContext(AuthContext)

    const use_id = currentUser?.use_id

    const [profDropIsOpen, setProfDropIsOpen] = useState(false)
    const navigate = useNavigate()

    function LinkPage (props) {
        const { pathname } = useLocation()
        return (
            <li className="inline-block rounded-sm text-dark-purple">
                {(pathname === props.match) ? (<a className="header__nav_path">{props.text}</a>) : (<Link to={props.match}>{props.text}</Link>)}
            </li>
        )
    }

    function ProfDropdown () {
        return (
          <div className="prof__dropdown">
            <div className="prof__item" onClick={() => {setProfDropIsOpen(!profDropIsOpen); navigate('/user')}}>
              <AiOutlineUser/>
              <p>Perfil</p>
            </div>
            <div className="prof__item" onClick={logout}>
              <AiOutlineLogout/>
              <p>Sair</p>
            </div>
          </div>
        )
    }

    function NavBar () {
        if (currentUser) {
            return (
                <li>
                    <div className="profile__icon" onClick={() => setProfDropIsOpen(!profDropIsOpen)}>
                        <AiOutlineUser color="white"/>
                    </div>

                    {profDropIsOpen && <ProfDropdown />}
                </li>
            )
        } else {
            return (
                <>
                    <LinkPage text="Sobre Nós" match="/sobre"/>
                    <LinkPage text="Funcionalidades" match="/funcionalidades"/>
                    <LinkPage text="Planos" match="/planos"/>
                    <li className="inline-block rounded-sm text-dark-purple">
                        <a className="text-alert">Entrar</a>
                    </li>
                    <li className="inline-block">
                        <button className="header__nav_button"><Link to="/logastro">Criar nova conta →</Link></button>
                    </li>
                </>
            )
        }
    }


    return (
        <div className="fixed top-0 mx-auto min-w-full w-full flex justify-center h-header text-sm bg-glass backdrop-blur-md z-10">
            <div className='w-full md:w-3xl bg-transparent flex px-12 justify-between'>
                <div className="bg-transparent flex items-center">
                    <Link to='/' className="flex cursor-pointer items-center space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="30" height="30">
                            <path d="M50.333,2.553c-15.686,0-29.611,7.656-38.255,19.422c-1.293,1.632-2.424,3.398-3.371,5.277 C4.998,34.01,2.885,41.763,2.885,50.001c0,26.163,21.285,47.448,47.448,47.448s47.448-21.285,47.448-47.448 S76.496,2.553,50.333,2.553z M44.928,61.67c-7.897,0-14.322-6.506-14.322-14.503s6.425-14.503,14.322-14.503 S59.25,39.17,59.25,47.167S52.825,61.67,44.928,61.67z M44.928,28.412c-10.242,0-18.574,8.413-18.574,18.755 s8.332,18.755,18.574,18.755c0.116,0,0.228-0.016,0.343-0.018c-2.924,1.144-6.097,1.777-9.415,1.777 c-14.448,0-26.203-11.895-26.203-26.515c0-4.277,1.013-8.317,2.798-11.899c0.911-1.658,1.931-3.248,3.045-4.766 c4.808-6.003,12.147-9.85,20.36-9.85c14.011,0,25.488,11.185,26.171,25.192C59.196,33.132,52.599,28.412,44.928,28.412z M50.333,93.197c-23.313,0-42.36-18.568-43.158-41.69c4.214,11.893,15.478,20.427,28.681,20.427 c16.794,0,30.456-13.802,30.456-30.767S52.649,10.4,35.855,10.4c-1.047,0-2.082,0.054-3.103,0.158 c5.374-2.405,11.321-3.754,17.58-3.754c23.818,0,43.196,19.378,43.196,43.196S74.151,93.197,50.333,93.197z" fill="#8185DA" fill-opacity="0.9"/>
                        </svg>
                        <div className="bg-gradient-to-l from-light-purple to-purple bg-clip-text">
                        </div>
                    </Link>
                </div>
          
                <div className="hidden md:flex flex-wrap items-center justify-center text-center">
                    <ul className="space-x-9">
                        <NavBar/>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default HorizontalNavbar
