import { defineStore } from 'pinia'
import { getAllProducts, getProduct, createProducts, updateProduct, deleteProducts } from '../services/HttpService'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    error: ''
  }),
  actions: {
    async fetchProducts() {
      this.loading = true
      try {
        this.products = await getAllProducts()
        this.error = ''
      } catch (e) {
        this.error = e?.response?.data?.detail || 'Erro ao buscar produtos.'
      } finally {
        this.loading = false
      }
    },
    async fetchProduct(id) {
      return await getProduct(id)
    },
    async createProduct(produto) {
      return await createProducts(produto)
    },
    async updateProduct(id, produto) {
      return await updateProduct(id, produto)
    },
    async deleteProduct(id) {
      return await deleteProducts(id)
    }
  }
}) 