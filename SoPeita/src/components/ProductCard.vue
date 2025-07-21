<template>
  <div class="product-card card border-0 h-100 p-2" @click="goToDetails" style="cursor:pointer;">
    <img :src="getImage(product.image_path)" :alt="product.name" class="card-img-top object-fit-cover rounded-4 mb-3" style="height: 200px;" />
    <div class="position-absolute top-0 start-0 m-3">
      <img v-if="product.escudo" :src="product.escudo" alt="Escudo" style="width:40px;height:40px;" class="bg-white rounded-circle border border-success p-1 shadow" />
      <span v-if="activeDiscount" class="badge badge-desconto position-absolute top-0 start-0 fs-6 py-2 px-3 rounded-pill shadow">-{{ Number(activeDiscount.discount_percentage).toFixed(0) }}%</span>
    </div>
    <span v-if="product.oficial" class="badge bg-success position-absolute top-0 end-0 m-3 fs-6 py-2 px-3 rounded-pill shadow">Oficial</span>
    <!-- Ícone de detalhes -->
    <button class="btn-detalhes-icon position-absolute top-0 end-0 m-3" @click.stop="goToDetails" title="Ver detalhes">
      <i class="bi bi-search fs-5 icon-preto"></i>
    </button>
    <!-- Remover bloco de exibição de tags e referências ao useTagsStore/productTags. -->
    <div class="card-body d-flex flex-column align-items-center p-0">
      <h5 class="card-title fw-bold text-center mb-2">{{ product.name }}</h5>
      <div class="precos-produto mb-3">
        <span v-if="activeDiscount" class="preco-original me-2">R$ {{ Number(product.price).toFixed(2) }}</span>
        <span class="preco-final text-success fw-semibold fs-4">
          R$ {{ precoComDesconto }}
        </span>
      </div>
      <div class="d-flex w-100 gap-2 mt-auto">
        <button v-if="showCartBtn" @click.stop="$emit('add-to-cart', product)" class="btn btn-outline-preto flex-grow-1 fw-bold rounded-pill shadow" title="Adicionar ao carrinho">
          <i class="bi bi-cart-plus fs-5 icon-preto"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps({
  product: Object,
  showCartBtn: { type: Boolean, default: false }
})
const router = useRouter()
function getImage(path) {
  if (!path) return '/default-product.png'
  if (path.startsWith('http')) return path
  return 'http://35.196.79.227:8000' + path
}
function goToDetails() {
  router.push({ name: 'detalhe-produto', params: { id: props.product.id } })
}
// Badge de desconto ativo
const activeDiscount = computed(() => {
  if (!props.product.discounts || !props.product.discounts.length) return null
  const now = new Date()
  return props.product.discounts.find(d => {
    const start = new Date(d.start_date)
    const end = new Date(d.end_date)
    return start <= now && now <= end
  })
})
const precoComDesconto = computed(() => {
  if (!activeDiscount.value) return Number(props.product.price).toFixed(2)
  const desconto = Number(activeDiscount.value.discount_percentage) || 0
  const preco = Number(props.product.price) || 0
  return (preco * (1 - desconto / 100)).toFixed(2)
})
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
.tag-badge {
  font-size: 0.78rem;
  padding: 2px 10px;
  border-radius: 8px;
  opacity: 0.85;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
  margin-bottom: 2px;
}
.btn-outline-preto {
  border: 2px solid #18181b;
  color: #18181b !important;
  background: transparent;
  transition: background 0.2s, color 0.2s;
}
.btn-outline-preto:hover, .btn-outline-preto:focus {
  background: #fff !important;
  color: #18181b !important;
  border-color: #18181b !important;
}
.icon-preto {
  color: #18181b !important;
}
.btn-detalhes-icon {
  background: #fff;
  border: 1.5px solid #18181b;
  color: #18181b;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(24,24,27,0.10);
  transition: background 0.18s, color 0.18s, border 0.18s;
  z-index: 3;
  font-size: 1.2rem;
  padding: 0;
}
.btn-detalhes-icon:hover {
  background: #fff;
  color: #18181b;
  border-color: #18181b;
}
.badge-desconto {
  background: #ff1744;
  color: #fff;
  font-weight: 700;
  font-size: 1.05rem;
  box-shadow: 0 2px 8px rgba(255,23,68,0.13);
  z-index: 4;
  left: 0;
  top: 0;
}
.precos-produto {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.7rem;
}
.preco-original {
  color: #888;
  text-decoration: line-through;
  font-size: 1.08rem;
  font-weight: 500;
}
.preco-final {
  color: #1b5e20;
  font-size: 1.25rem;
  font-weight: 700;
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