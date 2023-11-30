import { db } from "../config/config.js"
import moment from "moment"

const state = "active"

export const getKanbanTable = (req, res) => {
    const q = "SELECT * FROM kat_kanbanTable WHERE fra_id = ? AND kat_state = 'active'"

    const values = [
        req.params.fra_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao carregar as tabelas do quadro." })
        }
        return res.status(200).json(data)
    })
}

export const getKanbanCard = (req, res) => {
    const q = "SELECT a.*, b.kat_id, b.kat_position FROM kac_kanbanCard a JOIN kat_kanbanTable b WHERE a.kat_id = b.kat_id AND kac_state = 'active' AND b.fra_id = ?"

    const values = [
        req.params.fra_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao carregar os cartões do quadro." })
        }
        return res.status(200).json(data)
    })
}

export const postTable = (req, res) => {
    const { kat_title, kat_description, kat_createdAt} = req.body

    console.log(kat_title)
    console.log(kat_description)
    console.log(kat_createdAt)

    if (!kat_title || kat_title.length < 3 || !kat_description || kat_description.length < 10 || !kat_createdAt) {
        return res.status(400).json({ error: "Valores inválidos." })
    }

    const q = "INSERT INTO kat_kanbanTable (kat_title, kat_description, kat_state, kat_createdAt, kat_position, uda_id, fra_id, col_id) VALUES (?)"

    const values = [
        kat_title,
        kat_description,
        state,
        kat_createdAt,
        1,
        req.params.uda_id,
        req.params.fra_id,
        1
    ]

    db.query(q, [values], (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Não foi possível criar a tabela." })
        }
        req.io.emit('kanbanTableCreated', { frameId: req.params.fra_id })
        return res.status(200).json({ message: "Tabela criada cmo sucesso. "})
    })
}

export const patchPositionCard = (req, res) => {
    const q = 'UPDATE kac_kanbanCard SET kat_id = ? WHERE kac_id = ?'

    const updatedCardData = req.body

    const katId = updatedCardData.kat_id
    const kacId = updatedCardData.kac_id
  
    db.query(q, [katId, kacId], (err) => {
        if (err) {
            return res.status(500).json('Houve um erro ao atualizar as posições e endereçamento dos cartões')
        }
        req.io.emit('kanbanUpdated')

        return res.sendStatus(200)
    })
}

export const patchCard = (req, res) => {
    const { kac_title, kac_content, kac_deadline, pri_id } = req.body
    if (!kac_title || kac_title.length < 3 || !kac_content || kac_content.length < 10 || !kac_deadline || !pri_id) {
        return res.status(400).json({ error: "Valores inválidos." })
    }
    const q = "UPDATE kac_kanbanCard SET kac_title = ?, kac_content = ?, kac_deadline = ?, pri_id = ? WHERE kac_id = ?"
  
    const formattedDate =  moment(kac_deadline).format("YYYY-MM-DD HH:mm:ss")

    const values = [
      kac_title,
      kac_content,
      formattedDate,
      pri_id,
      req.params.kac_id
    ]

    console.log(values)
  
    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao atualizar o cartão" })
        }
        req.io.emit("kanbanCardUpdated", { fraId: req.params.fra_id })
        return res.status(200).json({ message: "Cartão atualizado com sucesso." })
    })
}


export const deleteCard = (req, res) => {
    const q = "UPDATE kac_kanbanCard SET kac_state = 'disabled' WHERE kac_id = ?"
  
    const values = [
        req.params.kac_id
    ]
  
    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao excluir o cartão" })
        }
        req.io.emit("kanbanCardUpdated", { fraId: req.params.fra_id })
        return res.status(200).json({ message: "Cartão excluído com sucesso." })
    })
}

export const patchTable = (req, res) => {
    const { kat_title, kat_description } = req.body

    if (!kat_title || kat_title.length < 3 || !kat_description || kat_description.length < 10) {
        return res.status(400).json({ error: " Valores inválidos." })
    }

    const q = "UPDATE kat_kanbanTable SET kat_title = ?, kat_description = ? WHERE kat_id = ?"
  
    const values = [
      kat_title,
      kat_description,
      req.params.kat_id
    ]
  
    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao atualizar a tabela" })
        }
        req.io.emit("kanbanTableUpdated", { fraId: req.params.fra_id})
        return res.sendStatus(200).json({ message: "Tabela atualizada com sucesso." })
    })
}
  
export const deleteTable = (req, res) => {
    const q = "UPDATE kat_kanbanTable SET kat_state = 'disabled' WHERE kat_id = ?"
  
    const values = [
        req.params.kat_id
    ]
  
    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao desativar a tabela" })
        }
        req.io.emit("kanbanTableUpdated", { fraId: req.params.fra_id })
        return res.status(200).json({ message: "Tabela excluida com sucesso!" })
    })
}

export const postCard = (req, res) => {
    const { kac_title, kac_content, kac_deadline, kac_createdAt, pri_id } = req.body

    if (!kac_title || kac_title.length < 3 || !kac_content || kac_content.length < 10 || !kac_deadline || !kac_createdAt || !pri_id ) {
        return res.status(400).json({ error: "Valores inválidos." })
    }
    const q = "INSERT INTO kac_kanbanCard (kac_title, kac_content, kac_deadline, kac_state, kac_position, kac_createdAt, col_id, pri_id, uda_id, kat_id) VALUES (?)"

    const values = [
        kac_title,
        kac_content,
        kac_deadline,
        state,
        1,
        kac_createdAt,
        1,
        pri_id,
        req.params.uda_id,
        req.params.kat_id
    ]

    db.query(q, [values], (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Houve um erro ao criar o cartão." })
        }
        req.io.emit("kanbanCardUpdated", { fraId: req.params.fra_id})
        return res.status(200).json({ message: "Cartão criado com sucesso!" })
    })
}