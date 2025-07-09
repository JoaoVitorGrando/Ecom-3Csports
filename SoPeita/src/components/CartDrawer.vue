<template>
  <transition name="cart-drawer">
    <div v-if="cartDrawer.isOpen" class="cart-drawer-overlay" @click.self="close">
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
            <img :src="getImage(item.image_path || item.image)" :alt="item.name" class="cart-img me-3" />
            <div class="flex-grow-1">
              <div class="fw-bold">{{ item.name }}</div>
              <div class="small text-muted">Tamanho: {{ item.size || 'M' }}</div>
              <div class="fw-semibold mt-1">
                R$ {{ (typeof item.unit_price === 'number' ? item.unit_price : Number(item.unit_price) || 0).toFixed(2) }}
              </div>
            </div>
            <button class="btn-remove" @click="removeFromCart(item.product_id)" title="Remover do carrinho">
              <i class="bi bi-trash fs-5"></i>
            </button>
          </div>
        </div>
        <div class="cart-summary bg-body-tertiary rounded-4 p-4 shadow-sm">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="fw-bold">Total</span>
            <span class="fs-5 fw-bold">R$ {{ (typeof total === 'number' ? total : Number(total) || 0).toFixed(2) }}</span>
          </div>
          <router-link to="/checkout" class="btn btn-success w-100 py-3 fw-bold rounded-pill" @click="close">Finalizar Compra</router-link>
        </div>
      </aside>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getCartItems, deleteInCart } from '@/services/HttpService'
import { showToast } from '@/utils/toast'
import { useAuthStore } from '@/stores/auth'
import { useCartDrawerStore } from '@/stores/cartDrawer'
import { useCartStore } from '@/stores/cart'

const cartDrawer = useCartDrawerStore()
const cartStore = useCartStore()

const cart = computed(() => cartStore.items)
const loading = computed(() => cartStore.loading)
const error = computed(() => cartStore.error)

const auth = useAuthStore()

onMounted(async () => {
  if (!auth.token) {
    showToast('Faça login para acessar o carrinho.', 'error')
    return
  }
  await cartStore.fetchItems()
})

cartDrawer.$onAction(({ name, after }) => {
  if (name === 'openDrawer') {
    cartStore.fetchItems()
  }
})

const total = computed(() => {
  return cart.value.reduce((sum, item) => (Number(item.unit_price) || 0) * (item.quantity || 1) + sum, 0)
})

function getImage(path) {
  if (!path) return '/default-product.png'
  if (path.startsWith('http')) return path
  return 'http://35.196.79.227:8000' + path
}

async function removeFromCart(product_id) {
  try {
    await cartStore.removeItem(product_id)
    await cartStore.fetchItems()
    showToast('Item removido do carrinho!', 'success')
  } catch (e) {
    showToast('Erro ao remover item: ' + (e?.detail || e?.message || 'Erro interno'), 'error')
  }
}

function close() { cartDrawer.closeDrawer() }
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
  margin-bottom: 18px;
}
.cart-list {
  overflow-y: auto;
  max-height: 48vh;
  margin-bottom: 2rem;
}
.cart-item {
  background: #f8f9fa;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(33,186,69,0.07);
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
  transition: background 0.2s, box-shadow 0.2s;
  border: 1.5px solid #e9ecef;
}
.cart-item:hover {
  background: #f1fff4;
  box-shadow: 0 4px 18px rgba(33,186,69,0.13);
  border-color: #21ba45;
}
.cart-img {
  width: 76px;
  height: 76px;
  object-fit: cover;
  border-radius: 1rem;
  background: #f5f5f5;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  margin-right: 1.1rem;
}
.cart-item .fw-bold {
  font-size: 1.08rem;
  color: #222;
}
.cart-item .small.text-muted {
  font-size: 0.98rem;
}
.cart-item .fw-semibold {
  font-size: 1.13rem;
  color: #21ba45;
  margin-top: 0.2rem;
}
.btn-remove {
  background: #fff;
  border: 1.5px solid #e63946;
  color: #e63946;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-left: 0.7rem;
  transition: background 0.18s, color 0.18s, border 0.18s;
}
.btn-remove:hover {
  background: #e63946;
  color: #fff;
  border-color: #e63946;
}
.cart-summary {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  margin-top: auto;
  box-shadow: 0 -2px 16px rgba(0,0,0,0.04);
  background: #f6fff9;
  border-radius: 1.2rem;
  padding: 2rem 1.2rem 1.2rem 1.2rem;
}
.cart-summary .fw-bold {
  font-size: 1.18rem;
}
.cart-summary .fs-5 {
  color: #21ba45;
  font-size: 1.45rem;
}
.btn-success.w-100 {
  font-size: 1.13rem;
  padding: 1.1rem 0;
  border-radius: 2rem;
  margin-top: 1.2rem;
  font-weight: 700;
  box-shadow: 0 2px 12px rgba(33,186,69,0.09);
}
.text-center.text-muted.py-5 {
  padding: 3.5rem 0 !important;
  color: #b0b0b0 !important;
}
@media (max-width: 600px) {
  .cart-drawer {
    max-width: 100vw;
    padding: 18px 6px 12px 6px;
  }
  .cart-summary {
    padding: 18px 8px;
  }
  .cart-item {
    padding: 0.6rem 0.5rem;
    margin-bottom: 0.7rem;
  }
  .cart-img {
    width: 54px;
    height: 54px;
    margin-right: 0.6rem;
  }
}
</style> 