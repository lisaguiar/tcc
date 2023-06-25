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