import { db } from "../config/config.js"

const state = "active"

export const getProjects = (req, res) => {
    const q = "SELECT * FROM pro_projects WHERE pro_state = 'active'"

    db.query(q, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao obter os projetos!" })
        } 
        const { q } = req.query

        const pro_id = req.params.pro_id ? {pro_id: req.params.pro_id} : {}

        if (q) {
            const keys = ["pro_title"]

            const search = (data) => {
                return data.filter((item) => 
                    keys.some((key) => item[key].toLowerCase().includes(q))
                )
            } 
            
            const actualProject = data.filter(item => item.pro_id === pro_id)

            return res.status(200).json(...search(data), ...actualProject)      
        } else {
            return res.status(200).json(data)
        }
    })
}

export const postProject = (req, res) => {

    const { pro_title, pro_description, pro_createdAt } = req.body

    if (!pro_title || pro_title.length < 3 || !pro_description || pro_description.length < 10 || !pro_createdAt) {
        return res.status(400).json({ error: "Valores inválidos." })
    }

    const q = "INSERT INTO pro_projects (pro_title, pro_description, pro_state, pro_createdAt, des_id, uda_id) VALUES (?)"

    const values = [
        pro_title,
        pro_description,
        state,
        pro_createdAt,
        req.params.des_id,
        req.params.uda_id
    ]

    db.query(q, [values], (err, data) => {
        if (err) {
            return res.status(500).json(err)
        }
        req.io.emit('projectCreated', { projectId: data.insertId })

        return res.status(200).json(data.insertId)
    })
}

export const patchProject = (req, res) => {
    const { pro_title, pro_description } = req.body
    if (!pro_title || pro_title.length < 3 || !pro_description || pro_description.length < 10) {
        console.log("erro porraaaaa")
        return res.status(400).json({ error: "Valores inválidos."})
    }
    const q = "UPDATE pro_projects SET pro_title = ?, pro_description = ? WHERE pro_id = ?"

    const values = [
        pro_title,
        pro_description,
        req.params.pro_id
    ]

    console.log(values)

    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json("Houve um erro ao atualizar a tabela")
        }
        req.io.emit("projectUpdated", { desktopId: req.params.des_id })
        return res.sendStatus(200)
    })
}

export const deleteProject = (req, res) => {
    const q ="UPDATE pro_projects SET pro_state = 'disabled' WHERE pro_id = ?"

    const pro_id = req.params.pro_id

    db.query(q, pro_id, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao desativar o projeto."})
        }
        req.io.emit("projectDeleted", { desktopId: req.body.des_id })
        return res.status(200).json({ message: "Projeto excluido com sucesso!"})
    })
}