import React, { useCallback, useContext, useEffect, useState } from 'react'
import '../styles/Workspace.css'
import axios from '../api/axios'
import { AuthContext } from '../contexts/authContext'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Logado } from '../components/IsLogged'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useHandleDatabaseRequest } from '../functions/IsOnline'
import { io } from 'socket.io-client'
import { AiFillDelete, AiOutlineClose, AiOutlineEdit, AiOutlineUsergroupAdd } from 'react-icons/ai'
import ErrorDisplay from '../functions/HandleError'
import { RiInboxLine, RiLayoutBottom2Line, RiMore2Fill } from 'react-icons/ri'
import SearchBar from '../functions/SearchBar'
import Modal from '../functions/Modal'
import { CiCirclePlus } from "react-icons/ci";

const Project = () => {

  const [openModal, setOpenModal] = useState(false)
  const [inputType, setInputType] = useState("")
  const [inputOperation, setInputOperation] = useState("")
  const [inputItem, setInputItem] = useState("")

  const navigate = useNavigate()

  const [projects, setProjects] = useState([])

  const [frames, setFrames] = useState([])

  const [kanbanTable, setKanbanTable] = useState([])
  const [kanbanCards, setKanbanCards] = useState([])


  const { currentUser, checkUserPermission } = useContext(AuthContext)
  const uda_id = currentUser?.uda_id
  const use_id = currentUser?.use_id
  const last_id = currentUser?.use_lastDesktop

  const [err, setErr] = useState("")

  const location = useLocation()
  const des_id = location.pathname.split("/")[2]
  const pro_id = location.pathname.split("/")[4]
  const fra_id = location.pathname.split("/")[6]


  const handleOpenModal = (value) => {
    setOpenModal(value)
  }

  function RenderKanban() {

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
          setErr(error.response.data)
        })
    }
  
    return (
      <div className="kanban">
        <DragDropContext onDragEnd={handleDragEnd}>
          {kanbanTable &&
            kanbanTable.map((table) => (
              <ColumnList
                keys={table.kat_id}
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
  
  function ColumnList({ keys, nome, katId, kanbanCards }) {
    return (
      <Droppable droppableId={katId.toString()} key={keys}>
        {(provided) => (
          <div
            key={keys}
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="kanban-container"
          >
            <div className="column-container justify-between p-2">
              <h4>{nome}</h4>
              <div className="flex flex=wrap">
              <CiCirclePlus className="delete-table" onClick={() => {
                setInputOperation("create")
                setInputType("cartão")
                setInputItem(katId)
                setOpenModal(true)
              }
              }/>
              <AiOutlineClose className="delete-table" onClick={() => {
              setInputOperation("delete")
              setInputType("tabela")
              setInputItem(katId)
              setOpenModal(true)
              }
              }/>
            </div>
            </div>
            <div className="itens-container">
              {kanbanCards &&
                kanbanCards.map((card, index) => (
                  <Card
                    keys={card.kac_id}
                    card={card}
                    index={index}
                    katId={katId}
                  />
                ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    )
  }
  
  function Card({ keys, index, card }) {
    return (
      <Draggable draggableId={card.kac_id.toString()} index={index} key={keys}>
        {(provided) => (
          <div key={keys}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className="item-container"

            onClick={() => {
              setInputOperation("update")
              setInputType("cartão")
              setInputItem(card)
              setOpenModal(true)
            }}
          >
            <p>{card.kac_title}</p>
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
      navigate(`/desktop/${des_id}/project/${pro_id}/frame/${frame.fra_id}`)
    }

    const getProjects = useCallback(async () => {
      try {
          const res = await axios.get(`/api/projects/${pro_id}`)
          console.log(res.data)
          setProjects(res.data.filter(project => project.des_id === parseInt(des_id)))
      } catch (err) {
          setErr(err.data)
      }
  }, [pro_id, des_id])

  const getFrames = useCallback(async () => {
    try {
      const res = await axios.get(`/api/frames/${pro_id}/${fra_id}`)
      console.log(res.data)
      setFrames(res.data)
    } catch (err) {
      setErr(err.data)
    }
  }, [pro_id, fra_id])

  const getKanbanTable = useCallback(async () => {
    try {
      const res = await axios.get(`/api/kanban/table/${fra_id}`)
      setKanbanTable(res.data)
    } catch (err) {
      setErr(err.data)
    }
  }, [fra_id])

  const getKanbanCards = useCallback(async () => {
    try {
      const res = await axios.get(`/api/kanban/card/${fra_id}`)
      setKanbanCards(res.data)
    } catch (err) {
      setErr(err.data)
    }
  }, [fra_id])

  /*const validateFrameModId = useCallback(() => {
    if (frame && frame.length !== 0) {
      setModId(frame[0].mod_id)
    }
  }, [frame])*/

  const getPermission = useCallback(async () => {
    try {
      const res = await checkUserPermission(des_id)
      if (!res) {
        window.location.replace('/desktop')
      }
    } catch (err) {
      setErr(err.data)
    }
  }, [checkUserPermission, des_id])

  useEffect(() => {
    if (isOnline) {
      const socket = io('http://localhost:8001')
      getPermission()
      getProjects()
      getFrames()

      console.log("frame: " + fra_id)
      console.log("frames length: " + frames.length)
      console.log(frames)
      
    socket.on('connect', () => {
      console.log('Conectado ao servidor do Socket.io')
    })
  
    socket.on('disconnect', () => {
      console.log('Desconectado do servidor do Socket.io')
    })

    socket.on('projectUpdated', (data) => {
      getProjects()
    })

    socket.on('projectDeleted', (data) => {
      getProjects()
    })

    socket.on('projectCreated', () => {
      getProjects()
    })

    socket.on('frameUpdated', (data) => {
      if (data.proId = pro_id) {
        getFrames()
      }
    })

    socket.on('frameDeleted', (data) => {
      if (data.proId === pro_id) {
        setErr('O quadro foi excluído por um membro!')
        getFrames()
      }
    })

    socket.on('frameCreated', (data) => {
      if (data.proId === pro_id) {
        getFrames()
      }
    })

    socket.on('kanbanCreated', () => {
      getKanbanTable()
      getKanbanCards()
    })

    socket.on('kanbanUpdated', (data) => {
      getKanbanTable()
      getKanbanCards()
    })
    return () => {
      socket.disconnect()
    } 
    } else {
      setErr(connectionErr)
    }
  }, [pro_id, getPermission, getFrames, getProjects, getKanbanCards, getKanbanTable, connectionErr, des_id, fra_id, isOnline])

  useEffect(() => {
    if (fra_id) {
      if (frames.length > 0) {
        if (frames.filter(item => item.fra_id === fra_id).filter(item => item.mod_id === 1)) {
          console.log("oi")
          getKanbanTable()
          getKanbanCards()
        } else if (frames.filter(item => item.mod_id === 2)) {
          console.log("checklist")
        } else if (frames.filter(item => item.mod_id === 3)) {
          console.log("anotações")
        } else {
          navigate(`desktop/${des_id}/projects/${pro_id}`)
        }
      }
    }
  }, [fra_id, frames, openModal])

  const [DropIsOpen, setDropIsOpen] = useState(false)

  function Dropdown () {
    if (fra_id) {
      return (
        <div className="prof_dropdown">
          <div className="prof_item" onClick={() => {setDropIsOpen(!DropIsOpen) /*handleOpenModalFrameUpdate()*/ }}>
            <AiOutlineEdit/>
            <p>Editar Quadro</p>
          </div>
          <div className="prof_item" onClick={() => {setDropIsOpen(!DropIsOpen) /*handleOpenModalFrameDelete()*/ }}>
            <AiFillDelete/>
            <p>Excluir Quadro</p>
          </div>
          <div className="prof_item" onClick={() => {setDropIsOpen(!DropIsOpen) /*setShowModalFrame(true)*/ }}>
            <RiLayoutBottom2Line/>
            <p>Criar Quadro</p>
          </div>
        </div>
      )
    } else {
      return (
        <div className="prof_dropdown">
          <div className="prof_item" onClick={() => {
            setDropIsOpen(!DropIsOpen)
            setInputType("projeto")
            setInputOperation("update")
            setInputItem(projects.filter(project => project.pro_id === parseInt(pro_id)))
            setOpenModal(true)
          }}>
            <AiOutlineEdit/>
            <p>Editar Projeto</p>
          </div>
          <div className="prof_item" onClick={() => {
            setDropIsOpen(!DropIsOpen)
            setInputType("projeto")
            setInputOperation("delete")
            setInputItem(projects.filter(project => project.pro_id === parseInt(pro_id)))
            setOpenModal(true)
          }}>
            <AiFillDelete/>
            <p>Excluir Projeto</p>
          </div>
          <div className="prof_item" onClick={() => {
            setDropIsOpen(!DropIsOpen)
            setInputType("projeto")
            setInputOperation("create")
            setOpenModal(true)
          }}>
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
        <SearchBar/>
        <div className="topo">
          <div className="projeto">
            {!fra_id && projects.length > 0 && projects
            .filter(project => project.pro_id === parseInt(pro_id))
            .map((project) => {
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

            {fra_id && frames.length > 0 && frames
              .filter(frame => frame.fra_id === parseInt(fra_id))
              .map((frame) => { 
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
                    <span className="projeto-edit" onClick={() => {
                      setInputType("tabela")
                      setInputOperation("create")
                      setOpenModal(true)
                    }}>Adicionar Tabela</span>
                    </div>
                </div>
                )
            })}
          </div>
          <div className="quadro-map">

            {openModal ? <Modal type={inputType} operation={inputOperation} modal={openModal} input={inputItem} openChange={handleOpenModal}/> : null}

            {projects.filter(projeto => projeto.pro_id === parseInt(pro_id)).length > 0 && (
                <>
                  {frames.map(frame => (
                    <div className="quadro-item" key={frame.fra_id} onClick={() => handleFrame(frame)}>
                      <RiInboxLine />
                      <p>{frame.fra_title}</p>
                    </div>
                  ))}
                  <div className="quadro-item-add" onClick={() => {
                    setInputType("quadro")
                    setInputOperation("create")
                    setOpenModal(true)
                  }}>
                    <p>+</p>
                  </div>
                </>
              )
            }
          </div>
          {frames.filter(frame => frame.fra_id === parseInt(fra_id)).length > 0 && (
            <>
              <hr className="hr2" />
              <div className="kanbans-container">
                {frames.length === 0 && (
                  <div className="projeto-null project">
                    <div className="projeto-null-title">
                      <h4>Nenhum quadro cadastrado</h4>
                      <p>Crie um quadro para poder iniciar seu gerenciamento!</p>
                    </div>
                    <button className="add_desktop" 
                    onClick={() => {
                      setInputType("quadro")
                      setInputOperation("create")
                      setOpenModal(true)}}>Adicionar quadro +</button>
                  </div>
                )}

                {console.log(!fra_id)}
                {console.log(kanbanTable)}
                {console.log(frames)}
                {fra_id ? (RenderKanban()) : RenderChecklist()}
           
                {!fra_id && frames.length > 0 && (
                  <div className="projeto-null">
                    <div className="projeto-null-title">
                      <h4>Nenhum quadro selecionado</h4>
                      <p>Selecione um quadro acima para exibí-lo</p>
                    </div>
                  </div>
                )}
                </div>
              </>
          )}
          
        </div>
      </section>
    </div>
  )
}

export default Project