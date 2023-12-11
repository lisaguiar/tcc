import { db } from "../config/config.js"

const state = "active"

export const getFrames = (req, res) => {
const { pro_id } = req.params

    const q = "SELECT * FROM fra_frames WHERE pro_id = ? AND fra_state = 'active'"

    const values = [
        pro_id
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

export const getOneFrame = (req, res) => {

}

export const postFrame = (req, res) => {
    const { fra_title, fra_description, fra_createdAt, mod_id } = req.body

    const q = "INSERT INTO fra_frames (fra_title, fra_description, fra_createdAt, fra_state, mod_id, pro_id, uda_id) values (?)"

    const values = [
        fra_title,
        fra_description,
        fra_createdAt,
        state,
        mod_id,
        req.params.pro_id,
        req.params.uda_id
    ]

    db.query(q, [values], (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao cadastrar o quadro!" })
        }

        req.io.emit('frameCreated', { frameId: req.params.pro_id })

        return res.status(200).json(data.insertId)
    })
}

export const patchFrame = (req, res) => {
    const { fra_titleUpdated, fra_descriptionUpdated } = req.body

    if (!fra_titleUpdated || !fra_descriptionUpdated || fra_titleUpdated.length < 3 || fra_descriptionUpdated.length < 10) {
        return res.status(400).json({ error: "Valores inválidos para atualização do quadro." })
    }

    const q = "UPDATE fra_frames SET fra_title = ?, fra_description = ? WHERE fra_id = ?"

    const values = [
        fra_titleUpdated,
        fra_descriptionUpdated,
        req.params.fra_id
    ]

    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error:"Houve um erro ao atualizar o quadro!" })
        }

        req.io.emit('frameUpdated', { fraId: req.params.pro_id })

        return res.status(200).json({ message: "Quadro editado com sucesso!" })
    })
}

export const deleteFrame = (req, res) => {
    const q = "UPDATE fra_frames SET fra_state = 'disabled' WHERE fra_id = ?"

    const values = [
        req.params.fra_id
    ]

    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao excluir o quadro!"})
        }

        req.io.emit('frameDeleted', { fraId: req.params.pro_id })

        return res.status(200).json({ message: "Quadro excluído com sucesso!"})
    })
}