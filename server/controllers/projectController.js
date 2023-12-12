import { db } from "../config/config.js"

const state = "active"

export const getProjects = (req, res) => {
    const { des_id } = req.params

    const q = "SELECT * FROM pro_projects WHERE des_id = ? AND pro_state = 'active'"

    const values = [
        des_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao obter os projetos." })
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
    const { des_id, pro_id } = req.params 

    const q = "SELECT * FROM pro_projects WHERE des_id = ? AND pro_id = ? AND pro_state = 'active'"

    const values = [
        des_id,
        pro_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao encontrar o projeto." })
        }
        return res.status(200).json(data)
    })
}

export const postProject = (req, res) => {
    const { title, description, createdAt } = req.body
    const { des_id, uda_id } = req.params 

    const q = "INSERT INTO pro_projects (pro_title, pro_description, pro_state, pro_createdAt, des_id, uda_id) VALUES (?)"

    const values = [
        title,
        description,
        state,
        createdAt,
        des_id,
        uda_id
    ]

    db.query(q, [values], (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao criar o projeto." })
        }
        req.io.emit('projectCreated', { desId: des_id })

        return res.status(200).json({ message: "Projeto criado com sucesso." })
    })
}

export const patchProject = (req, res) => {
    const { title, description } = req.body
    const { des_id, pro_id } = req.params 
    
    const q = "UPDATE pro_projects SET pro_title = ?, pro_description = ? WHERE pro_id = ?"

    const values = [
        title,
        description,
        pro_id
    ]

    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao atualizar o projeto." })
        }
        req.io.emit("projectUpdated", { desId: des_id })
        return res.sendStatus(200).json({ message: "Projeto atualizado com sucesso." })
    })
}

export const deleteProject = (req, res) => {
    const { des_id, pro_id } = req.params

    const q = "UPDATE pro_projects SET pro_state = 'disabled' WHERE pro_id = ?"

    const values = [
        pro_id
    ]

    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao desativar o projeto." })
        }
        req.io.emit("projectDeleted", { desId: des_id })
        return res.status(200).json({ message: "Projeto excluido com sucesso." })
    })
}