import axios from 'axios'
const API_URL = 'http://35.196.79.227:8000'

export async function getProdutos() {
  const response = await axios.get(`${API_URL}/products/`)
  return response.data
}

export async function getProduto(id) {
  const response = await axios.get(`${API_URL}/products${id}`)
  return response.data
}

export async function createProduto(produto) {
  const token = localStorage.getItem('token')
  const response = await axios.post(`${API_URL}/products/`, produto, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export async function updateProduto(id, produto) {
  const token = localStorage.getItem('token')
  const response = await axios.put(`${API_URL}/products/${id}`, produto, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export async function deleteProduto(id) {
  const token = localStorage.getItem('token')
  const response = await axios.delete(`${API_URL}/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export async function getAllProducts() {
  const response = await axios.get('http://35.196.79.227:8000/products/')
  return response.data
} 