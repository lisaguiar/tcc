import { db } from "../config/config.js"

const state = 'active'

export const postMember = (req, res) => {
    const { email, createdAt, per_id } = req.body
    const { des_id } = req.params 

    const q = "INSERT INTO uda_userDesktop (uda_state, uda_createdAt, use_id, des_id, per_id) VALUES (?, ?, (SELECT use_id FROM use_users WHERE use_email = ?), ?, ?)"

    const values = [
        state,
        createdAt,
        email,
        des_id,
        per_id
    ]

    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao adicionar o membro." })
        }
        req.io.emit("memberPosted", { desktopId: des_id} )
        return res.status(201).json({ message: "Membro adicionado com sucesso." })
    })
}

export const getMember = (req, res) => {
    const { uda_id } = req.params

    const q = "SELECT * FROM uda_userDesktop WHERE uda_id = ? AND uda_state = 'active'"

    const values = [
        uda_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao procurar membros." })
        }
        return res.status(201).json(data)
    })
}

export const patchMember = (req, res) => {
    const { per_id } = req.body
    const { uda_id, des_id } = req.params

    const q = "UPDATE uda_userDesktop SET per_id = ? WHERE uda_id = ?"

    const values = [
        per_id,
        uda_id
    ]

    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao atualizar as permissões do membro." })
        }
        req.io.emit("memberUpdated", { desktopId: des_id} )
        return res.status(201).json({ message: "Membro atualizado com sucesso." })
    })
}

export const deleteMember = (req, res) => {
    const { uda_id, des_id } = req.params

    const q = "UPDATE uda_userDesktop SET uda_state = 'disabled' WHERE uda_id = ?"

    const values = [
        uda_id
    ]

    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao excluir o membro." })
        }
        req.io.emit("memberDeleted", { desktopId: des_id })
        return res.status(201).json({ message: "Member excluído com sucesso." })
    })
}