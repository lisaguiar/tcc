import React, { useContext, useEffect, useState } from 'react'
import '../styles/Workspace.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useHandleDatabaseRequest } from '../middleware/connection'
import { AiFillDelete, AiOutlineClose, AiOutlineEdit } from 'react-icons/ai'
import { RiLayoutBottom2Line, RiMore2Fill } from 'react-icons/ri'
import SearchBar from '../components/SearchBar'
import Modal from '../components/Modal'
import { CiCirclePlus } from "react-icons/ci"
import { getProject } from '../api/project'

import { ModalContext } from '../contexts/modal'
import { getFrames } from '../api/frame'

const Project = () => {

  const { openModal, inputType, inputOperation, inputItem, setModalState } = useContext(ModalContext)

  const [project, setProject] = useState([])
  const [frames, setFrames] = useState([])


  const [err, setErr] = useState("")

  const location = useLocation()
  const uda_id = location.pathname.split("/")[2]
  const pro_id = location.pathname.split("/")[4]
  
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProject(pro_id)
        setProject(res)
      } catch (error){
        setErr(error)
      }
    }

    const fetchFrames = async () => {
      try {
        const res = await getFrames(pro_id)
        setFrames(res)
      } catch (error) {
        setErr(error)
      }
    }
    fetchProject()
    fetchFrames()
  }, [pro_id])

  const [DropIsOpen, setDropIsOpen] = useState(false)

  function Dropdown () {
      return (
        <div className="prof_dropdown">
          <div className="prof_item" onClick={() => {
            setDropIsOpen(!DropIsOpen)
            /*setInputType("projeto")
            setInputOperation("update")
            setInputItem(project.filter(project => project.pro_id === parseInt(pro_id)))
            setOpenModal(true)*/
          }}>
            <AiOutlineEdit/>
            <p>Editar Projeto</p>
          </div>
          <div className="prof_item" onClick={() => {
            setDropIsOpen(!DropIsOpen)
            /*setInputType("projeto")
            setInputOperation("delete")
            setInputItem(project.filter(project => project.pro_id === parseInt(pro_id)))
            setOpenModal(true)*/
          }}>
            <AiFillDelete/>
            <p>Excluir Projeto</p>
          </div>
          <div className="prof_item" onClick={() => {
            setDropIsOpen(!DropIsOpen)
            setModalState({type:"projeto", operation:"create"})
          }}>
            <RiLayoutBottom2Line/>
            <p>Criar projeto</p>
          </div>
        </div>
      )
  }

  function Project () {
    const renderProject = () => {
      if (project.length > 0) {
        return (
          <>
            {project.map((project) => {
              return (
                <div key={project.pro_id}>
                  <p>{project.pro_title}</p>
                  <p>{project.pro_description}</p>

                  <div>
                    <span className="projeto-edit"><p>Editar Projeto</p></span>
                    <span className="projeto-edit"><p>Excluir Projeto</p></span>
                  </div>
                </div>
              )
            })}
          </>
        )
      } else {
        return (
          <>
            <p>projeto nao existe ???? recarrega a pagina ai ou tenta dnv ne</p>
          </>
        )
      }
    }
    return (
      <>
        <div className="flex">
          {renderProject()}
        </div>
      </>
    )
  }
  function Frames () {
    const renderFrames = () => {
      if (frames.length > 0) {
        return (
          <>
            {frames.map((frame) => {
              return (
                <div key={frame.fra_id} className='border flex w-full flex-wrap'>
                  <p className='w-full'>{frame.fra_title}</p>
                  <p>{frame.fra_description}</p>
                </div>
              )
            })}
          </>
        )
      } else {
        return (
          <>
            <p>nenhum quadro mano cria ai (insane botao pra eu fazer a função depois)</p>
          </>
        )
      }
    }

    return (
      <>
        <div className='flex flex-wrap'>
          {renderFrames()}
        </div>
      </>
    )

  }

  return (
    <div>
      <section className="home-section">
        <SearchBar/>
        <div className="topo">
          <div className="projeto">
            {Project()}
        
          </div>
          <div className="quadro-map">

            {Frames()}

            {openModal && <Modal type={inputType} operation={inputOperation} input={inputItem}/>}

          </div>
          
        </div>
      </section>
    </div>
  )
}

export default Project