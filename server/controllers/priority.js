import { db } from "../config/config.js"

export const getPriority = (req, res) => {
    const q = "SELECT * FROM pri_priority"

    db.query(q, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao definir as prioridades" })
        }
        return res.status(200).json(data)
    })
}
