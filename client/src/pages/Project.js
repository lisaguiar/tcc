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
import SearchBar from '../functions/SearchBar'
import Modal from '../functions/Modal'

const Project = () => {

  const [openModal, setOpenModal] = useState(false)
  const [inputType, setInputType] = useState("")
  const [inputOperation, setInputOperation] = useState("")
  const [inputItem, setInputItem] = useState("")

  const {register, formState: {errors}, handleSubmit} = useForm({
    mode: "all"
  })

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

  const handleChange = (updatedFunction, fieldName, e) => {
    updatedFunction((prev) => ({...prev, [fieldName]: e.target.value}))
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
  //setShowModalDeleteTable(false)
}

  const location = useLocation()
  const des_id = location.pathname.split("/")[2]
  const pro_id = location.pathname.split("/")[4]
  const fra_id = location.pathname.split("/")[6]

  const handleFrameId = () => {
    setFrameId(location.pathname.split("/")[6])
  }

  const handleOpenModal = (value) => {
    setOpenModal(value)
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
              <AiOutlineClose className="delete-table" onClick={() => {
              /*handleSubmitDeleteTable(katId)*/ 
              setInputOperation("create")
              setInputType("cartão")
              setInputItem(katId)
              setOpenModal(true)
              }
              }/>

            </div>
            <div className="itens-container">
              {kanbanCards &&
                kanbanCards.map((card, index) => (
                  <Card
                    key={card.kac_id}
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
  
  function Card({ key, index, card }) {
    return (
      <Draggable draggableId={card.kac_id.toString()} index={index}>
        {(provided) => (
          <div key={card.kac_id}
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
      setModId(frame.mod_id)
      navigate(`/desktop/${des_id}/project/${pro_id}/frame/${frame.fra_id}`)
    }

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
    // Inicialização do socket
    const socket = io('http://localhost:8001');
  
    socket.on('connect', () => {
      console.log('Conectado ao servidor do Socket.io');
    });
  
    socket.on('disconnect', () => {
      console.log('Desconectado do servidor do Socket.io');
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);
  
  useEffect(() => {
    // Verifique a permissão do usuário
    const permission = async () => {
      try {
        const res = await checkUserPermission(des_id);
        if (!res) {
          window.location.replace('/desktop');
        }
      } catch (err) {
        setErr(err.data);
      }
    };
  
    if (isOnline) {
      // Execute ações relacionadas à conexão online
      permission();
      getFrames();
      getProject();
      getProjects();
      const socket = io('http://localhost:8001');
  
      if (fra_id) {
        handleFrameId();
        getFrame();
      }
  
      if (frame) {
        validateFrameModId();
  
        if (modId === 1) {
          getKanbanTable();
          getKanbanCards();
        } else if (modId === 2) {
          // Lógica para modId igual a 2
        }
      }
  
      socket.on('projectUpdated', (data) => {
          getProjects()
      })
  
      socket.on('projectDeleted', (data) => {
          getProjects()
      })
  
      socket.on('projectCreated', () => {
        getProjects()
      });
  
      socket.on('frameUpdated', (data) => {
        getFrame();
        getFrames();
      });
  
      socket.on('frameDeleted', (data) => {
        if (data.fra_id === frameId) {
          setCountFrames(false);
          setErr('O quadro foi excluído por um membro!');
        } else {
          getFrames();
        }
      });
  
      socket.on('frameCreated', () => {
        getFrames();
      });
  
      socket.on('kanbanCreated', () => {
        handleFrame();
        getKanbanTable();
        getKanbanCards();
      });
  
      socket.on('kanbanUpdated', (data) => {
        getKanbanTable();
        getKanbanCards();
      });
    } else {
      setErr(connectionErr);
    }
  }, [use_id, query, last_id, pro_id, des_id, openModal, checkUserPermission, fra_id, frameId, getFrame, getFrames, getProject, getProjects, modId, getKanbanCards, getKanbanTable]);

  const [DropIsOpen, setDropIsOpen] = useState(false)

  function Dropdown () {
    if (frameId) {
      return (
        <div className="prof_dropdown">
          <div className="prof_item" onClick={() => {setDropIsOpen(!DropIsOpen); /*handleOpenModalFrameUpdate()*/ }}>
            <AiOutlineEdit/>
            <p>Editar Quadro</p>
          </div>
          <div className="prof_item" onClick={() => {setDropIsOpen(!DropIsOpen); /*handleOpenModalFrameDelete()*/ }}>
            <AiFillDelete/>
            <p>Excluir Quadro</p>
          </div>
          <div className="prof_item" onClick={() => {setDropIsOpen(!DropIsOpen); /*setShowModalFrame(true)*/ }}>
            <RiLayoutBottom2Line/>
            <p>Criar Quadro</p>
          </div>
        </div>
      )
    } else {
      return (
        <div className="prof_dropdown">
          <div className="prof_item" onClick={() => {setDropIsOpen(!DropIsOpen);
             setInputType("projeto")
             setInputOperation("update")
             setInputItem(project)
             setOpenModal(true)
            
            
            /*navigate(`/desktop/${des_id}/project/${pro_id}/edit`)*/}}>
            <AiOutlineEdit/>
            <p>Editar Projeto</p>
          </div>
          <div className="prof_item" onClick={() => {setDropIsOpen(!DropIsOpen); 
            setInputType("projeto")
            setInputOperation("delete")
            setInputItem(project)
            setOpenModal(true)
            
            /*navigate(`/desktop/${des_id}/project/${pro_id}/edit`)}*/ }}>
            <AiFillDelete/>
            <p>Excluir Projeto</p>
          </div>
          <div className="prof_item" onClick={() => {setDropIsOpen(!DropIsOpen); 
            setInputType("projeto")
            setInputOperation("create")
            setOpenModal(true)
            
            /*setShowModalProject(true)*/}}>
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

            {openModal ? <Modal type={inputType} operation={inputOperation} modal={openModal} input={inputItem} openChange={handleOpenModal}/> : null}

            {valid && frames.map((frame) => {
              return (
                <div className="quadro-item" key={frame.fra_id} onClick={() => handleFrame(frame)}>
                <RiInboxLine/>
                  <p>{frame.fra_title}</p>
                </div>
              )
            })}
            {valid && frames.length !== 0 ? (
              <div className="quadro-item-add" onClick={() => {
                    setInputType("quadro")
                    setInputOperation("create")
                    setOpenModal(true)}} >
                <p>+</p>
              </div>
      
            ) : (<></>)}

            {frame && (
              <>
                <div className='add-frame'>
                  <p onClick={() => {
                    setInputType("tabela")
                    setInputOperation("create")
                    setOpenModal(true)}} >Adicionar Tabela</p>
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
                    <button className="add_desktop" 
                    onClick={() => {
                      setInputType("quadro")
                      setInputOperation("create")
                      setOpenModal(true)}}>Adicionar quadro +</button>
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
    </div>
  )
}

export default Project