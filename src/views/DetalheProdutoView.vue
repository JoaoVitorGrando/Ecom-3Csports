<template>
  <div class="product-detail-container">
    <div class="product-detail-content">
      <div class="product-image-section">
        <div class="image-container">
          <img :src="getImage(product.image_path)" :alt="product.name" class="product-image" />
          <img v-if="product.escudo" :src="product.escudo" alt="Escudo" class="team-badge" />
          <span v-if="product.oficial" class="official-badge">Oficial</span>
        </div>
        
        <div v-if="relatedProducts.length" class="related-products">
          <div class="related-title">
            Itens semelhantes para você
          </div>
          <div class="related-carousel">
            <button class="carousel-arrow left" @click="prevRelated" :disabled="relatedIndex === 0" aria-label="Anterior">
              <i class="bi bi-arrow-left-circle"></i>
            </button>
            <div class="related-card-wrapper">
              <ProductCard :product="relatedProducts[relatedIndex]" :showCartBtn="true" @add-to-cart="addRelatedToCart" />
            </div>
            <button class="carousel-arrow right" @click="nextRelated" :disabled="relatedIndex === relatedProducts.length - 1" aria-label="Próximo">
              <i class="bi bi-arrow-right-circle"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div class="product-info-section">
        <div class="info-container">
          <h1 class="product-name">{{ product.name }}</h1>
          
          <div class="price-section">
            <span class="old-price" v-if="precoAntigo">De <span>R$ {{ Number(precoAntigo).toFixed(2) }}</span></span>
            <span class="installment-price">12x de <b class="installment-value">R$ {{ parcela12x }}</b> <span class="no-interest">sem juros</span></span>
            <span class="cash-price">ou <b>R$ {{ Number(product.price).toFixed(2) }}</b> à vista</span>
          </div>
          
          <div class="divider"></div>
          
          <div class="size-section">
            <div class="size-label">Tamanho:</div>
            <div class="size-buttons">
              <button v-for="size in sizes" :key="size" type="button" class="size-btn" :class="{ active: selectedSize === size }" @click="selectedSize = size">{{ size }}</button>
            </div>
          </div>
          
          <button @click="addToCart" class="add-cart-btn">
            <span v-if="!showMsg"><i class="bi bi-cart-plus"></i>Adicionar ao carrinho</span>
            <span v-else class="success-message">Adicionado! <i class="bi bi-check-circle"></i></span>
          </button>
          
          <div class="guarantee-info">
            <i class="bi bi-shield-lock"></i> <b>Compra 100% Segura</b> &mdash; Satisfação garantida ou seu dinheiro de volta!
          </div>
          
          <div class="payment-info">
            <span class="payment-label">Aceitamos:</span>
            <i class="bi bi-credit-card"></i>
            <i class="bi bi-cash-coin"></i>
            <i class="bi bi-bank"></i>
            <span class="pix-badge">PIX</span>
            <span class="boleto-badge">Boleto</span>
          </div>
          
          <div class="delivery-info">
            <i class="bi bi-truck"></i> <span>Envio rápido para todo o Brasil</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/utils/toast'
import ProductCard from '@/components/ProductCard.vue'

// Helper para montar URL da imagem vinda da API
function getImage(path) {
  if (!path) return '/default-product.png'
  if (path.startsWith('http')) return path
  return 'http://35.196.79.227:8000' + path
}

const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const auth = useAuthStore()

const product = ref({})
const sizes = ['P', 'M', 'G', 'GG', '2XL']
const selectedSize = ref('M')
const showMsg = ref(false)
const relatedIndex = ref(0)

// Produtos relacionados por categoria (exclui o próprio produto)
const relatedProducts = computed(() => {
  if (!product.value?.category?.name) return []
  return productsStore.products
    .filter(p => p.id !== product.value.id && p.category?.name === product.value.category?.name)
    .slice(0, 4)
})

// Ao montar, busca o produto atual e carrega lista para relacionados, se necessário
onMounted(async () => {
  try {
    product.value = await productsStore.fetchProduct(route.params.id)
    if (!productsStore.products.length) {
      await productsStore.fetchProducts()
    }
  } catch (e) {
    showToast('Erro ao carregar produto.', 'error')
  }
})

// Preço “de” (só para efeito visual), calculado como 38% acima do atual
const precoAntigo = computed(() => {
  if (!product.value.price) return null
  return (Number(product.value.price) * 1.38).toFixed(2)
})

// Valor da parcela em 12x sem juros (exibição)
const parcela12x = computed(() => {
  if (!product.value.price) return '0,00'
  return (Number(product.value.price) / 12).toFixed(2)
})

// Adiciona o produto ao carrinho (requer autenticação)
async function addToCart() {
  if (!auth.token) {
    showToast('Faça login para adicionar produtos ao carrinho.', 'warning')
    window.location.href = '/login'
    return
  }
  try {
    await cartStore.addItem(product.value, 1, selectedSize.value)
    showMsg.value = true
    showToast('Produto adicionado ao carrinho!', 'success')
    setTimeout(() => showMsg.value = false, 1500)
  } catch (e) {
    showToast('Erro ao adicionar ao carrinho.', 'error')
  }
}

// Adiciona um item relacionado ao carrinho
async function addRelatedToCart(produto) {
  if (!auth.token) {
    showToast('Faça login para adicionar produtos ao carrinho.', 'warning')
    window.location.href = '/login'
    return
  }
  try {
    await cartStore.addItem(produto, 1, 'M')
    showToast('Produto adicionado ao carrinho!', 'success')
  } catch (e) {
    showToast('Erro ao adicionar ao carrinho.', 'error')
  }
}

// Navegação do carrossel de relacionados (anterior)
function prevRelated() {
  if (relatedIndex.value > 0) relatedIndex.value--
}

// Navegação do carrossel de relacionados (próximo)
function nextRelated() {
  if (relatedIndex.value < relatedProducts.value.length - 1) relatedIndex.value++
}

// Reseta o índice ao mudar a lista de relacionados
watch(relatedProducts, () => { relatedIndex.value = 0 })
</script>

<style scoped>
.product-detail-container {
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  max-width: 100vw;
  margin: 0 auto;
  padding: 32px 8px 24px 8px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.product-detail-content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 40px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.product-image-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  max-width: 600px;
}

.image-container {
  background: #f7f7f7;
  border-radius: 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  padding: 0;
  width: 100%;
  max-width: 400px;
  height: 400px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin: 0 auto;
  position: relative;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1.5rem;
  transition: transform 0.4s cubic-bezier(.4,1.6,.3,1);
  background: #fff;
  margin-top: 0;
}

.team-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 54px;
  height: 54px;
  background: #fff;
  border-radius: 50%;
  border: 1px solid #28a745;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  z-index: 2;
}

.official-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #28a745;
  color: #fff;
  font-size: 1rem;
  padding: 8px 12px;
  border-radius: 50px;
  box-shadow: 0 2px 8px rgba(40,167,69,0.2);
  z-index: 2;
}

.product-info-section {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 1;
  max-width: 600px;
}

.info-container {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(24,24,27,0.04);
  padding: 2.5rem 2rem 2rem 2rem;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.product-name {
  font-size: 2.1rem;
  font-weight: 900;
  color: #18181b;
  margin-bottom: 0.7rem;
  text-align: center;
}

.price-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.old-price {
  color: #e60014;
  text-decoration: line-through;
  font-size: 1.13rem;
  font-weight: 700;
}

.installment-price {
  color: #18181b;
  font-size: 2.3rem;
  font-weight: 900;
}

.installment-value {
  color: #1db954;
  font-size: 2.3rem;
  font-weight: 900;
}

.no-interest {
  color: #18181b;
  font-weight: 700;
}

.cash-price {
  color: #18181b;
  font-size: 1.13rem;
  font-weight: 700;
}

.divider {
  width: 100%;
  height: 1px;
  background: #ececec;
  margin: 16px 0 20px 0;
  border-radius: 2px;
}

.size-section {
  margin-bottom: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.size-label {
  font-weight: 700;
  margin-bottom: 8px;
  color: #18181b;
}

.size-buttons {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.size-btn {
  background: #fff;
  border: 2.5px solid #18181b;
  color: #18181b;
  font-weight: 800;
  border-radius: 14px;
  padding: 12px 24px;
  font-size: 1.18rem;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, border 0.18s;
  box-shadow: 0 1px 4px rgba(24,24,27,0.04);
}

.size-btn.active, .size-btn:hover {
  background: #18181b;
  color: #fff;
  border-color: #18181b;
}

.add-cart-btn {
  background: #18181b;
  color: #FFD600;
  font-size: 1.35rem;
  font-weight: 900;
  border: none;
  border-radius: 18px;
  padding: 20px 40px;
  margin-top: 16px;
  box-shadow: 0 2px 8px rgba(24,24,27,0.10);
  transition: background 0.18s, color 0.18s;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.01em;
  cursor: pointer;
  width: 100%;
}

.add-cart-btn:hover {
  background: #18181b;
  color: #FFD600;
}

.add-cart-btn i {
  margin-right: 8px;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 8px;
}

.guarantee-info, .payment-info, .delivery-info {
  width: 100%;
  text-align: center;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.guarantee-info {
  color: #18181b;
  font-size: 1.13rem;
  font-weight: 700;
}

.payment-info {
  font-size: 1.13rem;
  color: #18181b;
  gap: 12px;
}

.payment-label {
  font-weight: 700;
  margin-right: 8px;
}

.pix-badge {
  background: #18181b;
  color: #FFD600;
  border-radius: 8px;
  padding: 4px 12px;
  font-size: 1.05rem;
  font-weight: 700;
}

.boleto-badge {
  background: #FFD600;
  color: #18181b;
  border-radius: 8px;
  padding: 4px 12px;
  font-size: 1.05rem;
  font-weight: 700;
}

.delivery-info {
  color: #18181b;
  font-size: 1.13rem;
  font-weight: 700;
}

.related-products {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px rgba(24,24,27,0.07);
  padding: 32px 20px 20px 20px;
  margin-top: 20px;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
}

.related-title {
  font-size: 1.25rem;
  color: #18181b;
  letter-spacing: 0.01em;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
}

.related-carousel {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.related-card-wrapper {
  min-width: 240px;
  max-width: 320px;
  width: 100%;
  display: flex;
  align-items: stretch;
  justify-content: center;
}

.carousel-arrow {
  background: transparent;
  border: none;
  color: #18181b;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: none;
  cursor: pointer;
  padding: 0 4px;
}

.carousel-arrow:disabled {
  color: #ececec;
  cursor: not-allowed;
}

.carousel-arrow:hover,
.carousel-arrow:focus {
  color: #18181b;
  background: transparent;
}

@media (min-width: 1200px) {
  .image-container {
    max-width: 520px;
    height: 520px;
  }
  
  .info-container {
    max-width: 540px;
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
}

@media (max-width: 991px) {
  .product-detail-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .product-image-section {
    max-width: 100%;
  }
  
  .product-info-section {
    max-width: 100%;
  }
}

@media (max-width: 900px) {
  .product-detail-container {
    padding: 18px 4px;
    border-radius: 1.2rem;
  }
  
  .image-container {
    max-width: 320px;
    height: 260px;
  }
  
  .info-container {
    max-width: 100vw;
    padding-left: 0.7rem;
    padding-right: 0.7rem;
  }
  
  .product-name {
    font-size: 1.3rem;
  }
  
  .add-cart-btn {
    font-size: 1rem;
    padding: 16px 20px;
  }
  
  .related-products {
    padding: 16px 4px;
  }
  
  .related-card-wrapper {
    min-width: 90vw;
    max-width: 98vw;
  }
  
  .related-carousel {
    gap: 8px;
  }
}

@media (max-width: 600px) {
  .image-container {
    height: 180px;
    max-width: 220px;
  }
  
  .info-container {
    padding: 12px 4px 12px 4px;
  }
}
</style> 