import axios from "./axios"

export const getKanbanTable = async (fra_id) => {
  try {
    const res = await axios.get(`/api/kanban/table/${fra_id}`)
    return res.data
  } catch (error) {
    return error.response.data.error
  }
};

export const getKanbanCard = async (fra_id) => {
  try {
    const res = await axios.get(`/api/kanban/card/${fra_id}`)
    return res.data
  } catch (error) {
    return error.response.data.error
  }
}

export const postKanbanTable = async (fra_id, uda_id, data) => {
  try {
    const res = await axios.post(`/api/kanban/table/${fra_id}/${uda_id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error posting Kanban table", error);
  }
};

export const postKanbanCard = async (fra_id, uda_id, kat_id, data) => {
  try {
    const res = await axios.post(`/api/kanban/card/${fra_id}/${uda_id}/${kat_id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error posting Kanban card", error);
  }
};

// Adicione outras funções conforme necessário para as demais rotas...

export const deleteKanbanCard = async (fra_id, kac_id) => {
  try {
    const res = await axios.patch(`/api/kanban/card/delete/${fra_id}/${kac_id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting Kanban card", error);
  }
};

export const deleteKanbanTable = async (fra_id, kat_id) => {
  try {
    const res = await axios.patch(`/api/kanban/table/delete/${fra_id}/${kat_id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting Kanban table", error);
  }
};
