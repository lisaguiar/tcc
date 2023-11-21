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
            return res.status(500).json("Houve um erro ao carregar as tabelas do quadro")
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
            return res.status(500).json("Houve um erro ao carregar os cartões do quadro")
        }
        return res.status(200).json(data)
    })
}

export const postTable = (req, res) => {
    const q = "INSERT INTO kat_kanbanTable (kat_title, kat_description, kat_state, kat_createdAt, kat_position, uda_id, fra_id, col_id) VALUES (?)"

    const values = [
        req.body.kat_title,
        req.body.kat_description,
        state,
        req.body.kat_createdAt,
        req.body.kat_position,
        req.params.uda_id,
        req.params.fra_id,
        req.body.col_id
    ]

    db.query(q, [values], (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).json("Não foi possível criar a tabela.")
        }
        req.io.emit('kanbanCreated')
        console.log(data)
        return res.status(200).json(data)
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
    const q = "UPDATE kac_kanbanCard SET kac_title = ?, kac_content = ?, kac_deadline = ?, pri_id = ? WHERE kac_id = ?"
  
    const formattedDate =  moment(req.body.kac_deadline).format("YYYY-MM-DD HH:mm:ss")

    const values = [
      req.body.kac_title,
      req.body.kac_content,
      formattedDate,
      req.body.pri_id,
      req.params.kac_id
    ]

    console.log(values)
  
    db.query(q, values, (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json("Houve um erro ao atualizar o cartão")
        }
        req.io.emit("kanbanUpdated")
        console.log("funcionou")
        return res.status(200).json("joga mt")
    })
}


export const deleteCard = (req, res) => {
    const q = "UPDATE kac_kanbanCard SET kac_state = 'disabled' WHERE kac_id = ?"
  
    const kac_id = req.params.kac_id
  
    db.query(q, [kac_id], (err) => {
        if (err) {
            return res.status(500).json("Houve um erro ao excluir o cartão")
        }
        req.io.emit("kanbanUpdated")
        return res.status(200)
    })
}

export const patchTable = (req, res) => {
    const q = "UPDATE kat_kanbanTable SET kat_title = ?, kat_description = ? WHERE kat_id = ?"
  
    const { kat_title, kat_description } = req.body
    const kat_id = req.params.kat_id
  
    const values = [
      kat_title,
      kat_description,
      kat_id
    ]
  
    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json("Houve um erro ao atualizar a tabela")
        }
        req.io.emit("kanbanUpdated")
        return res.sendStatus(200)
    })
}
  
export const deleteTable = (req, res) => {
    const q = "UPDATE kat_kanbanTable SET kat_state = 'disabled' WHERE kat_id = ?"
  
    const kat_id = req.params.kat_id
  
    db.query(q, kat_id, (err) => {
        if (err) {
            return res.status(500).json("Houve um erro ao desativar a tabela")
        }
        req.io.emit("kanbanUpdated")
        return res.status(200).json("Tabela excluida com sucesso!")
    })
}

export const postCard = (req, res) => {
    const q = "INSERT INTO kac_kanbanCard (kac_title, kac_content, kac_deadline, kac_state, kac_position, kac_createdAt, col_id, pri_id, uda_id, kat_id) VALUES (?)"

    const values = [
        req.body.kac_title,
        req.body.kac_content,
        req.body.kac_deadline,
        state,
        req.body.kac_position,
        req.body.kac_createdAt,
        req.body.col_id,
        req.body.pri_id,
        req.params.uda_id,
        req.params.kat_id
    ]

    console.log("valor: " + values)
    
    db.query(q, [values], (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json("Houve um erro ao criar o cartão")
        }
        req.io.emit("kanbanUpdated")
        return res.status(200).json("Cartão criado com sucesso!")
    })
}