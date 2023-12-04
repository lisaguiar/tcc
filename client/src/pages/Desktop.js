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
import { RiEdit2Fill, RiHome2Line, RiHome6Line, RiHomeLine, RiMore2Fill } from 'react-icons/ri'
import { io } from 'socket.io-client'
import SearchBar from '../functions/SearchBar'


const Desktop = () => {
  const [showModal, setShowModal] = useState(false)
  const [showModalUpdate, setShowModalUpdate] = useState(false)
  const [showModalDelete, setShowModalDelete] = useState(false)

  const {register, formState: {errors, isValid}, handleSubmit} = useForm({
    mode: "all"
  })

  const { currentUser, handleDesktop } = useContext(AuthContext)
  const location = useLocation()
  const use_id = currentUser?.use_id
  const last_id = currentUser?.use_lastDesktop
  const uda_id = currentUser?.uda_id
  const des_id = location.pathname.split("/")[2]

  const createdAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")



  const navigate = useNavigate()

  const [desktop, setDesktop] = useState([])
  const [valid, setValid] = useState(true)
  const [query, setQuery] = useState("")
  const [count, setCount] = useState(true)
  const [lastDesktop, setLastDesktop] = useState([])
  const [err, setErr] = useState("")

  const [inputDesktop, setInputDesktop] = useState({
    des_title: "",
    des_description: "",
    des_createdAt: createdAt
  })

  const [inputUpdateDesktop, setInputUpdateDesktop] = useState({
    des_titleUpdated: "",
    des_descriptionUpdated: ""
  })

  const handlePatch = async (title, description) => {
    await setInputUpdateDesktop({
        des_titleUpdated: title,
        des_descriptionUpdated: description
    })
  }

  const submitChangeDesktop = async (values) => {
    try {
      await handleDesktop(values)
    } catch (err) {
      setErr("Houve um problema ao acessar a área de trabalho selecionada. Tente novamente mais tarde.")
    }
  }


  const { handleOnlineStatus, connectionErr } = useHandleDatabaseRequest()
  let isOnline = true

  useEffect(() => {
    const socket = io('http://localhost:8000')
  
    socket.on('connect', () => {
      console.log('Conectado ao servidor do Socket.io')
    })

    socket.on('desktopUpdated', (data) => {
        // Atualize a lista de projetos com o novo projeto recebido
        console.log('Área atualizada:', data.desktopId)
    })

    socket.on('desktopDeleted', () => {
        // Atualize a lista de projetos com o novo projeto recebido
        console.log('Área deletada!')
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
        const res = await axios.get(`/api/desktops/all/${use_id}/?q=${query}`);
        setDesktop(res.data.filter(desktop => desktop.des_id === des_id))
      } catch (err) {
        setErr(err.data)
      }
    }
  
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
    getLastDesktop()
  
  }, [use_id, query, last_id, isOnline, connectionErr, getLastDesktop, valid])

  const [DropIsOpen, setDropIsOpen] = useState(false)

  function Dropdown () {
    return (
      <div className="prof_dropdown">
        <div className="prof_item" disabled={true} onClick={() => {setDropIsOpen(!DropIsOpen)}}>
          <AiOutlineEdit/>
          <p>Editar Área de Trabalho</p>
        </div>
        <div className="prof_item" disabled={true} onClick={() => {setDropIsOpen(!DropIsOpen)}}>
          <AiOutlineDelete/>
          <p>Excluir Área de Trabalho</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {Logado()}
      <section className="home-section">
        <div className="submenuproj">
          <SearchBar/>

          <div className='space'></div>

          <div>
            {err && <ErrorDisplay message={err} />}
          </div>
        </div>

        <div className="topo">
          <div className="projeto">
            {desktop && desktop !== 0 && desktop.map((desktop) => {
              return (
                <div className="projeto-2" key={desktop.des_id}>
                {DropIsOpen && <Dropdown />}
                  <div className="projeto-title">
                   <p>{desktop.des_title}</p>
                  </div>
                  <span className="projeto-icon-edit" onClick={() => setDropIsOpen(!DropIsOpen)}><RiMore2Fill size={20}/></span>

                  <div className="projeto-description">
                    <p>{desktop.des_description}</p>
                    <br/>
                    <span className="projeto-edit"><p>Editar Área de Trabalho</p></span>
                    <span className="projeto-edit"><p>Excluir Área de Trabalho</p></span>
                  </div>

                 
                </div>
              )
            })}          
          </div> 
          <hr className="hr2"/>     
        </div>
      </section>
    </div>
  )
}

export default Desktop