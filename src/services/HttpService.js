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
    }
    return Promise.reject(error)
  }
)

// ========== USER ==========
export async function login(payload) {
  try {
    return (await API.post('login', payload)).data
  } catch (error) {
    throw error
  }
}

export async function register(payload) {
  try {
    return (await API.post('register', payload)).data
  } catch (error) {
    throw error
  }
}

export async function registerModerator(payload) {
  try {
    return (await API.post('users/create-moderator', payload)).data
  } catch (error) {
    throw error
  }
}

export async function getUser() {
  try {
    return (await API.get('users/me')).data
  } catch (error) {
    throw error
  }
}

export async function changeUserInfos(payload) {
  try {
    return (await API.put('users/me', payload)).data
  } catch (error) {
    throw error
  }
}

export async function deleteUser() {
  try {
    return (await API.delete('users/me')).data
  } catch (error) {
    throw error
  }
}

export async function updatePFP(formData) {
  try {
    return (await API.put('users/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })).data
  } catch (error) {
    throw error
  }
}

// ========== CATEGORIES ==========
export async function registerCategories(payload) {
  try {
    return (await API.post('categories/', payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })).data
  } catch (error) {
    throw error
  }
}

export async function getCategories() {
  try {
    return (await API.get('categories/')).data
  } catch (error) {
    throw error
  }
}

export async function deleteCategorie(idCat) {
  try {
    return (await API.delete(`categories/${idCat}`)).data
  } catch (error) {
    throw error
  }
}

export async function updateCategories(idCat, payload) {
  try {
    return (await API.put(`categories/${idCat}`, payload)).data
  } catch (error) {
    throw error
  }
}

// ========== SUBCATEGORIES ==========
export async function createSubcategory(categoryId, payload) {
  try {
    return (await API.post(`categories/${categoryId}/subcategories`, payload)).data
  } catch (error) {
    throw error
  }
}

export async function getSubcategories(categoryId) {
  try {
    return (await API.get(`categories/${categoryId}/subcategories`)).data
  } catch (error) {
    throw error
  }
}

export async function updateSubcategory(categoryId, subcategoryId, payload) {
  try {
    return (await API.put(`categories/${categoryId}/subcategories/${subcategoryId}`, payload)).data
  } catch (error) {
    throw error
  }
}

export async function deleteSubcategory(categoryId, subcategoryId) {
  try {
    return (await API.delete(`categories/${categoryId}/subcategories/${subcategoryId}`)).data
  } catch (error) {
    throw error
  }
}

// ========== PRODUCTS ==========
export async function createProducts(formData) {
  try {
    return (await API.post('products/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })).data
  } catch (error) {
    throw error
  }
}

export async function getProducts(idCat) {
  try {
    return (await API.get(`products/category/${idCat}`)).data
  } catch (error) {
    throw error
  }
}

export async function getAllProducts() {
  try {
    return (await API.get('products/')).data
  } catch (error) {
    throw error
  }
}

export async function getProduct(idProd) {
  try {
    return (await API.get(`products/${idProd}`)).data
  } catch (error) {
    throw error
  }
}

export async function updateProduct(idProd, payload) {
  try {
    return (await API.put(`products/${idProd}`, payload)).data
  } catch (error) {
    throw error
  }
}


export async function updateStockProduct(idProd, payload) {
  try {
    return (await API.put(`products/${idProd}/stock`, payload)).data
  } catch (error) {
    throw error
  }
}


export async function deleteProducts(idProd) {
  try {
    return (await API.delete(`products/${idProd}`)).data
  } catch (error) {
    throw error
  }
}


export async function getProductsByUser(userId) {
  try {
    return (await API.get(`products/user/${userId}`)).data
  } catch (error) {
    throw error
  }
}

// ========== ADDRESSES ==========

export async function getAddresses() {
  try {
    return (await API.get('addresses/')).data
  } catch (error) {
    throw error
  }
}


export async function getAddressByID(idAddress) {
  try {
    return (await API.get(`addresses/${idAddress}`)).data
  } catch (error) {
    throw error
  }
}


export async function createAddress(payload) {
  try {
    return (await API.post('addresses/', payload)).data
  } catch (error) {
    throw error
  }
}


export async function updateAddress(idAddress, payload) {
  try {
    return (await API.put(`addresses/${idAddress}`, payload)).data
  } catch (error) {
    throw error
  }
}

export async function deleteAddresses(idAddress) {
  try {
    return (await API.delete(`addresses/${idAddress}`)).data
  } catch (error) {
    throw error
  }
}

// ========== CART ==========
export async function createCart() {
  try {
    return (await API.post('cart/')).data
  } catch (error) {
    throw error
  }
}

export async function getCart() {
  try {
    return (await API.get('cart/')).data
  } catch (error) {
    throw error
  }
}

export async function getCartItems() {
  try {
    return (await API.get('cart/items')).data
  } catch (error) {
    throw error
  }
}

export async function addItems(payload) {
  try {
    return (await API.post('cart/items', payload)).data
  } catch (error) {
    throw error
  }
}

export async function updateQnt(payload) {
  try {
    return (await API.put('cart/items', payload)).data
  } catch (error) {
    throw error
  }
}

export async function deleteInCart(data) {
  try {
    return (await API.delete('cart/items', { data })).data
  } catch (error) {
    throw error
  }
}

export async function clearCartItems() {
  try {
    return (await API.delete('cart/clear')).data
  } catch (error) {
    throw error
  }
}

// ========== COUPONS ==========
export async function newCoupon(payload) {
  try {
    return (await API.post('coupons/', payload)).data
  } catch (error) {
    throw error
  }
}

export async function getCoupons() {
  try {
    return (await API.get('coupons/')).data
  } catch (error) {
    throw error
  }
}

export async function updateCoupon(couponID, payload) {
  try {
    return (await API.put(`coupons/${couponID}`, payload)).data
  } catch (error) {
    throw error
  }
}

export async function getCouponsByID(couponID) {
  try {
    return (await API.get(`coupons/${couponID}`)).data
  } catch (error) {
    throw error
  }
}

export async function deleteCoupon(couponID) {
  try {
    return (await API.delete(`coupons/${couponID}`)).data
  } catch (error) {
    throw error
  }
}

// ========== ORDERS ==========
export async function newOrder(payload) {
  try {
    return (await API.post('orders/', payload)).data
  } catch (error) {
    throw error
  }
}

export async function getOrders() {
  try {
    return (await API.get('orders/')).data
  } catch (error) {
    throw error
  }
}

export async function getOrderById(orderID) {
  try {
    return (await API.get(`orders/${orderID}`)).data
  } catch (error) {
    throw error
  }
}

export async function changeOrderStatus(orderID, payload) {
  try {
    return (await API.put(`orders/${orderID}`, payload)).data
  } catch (error) {
    throw error
  }
}

export async function getClientOrders(clientId) {
  try {
    return (await API.get(`orders/all/${clientId}`)).data
  } catch (error) {
    throw error
  }
}

export async function cancelOrder(orderID) {
  try {
    return (await API.delete(`orders/${orderID}`)).data
  } catch (error) {
    throw error
  }
}

export async function getAllOrders() {
  try {
    return (await API.get('orders/all')).data
  } catch (error) {
    throw error
  }
}

export async function getAllOrdersByAdmin(adminId) {
  try {
    return (await API.get(`orders/all/${adminId}`)).data
  } catch (error) {
    throw error
  }
}

// ========== AUTH TOKEN ==========
export async function renewToken() {
  try {
    return (await API.post('renew-token')).data
  } catch (error) {
    throw error
  }
}

export async function verifyToken() {
  try {
    return (await API.get('verify-token')).data
  } catch (error) {
    throw error
  }
} 

// ========== DESCONTOS ==========
export async function getDiscounts() {
  try {
    return await API.get('/discounts/').then(r => r.data)
  } catch (error) {
    throw error
  }
}
export async function getDiscountById(id) {
  try {
    return await API.get(`/discounts/${id}`).then(r => r.data)
  } catch (error) {
    throw error
  }
}
export async function createDiscount(payload) {
  try {
    return await API.post('/discounts/', payload).then(r => r.data)
  } catch (error) {
    throw error
  }
}
export async function updateDiscount(id, payload) {
  try {
    return await API.put(`/discounts/${id}`, payload).then(r => r.data)
  } catch (error) {
    throw error
  }
}
export async function deleteDiscount(id) {
  try {
    return await API.delete(`/discounts/${id}`)
  } catch (error) {
    throw error
  }
}