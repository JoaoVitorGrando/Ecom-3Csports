import { defineStore } from 'pinia'

export const useCartDrawerStore = defineStore('cartDrawer', {
  state: () => ({
    isOpen: false
  }),
  actions: {
    openDrawer() { this.isOpen = true },
    closeDrawer() { this.isOpen = false },
    toggleDrawer() { this.isOpen = !this.isOpen }
  }
}) 