import axios from 'axios'
const baseURL = '/api/persons'

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
const modifyData  = (id, changedPerson) => {
    const url = `${baseURL}/${id}`
    return axios.put(url, changedPerson)
}

export default {getData, updateData, deleteData, modifyData}