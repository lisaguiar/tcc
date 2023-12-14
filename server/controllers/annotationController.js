import { db } from "../config/config.js"

const state = 'active'

export const getAnnotations = (req, res) => {
    const { fra_id } = req.params
    
    const q = "SELECT * FROM ann_annotations WHERE fra_id = ? AND ann_state = 'active'"

    const values = [
        fra_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao obter as anotações." })
        }
        if (!data.length) {
            return res.status(200).json({ message:"Nenhuma anotação encontrada." })
        }
        return res.status(200).json(data)
    })
}

export const postAnnotation = (req, res) => {
    const { fra_id, uda_id } = req.params
    const { title, content, createdAt } = req.body

    const q = "INSERT INTO ann_annotations (ann_title, ann_content, ann_createdAt, ann_state, fra_id, uda_id) VALUES (?)"

    const values = [
        title, 
        content,
        createdAt,
        state,
        fra_id,
        uda_id
    ]

    db.query(q, [values], (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Houve um erro ao criar a anotação." })
        }
        req.io.emit('annotationCreated', { fraId: fra_id })
        return res.status(200).json({ message: "Anotação criada com sucesso." })
    })
}

export const patchAnnotation = (req, res) => {
    const { ann_id, fra_id } = req.params
    const { title, content } = req.body

    const q = "UPDATE ann_annotations SET ann_title = ?, ann_content = ? WHERE ann_id = ?"

    const values = [
        title, 
        content,
        ann_id
    ]

    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao atualizar a anotação." })
        }
        req.io.emit('annotationUpdated', { fraId: fra_id })
        return res.status(200).json({ message: "Anotação atualizada com sucesso." })
    })
}

export const deleteAnnotation = (req, res) => {
    const { ann_id, fra_id } = req.params

    const q = "UPDATE ann_annotations SET ann_state = 'disabled' WHERE ann_id = ?"

    const values = [
        ann_id
    ]

    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao excluir a anotação." })
        }
        req.io.emit('annotationDeleted', { fraId: fra_id })
        return res.status(200).json({ message: "Anotação excluída com sucesso." })
    })
}