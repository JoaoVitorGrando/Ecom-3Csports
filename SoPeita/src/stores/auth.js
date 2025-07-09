import { defineStore } from 'pinia'
import { login as loginApi, getUser } from '../services/HttpService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: null,
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
    },
    logout() {
      this.token = ''
      this.user = null
      this.role = ''
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    },
    async fetchProfile() {
      const data = await getUser()
      this.user = data
      this.role = data.role
    }
  }
}) 