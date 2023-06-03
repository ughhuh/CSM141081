import axios from 'axios'
const baseURL = 'http://localhost:3001/persons'

const getData = () => {
    return axios.get(baseURL)
}
const updateData = (personObject) => {
    return axios.post(baseURL, personObject)
}
const deleteData = id => {
    const url = `${baseURL}/${id}`
    return axios.delete(url)
}
const modifyData  = (id, changedNote) => {
    const url = `${baseURL}/${id}`
    return axios.put(url, changedNote)
}

export default {getData, updateData, deleteData, modifyData}