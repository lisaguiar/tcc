import React, { useCallback, useContext, useEffect, useState } from 'react'
import '../styles/Workspace.css'
import { GrConfigure } from 'react-icons/gr'
import axios from '../api/axios'
import { AuthContext } from '../contexts/authContext'
import house from '../images/house.png'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Logado } from '../components/IsLogged'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useHandleDatabaseRequest } from '../functions/IsOnline'
import { io } from 'socket.io-client'

const Project = () => {
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

  const [valid, setValid] = useState(true)
  const [query, setQuery] = useState("")
  const [count, setCount] = useState(true)

  const [lastDesktop, setLastDesktop] = useState([])
  const [project, setProject] = useState([])
  const [projects, setProjects] = useState([])
  const [countProject, setCountProject] = useState(false)

  const [countFrames, setCountFrames] = useState(false)
  const [frames, setFrames] = useState([])
  const [frame, setFrame] = useState([])

  const [kanbanTable, setKanbanTable] = useState([])
  const [kanbanCards, setKanbanCards] = useState([])

  const { currentUser, checkUserPermission } = useContext(AuthContext)
  const use_id = currentUser?.use_id
  const last_id = currentUser?.use_lastDesktop

  const [err, setErr] = useState("")
  const [frameId, setFrameId] = useState("")


  const location = useLocation()
  const des_id = location.pathname.split("/")[2]
  const pro_id = location.pathname.split("/")[4]

  const handleFrameId = () => {
    setFrameId(location.pathname.split("/")[6])
  }

  async function renderKanban(frame) {
    const res = await axios.get(`/api/kanban/table/${frameId}`)
    setKanbanTable(res.data)
    return (
      <div className='kanban'>
        <DragDropContext /*onDragEnd={handleDragDrop}*/>
            <Droppable droppableId="root" type="group">
                {(provided) => (
                    <div className='flex' {...provided.droppableProps} ref={provided.innerRef}>
                     
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    </div>
    )
  }

  function ColumnList({ nome, itens, id }) {
    return (
      <Droppable droppableId={id}>
        {(provided) => (
          <div className='kanban-container' {...provided.droppableProps} ref={provided.innerRef}>
            <div className='column-container'>
              <h3>{nome}</h3>
            </div>
            <div className='itens-container'>
              {itens.map((item, index) => (
                <Draggable draggableId={item.kac_id.toString()} index={index} key={item.kac_id}>
                  {(provided) => (
                    <div className='item-container' {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                      <h4>{item.kac_title}</h4>
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }

  function renderNotes(frame) {
    return (
      <>
      <p>notes</p>
      </>
    )
  }

  function renderChecklist(frame) {
    return (
      <>
      <p>check</p>
      </>
    )
  }

  const { handleOnlineStatus, connectionErr } = useHandleDatabaseRequest()
  let isOnline = true

  useEffect(() => {
    const socket = io('http://localhost:8001')
  
    socket.on('connect', () => {
      console.log('Conectado ao servidor do Socket.io')
    })

    socket.on('desktopDeleted', () => {
        console.log('Área deletada!')
    })

    socket.on('frameCreated', () => {

    })

    socket.on('frameUpdated', () => {
      
    })

    socket.on('frameDeleted', () => {
      
    })

    socket.on('projectCreated', () => {
      
    })

    socket.on('projectUpdated', () => {
      
    })

    socket.on('projectDeleted')
  
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
      const res = await axios.get(`/api/projects/${des_id}/${pro_id}?q=${query}`)
      setProjects(res.data)
      if (res.data.length === 0 || !res.data.length) {
        setCount(false)
      } else {
        setCount(true)
        console.log(res.data)
      }
    } catch (err) {
      setErr(err.data)
    }
  }, [des_id, query])

  const getProject = useCallback(async () => {
    try {
      const res = await axios.get(`/api/projects/${pro_id}/${last_id}`)
      setProject(res.data)

    } catch (err) {
      setErr(err.data)
    }
  }, [pro_id, last_id])

  const getFrames = useCallback(async () => {
    const res = await axios.get(`/api/frames/all/${pro_id}`)
      setFrames(res.data)
      if (res.data.length === 0 || !res.data.length) {
        setCountFrames(false)
      } else {
        setCountFrames(true)
      }
  }, [pro_id])

  const getFrame = useCallback(async () => {
    try {
      const res = await axios.get(`/api/frames/${pro_id}/${frameId}`)
      setFrame(res.data)
      
    } catch (err) {
      setErr(err.data)
    }
  }, [pro_id, frameId])

  useEffect(() => {
    const permission = async () => {
      try {
          const res = await checkUserPermission(des_id)
          console.log(res)
          if (!res) {
              window.location.replace("/desktop")
          }
      } catch (err) {
          console.log(err)
      }
    }
    if (isOnline) {

    } else {
      setErr(connectionErr)
    }
    
    const socket = io('http://localhost:8001')

    const getDesktop = async () => {
      if (last_id) {
        try {
          const res = await axios.get(`/api/desktops/${last_id}`)
          setLastDesktop(res.data)

          setValid(true)
        } catch (err) {
          console.log(err)
        }
      } else {
        setValid(false)
      }
    }

    if (frameId) {
      getFrame()
    } else {
      
    }
  permission()
  getProject()
  getDesktop()
  getProjects()
  getFrames()

  socket.on('projectUpdated', (data) => {
    if (data.pro_id === pro_id) {
      getProject()
    } else {
      getProjects()
    }
  })

  socket.on('projectDeleted', (data) => {
    if (data.pro_id === pro_id) {
      setValid(false)
    } else {
      getProjects()
    }
  })

  socket.on('projectCreated', () => {
      getProjects()
  })

  socket.on('frameUpdated', (data) => {
    if (data.fra_id === frameId) {
      getFrame()
    } else {
      getFrames()
    }
  })

  socket.on('frameDeleted', (data) => {
    if (data.fra_id === frameId) {
      setCountFrames(false)
      setErr("O quadro foi excluído por um membro!")
    } else {
      getFrames()
    }
  })

  socket.on('frameCreated', () => {
      getFrames()
  })




  }, [use_id, query, last_id, pro_id, des_id, checkUserPermission, frameId, getFrame, getFrames, getProject, getProjects])

  return (
    <div>
      {Logado()}
      <section className="home-section">
        <div className="submenuproj">
          <div className="textmain">
            <img src={house} alt=""></img>
            <h4>Projetos</h4>
          </div>
          <div className="search">
            <input className="searchbar" placeholder="🔍 Pesquisar" disabled={!valid} onChange={(e) => setQuery(e.target.value.toLowerCase())}/>
            <button className="add__desktop" onClick={() => handleOpenModal()}>+</button>
          </div>
  
          <div className='space'></div> 
          <div className="cards">   
            {valid && project && project.map((project) => {
              const firstLetter = project.pro_title.charAt(0).toUpperCase()
              return (
                <>
                  <span className='left'>Projeto atual</span>
                  <div className="card-last card-2" key={project.pro_id}>
                    <div className="card__letter">
                      <h3>{firstLetter}</h3>
                    </div>
                    <h4 className="card__title">{project.pro_title}</h4>
                  </div>
                </>
              )
            })}
          </div>

          <div className='space'></div>
          <div className="cards">

            {projects && projects.length !== 0 ? (
            <span className='left'>Outros projetos</span>) &&
            projects.map((project) => {
                const firstLetter = project.pro_title.charAt(0).toUpperCase()
                return (
                  <div className="card card-2" key={project.pro_id}>
                    <div className="card__letter">
                      <h3>{firstLetter}</h3>
                    </div>
                    <h4 className="card__title">{project.pro_title}</h4>
                  </div>
                )
            }
            ) : (
                <div className="none">
                <h4>Nenhum Projeto</h4>
                <p>Crie um projeto agora!</p>
                <button className='add_desktop' onClick={() => handleOpenModal()}>Adicionar projeto +</button>
              </div>
            )}


            {!count && valid && (
              <div className="none">
                <p>Nenhum resultado encontrado!</p>
              </div>
            )
                
            }
          </div>
        </div>
        <div className="topo">
          <div className="projeto">
            {project && project !== 0 && project.map((project) => {
              return (
                <div className="" key={project.pro_id}>
                  <div className="projeto-title">
                   <p>{project.pro_title}</p>
                  </div>
                  <div className="projeto-description">
                    <p>{project.pro_description}</p>
                    <span className="projeto-edit"><p>Ver mais</p></span>
                  </div>
                 
                </div>
              )
            })}
          </div>
          <div className="quadro-map">
            {valid && frames.map((frame) => {
              return (
                <div className="quadro-item" key={frame.fra_id} onClick={() => navigate(`/desktop/${des_id}/project/${pro_id}/frame/${frame.fra_id}`)}>
                  <p>{frame.fra_title}</p>
                </div>
              )
            })}
            <div className="quadro-item">
              <p>+</p>
            </div>
          </div>
          
          {valid ? (
            <>
              <hr className="hr2" />
              <div className="cards-container">

                {frame && frame.length > 0 && (
                  frame[0].mod_id === 1 ? (renderKanban(frame)) : [0].mod_id === 2 ? (renderChecklist(frame)) : (renderNotes(frame))
                )}

                {project && project.length > 0 && project.map((projects) => {
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
                <h4>Nenhum projeto cadastrado nessa área</h4>
                <p>Crie um projeto para poder gerar seus quadros</p>
              </div>
              <button className="add_desktop" onClick={() => handleOpenModal()}>Adicionar projeto +</button>
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

export default Project
