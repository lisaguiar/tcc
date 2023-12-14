import { db } from "../config/config.js"

const state = 'active'

export const getChecklist = (req, res) => {
    const { fra_id } = req.params

    const q = "SELECT * FROM che_checklist WHERE fra_id = ? AND che_state = 'active'"

    const values = [
        fra_id
    ]

    db.query(q, [values], (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Não foi possível obter os valores da lista." })
        }
        if (!data.length) {
            return res.status(200).json({ message: "Nenhum valor encontrado." })
        }
        return res.status(200).json(data)
    })
}

export const postChecklist = (req, res) => {
    const { fra_id, uda_id } = req.params
    const { title, description, createdAt, deadline, pri_id } = req.body

    const q = "INSERT INTO che_checklist (che_title, che_description, che_createdAt, che_deadline, che_state, pri_id, fra_id, uda_id) VALUES (?)"

    const values = [
        title, 
        description,
        createdAt,
        deadline,
        state,
        pri_id,
        fra_id,
        uda_id
    ]

    db.query(q, [values], (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao criar a lista." })
        }
        req.io.emit('checklistCreated', { fraId: fra_id })
        return res.status(200).json({ message: "Lista criada com sucesso." })
    })
}

export const patchChecklist = (req, res) => {
    const { title, description, deadline, pri_id } = req.body
    const { fra_id, che_id } = req.params

    const q = "UPDATE che_checklist SET che_title = ?, che_description = ?, che_deadline = ?, pri_id = ? WHERE che_id = ?"

    const values = [
        title,
        description,
        deadline,
        pri_id,
        che_id
    ]

    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao atualizar a lista." })
        }
        req.io.emit('checklistUpdated', { fraId: fra_id })
        return res.status(200).json({ message: "Lista atualizada com sucesso." })
    })
} 

export const deleteChecklist = (req, res) => {
    const { fra_id, che_id } = req.params

    const q = "UPDATE che_checklist SET che_state = 'disabled' WHERE che_id = ?"

    const values = [
        che_id
    ]

    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Não foi possível excluir a lista." })
        }
        req.io.emit('checklistDeleted', { fraId: fra_id })
        return res.status(200).json({ message: "A lista foi excluída com sucesso." })
    })
}