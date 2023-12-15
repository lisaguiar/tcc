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
  }, [uda_id])

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

  function Desktop () {
    const renderDesktop = () => {
      if (desktop.length > 0) {
        return (
          <>
            {desktop.map((desktop) => {
              return (
                <div key={desktop.des_id}>
                  <p>{desktop.des_title}</p>
                  <p>{desktop.des_description}</p>
                  <p>Criado por: {desktop.use_name}</p>

                  <div>
                    <span className="projeto-edit"><p>Editar Área de Trabalho</p></span>
                    <span className="projeto-edit"><p>Excluir Área de Trabalho</p></span>
                  </div>
                </div>
              )
            })}
          </>
        )
      } else {
        return (
          <>
            <p>área de trabalho nao existe ???? recarrega a pagina ai ou tenta dnv ne</p>
          </>
        )
      }
    }
    
    return (
      <>
        <div className="flex">
          {renderDesktop()}
        </div>
      </>
    )
  }

  function Project () {
    const renderProject = () => {
      if (project.length > 0) {
        return (
          <>
            {project.map((project) => {
              return (
                <div key={project.pro_id} className='border flex w-full flex-wrap'>
                  <p className='w-full'>{project.pro_title}</p>
                  <p>{project.pro_description}</p>
                </div>
              )
            })}
          </>
        )
      } else {
        return (
          <>
            <p>nenhum projeto mano cria ai (insane botao pra eu fazer a função depois)</p>
          </>
        )
      }
    }

    return (
      <>
        <div className='flex flex-wrap'>
          {renderProject()}
        </div>
      </>
    )
  }

  return (
    <div>
      <section className="relative bg-white h-full">
              
        <SearchBar/>

        <div className="flex flex-col absolute top-0 left-searchbar w-board min-w-fit max-w-full min-h-full max-h-fit bg-white  border rounded-tl-lg border-dark-grey">
          <div className="px-16 w-full h-full">
          
  

            <div className="flex flex-shrink-0 flex-wrap w-4/6 min-h-fit my-12 items-start">

              {Desktop()}
              <div>
                {Project()}
              </div>

            </div>   
          </div>
        </div>
      </section>
    </div>
  )
}

export default Desktop