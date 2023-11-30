import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MdPerson2, MdLogout } from 'react-icons/md'
import { useContext, useState } from 'react'
import { AuthContext } from '../contexts/authContext'
import { CiLogout } from 'react-icons/ci'

import '../styles/HorizontalNavbar.css'
import { AiOutlineLogout, AiOutlineUser } from 'react-icons/ai'

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
                    <LinkPage text="Sobre Nós" path={pathname} match="/sobre"/>
                    <LinkPage text="Funcionalidades" path={pathname} match="/funcionalidades"/>
                    <li>
                        <button className="header__nav_button"><Link to="/logastro" className="header__login">Acessar minha conta →</Link></button>
                    </li>
                </>
            )
        }
    }


    return (
        <div className="fixed top-0 mx-auto w-full flex justify-center h-header text-sm bg-glass backdrop-blur-md z-10">
            <div className='max-w-7xl bg-transparent flex mx-auto space-x-96'>
                <div className="bg-transparent flex items-center">
                    <Link to='/' className='flex text-center items-center space-x-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="6.004 -0.00000762939 84 96" width="35" height="35">
                            <path d="M 88 96 h -50.612 c -6.208 0 -15.388 -5.072 -15.388 -15.952 v -52.048 c 0 -0.204 0.032 -0.404 0.088 -0.588 c -0.064 -0.456 -0.088 -0.924 -0.088 -1.412 c 0 -6.076 4.712 -10 12 -10 h 40 c 1.1 0 2 0.896 2 2 s -0.9 2 -2 2 h -40 c -2.408 0 -8 0.584 -8 6 s 5.588 6 8 6 h 54 c 1.1 0 2 0.896 2 2 v 60 c 0 1.1 -0.9 2 -2 2 z M 26 33.832 v 46.216 c 0 8.156 6.796 11.952 11.388 11.952 h 48.612 v -56 h -52 c -3.244 0 -5.972 -0.772 -8 -2.168 z M 23.372 83.42 c -0.172 0 -0.348 -0.024 -0.524 -0.072 c -5.292 -1.428 -8.848 -5.94 -8.848 -11.224 v -52.124 c 0 -6.616 5.384 -12 12 -12 h 40 c 1.1 0 2 0.896 2 2 s -0.9 2 -2 2 h -40 c -4.412 0 -8 3.584 -8 8 v 52.124 c 0 3.452 2.368 6.416 5.896 7.368 c 1.068 0.288 1.696 1.384 1.412 2.448 c -0.244 0.892 -1.056 1.48 -1.936 1.48 z M 16.16 75.6 c -0.124 0 -0.252 -0.008 -0.376 -0.036 c -5.76 -1.092 -9.78 -5.808 -9.78 -11.44 v -52.124 c 0 -6.616 5.384 -12 12 -12 h 44 c 1.1 0 1.996 0.896 1.996 2 s -0.896 2 -2 2 h -44 c -4.412 0 -8 3.584 -8 8 v 52.128 c 0 3.688 2.684 6.776 6.532 7.512 c 1.084 0.208 1.796 1.252 1.588 2.34 c -0.188 0.96 -1.024 1.62 -1.96 1.62 z M82 28h-44c-1.104 0-2-0.896-2-2s0.896-2 2-2h44c1.1 0 2 0.896 2 2s-0.9 2-2 2z" fill="#000"/>
                        </svg>
                        <p className='text-2xl font-normal'>focustastic</p>
                    </Link>
                </div>
          
                <div className="header__nav">
                    <ul>
                        <NavBar/>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default HorizontalNavbar
