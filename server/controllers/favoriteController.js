import { db } from "../config/config.js"

const state = "active"

export const getFavorites = (req, res) => {
    const { uda_id } = req.params

    const q = "SELECT * FROM fav_favorites WHERE uda_id = ? AND fav_state = 'active'"

    const values = [
        uda_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao procurar os favoritos." })
        }
        return res.status(200).json(data)
    })
}

export const addFavorite = (req, res) => {
    const { uda_id, fra_id } = req.params

    const q = "INSERT INTO fav_favorites (uda_id, fra_id) VALUES (?, ?)"
    
    const values = [
        uda_id,
        fra_id
    ]

    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao adicionar favorito." })
        }
        req.io.emit("favoriteCreated", { userId: uda_id })
        return res.status(201).json({ message: "Favoritado com sucesso." })
    })
}

export const deleteFavorite = (req, res) => {
    const { uda_id, fav_id } = req.params

    const q = "UPDATE fav_favorites SET fra_state = 'disabled' WHERE fav_id = ?"
    
    const values = [
        fav_id
    ]

    db.query(q, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao desfavoritar o quadro." })
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Quadro favoritado não encontrado" })
        }
        req.io.emit("favoriteDeleted", { userId: uda_id })
        return res.status(200).json({ message: "Quadro desfavoritado com sucesso." })
    })
}