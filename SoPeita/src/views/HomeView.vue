<template>
  <div class="home container-fluid py-5">
    <div class="row justify-content-center mb-5">
      <div class="col-12 col-lg-10">
        <BootstrapCarousel />
      </div>
    </div>
    <div v-if="isAuth && user" class="alert alert-success text-center fw-bold mb-5">
      Bem-vindo de volta, {{ user }}! Aproveite as ofertas exclusivas para torcedores.
    </div>
    <section class="products" id="produtos">
      <h2 class="mb-5 text-center fw-bold display-4 text-dark">Destaques</h2>
      <div class="row g-4 justify-content-center">
        <transition-group name="fadein" tag="div" class="row g-4 justify-content-center">
          <div v-for="product in products" :key="product.id" class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch">
            <ProductCard :product="product" @add-to-cart="handleAddToCart" />
          </div>
        </transition-group>
      </div>
    </section>
  </div>
</template>

<script setup>
import ProductCard from '../components/ProductCard.vue'
import { ref, onMounted } from 'vue'
import BootstrapCarousel from '../components/BootstrapCarousel.vue'
import { getProdutos } from '../services/productService'
import { addToCart as addToCartService } from '../services/cartService'

const products = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    products.value = await getProdutos()
  } catch (e) {
    error.value = 'Erro ao carregar produtos.'
  } finally {
    loading.value = false
  }
})

const isAuth = ref(localStorage.getItem('auth') === 'true')
const user = ref(localStorage.getItem('user') || '')

async function handleAddToCart(product) {
  try {
    await addToCartService(product.id, 1)
    alert('Produto adicionado ao carrinho!')
  } catch (e) {
    alert('Erro ao adicionar ao carrinho.')
  }
}
</script>

<style scoped>
.home {
  background: var(--color-bg);
}
.fadein-enter-active {
  animation: fadeIn 0.7s cubic-bezier(.4,2,.3,1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: none; }
}
</style>
