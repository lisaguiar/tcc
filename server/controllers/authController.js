import { db } from '../config/config.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const state = "active"

export const register = (req, res) => {
    const { use_email, use_name, use_password, use_createdAt } = req.body

    const q = "SELECT * FROM use_users WHERE use_email = ?"

    db.query(q, [use_email], (err, data) => {
        if (err) {
            return res.json({ error: "Houve um erro ao realizar o cadastro." })
        }
        if (data.length) {
            return res.status(409).json({ message: "E-mail já cadastrado." })
        }

        var salt = bcrypt.genSaltSync(10)
        var hash = bcrypt.hashSync(use_password, salt)

        const q = "INSERT INTO use_users (`use_email`, `use_password`, `use_name`, `use_createdAt`, `use_state`) VALUES (?)"

        const values = [
            use_email,
            hash,
            use_name,
            use_createdAt,
            state
        ]

        db.query(q, [values], (err, data) => {
            if (err) {
                return res.status(500).json({ error: "Não foi possível realizar o cadastro!" })
            }
            return res.status(200).json({ message: "Usuário cadastrado com sucesso!" })
        })
    })
}

export const login = (req, res) => {
    const q = "SELECT * FROM use_users WHERE use_email = ?"

    db.query(q, [req.body.email_login], (err, data) => {
        if (err) {
            return res.json("Houve um erro ao realizar o cadastro. Tente novamente mais tarde!")
        } 
        if (data.length === 0) {
            return res.status(400).json("Email ou senha incorretos!")
        } else {
            const senhaCorreta = bcrypt.compareSync(req.body.password_login, data[0].use_password)

            if (!senhaCorreta) {
                return res.status(400).json("Email ou senha incorretos!")
            } else {
                const secretKey = process.env.SECRET_KEY
                var token = jwt.sign({ id: data[0].use_id }, secretKey)
                const { use_password, ...other } = data[0]

                res.cookie("token", token, {
                    httpOnly: true
                })
                return res.status(200).json(other)
            }
        }
    })
}

export const logout = (req, res) => {
    res.clearCookie("token", {
        sameSite: "none",
        secure: true
    }).status(200).json("Usuário deslogado.")
}

export const handleToken = (req, res) => {
    const cookies = req.cookies

    if (!cookies) {
        return res.status(500).json({ error: "Sessão não autorizada." })
    }

    return res.status(200).json(cookies)
}


export const desktop = (req, res) => {
    const q = "SELECT uda_id, per_id FROM uda_userDesktop WHERE use_id = ? AND des_id = ?"

    const values = [
        req.params.use_id,
        req.params.des_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(400).json(err)
        }
        const r = JSON.stringify(data)
            return res.status(200).json(data)  
    })
}