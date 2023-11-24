import { db } from "../config/config.js"

const state = "active"

export const getFavorites = (req, res) => {
    const q = "SELECT * FROM fav_favorites WHERE uda_id = ? AND fav_state = 'active'"

    const values = [
        req.params.uda_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao procurar os favoritos." })
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

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao adicionar favorito." })
        }
        req.io.emit("favoriteCreated", { userId: req.params.uda_id })
        return res.status(201).json({ message: "Favoritado com sucesso." })
    })
}

export const deleteFavorite = (req, res) => {
    const q = "UPDATE fav_favorites SET fra_state = 'disabled' WHERE fav_id = ?"
    
    const values = [
        req.params.fav_id
    ]

    db.query(q, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao desfavoritar quadro." })
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Quadro favoritado não encontrado" })
        }

        return res.status(200).json({ message: "Quadro desfavoritado com sucesso." })
    })
}