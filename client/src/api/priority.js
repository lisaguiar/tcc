import axios from "./axios"

export const getPriority = async () => {
    try {
        const res = await axios.get(`/api/priority/`)
        return res.data
    } catch (error) {
        return error.response.data.error
    }
}