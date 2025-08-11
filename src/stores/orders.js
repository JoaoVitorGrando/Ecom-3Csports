import { defineStore } from 'pinia'
import { getOrders, getOrderById, newOrder, changeOrderStatus, getClientOrders, getAllOrders, getAllOrdersByAdmin } from '../services/HttpService'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    loading: false,
    error: ''
  }),
  actions: {
    // Lista pedidos do usuário autenticado
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
    // Busca detalhes de um pedido 
    async fetchOrder(id) {
      return await getOrderById(id)
    },
    // Cria pedido
    async createOrder(payload) {
      return await newOrder(payload)
    },
    async updateOrderStatus(id, payload) {
      return await changeOrderStatus(id, payload)
    },
    // Lista pedidos de um cliente específico id
    async fetchClientOrders(clientId) {
      return await getClientOrders(clientId)
    },
    // Lista todos os pedidos (admin) 
    async fetchAllOrders() {
      this.loading = true
      try {
        this.orders = await getAllOrders()
        this.error = ''
      } catch (e) {
        this.error = e?.response?.data?.detail || 'Erro ao buscar todos os pedidos.'
      } finally {
        this.loading = false
      }
    },
    // Lista todos os pedidos da loja do admin 
    async fetchAllOrdersByAdmin(adminId) {
      this.loading = true
      try {
        this.orders = await getAllOrdersByAdmin(adminId)
        this.error = ''
      } catch (e) {
        this.error = e?.response?.data?.detail || 'Erro ao buscar pedidos da loja.'
      } finally {
        this.loading = false
      }
    }
  }
}) 