<template>
  <div class="container py-5">
    <h2 class="fw-bold text-gradient mb-4 text-center">Produtos</h2>
    <div v-if="loading" class="text-center">Carregando produtos...</div>
    <div v-else-if="erro" class="alert alert-danger text-center">{{ erro }}</div>
    <div v-else class="produtos-grid">
      <div v-for="produto in produtos" :key="produto.id" class="produto-card-wrapper">
        <div class="produto-card card h-100 shadow-sm hover-lift">
          <img :src="'http://35.196.79.227:8000' + produto.image_path" class="card-img-top" :alt="produto.name">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ produto.name }}</h5>
            <p class="card-text text-muted mb-1">{{ produto.description }}</p>
            <p class="fw-bold text-gradient mb-1">R$ {{ Number(produto.price).toFixed(2) }}</p>
            <span class="badge bg-secondary mb-2">Estoque: {{ produto.stock }}</span>
            <span class="badge bg-info mb-2">Categoria: {{ produto.category?.name }}</span>
            <button v-if="userRole==='ADMIN' || userRole==='MODERATOR'" class="btn btn-outline-primary mt-auto" @click="abrirModal(produto)">Ver detalhes</button>
            <button v-if="userRole==='CLIENT'" class="btn btn-primary mt-auto" @click="adicionarAoCarrinho(produto)">Adicionar ao carrinho</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ModalProduto
    v-if="produtoSelecionado"
    :produto="produtoSelecionado"
    :show="mostrarModal"
    @close="fecharModal"
    @add-to-cart="adicionarAoCarrinho"
  />
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/utils/toast'
import ModalProduto from '@/components/ModalProduto.vue'

const productsStore = useProductsStore()
const produtos = computed(() => productsStore.products)
const loading = computed(() => productsStore.loading)
const erro = computed(() => productsStore.error)

const produtoSelecionado = ref(null)
const mostrarModal = ref(false)

const auth = useAuthStore()
const userRole = auth.role

function abrirModal(produto) {
  produtoSelecionado.value = produto
  mostrarModal.value = true
}
function fecharModal() {
  mostrarModal.value = false
  produtoSelecionado.value = null
}
function adicionarAoCarrinho(produto) {
  // Aqui você pode integrar com o carrinho, exibir toast, etc.
  showToast(`Produto "${produto.name}" adicionado ao carrinho!`, 'success')
  fecharModal()
}

onMounted(async () => {
  try {
    await productsStore.fetchProducts()
  } catch (e) {
    showToast('Erro ao carregar produtos.', 'error')
  }
})
</script>

<style scoped>
.produtos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  justify-content: center;
  align-items: stretch;
}
.produto-card-wrapper {
  display: flex;
  align-items: stretch;
  height: 100%;
}
.produto-card {
  width: 100%;
  min-width: 240px;
  max-width: 320px;
  min-height: 410px;
  max-height: 470px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-radius: 16px;
  border: 1px solid var(--color-border);
  overflow: hidden;
  background: var(--color-bg-card);
  transition: all 0.3s cubic-bezier(.4,2,.3,1);
}
.card-img-top {
  object-fit: cover;
  width: 100%;
  height: 200px !important;
  border-radius: 16px 16px 0 0;
  transition: transform 0.3s ease;
}
.produto-card:hover .card-img-top {
  transform: scale(1.05);
}
.card-body {
  flex: 1 1 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 1.1rem 1rem 0.7rem 1rem;
}
.card-title {
  font-size: 1.18rem;
  min-height: 48px;
  margin-bottom: 0.5rem;
  text-align: center;
}
.card-text {
  font-size: 1.08rem;
  margin-bottom: 0.7rem;
  text-align: center;
}
.fw-bold.text-gradient.mb-1 {
  font-size: 1.15rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.btn-outline-primary {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.btn-outline-primary:hover {
  background: var(--color-primary);
  color: #fff;
}
@media (max-width: 1200px) {
  .produtos-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 900px) {
  .produtos-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .produtos-grid {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
  .produto-card {
    min-width: 100%;
    max-width: 100%;
    min-height: 320px;
    max-height: 370px;
    padding: 0.7rem;
  }
  .card-img-top {
    height: 120px !important;
  }
  .card-title {
    font-size: 1rem;
    min-height: 36px;
  }
}
</style> 