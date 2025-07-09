import axios from 'axios'
const API_URL = 'http://35.196.79.227:8000'

export async function getUsuarios() {
  const token = localStorage.getItem('token')
  const response = await axios.get(`${API_URL}/users/`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export async function createUsuario(usuario) {
  const token = localStorage.getItem('token')
  const response = await axios.post(`${API_URL}/users/`, usuario, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export async function updateUsuario(id, usuario) {
  const token = localStorage.getItem('token')
  const response = await axios.put(`${API_URL}/users/${id}`, usuario, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export async function deleteUsuario(id) {
  const token = localStorage.getItem('token')
  const response = await axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
} 