import React, { useCallback, useContext, useEffect, useState } from 'react'
import '../styles/Workspace.css'
import axios from '../api/axios'
import { AuthContext } from '../contexts/auth'
import { useLocation, useNavigate } from 'react-router-dom'
import { useHandleDatabaseRequest } from '../middleware/connection'
import moment from 'moment'
import { RiSettingsLine, RiTrelloFill, RiUserLine } from 'react-icons/ri'
import { io } from 'socket.io-client'
import SearchBar from '../components/SearchBar'
import Modal from '../components/Modal'

const Board = () => {
  const [openModal, setOpenModal] = useState(false)
  const [inputType, setInputType] = useState("")
  const [inputOperation, setInputOperation] = useState("")
  const [inputItem, setInputItem] = useState("")

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

  const navigate = useNavigate()

  const [desktop, setDesktop] = useState()
  const [valid, setValid] = useState(true)
  const [query, setQuery] = useState("")
  const [count, setCount] = useState(true)
  const [countProject, setCountProject] = useState(true)
  const [lastDesktop, setLastDesktop] = useState([])
  const [projects, setProjects] = useState()
  const [err, setErr] = useState("")

  const submitChangeDesktop = async (values) => {
    try {
      await handleDesktop(values)
    } catch (err) {
      setErr("Houve um problema ao acessar a área de trabalho selecionada. Tente novamente mais tarde.")
    }
  }

  const handleOpenModal = (value) => {
    setOpenModal(value)
  }

  const { handleOnlineStatus, connectionErr } = useHandleDatabaseRequest()
  let isOnline = true

  useEffect(() => {
    const socket = io('http://localhost:8000')
  
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
      const res = await axios.get(`/api/projects`)
      setProjects(res.data)
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

  const getDesktop = async () => {
    try {
      const res = await axios.get(`api/desktops/all/${use_id}/?q=${query}`)

      if (res.data.length > 0) {
        setDesktop(res.data)
      }
     
    } catch (err) {
      setErr(err.error)
    }
  }
  
  useEffect(() => {
    const socket = io('http://localhost:8000')

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

  /*function Dropdown () {
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
  }*/

  return (
    <div>
      <section className="relative bg-white h-full">
        <SearchBar/>

        <div className="flex flex-col absolute top-0 left-searchbar w-board min-w-fit max-w-full min-h-full max-h-fit bg-white  border rounded-tl-lg border-dark-grey">
          <div className="px-16 w-full h-full">
          
          {openModal ? <Modal type={inputType} operation={inputOperation} modal={openModal} input={inputItem} openChange={handleOpenModal}/> : null}

            <div className="flex flex-shrink-0 flex-wrap w-4/6 min-h-fit my-12 items-start">
              <h3 className="font-medium w-full">Suas áreas de trabalho</h3>
              <p onClick={() => {
                setInputOperation("create")
                setInputType("área")
                setOpenModal(true)
              }}>Adicionar desktop</p>
              {desktop ? (
                <div className='flex flex-shrink-0 flex-wrap w-full min-h-full'>
                  {desktop.map((desktop) => {
                    return (
                      <div className="w-full h-full" key={desktop.des_id}>
                        <div className="min-w-fit flex space-x-2 items-center my-5">
                          <div className="flex flex-shrink-0 w-10 h-10 justify-center items-center gradient-auto rounded-sm cursor-pointer" onClick={() => navigate(`/desktop/${desktop.des_id}`)}>
                            <p className="font-medium text-2xl text-white">{desktop.des_title.charAt(0)}</p>
                          </div>
                          <p className="w-2/6 font-medium truncate" onClick={() => navigate(`/desktop/${desktop.des_id}`)}>{desktop.des_title}</p>
                          <div className="flex flex-wrap w-4/6 h-10 justify-between pl-5">
                            <div className="flex justify-center space-x-2 items-center w-[30%] min-w-fit h-10 bg-light-grey rounded-sm cursor-pointer hover:bg-dark-grey transition-all duration-300 ease">
                              <RiTrelloFill className="text-dark-purple h-6 w-6"/>
                              <p className="text-sm" onClick={() => navigate(`/desktop/${desktop.des_id}`)}>Projetos</p>
                            </div>
                            <div className="flex justify-center space-x-1 items-center w-[30%] min-w-fit h-10 bg-light-grey rounded-sm cursor-pointer  hover:bg-dark-grey transition-all duration-300 ease">
                              <RiUserLine className="text-dark-purple h-5 w-5"/>
                              <p className="text-sm">Membros</p>
                            </div>
                            <div className="flex justify-center space-x-1 items-center w-[35%] min-w-fit h-10 bg-light-grey rounded-sm cursor-pointer hover:bg-dark-grey transition-all duration-300 ease">
                              <RiSettingsLine className="text-dark-purple h-5 w-5"/>
                              <p className="text-sm">Configurações</p>
                            </div>
                          </div>
                        </div>
                        <div className="w-full min-h-fit flex flex-wrap justify-between">
                          {projects && projects
                            .filter(project => project.des_id === parseInt(desktop.des_id))  
                            .map((project) => {
                              return (
                                <div className="flex justify-center items-center w-[22%] h-28 bg-light-grey rounded-sm mb-4  cursor-pointer hover:bg-dark-grey transition-all duration-300 ease" onClick={() => navigate(`/desktop/${desktop.des_id}/project/${project.pro_id}`)}>
                                  <p>{project.pro_title}</p>
                                </div>
                              )
                            })
                          }
                          <div className="flex justify-center items-center w-[22%] h-28 bg-light-grey rounded-sm mb-4 cursor-pointer hover:bg-dark-grey transition-all duration-300 ease" onClick={() => {
                            setInputOperation("create")
                            setInputType("projeto")
                            setInputItem(desktop)
                            setOpenModal(true)
                          }}>
                            <p className="p-4 text-center font-light">Criar novo projeto</p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
                </div>
              ) : (
                <div>
                  <p className="mt-2 w-full">Você ainda não é membro de nenhuma área de trabalho. <a className="text-light-purple cursor-pointer" onClick={() => {
                    setInputOperation("create")
                    setInputType("área")
                    setOpenModal(true)
                  }}> Criar área de trabalho.</a>
                  </p>
                </div>
              )}
            </div>

          </div>
        
        </div>
      </section>
    </div>
  );
};

export default Board