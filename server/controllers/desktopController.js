import { db } from "../config/config.js"

const state = "active"

export const getDesktops = (req, res) => {
    const { use_id } = req.params

    const q = "SELECT a.*, b.uda_id FROM des_desktop a JOIN uda_userDesktop b WHERE b.use_id = ? AND a.des_id = b.des_id AND a.des_state = 'active' AND b.uda_state = 'active'"

    const values = [
        use_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao encontrar a área de trabalho." })
        } 
        const { q } = req.query

        if (q) {
            const keys = ["des_title"]

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

export const getDesktop = (req, res) => {
    const { des_id } = req.params 

    const q = "SELECT * FROM des_desktop WHERE des_id = ? des_state = 'active'"

    const values = [
        des_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao encontrar a área de trabalho." })
        }
        return res.status(200).json(data)
    })
}

export const postDesktop = (req, res) => {
    const { title, description, createdAt } = req.body
    const { use_id } = req.params
    
    const q = "INSERT INTO des_desktop (des_title, des_description, des_state, des_createdAt) VALUES (?)"

    const values = [
        title,
        description,
        state,
        createdAt
    ]

    db.query(q, [values], (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao criar a área de trabalho." })
        }
        const q = "SELECT LAST_INSERT_ID(des_id) AS id FROM des_desktop ORDER BY des_id DESC LIMIT 1"

        db.query(q, (err, data) => {
            if (err) {
                const q = "DELETE FROM des_desktop WHERE des_id = ?"

                const values = [
                    data[0].id
                ]

                db.query(q, values, (err) => {
                    if (err) {
                        return res.status(500).json({ error: "Houve um erro ao criar a área de trabalho." })
                    }
                    return res.status(500).json({ error: "Houve um erro ao criar a área de trabalho." })
                })
            } else {
                const des_id = data[0].id

                const q = "INSERT INTO uda_userDesktop (uda_state, uda_createdAt, use_id, des_id, per_id) VALUES (?)"

                const values = [
                    state,
                    createdAt,
                    use_id,
                    des_id,
                    '1'
                ]

                db.query(q, [values], (err) => {
                    if (err) {
                        const q = "DELETE FROM des_desktop WHERE des_id = ?"

                        db.query(q, des_id, (err) => {
                            if (err) {
                                return res.status(500).json({ error: "Houve um erro ao criar a área de trabalho." })
                            }
                            return res.status(500).json({ error: "Houve um erro ao criar a área de trabalho." })
                        })
                    }
                    req.io.emit("postDesktop", { desId: des_id })
                    return res.status(200).json({ message: "Área de trabalho criada com sucesso." })
                })
            }
        })
    })
    
}

export const patchDesktop = (req, res) => {
    const { title, description } = req.body
    const { des_id, uda_id } = req.params

    const q = "UPDATE des_desktop SET des_title = ?, des_description = ? WHERE des_id = ?"

    const values = [
        title, 
        description,
        des_id
    ]
  
    db.query(q, values, (err) => {
        if (err) {
            return res.status(400).json({ error: "Houve um erro ao atualizar a área de trabalho." })
        }
        req.io.emit('desktopUpdated', { udaId: uda_id })

        return res.status(200).json({ message: "Área de Trabalho atualizada!" })
    })
}

export const deleteDesktop = (req, res) => {
    const { des_id, uda_id } = req.params

    const q = "UPDATE des_desktop SET des_state = 'disabled' WHERE des_id = ?"

    const values = [
        des_id
    ]
  
    db.query(q, values, (err) => {
        if (err) {
            return res.status(400).json({ error: "Houve um erro ao excluir a área de trabalho." })
        }
        req.io.emit('desktopDeleted', { udaId: uda_id })

        return res.status(200).json({ message: "Área de Trabalho excluída!" })
    })
}