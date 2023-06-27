import { db } from "../config/config.js"

const state = "active"

export const getAllProjects = (req, res) => {
    const q = "SELECT * FROM pro_projects WHERE des_id = ? AND pro_id <> ? AND pro_state = 'active'"

    const values =  [
        req.params.des_id,
        req.params.pro_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json("Houve um erro ao obter os projetos!")
        } 
        const { q } = req.query

        if (q) {
            const keys = ["pro_title"]

            const search = (data) => {
                return data.filter((item) => 
                    keys.some((key) => item[key].toLowerCase().includes(q))
                )
            }           
            return res.status(200).json(search(data))      
        } else {
            return res.status(200).json(data)
        }
    })
}

export const getProject = (req, res) => {
    const q = "SELECT * FROM pro_projects WHERE pro_id = ? AND pro_state = 'active' AND des_id = ?"

    const values = [
        req.params.pro_id,
        req.params.des_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json(err)
        } 
        return res.status(200).json(data)
    })
}

export const postProject = (req, res) => {
    const q = "INSERT INTO pro_projects (pro_title, pro_description, pro_state, pro_createdAt, des_id, uda_id) VALUES (?)"

    const values = [
        req.body.pro_title,
        req.body.pro_description,
        state,
        req.body.pro_createdAt,
        req.params.des_id,
        req.params.uda_id
    ]

    db.query(q, [values], (err, data) => {
        if (err) {
            return res.status(500).json(err)
        }
        req.io.emit('projectCreated', { projectId: data.insertId })

        return res.status(200).json("Projeto criado com sucesso!")
    })
}