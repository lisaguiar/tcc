import React, { useCallback, useContext, useEffect, useState } from 'react'
import '../styles/Workspace.css'
import axios from '../api/axios'
import { AuthContext } from '../contexts/authContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { Logado } from '../components/IsLogged'
import { useHandleDatabaseRequest } from '../functions/IsOnline'
import ErrorDisplay from '../functions/HandleError'
import { AiOutlineClose, AiOutlineDelete, AiOutlineEdit, AiOutlineUsergroupAdd } from 'react-icons/ai'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import { RiEdit2Fill, RiHome2Line, RiHome6Line, RiHomeLine, RiLayoutBottom2Fill, RiLayoutBottom2Line, RiMore2Fill } from 'react-icons/ri'
import { io } from 'socket.io-client'


const Workspace = () => {
  const [showModal, setShowModal] = useState(false)
  const [showModalProject, setShowModalProject] = useState(false)

  const {register, formState: {errors, isValid}, handleSubmit} = useForm({
    mode: "all"
  })

  const { currentUser, handleDesktop } = useContext(AuthContext)
  const location = useLocation()
  const use_id = currentUser?.use_id
  const last_id = currentUser?.use_lastDesktop
  const uda_id = currentUser?.uda_id
  const createdAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")

  const [inputDesktop, setInputDesktop] = useState({
    des_title: "",
    des_description: "",
    des_createdAt: createdAt
  })

  const [inputProject, setInputProject] = useState({
    pro_title: "",
    pro_description: "",
    pro_createdAt: createdAt,
    uda_id: currentUser?.uda_id,
    des_id: currentUser?.use_lastDesktop
  })

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleOpenModalProject = () => {
    setShowModalProject(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleCloseModalProject = () => {
    setShowModalProject(false)
  }

  const handleChangeDesktop = e => {
    setInputDesktop(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleChangeProject = e => {
    setInputProject(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const navigate = useNavigate()

  const [desktop, setDesktop] = useState([])
  const [valid, setValid] = useState(true)
  const [query, setQuery] = useState("")
  const [count, setCount] = useState(true)
  const [countProject, setCountProject] = useState(true)
  const [lastDesktop, setLastDesktop] = useState([])
  const [projects, setProjects] = useState([])
  const [err, setErr] = useState("")

  const submitChangeDesktop = async (values) => {
    try {
      await handleDesktop(values)
    } catch (err) {
      setErr("Houve um problema ao acessar a área de trabalho selecionada. Tente novamente mais tarde.")
    }
  }

  const SubmitDesktop = async () => {
    try {
      const res = await axios.post(`/api/desktops/post/${use_id}`, inputDesktop)
      await submitChangeDesktop(res.data)
    } catch (err) {
      setErr(err.response.data)
    }
    setShowModal(false)
  }

  const SubmitProject = async () => {
    try {
      await axios.post(`/api/projects/post/${uda_id}/${last_id}`, inputProject)
    } catch (err) {
      console.log(err)
      setErr(err.data)
    }
    setShowModalProject(false)
  }

  const { handleOnlineStatus, connectionErr } = useHandleDatabaseRequest()
  let isOnline = true

  useEffect(() => {
    const socket = io('http://localhost:8001')
  
    socket.on('connect', () => {
      console.log('Conectado ao servidor do Socket.io')
    })
  
    socket.on('projectCreated', (data) => {
      // Atualize a lista de projetos com o novo projeto recebido
      console.log('Novo projeto criado:', data.projectId)
    })
  
    socket.on('disconnect', () => {
      console.log('Desconectado do servidor do Socket.io')
    })
  
    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      isOnline = await handleOnlineStatus()
    }
    fetchData()
  })

  const getProjects = useCallback(async () => {
    try {
      const res = await axios.get(`/api/projects/all/${last_id}/0`)
      setProjects(res.data)
      if (res.data.length === 0 || !res.data.length) {
        setCountProject(false)
      } else {
        setCountProject(true)
      }
    } catch (err) {
      setErr(err.data)
    }
  }, [last_id])

  const getLastDesktop = useCallback(async () => {
    try {
      const res = await axios.get(`/api/desktops/${last_id}`)
      setLastDesktop(res.data)

      setValid(true)

      if (res.data.length === 0 || !res.data.length) {
        setCount(false)
      } else {
        setCount(true)
      }
    } catch (err) {
      setErr(err.data)
    }
  }, [last_id])
  
  useEffect(() => {
    const getDesktop = async () => {
      try {
        const res = await axios.get(`/api/desktops/all/${use_id}/${last_id}/?q=${query}`);
        setDesktop(res.data)
      } catch (err) {
        setErr(err.data)
      }
    }
  
    const socket = io('http://localhost:8001')
  
    if (last_id) {
      try {
        getLastDesktop()
      } catch (err) {
        setErr("Houve um erro")
      }
    } else {
      setValid(false)
      setErr(connectionErr)
    }
  
    getDesktop()
    getProjects()
  
    socket.on('projectCreated', () => {
      getProjects() 
    })
    socket.on('desktopUpdated', () => {
      getLastDesktop()
    })
    socket.on('desktopDeleted', (data) => {
      if (data.des_id === last_id) {
        submitChangeDesktop(null)
      }
    })
  
    return () => {
      socket.disconnect()
    }
  }, [use_id, query, last_id, isOnline, connectionErr, getProjects, getLastDesktop])

  const [DropIsOpen, setDropIsOpen] = useState(false)

  function Dropdown () {
    return (
      <div className="prof_dropdown">
        <div className="prof_item" onClick={() => {setDropIsOpen(!DropIsOpen); navigate(`/desktop/${last_id}`)}}>
          <AiOutlineEdit/>
          <p>Editar Área de Trabalho</p>
        </div>
        <div className="prof_item" onClick={() => {setDropIsOpen(!DropIsOpen); navigate(`/desktop/${last_id}`)}}>
          <AiOutlineUsergroupAdd/>
          <p>Gerenciar Membros</p>
        </div>
        <div className="prof_item" onClick={() => {setDropIsOpen(!DropIsOpen); setShowModalProject(true)}}>
        <RiLayoutBottom2Line/>
        <p>Criar projeto</p>
      </div>
      </div>
    )
  }

  return (
    <div>
      {Logado()}
      <section className="home-section">
        <div className="submenuproj">
          <div className="textmain">
            <RiHome6Line size={20} />
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

          <div>
            {err && <ErrorDisplay message={err} />}
          </div>

          <div className="cards">
          {(valid || count) && desktop.length !== 0 && (
          <span className='left'>Outras áreas de trabalho</span>
          )}
            {(valid || count) && desktop.length !== 0 && desktop.map((desktop) => {
              const firstLetter = desktop.des_title.charAt(0).toUpperCase()
              return (
                <div className="card card-2" key={desktop.des_id} onClick={() => submitChangeDesktop(desktop.des_id)}>
                  <div className="card__letter">
                    <h3>{firstLetter}</h3>
                  </div>
                  <h4 className="card__title">{desktop.des_title}</h4>
                </div>
              )
            })}
            {!valid && !count && (
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
                <div className="projeto-2" key={desktop.des_id}>
                {DropIsOpen && <Dropdown />}
                  <div className="projeto-title">
                   <p>{desktop.des_title}</p>
                  </div>
                  <span className="projeto-icon-edit" onClick={() => setDropIsOpen(!DropIsOpen)}><RiMore2Fill size={20}/></span>

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
              <hr className="hr2"/>
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
                {countProject ? (
                  <>
                    <div className="cards2">
                      <div className="cookie-card-add">
                        <h4>Criar novo projeto</h4>
                        <h4 className="description">+</h4>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="projeto-null project">
                    <div className="projeto-null-title">
                      <h4>Nenhum projeto cadastrado</h4>
                      <p>Crie um projeto para poder gerar seus quadros</p>
                    </div>
                    <button className="add_desktop" onClick={() => handleOpenModalProject()}>Adicionar projeto +</button>
                  </div>
                )}
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
            <div className="lista-topo">
              <h3>Adicionar área de trabalho</h3>
              <span className="mdi mdi-close close" onClick={() => handleCloseModal()}><AiOutlineClose/></span>
            </div>

            <form className="lista-datoss" onSubmit={handleSubmit(SubmitDesktop)}>
              <label>Nome da área de trabalho</label>
              <input
                type="text"
                placeholder="Insira o título da área de trabalho"
                className={errors?.des_title && 'input-error'}
                {...register('des_title', {required: true, minLength: 4})}
                onChange={handleChangeDesktop}
              />
              {errors?.des_title?.type === 'required' && <p className="form_error_message">Insira um nome para a área de trabalho!</p>}
              {errors?.des_title?.type === 'minLength' && <p className="form_error_message">O nome da área de trabalho precisa conter no mínimo 4 caracteres</p>}

              <div className='space'></div>
              <label>Descrição da área de trabalho</label>
              <input
                type="text"
                placeholder="Insira a descrição da área de trabalho"
                className={errors?.des_description && 'input-error'}
                {...register('des_description', {required: true, minLength: 10})}
                onChange={handleChangeDesktop}
              />
              {errors?.des_description?.type === 'required' && <p className="form_error_message">Insira uma descrição para a área de trabalho!</p>}
              {errors?.des_description?.type === 'minLength' && <p className="form_error_message">A descrição da área de trabalho precisa conter no mínimo 10 caracteres</p>}

              <ul className="lista-datoss1">
                <p onClick={handleCloseModal}>Cancelar</p>
                <button type="submit" disabled={!isValid}>Adicionar área de trabalho</button>
              </ul>
            </form>

          </div>
        </div>
      )}

      {showModalProject && (
        <div className="modal">
          <div className="perfil-usuario-bioo">
            <div className="lista-topo">
              <h3>Adicionar projeto</h3>
              <span className="mdi mdi-close close" onClick={() => handleCloseModalProject()}><AiOutlineClose/></span>
            </div>

            <form className="lista-datoss" onSubmit={handleSubmit(SubmitProject)}>
              <label>Nome do projeto</label>
              <input
                type="text"
                placeholder="Insira o título do projeto"
                className={errors?.pro_title && 'input-error'}
                {...register('pro_title', {required: true, minLength: 4})}
                onChange={handleChangeProject}
              />
              {errors?.pro_title?.type === 'required' && <p className="form_error_message">Insira um nome para o projeto!</p>}
              {errors?.pro_title?.type === 'minLength' && <p className="form_error_message">O nome do projeto precisa conter no mínimo 4 caracteres</p>}

              <div className='space'></div>
              <label>Descrição do projeto</label>
              <input
                type="text"
                placeholder="Insira a descrição do projeto"
                className={errors?.pro_description && 'input-error'}
                {...register('pro_description', {required: true, minLength: 10})}
                onChange={handleChangeProject}
              />
              {errors?.pro_description?.type === 'required' && <p className="form_error_message">Insira uma descrição para o projeto!</p>}
              {errors?.pro_description?.type === 'minLength' && <p className="form_error_message">A descrição do projeto precisa conter no mínimo 10 caracteres</p>}

              <ul className="lista-datoss1">
                <p onClick={handleCloseModalProject}>Cancelar</p>
                <button type="submit" disabled={!isValid}>Adicionar projeto</button>
              </ul>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace