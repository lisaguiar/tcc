import React, { useCallback, useContext, useEffect, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/auth"
import moment from "moment"
import { ModalContext } from "../contexts/modal"
import { getModel } from "../api/model"
import { getPriority } from "../api/priority"
import axios from "../api/axios"
import { deleteProject, patchProject, postProject } from "../api/project"
import { deleteDesktop, patchDesktop, postDesktop } from "../api/desktop"


function Modal (props) {
    const navigate = useNavigate()

    const [err, setErr] = useState("")

    const { currentUser } = useContext(AuthContext)

    const location = useLocation()
    const des_id = location.pathname.split("/")[4]
    const pro_id = location.pathname.split("/")[4]
    const fra_id = location.pathname.split("/")[4]

    const uda_id = location.pathname.split("/")[2]
    const use_id = parseInt(currentUser?.use_id)

    const [priorities, setPriorities] = useState("")
    const [models, setModels] = useState("")

    const SubmitDesktop = async (props) => {
        switch (props.operation) {
            case "create":
                try {
                    await postDesktop(use_id, getValues())
                } catch (error) {
                    setErr(error.response.data.error)
                }
            break
            case "delete":
                try {
                    await deleteDesktop(uda_id, props.input[0].des_id)
                    window.location.reload()
                } catch (error) {
                    setErr(error.response.data.error)
                }
            break
            case "update":
                try {
                    await patchDesktop(uda_id, props.input[0].des_id, getValues())
                } catch (error) {
                    setErr(error.response.data.error)
                }
            break
        }
        closeModal()
    }

    const SubmitProject = async (props) => {
        switch (props.operation) {
            case "create":
                try {
                    const res = await postProject({ des_id: props.input[0].des_id, uda_id: uda_id, data: getValues()})
                    navigate(`/u/${uda_id}/project/${res.data}`)
                } catch (error) {
                    setErr(error.response.data.error)
                }
            break
            case "delete":
                try {
                    await deleteProject({ des_id: des_id, pro_id: props.input[0].pro_id})
                    window.location.reload()
                } catch (error) {
                    setErr(error.response.data.error)
                }
            break
            case "update":
                try {
                    await patchProject({ des_id: des_id, pro_id: props.input[0].pro_id, data: getValues()})
                } catch (error) {
                    setErr(error.response.data.error)
                }
            break
        }
        closeModal()
    }
    
    const SubmitFrame = async (props) => {
        switch (props.operation) {
            case "create":
                try {
                    const res = await axios.post(`/api/frames/${pro_id}/2`, getValues())
                    navigate(`/desktop/${des_id}/project/${pro_id}/frame/${res.data}`)
                } catch (err) {
                    console.log(err)
                    setErr(err.response.data.error)
                }
            break
            case "delete":
                try {
                    const res = await axios.patch(`/api/frames/delete/${pro_id}/${props.input[0].fra_id}`)
                    setErr(res.data)
                } catch (err) {
                    setErr(err.response.data)
                }
            break
            case "update":
                try {
                    await axios.patch(`/api/frames/patch/${pro_id}/${props.input[0].fra_id}`, getValues())
                } catch (err) {
                    setErr(err.response.data)
                }
            break
        }
        closeModal()
    }
    
    const SubmitTable = async (props) => {
        switch (props.operation) {
            case "create":
                try {
                    await axios.post(`/api/kanban/table/${fra_id}/2`, getValues())
                } catch (err) {
                    console.log(err.response.data.error)
                    setErr(err.response.data.error)
                }
            break
            case "update":
                try {
                    await axios.patch(`/api/kanban/patch/${props.input[0].kat_id}`, getValues())
                } catch (err) {

                }
            break
            case "delete":
                console.log("DELETAR")
                try {
                    const res = await axios.patch(`/api/kanban/table/delete/${fra_id}/${props.input}`)
                } catch (err) {
                    setErr(err.response.data.error)
                }
            break
        }
        closeModal()
    }

    const SubmitCard = async (props) => {
        switch (props.operation) {
            case "create":
                try {
                    const res = await axios.post(`/api/kanban/card/${fra_id}/2/${props.input}`, getValues())
                } catch (err) {
                    console.log(err.response.data.error)
                    setErr(err.response.data.error)
                }
            break
            case "update":
                try {
                    console.log(getValues())
                    const res = await axios.patch(`/api/kanban/card/patch/${fra_id}/${props.input.kac_id}`, getValues())
                    console.log(res.data)
                } catch (err) {
                }
            break
            case "delete":
                try {
                    const res = await axios.patch(`/api/kanban/card/delete/${fra_id}/${props.input.kac_id}`)
                    setErr(res.data)
                } catch (err) {
                    setErr(err.response.data)
                }
            break
        }
        closeModal()
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
        "cartão" : "o " + props.type.charAt(0).toUpperCase() + props.type.slice(1),
        "área": "a "  + props.type.charAt(0).toUpperCase() + props.type.slice(1),
    }

    const varTitleMapping = {
        "tabela": "kat_title",
        "quadro": "fra_title",
        "projeto" : "pro_title",
        "cartão" : "kac_title",
        "área": "des_title"
    }

    const varDescriptionMapping = {
        "tabela": "kat_description",
        "quadro": "fra_description",
        "projeto" : "pro_description",
        "cartão" : "kac_content",
        "área" : "des_description"
    }

    const varSubmitMapping = {
       "tabela" : (() => SubmitTable({ operation: props.operation, input: props.input ? props.input : null})),
        "projeto" : (() => SubmitProject({ operation: props.operation, input: props.input ? props.input : null })),
        "quadro" : (() => SubmitFrame({ operation: props.operation, input: props.input ? props.input : null })),
        "cartão" : (() => SubmitCard({ operation: props.operation, input: props.input})),
        "área":  (() => SubmitDesktop({ operation: props.operation, input: props.input}))
    }

    const varDateMapping = {
        "cartão" : "kac_deadline"
    }

    const varPriorityMapping = {
        "cartão" : "pri_id"
    }

    const varCreatedAtMapping = {
        "quadro" : "fra_createdAt",
        "tabela" : "kat_createdAt",
        "cartão" : "kac_createdAt",
        "projeto" : "pro_createdAt",
        "área": "des_createdAt"
    }

    const operation = operationMapping[props.operation] 
    const type = typeMapping[props.type]
    const varTitle = varTitleMapping[props.type]
    const varDescription = varDescriptionMapping[props.type]
    const varSubmit = varSubmitMapping[props.type]
    const varDate = varDateMapping[props.type]
    const varPriority = varPriorityMapping[props.type]
    const varCreatedAt = varCreatedAtMapping[props.type]

    const {register, formState: {errors}, handleSubmit, isValid, watch, getValues, setValue} = useForm({
        mode: "all"
    })

    const { closeModal, openModal } = useContext(ModalContext)

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
                    setValue(varTitle, props.input[varTitle])
                    setValue(varDescription, props.input[varDescription])
                    value = props.input
                }
                setValue(varCreatedAt, value[varCreatedAt]) 
            } else if (props.operation === "create") {
                setValue(varCreatedAt, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"))
            }
        }

        const fetchData = async () => {
            try {
                const resPriority = await getPriority()
                setPriorities(resPriority)

                const resModels = await getModel()
                setModels(resModels)
            } catch (error) {
                setErr(error.response.data.error)
            }
        }
        fetchData()
        renderValue()
    }, [props.operation, props.input, setValue])

    const handleChange = (e) => {
        const {name, value} = e.target
        setValue(name, value)
    }

    const renderFormFields = () => {
        if (props.operation === "delete") {
            return (
            <div className='lista-datoss1'>
                <label>Tem certeza que deseja excluir {type}?</label>
                <ul className="lista-datoss1">
                <p onClick={() => closeModal()}>Cancelar</p>
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

                {renderContent()}
                {renderKanban()}
                {renderFrame()}
                <ul className="lista-datoss1">
                    <p onClick={() => closeModal()}>Cancelar</p>
                    <button type="submit">{operation} {props.type}</button>
                </ul>
            </div>
            )
        }
    }

    const renderContent = () => {
        if (props.type === "anotação") {
            return (
                <>
                    <div className='space'></div>

                    <label>Descrição d{type}</label>
                    <input
                    type="text"
                    placeholder={`Insira a descrição d${type}`}
                    onChange={handleChange}
                    className={errors?.[varDescription] && 'input-error'}
                    {...register(varDescription, {required: true, minLength: 10})}
                    />
                    {errors?.[varDescription]?.type === 'required' && <p className="form_error_message">Insira um conteúdo para {type}!</p>}
                    {errors?.[varDescription]?.type === 'minLength' && <p className="form_error_message">O conteúdo d{type} precisa conter no mínimo 10 caracteres</p>}
                </>
            )
        } else {
            return (
                <>
                    <div className='space'></div>

                    <label>Descrição d{type}</label>
                    <input
                    type="text"
                    placeholder={`Insira a descrição d${type}`}
                    onChange={handleChange}
                    className={errors?.[varDescription] && 'input-error'}
                    {...register(varDescription, {required: true, minLength: 10})}
                    />
                    {errors?.[varDescription]?.type === 'required' && <p className="form_error_message">Insira uma descrição para {type}!</p>}
                    {errors?.[varDescription]?.type === 'minLength' && <p className="form_error_message">A descrição d{type} precisa conter no mínimo 10 caracteres</p>}
                </>
            )
        }
    }

    const renderFrame = () => {
        if (props.type === "quadro") {
            return (
                <>
                <div className="space"/>
                <label>Modelo</label>

                {models ?
                        <> 
                            <select 
                            {...register('mod_id', {required: true})}
                            onChange={handleChange}
                        >
                                {models.map((model) => {
                                    return (
                                        <option key={model.mod_id} value={parseInt(model.mod_id)}>
                                            {model.mod_type}
                                        </option>
                                    )
                                })}
                            </select>
                            {errors?.mod_id?.type === 'required' && <p className="form_error_message">Insira um modelo para {type}!</p>}
                        </>
                    : ""}
                </>
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
                </>
                
            )
        }
    }

    return (
        <div className='modal'>
            <div className="perfil-usuario-bioo">
            <div className="lista-topo">
                <h3>{operation} {props.type}</h3>
                <span className="mdi mdi-close close" onClick={() => { closeModal() }}><AiOutlineClose/></span>
            </div>
            
            <form className='lista-datoss' onSubmit={handleSubmit(varSubmit)}>
                {renderFormFields()}
                </form>
            </div>
        </div>
    )
}

export default Modal