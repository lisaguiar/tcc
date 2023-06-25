import { db } from "../config/config.js"

const state = "active"

export const getAllProjects = (req, res) => {
    const q = "SELECT * FROM pro_projects WHERE des_id = ? AND pro_state = 'active'"

    const values = [
        req.params.des_id
    ]

    console.log("bbb")
    

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json(err)
        } 
        const { q } = req.query

        if (q) {
            const keys = ["pro_title"]

            const search = (data) => {
                return data.filter((item) => 
                    keys.some((key) => item[key].toLowerCase().includes(q))
                )
            }           
            return res.status(200).json(search(data))      
        } else {
            console.log(data)
            return res.status(200).json(data)
        }
    })
}

export const getProject = (req, res) => {
    const q = "SELECT * FROM pro_projects WHERE pro_id = ? AND pro_state = 'active' AND des_id = ?"

    const values = [
        req.params.pro_id,
        req.params.des_id
    ]

    console.log(values)

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json(err)
        } 
        return res.status(200).json(data)
    })
}