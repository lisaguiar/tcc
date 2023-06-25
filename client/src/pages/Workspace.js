import React, { useContext, useEffect, useState } from 'react'
import '../styles/Workspace.css'
import { GrConfigure } from 'react-icons/gr'
import axios from '../api/axios'
import { AuthContext } from '../contexts/authContext'
import house from '../images/house.png'
import { useNavigate } from 'react-router-dom'
import { Logado } from '../components/IsLogged'

const Workspace = () => {
  const [showModal, setShowModal] = useState(false)
  const [inputValue1, setInputValue1] = useState('')
  const [inputValue2, setInputValue2] = useState('')

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleCreate = () => {
    console.log('Valor do input 1:', inputValue1)
    console.log('Valor do input 2:', inputValue2)

    setShowModal(false)
  }

  const navigate = useNavigate()

  const [desktop, setDesktop] = useState([])
  const [valid, setValid] = useState(true)
  const [query, setQuery] = useState("")
  const [count, setCount] = useState(true)
  const [lastDesktop, setLastDesktop] = useState([])
  const [projects, setProjects] = useState([])

  const { currentUser, handleDesktop } = useContext(AuthContext)
  const use_id = currentUser?.use_id
  const last_id = currentUser?.use_lastDesktop

  const submitChangeDesktop = async (values) => {
    try {
      await handleDesktop(values)
      window.location.reload()
    } catch (err) {
      console.log(err)
    }
  }

  console.log(lastDesktop)
  console.log(desktop)

  const getProjects = async (values) => {
    try {
      const res = await axios.get(`/api/all/${use_id}?q=${query}`)
      setDesktop(res.data)
    } catch (err) {
      console.log(err)
    }
    
  }
  useEffect(() => {
    const fetchData = async () => {
      if (last_id) {
        try {
          const q = await axios.get(`/api/desktops/${last_id}`)
          setLastDesktop(q.data)
          const res = await axios.get(`/api/desktops/all/${use_id}?q=${query}`)
          setDesktop(res.data)
          const pro = await axios.get(`/api/projects/${last_id}`)
          setProjects(pro.data)
          setValid(true)
          if (res.data.length === 0 || !res.data.length) {
            setCount(false)
          } else {
            setCount(true)
          }
        } catch (err) {
          console.log(err)
        }
      } else {
        setValid(false)
      }
    }
    fetchData()
  }, [use_id, query, last_id])

  return (
    <div>
      {Logado()}
      <section className="home-section">
        <div className="submenuproj">
          <div className="textmain">
            <img src={house} alt=""></img>
            <h4>Áreas de Trabalho</h4>
          </div>
          <div className="search">
            <input className="searchbar" placeholder="🔍 Pesquisar" disabled={!valid} onChange={(e) => setQuery(e.target.value.toLowerCase())}/>
            <button className="add__desktop" onClick={() => handleOpenModal()}>+</button>
          </div>
  
          <div className='space'></div> 
          <div className="cards">   
            {valid && lastDesktop && lastDesktop.map((desktop) => {
              const firstLetter = desktop.des_title.charAt(0).toUpperCase()
              console.log(firstLetter)
              return (
                <>
                  <span className='left'>Área atual</span>
                  <div className="card-last card-2" key={desktop.des_id}>
                    <div className="card__letter">
                      <h3>{firstLetter}</h3>
                    </div>
                    <h4 className="card__title">{desktop.des_title}</h4>
                  </div>
                </>
                
              )
            })}
          </div>
          <div className='space'></div>
          <div className="cards">
          {valid && desktop.length !== 0 && (
          <span className='left'>Outras áreas de trabalho</span>
          )}
            {valid && desktop.length !== 0 && desktop.map((desktop) => {
              const firstLetter = desktop.des_title.charAt(0).toUpperCase()
              console.log(firstLetter)
              return (
                <div className="card card-2" key={desktop.des_id} onClick={() => submitChangeDesktop(desktop.des_id)}>
                  <div className="card__letter">
                    <h3>{firstLetter}</h3>
                  </div>
                  <h4 className="card__title">{desktop.des_title}</h4>
                </div>
              )
            })}
            {!valid && (
              <div className="none">
                <h4>Nenhuma área de trabalho</h4>
                <p>Começe criando uma área de trabalho</p>
                <button className='add_desktop' onClick={() => handleOpenModal()}>Adicionar área de trabalho +</button>
              </div>
            )
            }
            {!count && (
              <div className="none">
                <p>Nenhum resultado encontrado!</p>
              </div>
            )
                
            }
          </div>
        </div>
        <div className="topo">
          <div className="projeto">
            {lastDesktop && lastDesktop !== 0 && lastDesktop.map((desktop) => {
              return (
                <div className="" key={desktop.des_id}>
                  <div className="projeto-title">
                   <p>{desktop.des_title}</p>
                  </div>
                  <div className="projeto-description">
                    <p>{desktop.des_description}</p>
                    <span className="projeto-edit"><p>Ver mais</p></span>
                  </div>
                 
                </div>
              )
            })}
            {lastDesktop === 0 && (
              <div><p>Nada</p></div>
            )}
            
          </div>
          {valid ? (
            <>
              <hr className="hr2" />
              <div className="cards-container">
                {projects && projects.length > 0 && projects.map((projects) => {
                  return (
                    <div className="cards2">
                      <div className="cookie-card">
                        <h4>{projects.pro_title}</h4>
                        <p className="description">{projects.pro_description}</p>
                        <div className="actions">
                          <button className="pref" onClick={() => navigate(`${last_id}/project/${projects.pro_id}`)}>Editar projeto</button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div className="cards2">
                  <div className="cookie-card-add">
                    <h4>Criar novo projeto</h4>
                    <h4 className="description">+</h4>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="projeto-null">
              <div className="projeto-null-title">
                <h4>Nenhuma área de trabalho cadastrada</h4>
                <p>Crie uma área de trabalho para poder registrar seus projetos</p>
              </div>
              <button className="add_desktop" onClick={() => handleOpenModal()}>Adicionar área de trabalho +</button>
            </div>
          )}
          
        </div>
      </section>

      {showModal && (
        <div className="modal">
          <div className="perfil-usuario-bioo">
            <h3>Criar área de trabalho</h3>
            <ul className="lista-datoss">
              <input
                type="text"
                value={inputValue1}
                onChange={(e) => setInputValue1(e.target.value)}
                placeholder="Digite o titulo da área de trabalho"
              />
              <input
                type="text"
                value={inputValue2}
                onChange={(e) => setInputValue2(e.target.value)}
                placeholder="Digite a descrição da área"
              />
            </ul>

            <ul className="lista-datoss1">
              <button className="myButton1" onClick={handleCreate}>Criar</button>
              <button className="myButton1" onClick={handleCloseModal}>Cancelar</button>
            </ul>


          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace
