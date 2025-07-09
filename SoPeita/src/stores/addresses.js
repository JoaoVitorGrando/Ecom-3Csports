import { defineStore } from 'pinia'
import { getAddresses, getAddressByID, createAddress, updateAddress, deleteAddresses } from '../services/HttpService'

export const useAddressesStore = defineStore('addresses', {
  state: () => ({
    addresses: [],
    loading: false,
    error: ''
  }),
  actions: {
    async fetchAddresses() {
      this.loading = true
      try {
        this.addresses = await getAddresses()
        this.error = ''
      } catch (e) {
        this.error = e?.response?.data?.detail || 'Erro ao buscar endereços.'
      } finally {
        this.loading = false
      }
    },
    async fetchAddress(id) {
      return await getAddressByID(id)
    },
    async createAddress(payload) {
      return await createAddress(payload)
    },
    async updateAddress(id, payload) {
      return await updateAddress(id, payload)
    },
    async deleteAddress(id) {
      return await deleteAddresses(id)
    }
  }
}) 