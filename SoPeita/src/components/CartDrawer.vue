<template>
  <transition name="cart-drawer">
    <div v-if="cartDrawer.isOpen" class="cart-drawer-overlay" @click.self="close">
      <aside class="cart-drawer" @click.stop>
        <div class="cart-header d-flex align-items-center justify-content-between mb-4">
          <h2 class="fw-bold fs-4 mb-0">Seu Carrinho</h2>
          <button class="btn-close-lg custom-x-close" @click="close" aria-label="Fechar">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#e63946" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div v-if="cart.length === 0" class="text-center text-muted py-5">
          <i class="bi bi-cart-x display-3 mb-3"></i>
          <p class="mb-0">Seu carrinho está vazio.</p>
        </div>
        <div v-else class="cart-list flex-grow-1 mb-4">
          <div v-for="item in cart" :key="item.id + '-' + item.size" class="cart-item d-flex align-items-center mb-4">
            <img :src="getImage(item.image_path || item.image)" :alt="item.name" class="cart-img me-3" />
            <div class="flex-grow-1">
              <div class="fw-bold cart-item-title">{{ item.name }}</div>
              <div class="small text-muted">Tamanho: {{ item.size || 'M' }}</div>
              <div class="fw-semibold mt-1 cart-item-price">
                R$ {{ (typeof item.unit_price === 'number' ? item.unit_price : Number(item.unit_price) || 0).toFixed(2) }}
              </div>
            </div>
            <button class="btn-remove" @click="removeFromCart(item.product_id)" title="Remover do carrinho">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e63946" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </div>
        </div>
        <div class="cart-summary bg-body-tertiary rounded-4 p-4 shadow-sm">
          <div class="cart-total-center mb-3">
            <span class="fw-bold">Total:</span>
            <span class="fs-4 fw-bold text-success" style="margin-left: 0.5rem;">R$ {{ (typeof total === 'number' ? total : Number(total) || 0).toFixed(2) }}</span>
          </div>
          <router-link to="/checkout" class="btn btn-success btn-lg w-100 py-3 fw-bold rounded-pill cart-checkout-btn" @click="close">
            Finalizar Compra
          </router-link>
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
  background: transparent;
  z-index: 3000;
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
  transition: all 0.3s ease;
}

.cart-drawer {
  background-color: #c2c2c2;
  width: 100%;
  max-width: 420px;
  height: 100vh;
  box-shadow: 0 0 32px 0 rgba(0,0,0,0.13);
  display: flex;
  flex-direction: column;
  padding: 32px 24px 24px 24px;
  position: relative;
  animation: slideInCart 0.4s ease-out;
  border-left: 1px solid #e3e3e3;
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
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;
  margin-bottom: 18px;
  justify-content: center !important;
  text-align: center;
}

.cart-header h2 {
  color: #fff;
  flex: 1;
  text-align: center;
  margin: 0;
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: 0.01em;
  z-index: 2;
}

.cart-header .btn-close-lg {
  position: absolute;
  right: 12px;
  top: 18px;
  z-index: 3;
  font-size: 1.2rem;
  color: #e63946 !important;
  opacity: 1;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.custom-x-close svg {
  display: block;
  stroke: #e63946;
  background: transparent;
}
.custom-x-close:hover svg {
  stroke: #b3001b;
}
.cart-list {
  overflow-y: auto;
  max-height: 48vh;
  margin-bottom: 2rem;
}
.cart-item {
  background: #fafbfc;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 18px 12px;
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  border: 1px solid #f0f0f0;
  transition: box-shadow 0.2s, border 0.2s;
}
.cart-item:hover {
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.08);
  border-color: #2ecc40;
}
.cart-img {
  width: 88px;
  height: 88px;
  object-fit: cover;
  border-radius: 12px;
  background: #f5f5f5;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  margin-right: 1.1rem;
  border: 1.5px solid #e3e3e3;
}
.cart-item-title {
  font-size: 1.13rem;
  color: #222;
  margin-bottom: 2px;
}
.cart-item-price {
  font-size: 1.18rem;
  color: #000000;
  margin-top: 0.2rem;
}
.btn-remove {
  background: transparent;
  border: none;
  color: #e63946;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-left: 0.2rem;
  padding: 0;
  transition: color 0.18s;
}
.btn-remove:hover {
  background: transparent;
  color: #b3001b;
}
.cart-summary {
  position: sticky;
  bottom: 0;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  padding: 28px 18px 18px 18px;
  margin-top: 1.5rem;
  text-align: center;
}
.cart-checkout-btn {
  background: #FFD600;
  border: none;
  color: #222;
  font-size: 1.18rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 8px rgba(255,214,0,0.10);
  transition: background 0.18s, box-shadow 0.18s;
}
.cart-checkout-btn:hover {
  background: #FFEA00;
  color: #111;
  box-shadow: 0 4px 16px rgba(255,214,0,0.18);
}
.btn-close-lg {
  font-size: 1.7rem;
  color: #222;
  opacity: 0.7;
  transition: opacity 0.18s;
}
.btn-close-lg:hover {
  opacity: 1;
}
.cart-total-center {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
}
</style> 