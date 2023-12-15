import axios from "./axios"

export const getFrames = async (pro_id) => {
    try {
        const res = await axios.get(`/api/frames/${pro_id}`)
        return res.data
    } catch (error) {
        return error.response.data.error
    }
}

export const getFrame = async (fra_id) => {
    try {
        const res = await axios.get(`/api/frames/${fra_id}`)
        return res.data
    } catch (error) {
        return error.response.data.error
    }
}

export const postFrame = async (pro_id, uda_id, data) => {
    try {
        const res = await axios.post(`/api/frames/${pro_id}/${uda_id}`, data)
        return res.data.message
    } catch (error) {
        return error.response.data.error
    }
}

export const patchFrame = async (pro_id, fra_id, data) => {
    try {
        const res = await axios.patch(`/api/frames/patch/${pro_id}/${fra_id}`, data)
        return res.data.message
    } catch (error) {
        return error.response.data.error
    }
}

export const deleteFrame = async (pro_id, fra_id) => {
    try {
        const res = await axios.patch(`/api/frames/delete/${pro_id}/${fra_id}`)
        return res.data.message
    } catch (error) {
        return error.response.data.error
    }
}