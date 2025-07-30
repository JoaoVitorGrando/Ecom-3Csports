import { defineStore } from 'pinia'
import { login as loginApi, getUser } from '../services/HttpService'
import { useCartStore } from './cart'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: (() => {
      try {
        return JSON.parse(localStorage.getItem('user')) || null
      } catch (e) {
        return null
      }
    })(),
    role: localStorage.getItem('role') || ''
  }),
  actions: {
    async login(email, senha) {
      const data = await loginApi({ email, password: senha })
      this.token = data.token
      this.user = data.user
      this.role = data.user.role
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.user.role)
      localStorage.setItem('user', JSON.stringify(data.user))
      // Carregar carrinho do usuário logado SOMENTE SE FOR CLIENT
      if (this.role === 'CLIENT') {
        const cartStore = useCartStore()
        await cartStore.fetchItems()
      }
    },
    logout() {
      this.token = ''
      this.user = null
      this.role = ''
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('user')
      // Limpar carrinho ao deslogar SOMENTE SE FOR CLIENT
      const cartStore = useCartStore()
      if (cartStore.cart && this.role === 'CLIENT') {
        cartStore.items = []
        cartStore.cart = null
        cartStore.error = ''
        // Limpar carrinho no backend também
        cartStore.clearItems().catch(() => {})
      }
    },
    async fetchProfile() {
      const data = await getUser()
      this.user = data
      this.role = data.role
      localStorage.setItem('user', JSON.stringify(data))
      localStorage.setItem('role', data.role)
    }
  }
}) 