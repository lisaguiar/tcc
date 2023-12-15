import React, { useEffect, useState } from 'react'
import '../styles/Workspace.css'
import { useLocation, useNavigate } from 'react-router-dom'
import ErrorDisplay from '../components/HandleError'
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import { RiMore2Fill } from 'react-icons/ri'

import SearchBar from '../components/SearchBar'

import { getDesktop } from '../api/desktop'
import { getProjects } from '../api/project'


const Desktop = () => {
  const [openModal, setOpenModal] = useState(false)
  const [inputType, setInputType] = useState("")
  const [inputOperation, setInputOperation] = useState("")
  const [inputItem, setInputItem] = useState("")

  const location = useLocation()

  const uda_id = location.pathname.split("/")[2]
  const des_id = location.pathname.split("/")[4]

  const navigate = useNavigate()

  const [desktop, setDesktop] = useState([])
  const [project, setProject] = useState([])
  const [query, setQuery] = useState("")
  const [err, setErr] = useState("")

  useEffect(() => {
    const fetchDesktop = async () => {
      try {
        const res = await getDesktop(des_id)
        setDesktop(res)
      } catch (error) {
          setErr(error.response.data.error)
      }
    }

    const fetchProject = async () => {
      try {
        const res = await getProjects(des_id)
        setProject(res)
      } catch (error) {
        setErr(error.response.data.error)
    }
    }

    fetchDesktop()
    fetchProject()
  }, [uda_id, query])

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