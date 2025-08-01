<template>
    <div class="cart-bg py-5">
      <div class="cart-container container">
        <h2 class="cart-title text-center mb-4">Seu Carrinho</h2>
        <div v-if="loading" class="text-center my-5">
          <div class="spinner-border text-amarelo" role="status"></div>
        </div>
        <div v-else>
          <div v-if="items.length === 0" class="cart-empty text-center py-5">
            <i class="bi bi-cart-x display-3 mb-3 text-amarelo"></i>
            <p class="fs-4 mb-3">Seu carrinho está vazio</p>
            <router-link to="/produtos" class="btn btn-login px-4 py-2">Ver produtos</router-link>
          </div>
          <div v-else class="row g-4 justify-content-center">
            <!-- Lista de produtos -->
            <div class="col-12 col-lg-8">
              <div class="cart-products-list bg-white rounded-4 shadow-sm p-3 p-md-4 mb-4">
                <div v-for="item in items" :key="item.id" class="cart-product d-flex align-items-center gap-3 py-3 border-bottom">
                  <img :src="item.product?.image_path ? 'http://35.196.79.227:8000' + item.product.image_path : '/default-product.png'" class="cart-img rounded-3" alt="img" />
                  <div class="flex-grow-1">
                    <div class="fw-bold fs-5 mb-1 text-preto">{{ item.product?.name }}</div>
                    <div class="text-muted small mb-1">R$ {{ Number(item.product?.price).toFixed(2) }}</div>
                    <div class="d-flex align-items-center gap-2 mt-2">
                      <span class="text-muted">Qtd:</span>
                      <button class="btn btn-outline-secondary btn-sm px-2 py-0" @click="alterarQtd(item, item.quantity-1)" :disabled="item.quantity<=1">-</button>
                      <span class="fw-bold px-2">{{ item.quantity }}</span>
                      <button class="btn btn-outline-secondary btn-sm px-2 py-0" @click="alterarQtd(item, item.quantity+1)">+</button>
                    </div>
                  </div>
                  <div class="fw-bold fs-5 text-preto">R$ {{ Number(item.product?.price * item.quantity).toFixed(2) }}</div>
                  <button class="btn btn-outline-danger btn-sm ms-2" @click="removerItem(item)"><i class="bi bi-trash"></i></button>
                </div>
              </div>
            </div>
            <!-- Resumo do pedido -->
            <div class="col-12 col-lg-4">
              <div class="cart-summary bg-white rounded-4 shadow-sm p-4 sticky-top">
                <h4 class="fw-bold mb-3 text-preto">Resumo do Pedido</h4>
                <div class="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span class="fw-bold">R$ {{ subtotal }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Frete</span>
                  <span class="fw-bold text-amarelo">{{ frete > 0 ? 'R$ '+frete : 'Grátis' }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2 align-items-center">
                  <span>Cupom</span>
                  <input v-model="cupom" class="form-control form-control-sm w-50 d-inline-block ms-2" placeholder="Código" @keyup.enter="aplicarCupom" />
                </div>
                <div v-if="cupomMsg" class="small text-success mb-2">{{ cupomMsg }}</div>
                <hr />
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="fs-5 fw-bold">Total</span>
                  <span class="fs-4 fw-bold text-amarelo">R$ {{ total }}</span>
                </div>
                <button class="btn btn-login w-100 py-3 fs-5 mb-2" @click="irParaCheckout">
                  <i class="bi bi-lock-fill me-2"></i>Finalizar compra
                </button>
                <div class="text-center small text-muted">Compra 100% segura <i class="bi bi-shield-lock ms-1"></i></div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="erro" class="alert alert-danger mt-3">{{ erro }}</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, computed, ref } from 'vue'
  import { useCartStore } from '@/stores/cart'
  import { showToast } from '@/utils/toast'
  import { useAuthStore } from '@/stores/auth'
  import { useRouter } from 'vue-router'
  
  const cartStore = useCartStore()
  const auth = useAuthStore()
  const router = useRouter()
  
  const items = computed(() => cartStore.items)
  const loading = computed(() => cartStore.loading)
  const erro = computed(() => cartStore.error)
  
  const cupom = ref('')
  const cupomMsg = ref('')
  const desconto = ref(0)
  
  const subtotal = computed(() => items.value.reduce((sum, item) => sum + (Number(item.product?.price) || 0) * item.quantity, 0).toFixed(2))
  const frete = computed(() => subtotal.value > 200 ? 0 : 19.9)
  const total = computed(() => (subtotal.value - desconto.value + Number(frete.value)).toFixed(2))
  
  onMounted(async () => {
    if (!auth.token) {
      showToast('Faça login para acessar o carrinho.', 'error')
      return
    }
    await cartStore.fetchItems()
  })
  
  async function removerItem(item) {
    try {
      await cartStore.removeItem(item.product_id || item.id)
      await cartStore.fetchItems()
      showToast('Item removido do carrinho!', 'success')
    } catch (e) {
      showToast('Erro ao remover item: ' + (e?.detail || e?.message || 'Erro interno'), 'error')
    }
  }
  
  async function limparCarrinho() {
    try {
      await cartStore.clearItems()
      await cartStore.fetchItems()
      showToast('Carrinho limpo!', 'success')
    } catch (e) {
      showToast('Erro ao limpar carrinho: ' + (e?.detail || e?.message || 'Erro interno'), 'error')
    }
  }
  
  function irParaCheckout() {
    router.push('/checkout')
  }
  
  function alterarQtd(item, novaQtd) {
    if (novaQtd < 1) return
    cartStore.updateItem(item.product_id || item.id, novaQtd)
    cartStore.fetchItems()
  }
  
  function aplicarCupom() {
    if (cupom.value.trim().toLowerCase() === 'desconto10') {
      desconto.value = subtotal.value * 0.1
      cupomMsg.value = 'Cupom aplicado: -10%'
    } else {
      desconto.value = 0
      cupomMsg.value = 'Cupom inválido.'
    }
  }
  </script>
  
  <style scoped>
  .cart-bg {
    background: #18181b;
    min-height: 100vh;
    padding-bottom: 40px;
  }
  .cart-title {
    font-size: 2.2rem;
    font-weight: 800;
    color: #FFD600;
    letter-spacing: 1px;
  }
  .cart-products-list {
    background: #fff;
    border-radius: 1.5rem;
    box-shadow: 0 2px 16px rgba(0,0,0,0.10);
  }
  .cart-product {
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 1.2rem;
    margin-bottom: 0.5rem;
    transition: background 0.2s;
  }
  .cart-product:last-child {
    border-bottom: none;
  }
  .cart-img {
    width: 90px;
    height: 90px;
    object-fit: contain;
    background: #f5f5f5;
    border-radius: 1rem;
    border: 1.5px solid #FFD600;
  }
  .cart-summary {
    background: #fff;
    border-radius: 1.5rem;
    box-shadow: 0 2px 16px rgba(0,0,0,0.10);
    position: sticky;
    top: 32px;
    border: 1.5px solid #FFD600;
  }
  .btn-login {
    background: #FFD600;
    color: #18181b;
    font-weight: 800;
    border: none;
    border-radius: 1.5rem;
    padding: 1.1rem 0;
    width: 100%;
    font-size: 1.18rem;
    box-shadow: 0 2px 12px rgba(255,214,0,0.10);
    transition: background 0.2s, color 0.2s;
    letter-spacing: 0.5px;
  }
  .btn-login:hover, .btn-login:focus {
    background: #18181b;
    color: #FFD600;
    border: 2px solid #FFD600;
  }
  .text-amarelo {
    color: #FFD600 !important;
  }
  .text-preto {
    color: #18181b !important;
  }
  .cart-empty {
    min-height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
  }
  .cart-empty .btn-login {
    max-width: 220px;
    margin-top: 1.5rem;
  }
  .cart-summary h4 {
    color: #18181b;
    font-weight: 700;
  }
  .cart-summary .fs-4 {
    color: #FFD600;
    font-weight: 900;
  }
  .cart-summary input.form-control {
    border-radius: 1.2rem;
    border: 1.5px solid #FFD600;
    background: #f8fafc;
    color: #18181b;
    font-weight: 600;
  }
  .cart-summary input.form-control:focus {
    border-color: #18181b;
    background: #fffbe6;
  }
  .cart-summary .small {
    color: #18181b;
  }
  .cart-product .btn-outline-secondary {
    border-color: #FFD600;
    color: #18181b;
    font-weight: 700;
    background: #fff;
  }
  .cart-product .btn-outline-secondary:hover {
    background: #FFD600;
    color: #18181b;
    border-color: #FFD600;
  }
  .cart-product .btn-outline-danger {
    border-color: #FFD600;
    color: #FFD600;
    background: #fff;
  }
  .cart-product .btn-outline-danger:hover {
    background: #FFD600;
    color: #18181b;
    border-color: #FFD600;
  }
  @media (max-width: 991px) {
    .cart-summary {
      position: static;
      margin-top: 2rem;
    }
  }
  @media (max-width: 767px) {
    .cart-products-list, .cart-summary {
      padding: 1.2rem;
    }
    .cart-img {
      width: 56px;
      height: 56px;
    }
    .cart-title {
      font-size: 1.4rem;
    }
  }
  </style> 