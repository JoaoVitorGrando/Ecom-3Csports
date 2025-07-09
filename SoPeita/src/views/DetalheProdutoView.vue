<template>
  <div class="product-detail container py-5">
    <div class="row g-5 align-items-center">
      <div class="col-12 col-md-6 text-center">
        <div class="img-box position-relative mx-auto">
          <img :src="product.image" :alt="product.name" class="product-image shadow-sm" />
          <img v-if="product.escudo" :src="product.escudo" alt="Escudo" class="escudo position-absolute top-0 start-0 m-3 bg-white rounded-circle border border-success p-1" />
          <span v-if="product.oficial" class="badge bg-success position-absolute top-0 end-0 m-3 fs-6 py-2 px-3 rounded-pill">Oficial</span>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <h1 class="fw-bold mb-2">{{ product.name }}</h1>
        <div class="d-flex align-items-center gap-3 mb-3">
          <span class="price display-5 fw-bold text-success">R$ {{ Number(product.price).toFixed(2) }}</span>
        </div>
        <div class="mb-4">
          <span class="text-muted">Camiseta 100% algodão, confortável e estilosa. Estampa exclusiva soPeita.</span>
        </div>
        <div class="mb-4">
          <div class="fw-semibold mb-2">Tamanho:</div>
          <div class="sizes d-flex gap-3 flex-wrap">
            <button v-for="size in sizes" :key="size" type="button" class="btn btn-outline-success btn-lg rounded-pill px-4 fw-bold size-btn" :class="{ active: selectedSize === size }" @click="selectedSize = size">{{ size }}</button>
          </div>
        </div>
        <button @click="addToCart" class="btn btn-success btn-lg w-100 fw-bold rounded-pill py-3 shadow-sm position-relative">
          <span v-if="!showMsg">Adicionar ao carrinho</span>
          <span v-else class="fadein">Adicionado! <i class="bi bi-check-circle ms-2"></i></span>
        </button>
        <div class="mt-4">
          <div class="fw-semibold mb-2">Entrega estimada:</div>
          <span class="text-success">Receba entre 2 e 5 dias úteis</span>
        </div>
        <div class="mt-4">
          <div class="fw-semibold mb-2">Avaliações:</div>
          <div class="d-flex align-items-center gap-2 mb-2">
            <i class="bi bi-star-fill text-warning"></i>
            <i class="bi bi-star-fill text-warning"></i>
            <i class="bi bi-star-fill text-warning"></i>
            <i class="bi bi-star-fill text-warning"></i>
            <i class="bi bi-star-half text-warning"></i>
            <span class="ms-2 text-muted">4.5 (128 avaliações)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { showToast } from '@/utils/toast'

const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const product = ref(null)
const sizes = ['P', 'M', 'G', 'GG']
const selectedSize = ref('M')
const showMsg = ref(false)

onMounted(async () => {
  try {
    product.value = await productsStore.fetchProduct(route.params.id)
  } catch (e) {
    showToast('Erro ao carregar produto.', 'error')
  }
})

async function addToCart() {
  try {
    await cartStore.addItem(product.value.id, 1)
    showMsg.value = true
    showToast('Produto adicionado ao carrinho!', 'success')
    setTimeout(() => showMsg.value = false, 1500)
  } catch (e) {
    showToast('Erro ao adicionar ao carrinho.', 'error')
  }
}
</script>

<style scoped>
.product-detail {
  background: var(--color-card-bg, #fff);
  border-radius: 2rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  max-width: 1100px;
  margin: 40px auto;
  padding: 48px 32px;
  animation: fadeInDetail 0.7s cubic-bezier(.4,1.6,.3,1);
}
@keyframes fadeInDetail {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: none; }
}
.img-box {
  position: relative;
  display: inline-block;
  border-radius: 1.5rem;
  overflow: hidden;
  background: #f7f7f7;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  padding: 0;
  width: 360px;
  height: 360px;
  transition: box-shadow 0.3s;
}
.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1.5rem;
  transition: transform 0.4s cubic-bezier(.4,1.6,.3,1);
}
.img-box:hover .product-image {
  transform: scale(1.045) rotate(-1deg);
}
.escudo {
  width: 54px;
  height: 54px;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.badge {
  font-size: 1rem;
  letter-spacing: 1px;
  z-index: 2;
  box-shadow: none;
}
.price {
  font-size: 2.3rem;
  font-weight: 800;
  letter-spacing: 1px;
}
.sizes .size-btn {
  min-width: 56px;
  font-size: 1.15rem;
  border-width: 2px;
  transition: background 0.3s, color 0.3s, border 0.3s, transform 0.3s;
}
.sizes .size-btn.active, .sizes .size-btn:focus {
  background: #21ba45;
  color: #fff;
  border-color: #21ba45;
  transform: scale(1.08);
}
.fadein {
  animation: fadeInMsg 0.7s cubic-bezier(.4,1.6,.3,1);
}
@keyframes fadeInMsg {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: none; }
}
@media (max-width: 900px) {
  .img-box { width: 100%; height: 260px; }
  .product-image { height: 260px; }
}
@media (max-width: 700px) {
  .product-detail {
    padding: 18px 4px;
    border-radius: 1.2rem;
  }
  .img-box { height: 180px; }
  .product-image { height: 180px; }
}
</style> 