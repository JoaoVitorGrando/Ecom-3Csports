import { defineStore } from 'pinia'
import { createCart, getCart, getCartItems, addItems, updateQnt, deleteInCart, clearCartItems } from '../services/HttpService'
import { useAuthStore } from './auth'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: null,
    items: [],
    loading: false,
    error: ''
  }),
  actions: {
    async ensureCart() {
      const authStore = useAuthStore()
      if (!authStore.token) return // Não tenta buscar/criar carrinho se não autenticado
      try {
        this.cart = await getCart()
      } catch (e) {
        if (e?.response?.status === 404) {
          this.cart = await createCart()
        } else {
          throw e
        }
      }
    },
    async fetchItems() {
      const authStore = useAuthStore()
      if (!authStore.token) {
        this.items = []
        this.cart = null
        return
      }
      this.loading = true
      try {
        await this.ensureCart()
        const response = await getCartItems()
        this.items = Array.isArray(response.items) ? response.items : []
        this.error = ''
      } catch (e) {
        this.error = e?.response?.data?.detail || 'Erro ao buscar itens do carrinho.'
      } finally {
        this.loading = false
      }
    },
    async addItem(product, quantity = 1, size = 'M') {
      await this.ensureCart()
      return await addItems({ product_id: product.id, quantity, unit_price: Number(product.price), size })
    },
    async updateItem(product_id, quantity) {
      await this.ensureCart()
      return await updateQnt({ product_id, quantity })
    },
    async removeItem(product_id) {
      await this.ensureCart()
      await deleteInCart({ product_id })
      await this.fetchItems()
    },
    async clearItems() {
      await this.ensureCart()
      return await clearCartItems()
    }
  }
}) 