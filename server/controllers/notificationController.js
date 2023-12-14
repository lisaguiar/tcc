import { db } from "../config/config.js"

export const getNotifications = (req, res) => {
    const { uda_id } = req.params

    const q = "SELECT * FROM not_notifications WHERE uda_id = ? AND not_state = 'active'"

    const values = [
        uda_id
    ]

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao obter as notificações." })
        }
        return res.status(200).json(data)
    })
}

export const deleteNotification = (req, res) => {
    const { not_id, uda_id } = req.params

    const q = "UPDATE not_notifications SET not_state = 'disabled' WHERE not_id = ?"

    const values = [
        not_id
    ]

    db.query(q, values, (err) => {
        if (err) {
            return res.status(500).json({ error: "Houve um erro ao excluir a notificação." })
        }
        req.io.emit('notificationDeleted', { udaId: uda_id})
        return res.status(200).json({ message: "Notificação excluída com sucesso." })
    })
}