<template>
  <div class="product-card" @click="goToDetails">
    <div class="product-image-container">
      <img :src="getImage(product.image_path)" :alt="product.name" class="product-image" />
      
      <div class="product-badges">
        <img v-if="product.escudo" :src="product.escudo" alt="Escudo" class="team-badge" />
        <span v-if="activeDiscount" class="discount-badge">-{{ Number(activeDiscount.discount_percentage).toFixed(0) }}%</span>
      </div>
      
      <span v-if="product.oficial" class="official-badge">Oficial</span>
      
      <button class="details-btn" @click.stop="goToDetails" title="Ver detalhes">
        <i class="bi bi-search"></i>
      </button>
    </div>
    
    <div class="product-content">
      <h5 class="product-title">{{ product.name }}</h5>
      
      <div class="price-container">
        <span v-if="activeDiscount" class="original-price">R$ {{ Number(product.price).toFixed(2) }}</span>
        <span class="final-price">R$ {{ precoComDesconto }}</span>
      </div>
      
      <div class="action-buttons">
        <button v-if="showCartBtn" @click.stop="$emit('add-to-cart', product)" class="add-cart-btn" title="Adicionar ao carrinho">
          <i class="bi bi-cart-plus"></i>
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
  cursor: pointer;
  padding: 8px;
}

.product-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 2;
}

.team-badge {
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 50%;
  border: 1px solid #28a745;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.discount-badge {
  background: #ff1744;
  color: #fff;
  font-weight: 700;
  font-size: 1.05rem;
  padding: 8px 12px;
  border-radius: 50px;
  box-shadow: 0 2px 8px rgba(255,23,68,0.13);
  z-index: 4;
}


.details-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #fff;
  border: 1.5px solid #18181b;
  color: #18181b;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(179, 179, 179, 0.1);
  transition: background 0.18s, color 0.18s, border 0.18s;
  z-index: 3;
  font-size: 1.2rem;
  padding: 0;
  cursor: pointer;
}


.product-title {
  font-size: 1.18rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
  min-height: 48px;
  color: #18181b;
  line-height: 1.3;
}

.price-container {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
  justify-content: center;
}

.original-price {
  color: #888;
  text-decoration: line-through;
  font-size: 1.08rem;
  font-weight: 500;
}

.final-price {
  color: #1b5e20;
  font-size: 1.25rem;
  font-weight: 700;
}

.action-buttons {
  margin-top: auto;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.add-cart-btn {
  border: 2px solid #18181b;
  color: #18181b;
  background: transparent;
  border-radius: 50px;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 44px;
  min-width: 160px;
  max-width: 160px;
}

.add-cart-btn:hover, .add-cart-btn:focus {
  background: #18181b;
  color: #fff;
  border-color: #18181b;
}

.add-cart-btn i {
  font-size: 1.2rem;
  margin-right: 6px;
}

@media (max-width: 700px) {
  .product-card {
    min-width: 100%;
    max-width: 100%;
    min-height: 320px;
    max-height: 370px;
    padding: 6px;
  }
  
  .product-image-container {
    height: 120px;
    margin-bottom: 8px;
  }
  
  .product-title {
    font-size: 1rem;
    min-height: 36px;
  }
  
  .add-cart-btn {
    font-size: 0.9rem;
    padding: 10px 16px;
    width: 140px;
    height: 40px;
    min-width: 140px;
    max-width: 140px;
  }
  
  .add-cart-btn i {
    font-size: 1.1rem;
    margin-right: 4px;
  }
  
  .official-badge {
    font-size: 0.9rem;
    padding: 6px 10px;
  }
  
  .discount-badge {
    font-size: 0.95rem;
    padding: 6px 10px;
  }
}
</style> 