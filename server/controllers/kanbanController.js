import { db } from "../config/config.js"
import moment from "moment"

const state = "active"

export const getKanbanTable = (req, res) => {
    const { fra_id } = req.params

    const q = "SELECT * FROM kat_kanbanTable WHERE fra_id = ? AND kat_state = 'active'"

    const values = [
        fra_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao carregar as tabelas do quadro." })
        }
        return res.status(200).json(data)
    })
}

export const postTable = (req, res) => {
    const { title, description, createdAt} = req.body
    const { uda_id, fra_id } = req.params

    const q = "INSERT INTO kat_kanbanTable (kat_title, kat_description, kat_state, kat_createdAt, kat_position, uda_id, fra_id, col_id) VALUES (?)"

    const values = [
        title,
        description,
        state,
        createdAt,
        '1',
        uda_id,
        fra_id,
        '1'
    ]

    db.query(q, [values], (err) => {
        if (err) {
            return res.status(500).json({ error: "Não foi possível criar a tabela." })
        }
        req.io.emit('kanbanTableCreated', { frameId: fra_id })
        return res.status(200).json({ message: "Tabela criada com sucesso. "})
    })
}

export const patchTable = (req, res) => {
    const { title, description } = req.body
    const { fra_id, kat_id } = req.params

    const q = "UPDATE kat_kanbanTable SET kat_title = ?, kat_description = ? WHERE kat_id = ?"
  
    const values = [
      title,
      description,
      kat_id
    ]
  
    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao atualizar a tabela." })
        }
        req.io.emit("kanbanTableUpdated", { fraId: fra_id })
        return res.sendStatus(200).json({ message: "Tabela atualizada com sucesso." })
    })
}
  
export const deleteTable = (req, res) => {
    const { fra_id, kat_id } = req.params

    const q = "UPDATE kat_kanbanTable SET kat_state = 'disabled' WHERE kat_id = ?"
  
    const values = [
        kat_id
    ]
  
    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao desativar a tabela." })
        }
        req.io.emit("kanbanTableUpdated", { fraId: fra_id })
        return res.status(200).json({ message: "Tabela excluida com sucesso." })
    })
}

export const getKanbanCard = (req, res) => {
    const { fra_id } = req.params

    const q = "SELECT a.*, b.kat_id, b.kat_position FROM kac_kanbanCard a JOIN kat_kanbanTable b WHERE a.kat_id = b.kat_id AND kac_state = 'active' AND b.fra_id = ?"

    const values = [
        fra_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao carregar os cartões do quadro." })
        }
        return res.status(200).json(data)
    })
}

export const postCard = (req, res) => {
    const { title, description, deadline, createdAt, pri_id } = req.body
    const { uda_id, fra_id, kat_id } = req.params

    const q = "INSERT INTO kac_kanbanCard (kac_title, kac_content, kac_deadline, kac_state, kac_position, kac_createdAt, col_id, pri_id, uda_id, kat_id) VALUES (?)"

    const values = [
        title,
        description,
        deadline,
        state,
        1,
        createdAt,
        1,
        pri_id,
        uda_id,
        kat_id
    ]

    db.query(q, [values], (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Houve um erro ao criar o cartão." })
        }
        req.io.emit("kanbanCardUpdated", { fraId: fra_id })
        return res.status(200).json({ message: "Cartão criado com sucesso." })
    })
}

export const patchPositionCard = (req, res) => {
    const { kat_id, kac_id } = req.body
    const { fra_id } = req.params

    const q = 'UPDATE kac_kanbanCard SET kat_id = ? WHERE kac_id = ?'

    const values = [
        kat_id,
        kac_id
    ]
  
    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao atualizar as posições e endereçamento dos cartões." })
        }
        req.io.emit('kanbanUpdated', { fraId: fra_id})
        return res.sendStatus(200).json({ message: "Posição do cartão alterada com sucesso." })
    })
}

export const patchCard = (req, res) => {
    const { title, content, deadline, pri_id } = req.body
    const { kac_id, fra_id } = req.params
   
    const q = "UPDATE kac_kanbanCard SET kac_title = ?, kac_content = ?, kac_deadline = ?, pri_id = ? WHERE kac_id = ?"
  
    const formattedDate =  moment(deadline).format("YYYY-MM-DD HH:mm:ss")

    const values = [
      title,
      content,
      formattedDate,
      pri_id,
      kac_id
    ]
  
    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao atualizar o cartão" })
        }
        req.io.emit("kanbanCardUpdated", { fraId: fra_id })
        return res.status(200).json({ message: "Cartão atualizado com sucesso." })
    })
}

export const deleteCard = (req, res) => {
    const { fra_id, kac_id } = req.params

    const q = "UPDATE kac_kanbanCard SET kac_state = 'disabled' WHERE kac_id = ?"
  
    const values = [
        kac_id
    ]
  
    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao excluir o cartão." })
        }
        req.io.emit("kanbanCardUpdated", { fraId: fra_id })
        return res.status(200).json({ message: "Cartão excluído com sucesso." })
    })
}
