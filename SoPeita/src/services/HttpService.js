import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const API = axios.create({
  baseURL: 'http://35.196.79.227:8000/'
})

API.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

API.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const auth = useAuthStore()
      auth.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ========== USER ==========
export async function login(payload) {
  return (await API.post('login', payload)).data
}

export async function register(payload) {
  return (await API.post('register', payload)).data
}

export async function registerModerator(payload) {
  return (await API.post('users/create-moderator', payload)).data
}

export async function getUser() {
  return (await API.get('users/me')).data
}

export async function changeUserInfos(payload) {
  return (await API.put('users/me', payload)).data
}

export async function deleteUser() {
  return (await API.delete('users/me')).data
}

export async function updatePFP(formData) {
  return (await API.put('users/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })).data
}

// ========== CATEGORIES ==========
export async function registerCategories(payload) {
  return (await API.post('categories/', payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })).data
}

export async function getCategories() {
  return (await API.get('categories/')).data
}

export async function deleteCategorie(idCat) {
  return (await API.delete(`categories/${idCat}`)).data
}

export async function updateCategories(idCat, payload) {
  return (await API.put(`categories/${idCat}`, payload)).data
}

// ========== PRODUCTS ==========
export async function createProducts(formData) {
  return (await API.post('products/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })).data
}

export async function getProducts(idCat) {
  return (await API.get(`products/category/${idCat}`)).data
}

export async function getAllProducts() {
  return (await API.get('products/')).data
}

export async function getProduct(idProd) {
  return (await API.get(`products/${idProd}`)).data
}

export async function updateProduct(idProd, payload) {
  return (await API.put(`products/${idProd}`, payload)).data
}

export async function updateStockProduct(idProd, payload) {
  return (await API.put(`products/${idProd}/stock`, payload)).data
}

export async function deleteProducts(idProd) {
  return (await API.delete(`products/${idProd}`)).data
}

// ========== ADDRESSES ==========
export async function getAddresses() {
  return (await API.get('addresses/')).data
}

export async function getAddressByID(idAddress) {
  return (await API.get(`addresses/${idAddress}`)).data
}

export async function createAddress(payload) {
  return (await API.post('addresses/', payload)).data
}

export async function updateAddress(idAddress, payload) {
  return (await API.put(`addresses/${idAddress}`, payload)).data
}

export async function deleteAddresses(idAddress) {
  return (await API.delete(`addresses/${idAddress}`)).data
}

// ========== CART ==========
export async function createCart() {
  return (await API.post('cart/')).data
}

export async function getCart() {
  return (await API.get('cart/')).data
}

export async function getCartItems() {
  return (await API.get('cart/items')).data
}

export async function addItems(payload) {
  return (await API.post('cart/items', payload)).data
}

export async function updateQnt(payload) {
  return (await API.put('cart/items', payload)).data
}

export async function deleteInCart(data) {
  return (await API.delete('cart/items', { data })).data
}

export async function clearCartItems() {
  return (await API.delete('cart/clear')).data
}

// ========== COUPONS ==========
export async function newCoupon(payload) {
  return (await API.post('coupons/', payload)).data
}

export async function getCoupons() {
  return (await API.get('coupons/')).data
}

export async function updateCoupon(couponID, payload) {
  return (await API.put(`coupons/${couponID}`, payload)).data
}

export async function getCouponsByID(couponID) {
  return (await API.get(`coupons/${couponID}`)).data
}

export async function deleteCoupon(couponID) {
  return (await API.delete(`coupons/${couponID}`)).data
}

// ========== ORDERS ==========
export async function newOrder(payload) {
  return (await API.post('orders/', payload)).data
}

export async function getOrders() {
  return (await API.get('orders/')).data
}

export async function getOrderById(orderID) {
  return (await API.get(`orders/${orderID}`)).data
}

export async function changeOrderStatus(orderID, payload) {
  return (await API.put(`orders/${orderID}`, payload)).data
}

export async function getClientOrders(clientId) {
  return (await API.get(`orders/all/${clientId}`)).data
}

export async function cancelOrder(orderID) {
  return (await API.delete(`orders/${orderID}`)).data
} 