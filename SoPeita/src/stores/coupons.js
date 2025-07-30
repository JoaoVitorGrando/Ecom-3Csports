import { defineStore } from 'pinia'
import { getCoupons, getCouponsByID, newCoupon, updateCoupon, deleteCoupon } from '../services/HttpService'

export const useCouponsStore = defineStore('coupons', {
  state: () => ({
    coupons: [],
    loading: false,
    error: ''
  }),
  actions: {
    async fetchCoupons() {
      this.loading = true
      try {
        this.coupons = await getCoupons()
        this.error = ''
      } catch (e) {
        this.error = e?.response?.data?.detail || 'Erro ao buscar cupons.'
      } finally {
        this.loading = false
      }
    },
    async fetchCoupon(id) {
      return await getCouponsByID(id)
    },
    async createCoupon(payload) {
      return await newCoupon(payload)
    },
    async updateCoupon(id, payload) {
      return await updateCoupon(id, payload)
    },
    async deleteCoupon(id) {
      return await deleteCoupon(id)
    }
  }
}) 