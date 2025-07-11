<template>
  <div class="product-card card border-0 h-100 p-2">
    <img :src="getImage(product.image_path)" :alt="product.name" class="card-img-top object-fit-cover rounded-4 mb-3" style="height: 200px;" />
    <div class="position-absolute top-0 start-0 m-3">
      <img v-if="product.escudo" :src="product.escudo" alt="Escudo" style="width:40px;height:40px;" class="bg-white rounded-circle border border-success p-1 shadow" />
    </div>
    <span v-if="product.oficial" class="badge bg-success position-absolute top-0 end-0 m-3 fs-6 py-2 px-3 rounded-pill shadow">Oficial</span>
    <div class="card-body d-flex flex-column align-items-center p-0">
      <h5 class="card-title fw-bold text-center mb-2">{{ product.name }}</h5>
      <p class="card-text text-success fw-semibold mb-3 fs-4">R$ {{ Number(product.price).toFixed(2) }}</p>
      <div class="d-flex w-100 gap-2 mt-auto">
        <button v-if="showCartBtn" @click="$emit('add-to-cart', product)" class="btn btn-outline-success flex-grow-1 fw-bold rounded-pill shadow" title="Adicionar ao carrinho">
          <i class="bi bi-cart-plus fs-5"></i>
        </button>
        <button v-if="showCartBtn" @click="$emit('details', product)" class="btn btn-outline-secondary flex-grow-1 fw-bold rounded-pill shadow" title="Ver detalhes">
          <i class="bi bi-search fs-5"></i>
        </button>
        <button v-if="!showCartBtn" class="btn btn-success w-100 fw-bold rounded-pill shadow">Comprar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: Object,
  showCartBtn: { type: Boolean, default: false }
})
function getImage(path) {
  if (!path) return '/default-product.png'
  if (path.startsWith('http')) return path
  return 'http://35.196.79.227:8000' + path
}
</script>

<style scoped>
.product-card {
  background: var(--color-bg-card);
  box-shadow: var(--color-shadow);
  border-radius: 16px;
  transition: all 0.3s ease;
  min-width: 240px;
  max-width: 320px;
  min-height: 410px;
  max-height: 440px;
  margin: 0 auto 1.5rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.product-card:hover {
  border: 2px solid var(--color-primary);
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--color-shadow-hover);
}
.card-img-top.object-fit-cover {
  object-fit: cover;
  width: 100%;
  height: 200px !important;
  border-radius: 16px 16px 0 0;
  transition: transform 0.3s ease;
}

.product-card:hover .card-img-top.object-fit-cover {
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
}
.card-text {
  font-size: 1.08rem;
  margin-bottom: 0.7rem;
}
.d-flex.w-100.gap-2.mt-auto {
  margin-top: auto !important;
  width: 100%;
  gap: 0.7rem !important;
  display: flex;
  justify-content: center;
}
.btn {
  font-size: 1rem;
  padding: 0.7rem 1.1rem;
  border-radius: 2rem;
}
@media (max-width: 700px) {
  .product-card {
    min-width: 100%;
    max-width: 100%;
    min-height: 320px;
    max-height: 370px;
    padding: 0.7rem;
  }
  .card-img-top.object-fit-cover {
    height: 120px !important;
  }
  .card-title {
    font-size: 1rem;
    min-height: 36px;
  }
  .btn {
    font-size: 0.95rem;
    padding: 0.5rem 0.75rem;
  }
}
</style> 