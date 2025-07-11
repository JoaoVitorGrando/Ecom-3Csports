<template>
  <div class="home container-fluid py-5">
    <!-- Nome do site estilizado -->
    <div class="row justify-content-center mb-3">
      <div class="col-12 text-center">
        <h1 class="fw-bold display-3" style="letter-spacing:1px;">
          <span style="color:#18181b;">3C</span> <span style="color:#FFD600;">sports</span>
        </h1>
      </div>
    </div>
    <!-- Remover botão flutuante do carrinho e CartDrawer -->
    <div class="row justify-content-center mb-5">
      <div class="col-12 col-lg-10">
        <BootstrapCarousel />
      </div>
    </div>
    <section class="products" id="produtos">
      <h2 class="mb-5 text-center fw-bold display-4 text-dark">Destaques</h2>
      <div class="row g-4 justify-content-center">
        <transition-group name="fadein" tag="div" class="row g-4 justify-content-center">
          <div v-for="product in products" :key="product.id" class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch">
            <ProductCard :product="product" @add-to-cart="handleAddToCart" :show-cart-btn="true" @details="handleDetails" />
          </div>
        </transition-group>
      </div>
    </section>
  </div>
</template>

<script setup>
import ProductCard from '../components/ProductCard.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import BootstrapCarousel from '../components/BootstrapCarousel.vue'
import { getAllProducts, addItems, createCart } from '@/services/HttpService'
import { showToast } from '@/utils/toast'
import { useAuthStore } from '@/stores/auth'
import { useCartDrawerStore } from '@/stores/cartDrawer'

const products = ref([])
const loading = ref(true)
const error = ref('')
const auth = useAuthStore()
const router = useRouter()
const cartDrawer = useCartDrawerStore()

onMounted(async () => {
  try {
    products.value = await getAllProducts()
  } catch (e) {
    error.value = 'Erro ao carregar produtos.'
    showToast(error.value, 'error')
  } finally {
    loading.value = false
  }
})

const isAuth = computed(() => !!auth.token)
const user = computed(() => auth.user?.name || '')

async function handleAddToCart(product) {
  try {
    await createCart()
    await addItems({ product_id: Number(product.id), quantity: 1, unit_price: Number(product.price) })
    showToast('Produto adicionado ao carrinho!', 'success')
    cartDrawer.openDrawer()
  } catch (e) {
    showToast('Erro ao adicionar ao carrinho.', 'error')
  }
}

function handleDetails(product) {
  router.push({ name: 'detalhe-produto', params: { id: product.id } })
}
</script>

<style scoped>
.home {
  background: var(--color-bg);
}
.cart-fab {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 4000;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 4px 24px rgba(33,186,69,0.18);
}
.cart-fab:active {
  transform: scale(0.97);
}
.fadein-enter-active {
  animation: fadeIn 0.7s cubic-bezier(.4,2,.3,1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: none; }
}
</style>
