import React, { useCallback, useContext, useEffect, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { useForm } from 'react-hook-form'
import axios from "../api/axios"
import { useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/authContext"
import moment from "moment"


function Modal (props) {
    const navigate = useNavigate()

    const { currentUser, checkUserPermission } = useContext(AuthContext)
    const uda_id = currentUser?.uda_id
    const use_id = currentUser?.use_id
    const last_id = currentUser?.use_lastDesktop
    const createdAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
    const [err, setErr] = useState("")

    const location = useLocation()
    const des_id = location.pathname.split("/")[2]
    const pro_id = location.pathname.split("/")[4]
    const fra_id = location.pathname.split("/")[6]

    const [inputFrame, setInputFrame] = useState({
        fra_title: "",
        fra_description: "",
        fra_createdAt: createdAt,
        mod_id: 1
    })
    
    const [inputProject, setInputProject] = useState({
        pro_title: "",
        pro_description: "",
        pro_createdAt: createdAt,
        uda_id: currentUser?.uda_id,
        des_id: currentUser?.use_lastDesktop
    })
    
    const [inputTable, setInputTable] = useState({
        kat_title: "",
        kat_description: "",
        kat_createdAt: createdAt,
        col_id: 1,
        kat_position: 1
    })
  
    const [inputCard, setInputCard] = useState({
        kac_title: "",
        kac_content: "",
        kac_deadline: createdAt,
        kac_createdAt: createdAt,
        kac_position: 1,
        col_id: 1,
        pri_id: 1
    })

    const [priorities, setPriorities] = useState("")
    const [members, setMembers] = useState("")
    
    const handleClose = () => {
        props.openChange(false)
    }

    const SubmitProject = async (props) => {
        switch (props.operation) {
            case "create":
                try {
                    const res = await axios.post(`/api/projects/post/${uda_id}/${des_id}`, getValues())
                    navigate(`/desktop/${des_id}/project/${res.data}`)
                } catch (err) {
                    setErr(err.response.data)
                }
            break
            case "delete":
                try {
                    await axios.patch(`/api/projects/delete/${props.input[0].pro_id}`)
                    window.location.reload()
                } catch (err) {
                    setErr(err.response.data)
                }
            break
            case "update":
                const data = getValues()
                try {
                    await axios.patch(`api/projects/patch/${props.input[0].pro_id}`, data)
                } catch (err) {
                    setErr(err.response.data)
                }
            break
        }
        handleClose()
    }
    
    const SubmitFrame = async (props) => {
        switch (props.operation) {
            case "create":
                try {
                    const res = await axios.post(`/api/frames/post/${uda_id}/${pro_id}`, inputFrame)
                    navigate(`/desktop/${des_id}/project/${pro_id}/frame/${res.data}`)
                } catch (err) {
                    setErr(err.response.data)
                }
            break
            case "delete":
                try {
                    const res = await axios.patch(`/api/frames/delete/${props.input[0].fra_id}`)
                    setErr(res.data)
                } catch (err) {
                    setErr(err.response.data)
                }
            break
            case "update":
                try {
                    await axios.patch(`/api/frames/patch/${props.input[0].fra_id}`, inputFrame)
                } catch (err) {
                    setErr(err.response.data)
                }
            break
        }
        handleClose()
    }
    
    const SubmitTable = async (props) => {
        switch (props.operation) {
            case "create":
                try {
                    await axios.post(`/api/kanban/table/${uda_id}/${fra_id}`, inputTable)
                } catch (err) {
                    setErr(err.response.data)
                }
            break
            case "update":
                try {
                    await axios.patch(`/api/kanban/patch/${props.input[0].kat_id}`, inputFrame)
                } catch (err) {

                }
            break
            case "delete":
                try {
                    const res = await axios.patch(`/api/kanban/table/delete/${props.input[0].kat_id}`)
                    setErr(res.data)
                } catch (err) {
                    setErr(err.response.data)
                }
            break
        }
        handleClose()
    }

    const SubmitCard = async (props) => {
        switch (props.operation) {
            case "create":
                try {
                    const res = await axios.post(`/api/kanban/card/${uda_id}/${props.input}`, inputCard)
                } catch (err) {
                    setErr(err.response.data)
                }
            break
            case "update":
                try {
                    const res = await axios.patch(`/api/kanban/card/patch/${props.input.kac_id}`, getValues())
                } catch (err) {
                }
            break
            case "delete":
                try {
                    const res = await axios.patch(`/api/kanban/card/delete/${props.input.kac_id}`)
                    setErr(res.data)
                } catch (err) {
                    setErr(err.response.data)
                }
            break
        }
        handleClose()
    }

    const operationMapping = {
        "delete": "Deletar",
        "create": "Adicionar",
        "update": "Atualizar",
    }
      
    const typeMapping = {
        "tabela": "a " + props.type.charAt(0).toUpperCase() + props.type.slice(1),
        "quadro": "o " + props.type.charAt(0).toUpperCase() + props.type.slice(1),
        "projeto" : "o " + props.type.charAt(0).toUpperCase() + props.type.slice(1),
        "cartão" : "o " + props.type.charAt(0).toUpperCase() + props.type.slice(1)
    }
      
    const varTitleMapping = {
        "tabela": "kat_title",
        "quadro": "fra_title",
        "projeto" : "pro_title",
        "cartão" : "kac_title"
    }
      
    const varDescriptionMapping = {
        "tabela": "kat_description",
        "quadro": "fra_description",
        "projeto" : "pro_description",
        "cartão" : "kac_content"
    }
      
    const varHandleMapping = {
        "tabela": setInputTable,
        "quadro": setInputFrame,
        "projeto" : setInputProject,
        "cartão" : setInputCard
    }

    const varSubmitMapping = {
        "tabela" : (() => SubmitTable({ operation: props.operation, input: props.input ? props.input : null})),
        "projeto" : (() => SubmitProject({ operation: props.operation, input: props.input ? props.input : null })),
        "quadro" : (() => SubmitFrame({ operation: props.operation, input: props.input ? props.input : null })),
        "cartão" : (() => SubmitCard({ operation: props.operation, input: props.input})),
    }

      const varValueMapping = {
        "tabela" : inputTable,
        "projeto" : inputProject,
        "quadro" : inputFrame,
        "cartão" : inputCard
    }
      
    const varDateMapping = {
        "cartão" : "kac_deadline"
    }

    const varPriorityMapping = {
        "cartão" : "pri_id"
    }

    const varCreatedAtMapping = {
        "cartão" : "kac_createdAt",
        "projeto" : "pro_createdAt"

    }

    const operation = operationMapping[props.operation] 
    const type = typeMapping[props.type]
    const varTitle = varTitleMapping[props.type]
    const varDescription = varDescriptionMapping[props.type]
    const varHandle = varHandleMapping[props.type]
    const varSubmit = varSubmitMapping[props.type]
    const varValue = varValueMapping[props.type] 
    const varDate = varDateMapping[props.type]
    const varPriority = varPriorityMapping[props.type]
    const varCreatedAt = varCreatedAtMapping[props.type]

    const {register, formState: {errors}, handleSubmit, isValid, watch, getValues, setValue} = useForm({
        mode: "all"
    })

    console.log('', getValues())
    useEffect(() => {
        const renderValue = () => {
            if (props.operation === "update" && props.input.length !== 0) {
                var value = null
                if (props.type === "cartão") {
                    setValue(varTitle, props.input[varTitle])
                    setValue(varDescription, props.input[varDescription])
                    value = props.input
                    setValue(varPriority, props.input[varPriority])

                    const deadline = new Date(props.input[varDate])
                    setValue(varDate, deadline.toISOString().split('T')[0])
                } else {
                    setValue(varTitle, props.input[0][varTitle])
                    setValue(varDescription, props.input[0][varDescription])
                    value = props.input[0]
                }
                setValue(varCreatedAt, value[varCreatedAt])
                //setValue(varDescription, value[varDescription])
             
            } else if (props.operation === "create") {
                setValue(varCreatedAt, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"))
            }
        }
        const getPriority = async () => {
            try {
                const res = await axios.get(`/api/priority/`)
                setPriorities(res.data)
            } catch (err) {
                setErr(err.response.data)
            }
        }

        getPriority()
        renderValue()
    }, [props.operation, props.input, varHandle, setValue])


    const handleChange = (e) => {
        const {name, value} = e.target
        setValue(name, value)
        console.log('', getValues())
    }
    /*const handleChange = (updatedFunction, fieldName, e) => {
        updatedFunction((prev) => ({...prev, [fieldName]: e.target.value}))
    }*/

    const renderFormFields = () => {
        if (props.operation === "delete") {
            return (
            <div className='lista-datoss1'>
                <label>Tem certeza que deseja excluir {type}?</label>
                <ul className="lista-datoss1">
                <p onClick={() => handleClose()}>Cancelar</p>
                <button type="submit">Excluir {props.type}</button>
                </ul>
            </div>
            )    
        } else {
            return (
            <div>
                <label>Nome d{type}</label>
                <input
                type="text"
                onChange={handleChange}
                placeholder={`Insira o título d${type}`}
                className={errors?.[varTitle] && 'input-error'}
                {...register(varTitle, {required: true, minLength: 4})}
                
                />
                {errors?.[varTitle]?.type === 'required' && <p className="form_error_message">Insira um nome para {type}!</p>}
                {errors?.[varTitle]?.type === 'minLength' && <p className="form_error_message">O nome d{type} precisa conter no mínimo 4 caracteres</p>}

                <div className='space'></div>

                <label>Descrição d{type}</label>
                <input
                type="text"
                placeholder={`Insira a descrição d${type}`}
                onChange={handleChange}
                className={errors?.[varDescription] && 'input-error'}
                {...register(varDescription, {required: true, minLength: 10})}
                //onChange={(e) => handleChange(varHandle, varDescription, e)}
                />
                {errors?.[varDescription]?.type === 'required' && <p className="form_error_message">Insira uma descrição para {type}!</p>}
                {errors?.[varDescription]?.type === 'minLength' && <p className="form_error_message">A descrição d{type} precisa conter no mínimo 10 caracteres</p>}

                {renderKanban()}
                <ul className="lista-datoss1">
                    <p onClick={() => handleClose()}>Cancelar</p>
                    <button type="submit">{operation} {props.type}</button>
                </ul>
            </div>
            )
        }
    }

    const renderKanban = () => {
        if (props.type === "cartão") {
            return (
                <>
                <div className="space"/>
                <label>Prazo de conclusão</label>
                    <input
                    type="date"
                    className={errors?.[varDate] && 'input-error'}
                    {...register(varDate, {required: true})}
                    onChange={handleChange}
                    />
                    {errors?.[varDate]?.type === 'required' && <p className="form_error_message">Insira um prazo para {type}!</p>}

                    {priorities ?
                        <> 
                            <select 
                            {...register(varPriority, {required: true})}
                            onChange={handleChange}
                        >
                                {priorities.map((priority) => {
                                    return (
                                        <option key={priority.pri_id} value={parseInt(priority.pri_id)}>
                                            {priority.pri_type}
                                        </option>
                                    )
                                })}
                            </select>
                            {errors?.[varPriority]?.type === 'required' && <p className="form_error_message">Insira uma prioridade para {type}!</p>}
                        </>
                    : ""}

                    {members ? 
                        <select onChange={(e) => {
                            handleChange(varHandle, uda_id, e)
                        }}>
                            {members.map((member) => {
                                return (
                                    <option key={member.uda_id} value={parseInt(member.uda_id)}>
                                        {member.use_name}
                                    </option>
                                )
                            })}
                        </select>
                    : ""}


                </>
                
            )
        }
    }

    return (
        <div className='modal'>
            <div className="perfil-usuario-bioo">
            <div className="lista-topo">
                <h3>{operation} {props.type}</h3>
                <span className="mdi mdi-close close" onClick={handleClose}><AiOutlineClose/></span>
            </div>
            
            <form className='lista-datoss' onSubmit={handleSubmit(varSubmit)}>
                {renderFormFields()}
                </form>
            </div>
        </div>
    )
}

export default Modal