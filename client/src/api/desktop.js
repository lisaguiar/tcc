import axios from "./axios"

export const getDesktops = async (use_id, query) => {
    let res
    try {
        if (!query) {
            res = await axios.get(`/api/desktops/${use_id}`)
        } else {
            res = await axios.get(`/api/desktops/${use_id}/?q=${query}`)
        }
        return res.data
    } catch (error) {
        console.log("erro")
    }
}

export const getDesktop = async (des_id) => {
    try {
        const res = await axios.get(`/api/desktops/one/${des_id}`)
        return res.data
    } catch (error) {
        console.log("erro")
    }
}

export const postDesktop = async (use_id, data) => {
    try {
        const res = await axios.post(`/api/desktops/${use_id}`, data)
        return res.data
    } catch (error) {
        console.log("erro")
    }
}

export const patchDesktop = async (uda_id, des_id, data) => {
    try {
        const res = await axios.patch(`/api/desktops/${uda_id}/${des_id}`, data)
        return res.data
    } catch (error) {
        console.log("erro")
    }
}

export const deleteDesktop = async (uda_id, des_id) => {
    try {
        const res = await axios.patch(`/api/desktops/${uda_id}/${des_id}`)
        return res.data
    } catch (error) {
        console.log("erro")
    }
}