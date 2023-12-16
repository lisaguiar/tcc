import React, { useContext, useEffect, useState } from 'react'
import '../styles/Workspace.css'
import { useLocation, useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import Modal from '../components/Modal'
import { ModalContext } from '../contexts/modal'
import { getFrame, getFrames } from '../api/frame'
import RenderKanban from '../components/RenderKanban'
import RenderChecklist from '../components/RenderChecklist'
import RenderAnnotation from '../components/RenderAnnotation'
import { getKanbanCard, getKanbanTable } from '../api/kanban'

const Frame = () => {
    const { openModal, inputType, inputOperation, inputItem, setModalState } = useContext(ModalContext)

    const [frame, setFrame] = useState([])
    const [frames, setFrames] = useState([])
    const [kanbanTable, setKanbanTable] = useState([])
    const [kanbanCards, setKanbanCards] = useState([])
    const [checklist, setCheklist] = useState([])
    const [annotation, setAnnotation] = useState([])

    const [err, setErr] = useState("")

    const location = useLocation()
    const uda_id = location.pathname.split("/")[2]
    const pro_id = location.pathname.split("/")[4]
    const fra_id = location.pathname.split("/")[6]
  
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resFrame = await getFrame(fra_id)
                setFrame(resFrame)
                const resFrames = await getFrames(pro_id)
                setFrames(resFrames)

                if (resFrame.length > 0) {
                    if (resFrame[0].mod_id === 1) {
                        const resKanbanTable = await getKanbanTable(fra_id)
                        setKanbanTable(resKanbanTable)

                        const resKanbanCard = await getKanbanCard(fra_id)
                        setKanbanCards(resKanbanCard)
                    } else if (resFrame[0].mod_id === 2) {

                    } else if (resFrame[0].mod_id === 3) {

                    }
                }
            } catch (error) {
                setErr(error)
            }
        }
        fetchData()
    }, [fra_id])

    function Frame () {
        const renderFrame = () => {
        if (frame) {
            return (
            <>
                {frame.map((frame) => {
                return (
                    <div key={frame.fra_id}>
                    <p>{frame.fra_title}</p>
                    <p>{frame.fra_description}</p>
                        <div>
                            <span className="projeto-edit"><p>Editar Quadro</p></span>
                            <span className="projeto-edit"><p>Excluir Quadro</p></span>
                        </div>
                    </div>
                )
                })}
            </>
            )
        } else {
            return (
            <>
                <p>quadro nao existe ???? recarrega a pagina ai ou tenta dnv ne</p>
            </>
            )
        }
        }
        return (
        <>
            <div className="flex">
                {renderFrame()}
            </div>
        </>
        )
    }
    function Frames () {
        const renderFrames = () => {
            if (frames) {
                return (
                <>
                    {frames.map((frame) => {
                    return (
                        <div key={frame.fra_id} className='border flex w-full flex-wrap'>
                        <p className='w-full'>{frame.fra_title}</p> //map dos frames pra poder trocar de quadro
                        </div>
                    )
                    })}
                </>
                )
            } else {
            
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
    const RenderFrame = () => {
        switch (frame[0].mod_id) {
            case 1:
                return RenderKanban({ kanbanTable: kanbanTable, kanbanCards: kanbanCards })
            case 2:
                RenderChecklist(checklist)
            break
            case 3:
                RenderAnnotation(annotation)
            break
        }
    }

    return (
        <div>
            <section className="home-section">
                <SearchBar/>
                <div className="topo">
                    <div className="projeto">
                        {Frame()}
                    
                    </div>
                    <div className="quadro-map">
                        {Frames()}
                        {frame.length > 0 && RenderFrame()}
                        {openModal && <Modal type={inputType} operation={inputOperation} input={inputItem}/>}

                    </div>
                </div>
            </section>
        </div>
    )
}

export default Frame