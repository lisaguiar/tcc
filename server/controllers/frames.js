import { db } from "../config/config.js"

const state = "active"

export const getAllFrames = (req, res) => {
    const q = "SELECT * FROM fra_frames WHERE pro_id = ? AND fra_state = 'active'"

    const values = [
        req.params.pro_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json(err)
        } 
        const { q } = req.query

        if (q) {
            const keys = ["fra_title"]

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

export const getFrame = (req, res) => {
    const q = "SELECT * FROM fra_frames WHERE pro_id = ? AND fra_id = ? AND fra_state = 'active'"

    const values = [
        req.params.pro_id,
        req.params.fra_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).json(data)
    })
}

export const postFrame = (req, res) => {
    const q = "INSERT INTO fra_frames (fra_title, fra_description, fra_createdAt, fra_state, mod_id, pro_id, uda_id) values (?)"

    const values = [
        req.body.fra_title,
        req.body.fra_description,
        req.body.fra_createdAt,
        state,
        req.body.mod_id,
        req.params.pro_id,
        req.params.uda_id
    ]

    db.query(q, [values], (err, data) => {
        if (err) {
            return res.status(500).json("Houve um erro ao cadastrar o quadro!")
        }

        req.io.emit('frameCreated', { frameId: data.insertId })

        return res.status(200).json(data.insertId)
    })
}

export const patchFrame = (req, res) => {
    const q = "UPDATE fra_frames SET fra_title = ?, fra_description = ? WHERE fra_id = ?"

    const values = [
        req.body.fra_titleUpdated,
        req.body.fra_descriptionUpdated,
        req.params.fra_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json("Houve um erro ao atualizar o quadro!")
        }

        req.io.emit('frameUpdated', {fra_id: req.params.fra_id})

        return res.status(200).json("Quadro editado com sucesso!")
    })
}

export const deleteFrame = (req, res) => {
    const q = "UPDATE fra_frames SET fra_state = 'disabled' WHERE fra_id = ?"

    const values = [
        req.params.fra_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json("Houve um erro ao excluir o quadro!")
        }

        req.io.emit('frameDeleted', {fra_id: req.params.fra_id})

        return res.status(200).json("Quadro excluído com sucesso!")
    })
}