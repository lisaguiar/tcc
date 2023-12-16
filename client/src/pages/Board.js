import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/auth'
import { useLocation, useNavigate } from 'react-router-dom'
import { RiSettingsLine, RiTrelloFill, RiUserLine } from 'react-icons/ri'
import SearchBar from '../components/SearchBar'
import Modal from '../components/Modal'
import { getDesktops } from '../api/desktop'
import { getAllProjects } from '../api/project'
import { ModalContext } from '../contexts/modal'

const Board = () => {
    const { openModal, inputType, inputOperation, inputItem, setModalState } = useContext(ModalContext)

    const { currentUser } = useContext(AuthContext)

    const location = useLocation()

    const use_id = location.pathname.split("/")[2]

    const navigate = useNavigate()

    const [desktop, setDesktop] = useState()
    const [projects, setProjects] = useState()
    const [err, setErr] = useState("")

    useEffect(() => {
        const fetchDesktop = async () => {
            try {
                const res = await getDesktops(use_id)
                setDesktop(res)
            } catch (error) {
                setErr(error.response.data.error)
            }
        }
    
        const fetchProject = async () => {
            try {
                const res = await getAllProjects()
                setProjects(res)
            } catch (error) {
                setErr(error.response.data.error)
            }
        }

        fetchDesktop()
        fetchProject()

    }, [use_id])

    return (
        <div>
            <section className="relative bg-white h-full">
            
            <SearchBar/>

            <div className="flex flex-col absolute top-0 left-searchbar w-board min-w-fit max-w-full min-h-full max-h-fit bg-white  border rounded-tl-lg border-dark-grey">
                <div className="px-16 w-full h-full">
                
                {openModal && <Modal type={inputType} operation={inputOperation} input={inputItem}/>}

                <div className="flex flex-shrink-0 flex-wrap w-4/6 min-h-fit my-12 items-start">
                    <h3 className="font-medium w-full">Suas áreas de trabalho</h3>
                    <p onClick={() => {
                        setModalState({type:"área", operation:"create"})
                    }}>Adicionar desktop</p>
                    {desktop ? (
                    <div className='flex flex-shrink-0 flex-wrap w-full min-h-full'>
                        {desktop.map((desktop) => {
                        return (
                            <div className="w-full h-full" key={desktop.des_id}>
                            <div className="min-w-fit flex space-x-2 items-center my-5">
                                <div className="flex flex-shrink-0 w-10 h-10 justify-center items-center gradient-auto rounded-sm cursor-pointer" onClick={() => navigate(`/u/${desktop.uda_id}/desktop/${desktop.des_id}`)}>
                                <p className="font-medium text-2xl text-white">{desktop.des_title.charAt(0)}</p>
                                </div>
                                <p className="w-2/6 font-medium truncate" onClick={() => navigate(`/u/${desktop.uda_id}/desktop/${desktop.des_id}`)}>{desktop.des_title}</p>
                                <div className="flex flex-wrap w-4/6 h-10 justify-between pl-5">
                                <div className="flex justify-center space-x-2 items-center w-[30%] min-w-fit h-10 bg-light-grey rounded-sm cursor-pointer hover:bg-dark-grey transition-all duration-300 ease">
                                    <RiTrelloFill className="text-dark-purple h-6 w-6"/>
                                    <p className="text-sm" onClick={() => navigate(`/u/${desktop.uda_id}/desktop/${desktop.des_id}`)}>Projetos</p>
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
                                    <div className="flex justify-center items-center w-[22%] h-28 bg-light-grey rounded-sm mb-4  cursor-pointer hover:bg-dark-grey transition-all duration-300 ease" key={project.pro_id} onClick={() => navigate(`/u/${desktop.uda_id}/project/${project.pro_id}`)}>
                                        <p>{project.pro_title}</p>
                                    </div>
                                    )
                                })
                                }
                                <div className="flex justify-center items-center w-[22%] h-28 bg-light-grey rounded-sm mb-4 cursor-pointer hover:bg-dark-grey transition-all duration-300 ease" onClick={() => {
                                    setModalState({type:"projeto", operation:"create", item:desktop})
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
                        <p className="mt-2 w-full">Você ainda não é membro de nenhuma área de trabalho. <span className="text-light-purple cursor-pointer" onClick={() => {
                            setModalState({type:"área", operation:"create"})
                        }}> Criar área de trabalho.</span>
                        </p>
                    </div>
                    )}
                </div>
                </div>
            </div>
        </section>
    </div>
    )
}

export default Board