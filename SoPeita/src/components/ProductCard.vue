<template>
  <div class="product-card card border-0 h-100 p-2">
    <img :src="product.image" :alt="product.name" class="card-img-top object-fit-cover rounded-4 mb-3" style="height: 200px;" />
    <div class="position-absolute top-0 start-0 m-3">
      <img v-if="product.escudo" :src="product.escudo" alt="Escudo" style="width:40px;height:40px;" class="bg-white rounded-circle border border-success p-1 shadow" />
    </div>
    <span v-if="product.oficial" class="badge bg-success position-absolute top-0 end-0 m-3 fs-6 py-2 px-3 rounded-pill shadow">Oficial</span>
    <div class="card-body d-flex flex-column align-items-center p-0">
      <h5 class="card-title fw-bold text-center mb-2">{{ product.name }}</h5>
      <p class="card-text text-success fw-semibold mb-3 fs-4">R$ {{ product.price.toFixed(2) }}</p>
      <button @click="$emit('add-to-cart', product)" class="btn btn-success w-100 mt-auto fw-bold rounded-pill shadow">Comprar</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: Object
})
</script>

<style scoped>
.product-card {
  background: var(--color-card-bg, #fff);
  box-shadow: none !important;
  border-radius: 1.2rem;
  transition: transform 0.18s cubic-bezier(.4,2,.3,1), background 0.3s;
  min-width: 220px;
  max-width: 100%;
  margin-bottom: 1.5rem;
}
.product-card:hover {
  border: 2px solid #21ba45;
  transform: translateY(-6px) scale(1.03);
}
.object-fit-cover {
  object-fit: cover;
}
@media (max-width: 700px) {
  .product-card {
    min-width: 120px;
    font-size: 0.95rem;
    padding: 0.7rem;
  }
  .object-fit-cover {
    height: 110px !important;
  }
  .card-title {
    font-size: 1rem;
  }
  .btn {
    font-size: 0.95rem;
    padding: 0.5rem 0.75rem;
  }
}
</style> 