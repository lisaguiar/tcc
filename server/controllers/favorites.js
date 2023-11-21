import { db } from "../config/config.js"

const state = "active"

export const getFavorites = (req, res) => {
    const q = "SELECT * FROM fav_favorites WHERE uda_id = ? AND fav_state = 'active'"

    const values = [
        req.params.uda_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching favorites" })
        }
        return res.status(200).json(data)
    })
}

export const addFavorite = (req, res) => {
    const q = "INSERT INTO fav_favorites (uda_id, fra_id) VALUES (?, ?)"
    
    const values = [
        req.params.uda_id,
        req.params.fra_id
    ]

    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Error adding favorite" })
        }
        return res.status(201).json({ message: "Favorite added successfully" })
    })
}

export const deleteFavorite = (req, res) => {
    const q = "UPDATE fav_favorites SET fra_state = 'disabled' WHERE fav_id = ?"
    
    const values = [
        req.params.fav_id
    ]

    db.query(q, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error updating favorite" })
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Favorite not found" })
        }

        return res.status(200).json({ message: "Favorite updated successfully" })
    })
}