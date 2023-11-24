import { db } from "../config/config.js"

export const getModel = (req, res) => {
    const q = "SELECT * FROM mod_models"

    db.query(q, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao definir os modelos de quadro." })
        }
        return res.status(200).json(data)
    })
}
