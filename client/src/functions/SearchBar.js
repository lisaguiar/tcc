import { useCallback, useContext, useEffect, useState } from "react"
import { AuthContext } from "../contexts/authContext"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "../api/axios"
import { AiOutlineEdit } from "react-icons/ai"
import ErrorDisplay from "./HandleError"
import { io } from "socket.io-client"

function SearchBar() {
    const [query, setQuery] = useState("")
    const [projects, setProjects] = useState("")
    const [desktops, setDesktops] = useState("")
    const [frames, setFrames] = useState("")
    const [err, setErr] = useState("")

    const location = useLocation()
    const des_id = location.pathname.split("/")[2]
    const pro_id = location.pathname.split("/")[4]
    const fra_id = location.pathname.split("/")[6]

    const { currentUser } = useContext(AuthContext)
    const use_id = currentUser?.use_id

    const getProjects = useCallback(async () => {
        try {
            const res = await axios.get(`/api/projects/all/${des_id}/${pro_id}?=${query}`)
            setProjects(res.data)
        } catch (err) {
            setErr(err.data)
        }
    }, [des_id, query])

    const getDesktops = useCallback(async () => {
        try {
            const res = await axios.get(`/api/desktops/all/${use_id}/${des_id}/?q=${query}`)
            setDesktops(res.data)
        } catch (err) {
            setErr(err.data)
        }
    }, [query])

    const getFrames = useCallback(async () => {
        try {
            const res = await axios.get(`/api/desktops/all/${use_id}/${des_id}/?q=${query}`)
            setDesktops(res.data)
        } catch (err) {
            setErr(err.data)
        }
    }, [query])

    const type = 
    fra_id !== undefined ? "Quadros" : 
    pro_id !== undefined ? "Projetos" : 
    "Área de trabalho"

    useEffect(() => {
        const socket = io('http://localhost:8001')

        if (fra_id !== undefined) {
            try {
                getFrames()
            } catch (err) {
                setErr(err.data)
            }
        } else if (pro_id !== undefined) {
            try {
                getProjects()
            } catch (err) {
                setErr(err.data)
            }
        } else {
            try {
                getDesktops()
            } catch (err) {
                setErr(err.data)
            }
        }
        
        socket.on('projectUpdated', () => {
          getProjects()
        })
    }, [fra_id, pro_id])

    const variableMapping = {
      Quadros: {
        set: setFrames,
        map: frames,
        filter: "fra_id",
        title: "fra_title",
        value: parseInt(fra_id)
      },
      Projetos: {
        set: setProjects,
        map: projects,
        filter: "pro_id",
        title: "pro_title",
        value: parseInt(pro_id)
      },
      "Área de trabalho": {
        set: setDesktops,
        map: desktops,
        filter: "des_id",
        title: "des_title",
        value: parseInt(des_id)
      },
    }
    
    const { set: var_set, map: var_map, filter: var_filter, title: var_title, value: var_value } = variableMapping[type]

    return (
        <div className="submenuproj">

            <div>
                {err && <ErrorDisplay message={err} />}
            </div>

            <div className="textmain">
                <AiOutlineEdit/>
                <h4>{type}</h4>
            </div>
            <div className="search">
                <input className="searchbar" placeholder="🔍 Pesquisar" disabled={!var_map} onChange={(e) => setQuery(e.target.value.toLowerCase())}/>
                <button className="add__desktop" /*onClick*/ >+</button>
            </div>

            <div className="space"/>

            <div className="cards">
                {var_map.length > 0 && var_map
                    .filter(item => item[var_filter] === var_value)
                    .map((item) => {
                        console.log("oiiiii")
                        const firstLetter = item[var_title].charAt(0).toUpperCase()
                        return (
                            <>
                                <span className="left">Atual</span>
                                <div className="card-last card-2" key={item[var_filter]}>
                                    <div className="card__letter">
                                        <h3>{firstLetter}</h3>
                                    </div>
                                    <h4 className="card__title">{item[var_title]}</h4>
                                </div>
                            </>
                        )
                    })
                }
            </div>

            <div className="space"/>

            <div className="cards">
                {var_map.length > 0 && (
                    <>
                        <span className="left">Mais {type}</span>
                        {var_map
                        .filter(item => item[var_filter] !== var_value)
                        .map((item) => {
                            const firstLetter = item[var_title].charAt(0).toUpperCase()
                            return (
                                <div className="card card-2" key={item[var_filter]} /*onClick={() => submitChangeDesktop(desktop.des_id)}*/>
                                <div className="card__letter">
                                    <h3>{firstLetter}</h3>
                                </div>
                                <h4 className="card__title">{item[var_title]}</h4>
                                </div>
                            )      
                        })} 
                        {query.length !== 0 && (
                            <div className="none">
                                <p>Nenhum resultado encontrado!</p>
                            </div>
                        )}
                        {var_map.filter(item => item[var_filter] !== var_value).length === 0 && (
                            <>
                                <p>faz mais ai po</p>
                            </>
                        )}
                    </>
                )}
                {var_map.length === 0 && (
                    <div className="no-results">
                        <p>Nenhum resultado disponível.</p>
                    </div>
                )}
            </div> 
        </div>
    )
}

export default SearchBar