import { db } from "../config/config.js"

const state = "active"

export const getDesktop = (req, res) => {
    const q = "SELECT a.* FROM des_desktop a JOIN uda_userDesktop b WHERE b.use_id = ? AND a.des_id = b.des_id AND a.des_state = 'active' AND b.uda_state = 'active'"

    const values = [
        req.params.use_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao encontrar a área de trabalho." })
        } 
        const { q } = req.query
        const { des_id } = req.params

        if (q) {
            const keys = ["des_title"]

            const search = (data) => {
                return data.filter((item) => 
                    keys.some((key) => item[key].toLowerCase().includes(q))
                )
            }      
            
            const actualDesktop = data.filter(item => item.des_id === des_id)

            return res.status(200).json(search(data), ...actualDesktop)      
        } else {
            return res.status(200).json(data)
        }
    })
}

export const getLastDesktop = (req, res) => {
    const q = "SELECT * FROM des_desktop WHERE des_id = ? AND des_state = 'active'"

    const values = [
        req.params.des_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(400).json(err)
        }
        return res.status(200).json(data)
    })
}

export const postDesktop = (req, res) => {
    const { des_title, des_description, des_createdAt } = req.body

    if (!des_title || des_title.length < 3 || !des_description || des_description.length < 3 || !des_createdAt) {
        return res.status(400).json({ message: "Valores inválidos!" })
    }

    const q = "INSERT INTO des_desktop (des_title, des_description, des_state, des_createdAt) VALUES (?)"

    const values = [
        des_title,
        des_description,
        state,
        des_createdAt
    ]

    db.query(q, [values], (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao criar a área de trabalho" })
        }
        const q = "SELECT LAST_INSERT_ID(des_id) AS id FROM des_desktop ORDER BY des_id DESC LIMIT 1"

        db.query(q, (err, data) => {
            if (err) {
                const q = "DELETE FROM des_desktop WHERE des_id = ?"
                db.query(q, data[0].id, (err, data) => {
                    if (err) {
                        return res.status(500).json("Houve um erro ao criar a área de trabalho 2.")
                    }
                    return res.status(500).json("Houve um erro ao criar a área de trabalho 3.")
                })
            } else {
                const last_id = data[0].id

                const q = "INSERT INTO uda_userDesktop (uda_state, uda_createdAt, use_id, des_id, per_id) VALUES (?)"

                const values = [
                    state,
                    des_createdAt,
                    req.params.use_id,
                    last_id,
                    '1'
                ]

                db.query(q, [values], (err, data) => {
                    if (err) {
                        const q = "DELETE FROM des_desktop WHERE des_id = ?"

                        db.query(q, last_id, (err, data) => {
                            if (err) {
                                return res.status(500).json("Houve um erro ao criar a área de trabalho 4.")
                            }
                            return res.status(500).json("Houve um erro ao criar a área de trabalho 5.")
                        })
                    }
                    req.io.emit("postDesktop", { uda_id: data.insertId })
                    return res.status(200).json(last_id)
                })
            }
        })
    })
}

export const patchDesktop = (req, res) => {
    const { des_titleUpdated, des_descriptionUpdated } = req.body

    if (!des_titleUpdated || des_titleUpdated.length < 3 || !des_descriptionUpdated || des_descriptionUpdated.length < 10) {
        return res.status(400).json({ error: "Valores inválidos." })
    }

    const q = "UPDATE des_desktop SET des_title = ?, des_description = ? WHERE des_id = ?"

    const values = [
        des_titleUpdated, 
        des_descriptionUpdated,
        req.params.des_id
    ]
  
    db.query(q, values, (err) => {
        if (err) {
            return res.status(400).json({ error: "Houve um erro ao atualizar a área de trabalho." })
        }
        req.io.emit('desktopUpdated', { udaId: req.params.uda_id })

        return res.status(200).json({ message: "Área de Trabalho atualizada!" })
    })
}

export const deleteDesktop = (req, res) => {
    const q = "UPDATE des_desktop SET des_state = 'disabled' WHERE des_id = ?"

    const values = [
        req.params.des_id
    ]
  
    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(400).json({ error: "Houve um erro ao excluir a área de trabalho." })
        }
        req.io.emit('desktopDeleted', { udaId: req.params.uda_id })

        return res.status(200).json({ message: "Área de Trabalho excluída!" })
    })
}

