import { defineStore } from 'pinia'
import { login as loginApi, getUser } from '../services/HttpService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) || null,
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
    },
    logout() {
      this.token = ''
      this.user = null
      this.role = ''
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('user')
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