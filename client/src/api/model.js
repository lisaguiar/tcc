import axios from "./axios"

export const getModel = async () => {
    try {
        const res = await axios.get(`/api/models/`)
        return res.data
    } catch (error) {
        return error.response.data.error
    }
}