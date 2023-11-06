import React, { useContext, useEffect, useState } from 'react'
import axios from '../api/axios'
import { useForm } from 'react-hook-form'
import validator from 'validator'
import '../styles/Logastro.css'
import '../images/jorge.png'
import { useNavigate } from "react-router-dom"
import { AuthContext } from '../contexts/authContext'
import moment from 'moment'
import ErrorDisplay from '../functions/HandleError'
import { useHandleDatabaseRequest } from '../functions/IsOnline'
import { NaoLogado } from '../components/IsLogged'

const Logastro = () => {
    const { currentUser, setCurrentUser, login } = useContext(AuthContext)

    const navigate = useNavigate()

    const {register, formState: {errors, isValid}, handleSubmit} = useForm({
        mode: "all"
    })
    const {register:registerLogin, formState: {errors:errorsLogin, isValid:isValidLogin}, handleSubmit:handleSubmitL} = useForm({
        mode: "all"
    })

    const [inputsRegister, setInputsRegister] = useState({
        use_name: "",
        use_email: "",
        use_password: "",
        use_createdAt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
    })

    const [inputsLogin, setInputsLogin] = useState({
        email_login: "",
        senha_login: ""
    })

    const [err, setErr] = useState("")
    const { handleOnlineStatus, connectionErr } = useHandleDatabaseRequest()

    const handleChangeRegister = e => {
        setInputsRegister(prev => ({...prev, [e.target.name]: e.target.value}))  
    }

    const handleChangeLogin = e => {
        setInputsLogin(prev => ({...prev, [e.target.name]: e.target.value}))  
    }

    const handleSubmitRegister = async () => {
        try {   
            const res = await axios.post("/api/register", inputsRegister)
            console.log(res.data)  
        } catch (err) {
            console.log(err)
            setErr(err.response.data)
        }
    }

    const handleSubmitLogin = async () => {
        try {   
            await login(inputsLogin)
            navigate('/desktop')
        } catch (err) {
            console.log(err)
            setErr("Houve um problema")
        }
    }

    useEffect(() => {
        const registerButton = document.getElementById("register")
        const loginButton = document.getElementById("login")
        const container = document.getElementById("container")

        const handleConnection = async () => {
            const isOnline = await handleOnlineStatus()

            registerButton.addEventListener("click", () => {
                container.classList.add("right-panel-active")
            })
            loginButton.addEventListener("click", () => {
                container.classList.remove("right-panel-active")
            })

            if (!isOnline) {
                setErr(connectionErr)
            }
        } 
        handleConnection()
    }, [connectionErr])

    return (
        <div className="body">
        {NaoLogado()}
            {err && <ErrorDisplay message={err} />}
            <div className="container" id="container">
                <div className="form-container register-container">
                    <form onSubmit={handleSubmit(handleSubmitRegister)}>
                        <h1>Registre-se.</h1>
                        <input
                            type="text"
                            placeholder="Nome"
                            className={errors?.use_nome && 'input-error'}
                            {...register('use_name', {required: true, minLength: 4})}
                            onChange={handleChangeRegister}
                        />
                        {errors?.use_name?.type === 'required' && <p className="form_error_message">Insira um nome de usuário!</p>}
                        {errors?.use_name?.type === 'minLength' && <p className="form_error_message">Seu nome de usuário precisa conter mais de 3 caracteres</p>}
                        <input
                            type="text"
                            placeholder="Email"
                            className={errors?.use_email && 'input-error'}
                            {...register('use_email', {required: true, validate: (value) => validator.isEmail(value)})}
                            onChange={handleChangeRegister}
                        />
                        {errors?.use_email?.type === 'required' && <p className="form_error_message">Insira seu e-mail!</p>}
                        {errors?.use_email?.type === 'validate' && <p className="form_error_message">Insira um e-mail válido!</p>}
                        <input
                            type="password"
                            placeholder="Senha"
                            className={errors?.use_password && 'input-error'}
                            {...register('use_password', {required: true, minLength: 6})}
                            onChange={handleChangeRegister}
                        />
                        {errors?.use_password?.type === 'required' && <p className="form_error_message">Insira sua senha!</p>}
                        {errors?.use_password?.type === 'minLength' && <p className="form_error_message">Sua senha precisa conter ao menos 6 caracteres</p>}
                    
                        <button disabled={!isValid} type="submit">Registrar</button>
                    </form>
                </div>

                <div className="form-container login-container">
                    <form onSubmit={handleSubmitL(handleSubmitLogin)}>
                        <h1>Login</h1>
                        <input
                            type="text"
                            placeholder="Email"
                            className={errorsLogin?.email_login && 'input-error'}
                            {...registerLogin('email_login', {required: true, validate: (value) => validator.isEmail(value)})}
                            onChange={handleChangeLogin}
                        />
                        {errorsLogin?.email_login?.type === 'required' && <p className="form_error_message">Insira seu e-mail!</p>}
                        {errorsLogin?.email_login?.type === 'validate' && <p className="form_error_message">Insira um e-mail válido!</p>}
                        <input
                            type="password"
                            placeholder="Senha"
                            className={errorsLogin?.password_login && 'input-error'}
                            {...registerLogin('password_login', {required: true, minLength: 6})}
                            onChange={handleChangeLogin}
                        />
                        {errorsLogin?.password_login?.type === 'required' && <p className="form_error_message">Insira sua senha!</p>}
                        <div className="content">
                            <div className="pass-link">
                                <a href="./">Esqueci a senha</a>
                            </div>
                        </div>
                        <button disabled={!isValidLogin} type="submit">Login</button>
                    </form>
                </div>

                <div className="overlay-container">
                    <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <img className="jorge" src="./image/jorge.png" alt="" />
                        <p>Se você tem uma conta, faça o login aqui.</p>
                        <button className="ghost" id="login">
                            Login
                        {/*  <LniArrowLeft className="login" /> */}
                        </button>
                    </div>
                    <div className="overlay-panel overlay-right">
                        <img className="jorge" src="./image/jorge.png" alt="" />
                        <p>Comece sua jornada <br /> em FocusTask</p>
                        <button className="ghost" id="register" type='submit'>
                            Registrar
                            {/* <LniArrowRight className="register" /> */}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Logastro