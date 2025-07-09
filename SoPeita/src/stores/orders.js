import { defineStore } from 'pinia'
import { getOrders, getOrderById, newOrder, changeOrderStatus, getClientOrders } from '../services/HttpService'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    loading: false,
    error: ''
  }),
  actions: {
    async fetchOrders() {
      this.loading = true
      try {
        this.orders = await getOrders()
        this.error = ''
      } catch (e) {
        this.error = e?.response?.data?.detail || 'Erro ao buscar pedidos.'
      } finally {
        this.loading = false
      }
    },
    async fetchOrder(id) {
      return await getOrderById(id)
    },
    async createOrder(payload) {
      return await newOrder(payload)
    },
    async updateOrderStatus(id, payload) {
      return await changeOrderStatus(id, payload)
    },
    async fetchClientOrders(clientId) {
      return await getClientOrders(clientId)
    }
  }
}) 