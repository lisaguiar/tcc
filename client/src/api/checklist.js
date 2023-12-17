import axios from "./axios"

export const getChecklist = async (fra_id) => {
    try {
        const res = await axios.get(`/api/checklist/${fra_id}`)
        return res.data
    } catch (error) {
        return error.response.data.error
    }
}

export const postChecklist = async (fra_id, uda_id, data) => {
    try {
        const res = await axios.post(`/api/checklist/${fra_id}/${uda_id}`, data)
        return res.data.message
    } catch (error) {
        return error.response.data.error
    }
}

export const patchChecklist = async (fra_id, che_id, data) => {
    try {
        const res = await axios.patch(`/api/checklist/patch/${fra_id}/${che_id}`, data)
        return res.data.message
    } catch (error) {
        return error.response.data.error
    }
}

export const deleteChecklist = async (fra_id, che_id) => {
    try {
        const res = await axios.patch(`/api/checklist/delete/${fra_id}/${che_id}`)
        return res.data.message
    } catch (error) {
        return error.response.data.error
    }
}