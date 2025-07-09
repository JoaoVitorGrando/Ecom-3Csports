<template>
  <transition name="cart-drawer">
    <div v-if="open" class="cart-drawer-overlay" @click.self="close">
      <aside class="cart-drawer" @click.stop>
        <div class="cart-header d-flex align-items-center justify-content-between mb-4">
          <h2 class="fw-bold fs-4 mb-0">Seu Carrinho</h2>
          <button class="btn-close" @click="close" aria-label="Fechar"></button>
        </div>
        <div v-if="cart.length === 0" class="text-center text-muted py-5">
          <i class="bi bi-cart-x display-3 mb-3"></i>
          <p class="mb-0">Seu carrinho está vazio.</p>
        </div>
        <div v-else class="cart-list flex-grow-1 mb-4">
          <div v-for="item in cart" :key="item.id + '-' + item.size" class="cart-item d-flex align-items-center mb-4">
            <img :src="item.image" :alt="item.name" class="cart-img me-3" />
            <div class="flex-grow-1">
              <div class="fw-bold">{{ item.name }}</div>
              <div class="small text-muted">Tamanho: {{ item.size || 'M' }}</div>
              <div class="fw-semibold mt-1">R$ {{ item.price.toFixed(2) }}</div>
            </div>
            <button class="btn btn-link text-danger ms-2 p-0" @click="removeFromCart(item.id)">
              <i class="bi bi-trash fs-5"></i>
            </button>
          </div>
        </div>
        <div class="cart-summary bg-body-tertiary rounded-4 p-4 shadow-sm">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="fw-bold">Total</span>
            <span class="fs-5 fw-bold">R$ {{ total.toFixed(2) }}</span>
          </div>
          <router-link to="/checkout" class="btn btn-success w-100 py-3 fw-bold rounded-pill" @click="close">Finalizar Compra</router-link>
        </div>
      </aside>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getCart } from '../services/cartService'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])

const cart = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    cart.value = await getCart()
  } catch (e) {
    error.value = 'Erro ao carregar carrinho.'
  } finally {
    loading.value = false
  }
})

const total = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.produto?.preco || 0) * item.quantidade, 0)
})

function removeFromCart(id) {
  // Aqui você pode implementar a remoção via API se desejar
  cart.value = cart.value.filter(item => item.id !== id)
}

function close() { emit('close') }
</script>

<style scoped>
.cart-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(30,30,30,0.55);
  z-index: 3000;
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
  transition: background 0.45s cubic-bezier(.4,2,.3,1);
}
.cart-drawer {
  background: var(--color-bg, #fff);
  width: 100%;
  max-width: 410px;
  height: 100vh;
  box-shadow: -8px 0 32px rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  padding: 32px 24px 24px 24px;
  position: relative;
  animation: slideInCart 0.55s cubic-bezier(.4,1.6,.3,1);
}
@keyframes slideInCart {
  from { transform: translateX(100%); opacity: 0.5; }
  to { transform: none; opacity: 1; }
}
.cart-drawer-enter-active, .cart-drawer-leave-active {
  transition: opacity 0.45s cubic-bezier(.4,1.6,.3,1);
}
.cart-drawer-enter-from, .cart-drawer-leave-to {
  opacity: 0;
}
.cart-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
}
.cart-list {
  overflow-y: auto;
  max-height: 48vh;
}
.cart-item {
  background: none;
  border-radius: 1.2rem;
  box-shadow: none;
  padding: 0;
  transition: background 0.2s;
}
.cart-img {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 1rem;
  background: #f5f5f5;
}
.cart-summary {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  margin-top: auto;
  box-shadow: 0 -2px 16px rgba(0,0,0,0.04);
}
.btn-close {
  background: none;
  border: none;
  font-size: 1.6rem;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
}
.btn-close:hover {
  color: #e63946;
}
@media (max-width: 600px) {
  .cart-drawer {
    max-width: 100vw;
    padding: 18px 6px 12px 6px;
  }
  .cart-summary {
    padding: 18px 8px;
  }
}
</style> 