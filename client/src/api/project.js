import axios from "./axios"

export const getAllProjects = async () => {
    try {
        const res = await axios.get('api/projects/')
        return res.data
    } catch (error) {
        console.log("erro")
    }
}

export const getProjects = async (des_id, query) => {
    let res
    try {
        if (!query) {
            res = await axios.get(`/api/projects/${des_id}`)
        } else {
            res = await axios.get(`/api/projects/${des_id}/?q=${query}`)
        }
        return res.data
    } catch (error) {
        console.log("erro")
    }
}

export const getProject = async (pro_id) => {
    try {
        const res = await axios.get(`/api/projects/one/${pro_id}`)
        return res.data
    } catch (error) {
        console.log("erro")
    }
}

export const postProject = async (des_id, uda_id, data) => {
    try {
        const res = await axios.post(`/api/projects/${des_id}/${uda_id}`, data)
        return res.data
    } catch (error) {
        console.log("erro")
    }
}

export const patchProject = async (des_id, pro_id, data) => {
    try {
        const res = await axios.patch(`/api/projects/${des_id}/${pro_id}`, data)
        return res.data
    } catch (error) {
        console.log("erro")
    }
}

export const deleteProject = async (des_id, pro_id) => {
    try {
        const res = await axios.patch(`/api/projects/${des_id}/${pro_id}`)
        return res.data
    } catch (error) {
        console.log("erro")
    }
}