import axios from "./axios"

export const getMember = async (uda_id) => {
    try {
        const res = await axios.get(`/api/members/${uda_id}`)
        return res.data
    } catch (error) {
        return error.response.data.error
    }
}

export const postMember = async (des_id, data) => {
    try {
        const res = await axios.post(`/api/members/${des_id}`, data)
        return res.data.message
    } catch (error) {
        return error.response.data.error
    }
}

export const patchMember = async (des_id, uda_id, data) => {
    try {
        const res = await axios.patch(`/api/members/patch/${des_id}/${uda_id}`, data)
        return res.data.message
    } catch (error) {
        return error.response.data.error
    }
}

export const deleteMember = async (des_id, uda_id) => {
    try {
        const res = await axios.patch(`/api/members/delete/${des_id}/${uda_id}`)
        return res.data.message
    } catch (error) {
        return error.response.data.error
    }
}