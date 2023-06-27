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
import { AiFillDelete, AiOutlineClose, AiOutlineEdit, AiOutlineUsergroupAdd } from 'react-icons/ai'
import ErrorDisplay from '../functions/HandleError'
import { RiInboxLine, RiLayoutBottom2Line, RiMore2Fill } from 'react-icons/ri'
import { useForm } from 'react-hook-form'
import moment from 'moment'

const Project = () => {
  const [showModalProject, setShowModalProject] = useState(false)
  const [showModalFrame, setShowModalFrame] = useState(false)
  const [showModalFrameUpdate, setShowModalFrameUpdate] = useState(false)
  const [showModalFrameDelete, setShowModalFrameDelete] = useState(false)

  const [showModalUpdateTable, setShowModalUpdateTable] = useState(false)
  const [showModalDeleteTable, setShowModalDeleteTable] = useState(false)
  const [showModalCreateTable, setShowModalCreateTable] = useState(false)
  
  const {register, formState: {errors, isValid}, handleSubmit} = useForm({
    mode: "all"
  })

  const handleOpenModalProject = () => {
    setShowModalProject(true)
  }

  const handleOpenModalFrame = () => {
    setShowModalFrame(true)
  }

  const handleOpenModalTable = () => {
    setShowModalCreateTable(true)
  }

  const handleOpenModalFrameUpdate = async () => {
    await handlePatch(frame[0]?.fra_title, frame[0]?.fra_description)
    setShowModalFrameUpdate(true)
  }

  const handleOpenModalTableUpdate = async (values) => {
    await handlePatchTable(values.kat_title, values.kat_description)
    setShowModalUpdateTable(true)
  }

  const handleOpenModalFrameDelete = () => {
    setShowModalFrameDelete(true)
  }

  const handleOpenModalTableDelete = () => {
    setShowModalDeleteTable(true)
  }

  const handleCloseModalProject = () => {
    setShowModalProject(false)
  }

  const handleCloseModalFrame = () => {
    setShowModalFrame(false)
  }

  const handleCloseModalFrameUpdate = () => {
    setShowModalFrameUpdate(false)
  }

  const handleCloseModalTableUpdate = () => {
    setShowModalUpdateTable(false)
  }

  const handleCloseModalTableCreate = () => {
    setShowModalCreateTable(false)
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

  const [modId, setModId] = useState("")

  const [kanbanTable, setKanbanTable] = useState([])
  const [kanbanCards, setKanbanCards] = useState([])


  const { currentUser, checkUserPermission } = useContext(AuthContext)
  const uda_id = currentUser?.uda_id
  const use_id = currentUser?.use_id
  const last_id = currentUser?.use_lastDesktop
  const createdAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")

  const [err, setErr] = useState("")
  const [frameId, setFrameId] = useState("")

  const [inputFrame, setInputFrame] = useState({
    fra_title: "",
    fra_description: "",
    fra_createdAt: createdAt,
    mod_id: 1
  })

  const [inputProject, setInputProject] = useState({
    pro_title: "",
    pro_description: "",
    pro_createdAt: createdAt,
    uda_id: currentUser?.uda_id,
    des_id: currentUser?.use_lastDesktop
  })

  const [inputUpdateFrame, setInputUpdateFrame] = useState({
    fra_titleUpdated: "",
    fra_descriptionUpdated: ""
  })


  const [inputUpdateTable, setInputUpdateTable] = useState({
    kat_titleUpdated: "",
    kat_descriptionUpdates: "",
    kat_createdAt: createdAt,
    col_id: 1,
    kat_position: 1
  })

  const [inputCreateTable, setInputCreateTable] = useState({
    kat_title: "",
    kat_description: "",
    kat_createdAt: createdAt,
    col_id: 1,
    kat_position: 1
  })

  const handlePatch = async (title, description) => {
    await setInputUpdateFrame({
        fra_titleUpdated: title,
        fra_descriptionUpdated: description
    })
  }

  const handlePatchTable = async (title, description) => {
    await setInputUpdateTable({
        kat_titleUpdated: title,
        kat_descriptionUpdated: description
    })
  }

  const SubmitProject = async () => {
    try {
      const res = await axios.post(`/api/projects/post/${uda_id}/${last_id}`, inputProject)

      navigate(`/desktop/${des_id}/project/${res.data}`)
    } catch (err) {
      setErr(err.data)
    }
    setShowModalProject(false)
  }

  const SubmitUpdateFrame = async () => {
    try {
      await axios.patch(`/api/frames/patch/${fra_id}`, inputUpdateFrame)
    } catch (err) {
      setErr(err.data)
    }
    setShowModalFrameUpdate(false)
  }

  const SubmitDeleteFrame = async () => {
    try {
        const res = await axios.patch(`/api/frames/delete/${fra_id}`)
        setErr(res.data)
    } catch (err) {
      setErr(err.data)
    }
    setShowModalFrameDelete(false)
  }

  const SubmitFrame = async () => {
    try {
      const res = await axios.post(`/api/frames/post/${uda_id}/${pro_id}`, inputFrame)
      setInputFrame({
        fra_title: "",
        fra_description: "",
        fra_createdAt: createdAt,
        mod_id: 1
      })
    } catch (err) {
      setErr(err.response.data)
    }
    setShowModalFrame(false)
  }

  const SubmitUpdateTable = async (values) => {
    const kat_id = values
    try {
      await axios.patch(`/api/kanban/patch/${kat_id}`, inputUpdateFrame)
    } catch (err) {
      setErr(err.data)
    }
    setShowModalUpdateTable(false)
  }

  const handleSubmitDeleteTable = async (values) => {
      const kat_id = values

      await SubmitDeleteTable(kat_id)
  }
  const SubmitDeleteTable = async (kat_id) => {
    try {
      const res = await axios.patch(`/api/kanban/table/delete/${kat_id}`)
      setErr(res.data)
    } catch (err) {
      setErr(err.response.data)
    }
    setShowModalDeleteTable(false)
  };

  const SubmitTable = async () => {
    try {
      const res = await axios.post(`/api/kanban/table/${uda_id}/${fra_id}`, inputCreateTable)
      setInputCreateTable({
        kat_title: "",
        kat_description: "",
        kat_createdAt: createdAt,
        mod_id: 1,
        kat_position: 1
      })
    } catch (err) {
      setErr(err.response.data)
    }
    setShowModalCreateTable(false)
  }


  const handleChangeFrame = e => {
    setInputFrame(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleChangeProject = e => {
    setInputProject(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleChangeUpdateFrame = e => {
    setInputUpdateFrame(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleChangeUpdateTable = e => {
    setInputUpdateTable(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleChangeCreateTable = e => {
    setInputCreateTable(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const location = useLocation()
  const des_id = location.pathname.split("/")[2]
  const pro_id = location.pathname.split("/")[4]
  const fra_id = location.pathname.split("/")[6]

  const handleFrameId = () => {
    setFrameId(location.pathname.split("/")[6])
  }

  function RenderKanban({ frame }) {

    const handleDragEnd = (result) => {
      const { destination, source, draggableId } = result
    
      if (!destination) {
        return
      }
    
      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return
      }
    
      const updatedCard = kanbanCards.find((card) => card.kac_id.toString() === draggableId)
      updatedCard.kat_id = destination.droppableId
    
      const updatedCardData = {
        kat_id: updatedCard.kat_id,
        kac_id: updatedCard.kac_id,
      }
    
      axios
        .patch('/api/kanban/card', updatedCardData)
        .then(() => {
          console.log('Posição e endereço do cartão atualizados no banco de dados')
        })
        .catch((error) => {
          console.log(error)
          setErr(error.response.data)
        })
    }
  
    return (
      <div className="kanban">
        <DragDropContext onDragEnd={handleDragEnd}>
          {kanbanTable &&
            kanbanTable.map((table) => (
              <ColumnList
                key={table.kat_id}
                nome={table.kat_title}
                katId={table.kat_id}
                kanbanCards={kanbanCards.filter((card) => card.kat_id === table.kat_id)}
                type="card"
              />
            ))}
        </DragDropContext>
      </div>
    )
  }
  
  function ColumnList({ nome, katId, kanbanCards }) {
    return (
      <Droppable droppableId={katId.toString()}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="kanban-container"
          >
            <div className="column-container">
              <h4>{nome}</h4>
              <AiOutlineClose className="delete-table" onClick={() => handleSubmitDeleteTable(katId)}/>
            </div>
            <div className="itens-container">
              {kanbanCards &&
                kanbanCards.map((card, index) => (
                  <Card
                    key={card.kac_id}
                    title={card.kac_title}
                    index={index}
                    kacId={card.kac_id}
                  />
                ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    )
  }
  
  function Card({ title, index, kacId }) {
    return (
      <Draggable draggableId={kacId.toString()} index={index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className="item-container"
          >
            <p>{title}</p>
          </div>
        )}
      </Draggable>
    )
  }
  

  function RenderNotes(frame) {
    return (
      <>
        <p>notes</p>
      </>
    )
  }

  function RenderChecklist(frame) {
    return (
      <>
      <p>check</p>
      </>
    )
  }

  const { handleOnlineStatus, connectionErr } = useHandleDatabaseRequest()
  let isOnline = true

  const handleFrame = async (frame) => {
      setModId(frame.mod_id)
      navigate(`/desktop/${des_id}/project/${pro_id}/frame/${frame.fra_id}`)
    }

  useEffect(() => {
    const socket = io('http://localhost:8001')
  
    socket.on('connect', () => {
      console.log('Conectado ao servidor do Socket.io')
    })

    socket.on('desktopDeleted', () => {
        console.log('Área deletada!')
    })

    socket.on('frameCreated')

    socket.on('frameUpdated')

    socket.on('frameDeleted')

    socket.on('projectCreated')

    socket.on('projectUpdated')

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

  console.log(frameId)

  const getProjects = useCallback(async () => {
    try {
      const res = await axios.get(`/api/projects/all/${des_id}/${pro_id}?q=${query}`)
      setProjects(res.data)
      if (res.data.length === 0) {
        setCount(false)
      } else {
        setCount(true)
      }
    } catch (err) {
      setErr(err.data)
    }
  }, [des_id, query])

  const getProject = useCallback(async () => {
    try {
      const res = await axios.get(`/api/projects/one/${pro_id}/${des_id}`)
      setProject(res.data)

      if (res.data.length === 0 || !res.data.length) {
        setValid(false)
      } else {
        setValid(true)
      }
    } catch (err) {
      setErr(err.data)
    }
  }, [pro_id, last_id])

  const getFrames = useCallback(async () => {
    try {
      const res = await axios.get(`/api/frames/all/${pro_id}`)
      setFrames(res.data)
        if (res.data.length === 0 || !res.data.length) {
          setCountFrames(false)
        } else {
          setCountFrames(true)
          
        }
    } catch (err) {
      setErr(err.data)
    }
  }, [pro_id])

  const getFrame = useCallback(async () => {
    try {
      const res = await axios.get(`/api/frames/one/${pro_id}/${fra_id}`)
      setFrame(res.data)
    } catch (err) {
      setErr(err.data)
    }
  }, [pro_id, frameId])

  const getKanbanTable = useCallback(async () => {
    console.log(frameId)
    try {
      const res = await axios.get(`/api/kanban/table/${fra_id}`)
      setKanbanTable(res.data)
   
    } catch (err) {
      setErr(err.data)
    }
  }, [frameId])

  const getKanbanCards = useCallback(async () => {
    try {
      const res = await axios.get(`/api/kanban/card/${fra_id}`)
      setKanbanCards(res.data)
      
    } catch (err) {
      setErr(err.data)
    }
  }, [frameId])

  const validateFrameModId = useCallback(() => {
    if (frame && frame.length !== 0) {
      setModId(frame[0].mod_id)
    }
  }, [frame])


  useEffect(() => {
    const permission = async () => {
      try {
          const res = await checkUserPermission(des_id)
          if (!res) {
              window.location.replace("/desktop")
          }
      } catch (err) {
          setErr(err.data)
      }
    }

    if (isOnline) {

    } else {
      setErr(connectionErr)
    }
    
    const socket = io('http://localhost:8001')

    if (fra_id) {
      handleFrameId()
      getFrame()
    }

    if (frame) {
      validateFrameModId()

      if (modId === 1) {
        getKanbanTable()
        getKanbanCards()
      } else if (modId === 2) {

      }
    }

  permission()
  getFrames()
  getProject()
  getProjects()

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
      getFrame()
      getFrames()
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

  socket.on('kanbanCreated', () => {
    handleFrame()
    getKanbanTable()
    getKanbanCards()
  }) 

  socket.on('kanbanUpdated', (data) => {
      getKanbanTable()
      getKanbanCards()
  })

  }, [use_id, query, last_id, pro_id, des_id, checkUserPermission, fra_id, frameId, getFrame, getFrames, getProject, getProjects, modId, getKanbanCards, getKanbanTable])

  const [DropIsOpen, setDropIsOpen] = useState(false)

  function Dropdown () {
    if (frameId) {
      return (
        <div className="prof_dropdown">
          <div className="prof_item" onClick={() => {setDropIsOpen(!DropIsOpen); handleOpenModalFrameUpdate()}}>
            <AiOutlineEdit/>
            <p>Editar Quadro</p>
          </div>
          <div className="prof_item" onClick={() => {setDropIsOpen(!DropIsOpen); handleOpenModalFrameDelete()}}>
            <AiFillDelete/>
            <p>Excluir Quadro</p>
          </div>
          <div className="prof_item" onClick={() => {setDropIsOpen(!DropIsOpen); setShowModalFrame(true)}}>
            <RiLayoutBottom2Line/>
            <p>Criar Quadro</p>
          </div>
        </div>
      )
    } else {
      return (
        <div className="prof_dropdown">
          <div className="prof_item" onClick={() => {setDropIsOpen(!DropIsOpen); navigate(`/desktop/${des_id}/project/${pro_id}/edit`)}}>
            <AiOutlineEdit/>
            <p>Editar Projeto</p>
          </div>
          <div className="prof_item" onClick={() => {setDropIsOpen(!DropIsOpen); navigate(`/desktop/${des_id}/project/${pro_id}/edit`)}}>
            <AiFillDelete/>
            <p>Excluir Projeto</p>
          </div>
          <div className="prof_item" onClick={() => {setDropIsOpen(!DropIsOpen); setShowModalProject(true)}}>
            <RiLayoutBottom2Line/>
            <p>Criar projeto</p>
          </div>
        </div>
      )
    }
    
  }

  return (
    <div>
      {Logado()}
      <section className="home-section">
        <div className="submenuproj">
          <div className="textmain">
            <AiOutlineEdit/>
            <h4>Projetos</h4>
          </div>
          <div className="search">
            <input className="searchbar" placeholder="🔍 Pesquisar" disabled={!valid} onChange={(e) => setQuery(e.target.value.toLowerCase())}/>
            <button className="add__desktop" onClick={() => handleOpenModalProject()}>+</button>
          </div>
  
          <div className='space'></div> 
          <div className="cards">   
            {valid && project.map((project) => {
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

          <div>
            {err && <ErrorDisplay message={err} />}
          </div>

          <div className="cards">

            {projects && valid && projects.length !== 0 && (
            <span className='left'>Outros projetos</span>) &&
            projects.map((project) => {
                const firstLetter = project.pro_title.charAt(0).toUpperCase()
                return (
                  <div className="card card-2" key={project.pro_id} onClick={() => navigate(`/desktop/${des_id}/project/${project.pro_id}`)}>
                    <div className="card__letter">
                      <h3>{firstLetter}</h3>
                    </div>
                    <h4 className="card__title">{project.pro_title}</h4>
                  </div>
                )
            }
            )}
            
            {!valid && !projects && (navigate('/desktop'))}


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
            {!frameId && project && project !== 0 && project.map((project) => {
              return (
                <div className="projeto-2" key={project.pro_id}>
                   {DropIsOpen && <Dropdown />}
                  <div className="projeto-title">
                   <p>{project.pro_title}</p>
                  </div>

                  <span className="projeto-icon-edit" onClick={() => setDropIsOpen(!DropIsOpen)}><RiMore2Fill size={20}/></span>


                  <div className="projeto-description">
                    <p>{project.pro_description}</p>
                    <span className="projeto-edit"><p>Ver mais</p></span>
                  </div>
                 
                </div>
              )
            })}
            
            {frameId && frame && frame !== 0 && frame.map((frame) => {
              return (
                <div className="projeto-2" key={frame.fra_id}>
                {DropIsOpen && <Dropdown />}
                  <div className="projeto-title">
                   <p>{frame.fra_title}</p>
                  </div>
                  <span className="projeto-icon-edit" onClick={() => setDropIsOpen(!DropIsOpen)}><RiMore2Fill size={20}/></span>
                  <div className="projeto-description">
                    <p>{frame.fra_description}</p>
                    <span className="projeto-edit" onClick={() => navigate(`/desktop/${des_id}/project/${pro_id}/frame/${frame.fra_id}/edit`)}><p>Ver mais</p></span>
                  </div>
                 
                </div>
              )
            })}
          </div>
          <div className="quadro-map">
            {valid && frames.map((frame) => {
              return (
                <div className="quadro-item" key={frame.fra_id} onClick={() => handleFrame(frame)}>
                <RiInboxLine/>
                  <p>{frame.fra_title}</p>
                </div>
              )
            })}
            {valid && frames.length !== 0 ? (
              <div className="quadro-item-add" onClick={() => handleOpenModalFrame()}>
                <p>+</p>
              </div>
      
            ) : (<></>)}

            {frame && (
              <>
                <div className='add-frame'>
                  <p onClick={() => handleOpenModalTable()}>Adicionar Tabela</p>
                </div>
              </>
            )}
            
          </div>
          
          {valid ? (
            <>
              <hr className="hr2" />
              <div className="kanbans-container">

                {frames.length === 0 && (
                  <div className="projeto-null project">
                    <div className="projeto-null-title">
                      <h4>Nenhum quadro cadastrado</h4>
                      <p>Crie um quadro para poder iniciar seu gerenciamento!</p>
                    </div>
                    <button className="add_desktop" onClick={() => handleOpenModalFrame()}>Adicionar quadro +</button>
                  </div>
                )}

                {modId && frame.length > 0 && (
                  modId === 1 ? (RenderKanban(frame)) : modId === 2 ? (RenderChecklist(frame)) : (RenderNotes(frame))
                )}

                {!modId && frames.length > 0 && (
                  <div className="projeto-null">
                    <div className="projeto-null-title">
                      <h4>Nenhum quadro selecionado</h4>
                      <p>Selecione um quadro acima para exibí-lo</p>
                    </div>
                  </div>
                )}

              </div>
            </>
          ) : (
            navigate(`/desktop`)
          )}
          
        </div>
      </section>

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

      {showModalFrame && (
        <div className="modal">
          <div className="perfil-usuario-bioo">
            <div className="lista-topo">
              <h3>Adicionar quadro</h3>
              <span className="mdi mdi-close close" onClick={() => handleCloseModalFrame()}><AiOutlineClose/></span>
            </div>

            <form className="lista-datoss" onSubmit={handleSubmit(SubmitFrame)}>
              <label>Nome do quadro</label>
              <input
                type="text"
                placeholder="Insira o título do quadro"
                className={errors?.fra_title && 'input-error'}
                {...register('fra_title', {required: true, minLength: 4})}
                onChange={handleChangeFrame}
              />
              {errors?.fra_title?.type === 'required' && <p className="form_error_message">Insira um nome para o quadro!</p>}
              {errors?.fra_title?.type === 'minLength' && <p className="form_error_message">O nome do quadro precisa conter no mínimo 4 caracteres</p>}

              <div className='space'></div>
              <label>Descrição do quadro</label>
              <input
                type="text"
                placeholder="Insira a descrição do quadro"
                className={errors?.fra_description && 'input-error'}
                {...register('fra_description', {required: true, minLength: 10})}
                onChange={handleChangeFrame}
              />
              {errors?.fra_description?.type === 'required' && <p className="form_error_message">Insira uma descrição para o quadro!</p>}
              {errors?.fra_description?.type === 'minLength' && <p className="form_error_message">A descrição do quadro precisa conter no mínimo 10 caracteres</p>}

              <ul className="lista-datoss1">
                <p onClick={handleCloseModalFrame}>Cancelar</p>
                <button type="submit" disabled={!isValid}>Adicionar quadro</button>
              </ul>
            </form>

          </div>
        </div>
      )}

      {showModalFrameUpdate && (
        <div className="modal">
          <div className="perfil-usuario-bioo">
            <div className="lista-topo">
              <h3>Editar quadro</h3>
              <span className="mdi mdi-close close" onClick={() => handleCloseModalFrameUpdate()}><AiOutlineClose/></span>
            </div>

            <form className="lista-datoss" onSubmit={handleSubmit(SubmitUpdateFrame)}>
              <label>Nome do quadro</label>
              <input
                type="text"
                placeholder="Insira o título do quadro"
                value={inputUpdateFrame.fra_titleUpdated}
                className={errors?.fra_titleUpdated && 'input-error'}
                {...register('fra_titleUpdated', {required: true, minLength: 4})}
                onChange={handleChangeUpdateFrame}
              />
              {errors?.fra_titleUpdated?.type === 'required' && <p className="form_error_message">Insira um nome para quadro!</p>}
              {errors?.fra_titleUpdated?.type === 'minLength' && <p className="form_error_message">O nome do quadro precisa conter no mínimo 4 caracteres</p>}

              <div className='space'></div>
              <label>Descrição do quadro</label>
              <input
                type="text"
                placeholder="Insira a descrição do quadro"
                value={inputUpdateFrame.fra_descriptionUpdated}
                className={errors?.des_descriptionUpdated && 'input-error'}
                {...register('fra_descriptionUpdated', {required: true, minLength: 10})}
                onChange={handleChangeUpdateFrame}
              />
              {errors?.fra_descriptionUpdated?.type === 'required' && <p className="form_error_message">Insira uma descrição para o quadro!</p>}
              {errors?.fra_descriptionUpdated?.type === 'minLength' && <p className="form_error_message">A descrição do quadro precisa conter no mínimo 10 caracteres</p>}

              <ul className="lista-datoss1">
                <p onClick={() => handleCloseModalFrameUpdate()}>Cancelar</p>
                <button type="submit" disabled={!isValid}>Editar quadro</button>
              </ul>
            </form>

          </div>
        </div>
      )}
      
      {showModalFrameDelete && (
        <div className="modal">
          <div className="perfil-usuario-bioo">
            <div className="lista-topo">
              <h3>Excluir quadro</h3>
              <span className="mdi mdi-close close" onClick={() => setShowModalFrameDelete(false)}><AiOutlineClose/></span>
            </div>

            <form className="lista-datoss" onSubmit={handleSubmit(SubmitDeleteFrame)}>
              <label>Tem certeza que deseja excluir o quadro?</label>
              <ul className="lista-datoss1">
                <p onClick={() => setShowModalFrameDelete(false)}>Cancelar</p>
                <button type="submit">Excluir quadro</button>
              </ul>
            </form>

          </div>
        </div>
      )}

      {showModalCreateTable && (
        <div className="modal">
          <div className="perfil-usuario-bioo">
            <div className="lista-topo">
              <h3>Adicionar tabela</h3>
              <span className="mdi mdi-close close" onClick={() => handleCloseModalTableCreate()}><AiOutlineClose/></span>
            </div>

            <form className="lista-datoss" onSubmit={handleSubmit(SubmitTable)}>
              <label>Nome da tabela</label>
              <input
                type="text"
                placeholder="Insira o título da tabela"
                className={errors?.kat_title && 'input-error'}
                {...register('kat_title', {required: true, minLength: 4})}
                onChange={handleChangeCreateTable}
              />
              {errors?.kat_title?.type === 'required' && <p className="form_error_message">Insira um nome para a tabela!</p>}
              {errors?.kat_title?.type === 'minLength' && <p className="form_error_message">O nome da tabela precisa conter no mínimo 4 caracteres</p>}

              <div className='space'></div>
              <label>Descrição da tabela</label>
              <input
                type="text"
                placeholder="Insira a descrição da tabela"
                className={errors?.kat_description && 'input-error'}
                {...register('kat_description', {required: true, minLength: 10})}
                onChange={handleChangeCreateTable}
              />
              {errors?.kat_description?.type === 'required' && <p className="form_error_message">Insira uma descrição para a tabela!</p>}
              {errors?.kat_description?.type === 'minLength' && <p className="form_error_message">A descrição da tabela precisa conter no mínimo 10 caracteres</p>}

              <ul className="lista-datoss1">
                <p onClick={handleCloseModalTableCreate}>Cancelar</p>
                <button type="submit" disabled={!isValid}>Adicionar tabela</button>
              </ul>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Project
