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

  const handleOpenModal = () => {
    setShowModal(true)
  }
  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleOpenModalUpdate = () => {
    handlePatch(lastDesktop[0]?.des_title, lastDesktop[0]?.des_description)
    setShowModalUpdate(true)
  }

  const handleCloseModalUpdate = () => {
    setShowModalUpdate(false)
  }

  const handleChangeDesktop = e => {
    setInputDesktop(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleOpenModalDelete = () => {
    setShowModalDelete(true)
  }

  const handleChangeUpdateDesktop = e => {
    setInputUpdateDesktop(prev => ({...prev, [e.target.name]: e.target.value}))
  }

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

  const SubmitDesktop = async () => {
    try {
      const res = await axios.post(`/api/desktops/post/${use_id}`, inputDesktop)
      await submitChangeDesktop(res.data)
    } catch (err) {
      setErr(err.response.data)
    }
    setShowModal(false)
  }

  const SubmitUpdateDesktop = async () => {
    try {
      await axios.patch(`/api/desktops/patch/${last_id}`, inputUpdateDesktop)
    } catch (err) {
        console.log(err)
      setErr(err.data)
    }
    setShowModalUpdate(false)
  }

  const SubmitDeleteDesktop = async () => {
    try {
        const res = await axios.patch(`/api/desktops/delete/${last_id}`)
        setErr(res.data)
    } catch (err) {
        console.log(err)
      setErr(err.data)
    }
    setShowModalDelete(false)
  }

  const { handleOnlineStatus, connectionErr } = useHandleDatabaseRequest()
  let isOnline = true

  useEffect(() => {
    const socket = io('http://localhost:8001')
  
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
    getLastDesktop()
  
    socket.on('desktopUpdated', () => {
      getLastDesktop()
    })

    socket.on('desktopDeleted', (data) => {
        console.log(data.des_id)
        console.log(last_id)
        if (data.des_id === des_id) {
            submitChangeDesktop(null)
        }
    })
  
    return () => {
      socket.disconnect()
    }
  }, [use_id, query, last_id, isOnline, connectionErr, getLastDesktop, valid])

  const [DropIsOpen, setDropIsOpen] = useState(false)

  function Dropdown () {
    return (
      <div className="prof_dropdown">
        <div className="prof_item" disabled={true} onClick={() => {setDropIsOpen(!DropIsOpen); handleOpenModalUpdate()}}>
          <AiOutlineEdit/>
          <p>Editar Área de Trabalho</p>
        </div>
        <div className="prof_item" disabled={true} onClick={() => {setDropIsOpen(!DropIsOpen); handleOpenModalDelete()}}>
          <AiOutlineDelete/>
          <p>Excluir Área de Trabalho</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {Logado()}
      {parseInt(last_id) === parseInt(des_id) ? console.log("desktop igual") : (navigate('/desktop'))}
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
                  <div className="card card-2" key={desktop.des_id}  onClick={() => navigate('/desktop')}>
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
          {valid && desktop.length !== 0 && (
          <span className='left'>Outras áreas de trabalho</span>
          )}
            {valid && desktop.length !== 0 && desktop.map((desktop) => {
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
                    <br/>
                    <span className="projeto-edit" onClick={() => handleOpenModalUpdate()}><p>Editar Área de Trabalho</p></span>
                    <span className="projeto-edit" onClick={() => handleOpenModalDelete()}><p>Excluir Área de Trabalho</p></span>
                  </div>

                 
                </div>
              )
            })}
            {lastDesktop === 0 && (
              <div><p>Nada</p></div>
            )}
            
          </div> 
          <hr className="hr2"/>     
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
                <p onClick={() => handleCloseModal()}>Cancelar</p>
                <button type="submit" disabled={!isValid}>Adicionar área de trabalho</button>
              </ul>
            </form>

          </div>
        </div>
      )}

      {showModalUpdate && (
        <div className="modal">
          <div className="perfil-usuario-bioo">
            <div className="lista-topo">
              <h3>Editar área de trabalho</h3>
              <span className="mdi mdi-close close" onClick={() => handleCloseModalUpdate()}><AiOutlineClose/></span>
            </div>

            <form className="lista-datoss" onSubmit={handleSubmit(SubmitUpdateDesktop)}>
              <label>Nome da área de trabalho</label>
              <input
                type="text"
                placeholder="Insira o título da área de trabalho"
                value={inputUpdateDesktop.des_titleUpdated}
                className={errors?.pro_title && 'input-error'}
                {...register('des_titleUpdated', {required: true, minLength: 4})}
                onChange={handleChangeUpdateDesktop}
              />
              {errors?.des_titleUpdated?.type === 'required' && <p className="form_error_message">Insira um nome para a área de trabalho!</p>}
              {errors?.des_titleUpdated?.type === 'minLength' && <p className="form_error_message">O nome da área de trabalho precisa conter no mínimo 4 caracteres</p>}

              <div className='space'></div>
              <label>Descrição da área de trabalho</label>
              <input
                type="text"
                placeholder="Insira a descrição da área de trabalho"
                value={inputUpdateDesktop.des_descriptionUpdated}
                className={errors?.des_descriptionUpdated && 'input-error'}
                {...register('des_descriptionUpdated', {required: true, minLength: 10})}
                onChange={handleChangeUpdateDesktop}
              />
              {errors?.des_descriptionUpdated?.type === 'required' && <p className="form_error_message">Insira uma descrição para a área de trabalho!</p>}
              {errors?.des_descriptionUpdated?.type === 'minLength' && <p className="form_error_message">A descrição da área de trabalho precisa conter no mínimo 10 caracteres</p>}

              <ul className="lista-datoss1">
                <p onClick={() => handleCloseModalUpdate()}>Cancelar</p>
                <button type="submit" disabled={!isValid}>Editar área de trabalho</button>
              </ul>
            </form>

          </div>
        </div>
      )}

      {showModalDelete && (
        <div className="modal">
          <div className="perfil-usuario-bioo">
            <div className="lista-topo">
              <h3>Excluir área de trabalho</h3>
              <span className="mdi mdi-close close" onClick={() => setShowModalDelete(false)}><AiOutlineClose/></span>
            </div>

            <form className="lista-datoss" onSubmit={handleSubmit(SubmitDeleteDesktop)}>
              <label>Tem certeza que deseja excluir a área de trabalho?</label>
              <ul className="lista-datoss1">
                <p onClick={() => setShowModalDelete(false)}>Cancelar</p>
                <button type="submit">Excluir área de trabalho</button>
              </ul>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default Desktop