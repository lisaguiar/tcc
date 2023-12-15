import React, { useCallback, useContext, useEffect, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/auth"
import moment from "moment"
import { ModalContext } from "../contexts/modal"


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

    const [inputDesktop, setInputDesktop] = useState({
        des_title: "",
        des_description: "",
        des_createdAt: createdAt
    })

    const [priorities, setPriorities] = useState("")
    const [models, setModels] = useState("")
    const [members, setMembers] = useState("")

    /*const SubmitDesktop = async (props) => {
        switch (props.operation) {
            case "create":
                try {
                    console.log(getValues())
                    const res = await axios.post(`/api/desktops/post/${use_id}`, getValues())
                    navigate(`/desktop/${res.data}`)
                } catch (err) {
                    console.log(err.response.data.error)
                    setErr(err.response.data.error)
                }
            break
            case "delete":
                try {
                    await axios.patch(`/api/desktop/delete/${uda_id}/${props.input[0].des_id}`)
                    window.location.reload()
                } catch (err) {
                    setErr(err.response.data)
                }
            break
            case "update":
                const data = getValues()
                try {
                    await axios.patch(`api/desktop/patch/${uda_id}/${props.input[0].des_id}`, getValues())
                } catch (err) {
                    setErr(err.response.data)
                }
            break
        }
        handleClose()
    }

    const SubmitProject = async (props) => {
        switch (props.operation) {
            case "create":
                try {
                    const desktop_id = props.input.des_id
                    console.log(desktop_id)
                    const res = await axios.post(`/api/projects/${desktop_id}/2`, getValues())
                    //navigate(`/desktop/${des_id}/project/${res.data}`)
                } catch (err) {
                    setErr(err.response.data)
                }
            break
            case "delete":
                try {
                    await axios.patch(`/api/projects/delete/${des_id}/${props.input[0].pro_id}`)
                    window.location.reload()
                } catch (err) {
                    setErr(err.response.data)
                }
            break
            case "update":
                console.log(getValues())
                try {
                    await axios.patch(`api/projects/patch/${des_id}/${props.input[0].pro_id}`, getValues())
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
        handleClose()
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
        handleClose()
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
        handleClose()
    }*/

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
      
    const varHandleMapping = {
        "tabela": setInputTable,
        "quadro": setInputFrame,
        "projeto" : setInputProject,
        "cartão" : setInputCard,
        "área": setInputDesktop
    }

    const varSubmitMapping = {
       /* "tabela" : (() => SubmitTable({ operation: props.operation, input: props.input ? props.input : null})),
        "projeto" : (() => SubmitProject({ operation: props.operation, input: props.input ? props.input : null })),
        "quadro" : (() => SubmitFrame({ operation: props.operation, input: props.input ? props.input : null })),
        "cartão" : (() => SubmitCard({ operation: props.operation, input: props.input})),
        "área":  (() => SubmitDesktop({ operation: props.operation, input: props.input}))*/
    }

      const varValueMapping = {
        "tabela" : inputTable,
        "projeto" : inputProject,
        "quadro" : inputFrame,
        "cartão" : inputCard,
        "área" : inputDesktop
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
    const varHandle = varHandleMapping[props.type]
    const varSubmit = varSubmitMapping[props.type]
    const varDate = varDateMapping[props.type]
    const varPriority = varPriorityMapping[props.type]
    const varCreatedAt = varCreatedAtMapping[props.type]

    const {register, formState: {errors}, handleSubmit, isValid, watch, getValues, setValue} = useForm({
        mode: "all"
    })

    const { closeModal } = useContext(ModalContext)

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
                /*const res = await axios.get(`/api/priority`)
                setPriorities(res.data)*/
            } catch (err) {
                setErr(err.response.data)
            }
        }
        const getModels = async () => {
            try {
                /*const res = await axios.get(`/api/models`)
                console.log(res.data)
                setModels(res.data)*/
            } catch (err) {
                setErr(err.responde.data)
            }
        }

        getPriority()
        getModels()
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
                {renderFrame()}
                <ul className="lista-datoss1">
                    <p onClick={() => closeModal()}>Cancelar</p>
                    <button type="submit">{operation} {props.type}</button>
                </ul>
            </div>
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
                <span className="mdi mdi-close close" onClick={() => {
                    closeModal()}}><AiOutlineClose/></span>
            </div>
            
            <form className='lista-datoss' onSubmit={handleSubmit(varSubmit)}>
                {renderFormFields()}
                </form>
            </div>
        </div>
    )
}

export default Modal