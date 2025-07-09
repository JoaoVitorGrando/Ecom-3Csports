import axios from 'axios'
const API_URL = 'http://35.196.79.227:8000'

export async function addToCart(produtoId, quantidade) {
  const token = localStorage.getItem('token')
  const response = await axios.post(`${API_URL}/cart`, 
    { produto_id: produtoId, quantidade },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return response.data
}

export async function getCart() {
  const token = localStorage.getItem('token')
  const response = await axios.get(`${API_URL}/cart`, 
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return response.data
} 