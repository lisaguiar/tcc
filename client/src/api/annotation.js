import axios from "./axios"

export const getAnnotation = async (fra_id) => {
    try {
        const res = await axios.get(`/api/annotation/${fra_id}`)
        return res.data
    } catch (error) {
        return error.response.data.error
    }
}

export const postAnnotation = async (fra_id, uda_id, data) => {
    try {
        const res = await axios.post(`/api/annotation/${fra_id}/${uda_id}`, data)
        return res.data.message
    } catch (error) {
        return error.response.data.error
    }
}

export const patchAnnotation = async (fra_id, ann_id, data) => {
    try {
        const res = await axios.patch(`/api/annotation/patch/${fra_id}/${ann_id}`, data)
        return res.data.message
    } catch (error) {
        return error.response.data.error
    }
}

export const deleteAnnotation = async (fra_id, ann_id) => {
    try {
        const res = await axios.patch(`/api/annotation/delete/${fra_id}/${ann_id}`)
        return res.data.message
    } catch (error) {
        return error.response.data.error
    }
}