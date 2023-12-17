import axios from "./axios"

export const getFavorite = async (uda_id) => {
    try {
        const res = await axios.get(`/api/favorites/${uda_id}`)
        return res.data
    } catch (error) {
        return error.response.data.error
    }
}

export const postFavorite = async (uda_id, fra_id) => {
    try {
        const res = await axios.post(`/api/favorites/${uda_id}/${fra_id}`)
        return res.data.message
    } catch (error) {
        return error.response.data.error
    }
}

export const deleteFavorite = async (uda_id, fav_id) => {
    try {
        const res = await axios.delete(`/api/favorites/${uda_id}/${fav_id}`)
        return res.data.message
    } catch (error) {
        return error.response.data.error
    }
}