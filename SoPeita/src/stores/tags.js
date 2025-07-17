import { defineStore } from 'pinia'
import { getTags, createTag, updateTag, deleteTag, addProductToTag, removeProductFromTag } from '../services/HttpService'

export const useTagsStore = defineStore('tags', {
  state: () => ({
    tags: [],
    loading: false,
    error: ''
  }),
  actions: {
    async fetchTags() {
      this.loading = true
      try {
        this.tags = await getTags()
        this.error = ''
      } catch (e) {
        this.error = e?.response?.data?.detail || 'Erro ao buscar tags.'
      } finally {
        this.loading = false
      }
    },
    async createTag(payload) {
      return await createTag(payload)
    },
    async updateTag(id, payload) {
      return await updateTag(id, payload)
    },
    async deleteTag(id) {
      return await deleteTag(id)
    },
    async addProductToTag(tagId, productId) {
      return await addProductToTag(tagId, productId)
    },
    async removeProductFromTag(tagId, productId) {
      return await removeProductFromTag(tagId, productId)
    }
  }
}) 