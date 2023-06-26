import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MdPerson2, MdLogout } from 'react-icons/md'
import { useContext, useState } from 'react'
import { AuthContext } from '../contexts/authContext'
import { CiLogout } from 'react-icons/ci'
import logo from "../images/logo_nome.png"
import '../styles/HorizontalNavbar.css'

const HorizontalNavbar = () => {
    const { pathname } = useLocation()
    const { currentUser, logout } = useContext(AuthContext)

    const use_id = currentUser?.use_id

    const [profDropIsOpen, setProfDropIsOpen] = useState(false)
    const navigate = useNavigate()

    function LinkPage (props) {
        return (
            <li className="header__nav_li">
                {(props.path === props.match) ? (<a className="header__nav_path">{props.text}</a>) : (<Link to={props.match}>{props.text}</Link>)}
            </li>
        )
    }

    function ProfDropdown () {
        return (
          <div className="prof__dropdown">
            <div className="prof__item" onClick={() => {setProfDropIsOpen(!profDropIsOpen); navigate('/logado')}}>
              <MdPerson2/>
              Perfil
            </div>
            <div className="prof__item" onClick={logout}>
              <MdLogout/>
              Sair
            </div>
          </div>
        )
      }

    return (
        <div className="header">
            <div className="header-cont">
                <Link to='/'>
                    <img src={logo} alt="logotipo do sistema"/>
                </Link>
            </div>
            <div className="header__nav">
                <ul>
                    {currentUser ? (
                        <>
                            <li>
                                <div className="profile__icon" onClick={() => setProfDropIsOpen(!profDropIsOpen)}>
                                <MdPerson2 color="white"/>
                                </div>

                                {profDropIsOpen && <ProfDropdown />}
                            </li>
                        </>
                    ) : (
                        <>
                            <LinkPage text="Sobre Nós" path={pathname} match="/sobre"/>
                            <LinkPage text="Funcionalidades" path={pathname} match="/funcionalidades"/>
                            <li>
                            <button className="header__nav_button"><Link to="/logastro" className="header__login">Acessar minha conta →</Link></button>
                            </li>
                        </>
                    )}
                </ul>
            </div>

        </div>
    )
}

export default HorizontalNavbar
