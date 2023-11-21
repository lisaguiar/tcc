import { db } from "../config/config"

const state = 'active'

export const postMember = (req, res) => {
    const q = "INSERT INTO uda_userDesktop (uda_state, uda_createdAt, use_id, des_id, per_id) VALUES (?)"

    const values = [
        state,
        req.body.des_createdAt,
        req.params.use_id,
        req.params.des_id,
        req.body.per_id
    ]

    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Error adding member" })
        }
        return res.status(201).json({ message: "Member added successfully" })
    })
}

export const getMember = (req, res) => {
    const q = "SELECT * FROM uda_userDesktop WHERE uda_id = ? AND usa_state = 'active'"

    const values = [
        req.params.uda_id
    ]

    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Error finding member" })
        }
        return res.status(201).json({ message: "Member found successfully" })
    })
}

export const patchMember = (req, res) => {
    const q = "UPDATE uda_userDesktop SET per_id = ? WHERE uda_id = ?"

    const values = [
        req.body.per_id,
        req.params.uda_id
    ]

    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Error patching member" })
        }
        return res.status(201).json({ message: "Member patched successfully" })
    })
}

export const deleteMember = (req, res) => {
    const q = "UPDATE uda_userDesktop SET uda_state = 'disabled' WHERE uda_id = ?"

    const values = [
        req.params.uda_id
    ]

    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Error excluding member" })
        }
        return res.status(201).json({ message: "Member deleted successfully" })
    })
}