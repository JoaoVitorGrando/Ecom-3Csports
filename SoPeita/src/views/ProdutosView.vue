<template>
  <div class="container py-5">
    <h2 class="fw-bold text-gradient mb-4 text-center">Produtos</h2>
    <div v-if="loading" class="text-center">Carregando produtos...</div>
    <div v-else-if="erro" class="alert alert-danger text-center">{{ erro }}</div>
    <div v-else class="produtos-grid">
      <div v-for="produto in produtosFiltrados" :key="produto.id" class="produto-card-wrapper">
        <ProductCard
          :product="produto"
          :show-cart-btn="true"
          @add-to-cart="handleAddToCart"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/utils/toast'
import ProductCard from '@/components/ProductCard.vue'

const productsStore = useProductsStore()
const produtos = computed(() => productsStore.products)
const loading = computed(() => productsStore.loading)
const erro = computed(() => productsStore.error)

const auth = useAuthStore()
const userRole = auth.role

const route = useRoute()

const meuUserId = 221 //produtos criados com o id de adm serão visualizados por todos que acessarem o site
const produtosFiltrados = computed(() => {
  const categoriaSelecionada = route.query.categoria
  if (categoriaSelecionada) {
    return produtos.value.filter(produto =>
      produto.category?.user_id === meuUserId && produto.category?.name === categoriaSelecionada
    )
  }
  return produtos.value.filter(produto =>
    produto.category?.user_id === meuUserId
  )
})

watch(() => route.query.categoria, () => {}, { immediate: true })

function adicionarAoCarrinho(produto) {
  if (!auth.token) {
    showToast('Faça login para adicionar produtos ao carrinho.', 'warning')
    window.location.href = '/login'
    return
  }
  // Aqui você pode integrar com o carrinho, exibir toast, etc.
  showToast(`Produto "${produto.name}" adicionado ao carrinho!`, 'success')
}

async function handleAddToCart(product) {
  if (!auth.token) {
    showToast('Faça login para adicionar produtos ao carrinho.', 'warning')
    window.location.href = '/login'
    return
  }
  try {
    await productsStore.createCart?.()
    await productsStore.addItems?.({ product_id: Number(product.id), quantity: 1, unit_price: Number(product.price), size: 'M' })
    showToast('Produto adicionado ao carrinho!', 'success')
    // Se usar store/cartDrawer:
    try { const cartDrawer = (await import('@/stores/cartDrawer')).useCartDrawerStore(); cartDrawer().openDrawer(); } catch {}
  } catch (e) {
    showToast('Erro ao adicionar ao carrinho.', 'error')
  }
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