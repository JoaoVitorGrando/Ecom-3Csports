<template>
  <div class="container py-5">
    <h2 class="fw-bold text-success mb-4 text-center">Produtos</h2>
    <div v-if="loading" class="text-center">Carregando produtos...</div>
    <div v-else-if="erro" class="alert alert-danger text-center">{{ erro }}</div>
    <div v-else class="row g-4">
      <div v-for="produto in produtos" :key="produto.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card h-100 shadow-sm">
          <img :src="'http://35.196.79.227:8000' + produto.image_path" class="card-img-top" :alt="produto.name" style="object-fit:cover; height:180px;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ produto.name }}</h5>
            <p class="card-text text-muted mb-1">{{ produto.description }}</p>
            <p class="fw-bold text-success mb-1">R$ {{ Number(produto.price).toFixed(2) }}</p>
            <span class="badge bg-secondary mb-2">Estoque: {{ produto.stock }}</span>
            <span class="badge bg-info mb-2">Categoria: {{ produto.category?.name }}</span>
            <router-link :to="'/produtos/' + produto.id" class="btn btn-outline-success mt-auto">Ver detalhes</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import { showToast } from '@/utils/toast'

const productsStore = useProductsStore()
const produtos = computed(() => productsStore.products)
const loading = computed(() => productsStore.loading)
const erro = computed(() => productsStore.error)

onMounted(async () => {
  try {
    await productsStore.fetchProducts()
  } catch (e) {
    showToast('Erro ao carregar produtos.', 'error')
  }
})
</script>

<style scoped>
@media (max-width: 700px) {
  .row.g-4 > .col-12,
  .row.g-4 > .col-sm-6,
  .row.g-4 > .col-md-4,
  .row.g-4 > .col-lg-3 {
    flex: 0 0 100%;
    max-width: 100%;
    margin-bottom: 1.2rem;
  }
  .card-img-top {
    height: 120px !important;
  }
  .card-body {
    padding: 0.7rem 0.5rem;
  }
  .card-title {
    font-size: 1.1rem;
  }
  .fw-bold.text-success.mb-4.text-center {
    font-size: 1.3rem;
  }
}
</style> 