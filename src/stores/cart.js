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
    // Garante que o usuário autenticado possua um carrinho (cria se 404)
    async ensureCart() { 
      const authStore = useAuthStore()
      if (!authStore.token) return
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
    // Busca os itens do carrinho do usuário logado
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
    // Adiciona um item ao carrinho com tamanho e preço unitário
    async addItem(product, quantity = 1, size = 'M') {  
      await this.ensureCart()
      return await addItems({ product_id: product.id, quantity, unit_price: Number(product.price), size })
    },
    // Atualiza a quantidade de um item no carrinho
    async updateItem(product_id, quantity) { 
      await this.ensureCart()
      return await updateQnt({ product_id, quantity })
    },
    async removeItem(product_id) { // Remove um item do carrinho
      await this.ensureCart()
      await deleteInCart({ product_id })
      await this.fetchItems()
    },
    async clearItems() { // Limpa o carrinho
      await this.ensureCart()
      return await clearCartItems()
    }
  }
}) 