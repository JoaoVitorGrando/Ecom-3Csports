<template>
  <div class="product-detail-loja container-fluid py-5 d-flex flex-column align-items-center justify-content-center">
    <div class="row justify-content-center align-items-start gx-5 gy-4 w-100 product-detail-row-wide" style="max-width: 1400px;">
      <div class="col-12 col-lg-6 d-flex flex-column align-items-center align-items-lg-end justify-content-start mb-4 mb-lg-0">
        <div class="img-box-loja visual-box position-relative w-100 d-flex align-items-center justify-content-center justify-content-lg-end">
          <img :src="getImage(product.image_path)" :alt="product.name" class="product-image-loja shadow-sm" />
          <img v-if="product.escudo" :src="product.escudo" alt="Escudo" class="escudo-loja position-absolute top-0 start-0 m-3 bg-white rounded-circle border border-success p-1" />
          <span v-if="product.oficial" class="badge bg-success position-absolute top-0 end-0 m-3 fs-6 py-2 px-3 rounded-pill">Oficial</span>
        </div>
        <div v-if="relatedProducts.length" class="order-bump-box-similar w-100 mt-4">
          <div class="order-bump-title-similar fw-bold mb-3 text-center">
            Itens semelhantes para você
          </div>
          <div class="order-bump-carousel d-flex align-items-center justify-content-center gap-3">
            <button class="carousel-arrow-similar left" @click="prevRelated" :disabled="relatedIndex === 0" aria-label="Anterior">
              <i class="bi bi-arrow-left-circle"></i>
            </button>
            <div class="order-bump-card-wrapper visual-box">
              <ProductCard :product="relatedProducts[relatedIndex]" :showCartBtn="true" @add-to-cart="addRelatedToCart" />
            </div>
            <button class="carousel-arrow-similar right" @click="nextRelated" :disabled="relatedIndex === relatedProducts.length - 1" aria-label="Próximo">
              <i class="bi bi-arrow-right-circle"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-6 d-flex align-items-center align-items-lg-start justify-content-center justify-content-lg-start">
        <div class="info-box-loja w-100 d-flex flex-column align-items-center align-items-lg-start justify-content-center justify-content-lg-start visual-box">
          <h1 class="fw-bold mb-2 nome-produto-loja text-center align-title-desktop">{{ product.name }}</h1>
          <div class="precos-loja mb-3 justify-content-center flex-column align-items-center text-center visual-box">
            <span class="preco-antigo-loja mb-1" v-if="precoAntigo">De <span>R$ {{ Number(precoAntigo).toFixed(2) }}</span></span>
            <span class="parcela-loja mb-1">12x de <b class="valor-parcela">R$ {{ parcela12x }}</b> <span class="sem-juros-verde">sem juros</span></span>
            <span class="preco-promocional-loja mb-1">ou <b>R$ {{ Number(product.price).toFixed(2) }}</b> à vista</span>
          </div>
          <div class="divider-loja mb-3"></div>
          <div class="tamanhos-loja mb-4 w-100 d-flex flex-column align-items-center visual-box">
            <div class="tamanhos-label-loja">Tamanho:</div>
            <div class="tamanhos-list-loja justify-content-center">
              <button v-for="size in sizes" :key="size" type="button" class="btn-tamanho-loja btn-tamanho-pequeno" :class="{ active: selectedSize === size }" @click="selectedSize = size">{{ size }}</button>
            </div>
          </div>
          <button @click="addToCart" class="btn btn-comprar-loja w-100 mb-4">
            <span v-if="!showMsg"><i class="bi bi-cart-plus me-2"></i>Adicionar ao carrinho</span>
            <span v-else class="fadein">Adicionado! <i class="bi bi-check-circle ms-2"></i></span>
          </button>
          <div class="garantia-loja mb-2 justify-content-center text-center visual-box">
            <i class="bi bi-shield-lock me-2"></i> <b>Compra 100% Segura</b> &mdash; Satisfação garantida ou seu dinheiro de volta!
          </div>
          <div class="pagamento-loja mb-2 justify-content-center text-center visual-box">
            <span class="pagamento-label-loja">Aceitamos:</span>
            <i class="bi bi-credit-card"></i>
            <i class="bi bi-cash-coin"></i>
            <i class="bi bi-bank"></i>
            <span class="pix-badge-loja">PIX</span>
            <span class="boleto-badge-loja">Boleto</span>
          </div>
          <div class="entrega-loja mb-2 justify-content-center text-center visual-box">
            <i class="bi bi-truck me-2"></i> <span>Envio rápido para todo o Brasil</span>
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

const relatedProducts = computed(() => {
  if (!product.value?.category?.name) return []
  return productsStore.products
    .filter(p => p.id !== product.value.id && p.category?.name === product.value.category?.name)
    .slice(0, 4)
})

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

const precoAntigo = computed(() => {
  if (!product.value.price) return null
  return (Number(product.value.price) * 1.38).toFixed(2)
})
const parcela12x = computed(() => {
  if (!product.value.price) return '0,00'
  return (Number(product.value.price) / 12).toFixed(2)
})

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

function prevRelated() {
  if (relatedIndex.value > 0) relatedIndex.value--
}
function nextRelated() {
  if (relatedIndex.value < relatedProducts.value.length - 1) relatedIndex.value++
}
watch(relatedProducts, () => { relatedIndex.value = 0 })
</script>

<style scoped>
.product-detail-loja {
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
.img-box-loja {
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
  margin: 0 auto 0 auto;
  position: relative;
}
.product-image-loja {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1.5rem;
  transition: transform 0.4s cubic-bezier(.4,1.6,.3,1);
  background: #fff;
  margin-top: 0;
}
.img-box-loja:hover .product-image-loja {
  /* Removido efeito de zoom e rotação no hover */
}
.escudo-loja {
  width: 54px;
  height: 54px;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.info-box-loja {
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
.garantia-loja, .pagamento-loja, .entrega-loja {
  width: 100%;
  text-align: center;
  justify-content: center !important;
  align-items: center;
  margin-top: 0.5rem;
}
.nome-produto-loja {
  font-size: 2.1rem;
  font-weight: 900;
  color: #18181b;
  margin-bottom: 0.7rem;
}
.precos-loja {
  display: flex;
  align-items: baseline;
  gap: 1.1rem;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}
.preco-antigo-loja {
  color: #e60014;
  text-decoration: line-through;
  font-size: 1.13rem;
  margin-bottom: 0.2rem;
  display: block;
  font-weight: 700;
}
.preco-promocional-loja {
  color: #18181b;
  font-size: 1.13rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
  display: block;
}
.parcela-loja {
  color: #18181b;
  font-size: 2.3rem;
  font-weight: 900;
  margin-bottom: 0.2rem;
  display: block;
}
.valor-parcela {
  color: #1db954;
  font-size: 2.3rem;
  font-weight: 900;
}
.sem-juros-verde {
  color: #18181b;
  font-weight: 700;
}
.divider-loja {
  width: 100%;
  height: 1px;
  background: #ececec;
  margin: 0.7rem 0 1.1rem 0;
  border-radius: 2px;
}
.tamanhos-loja {
  margin-bottom: 0.7rem;
  width: 100%;
}
.tamanhos-label-loja {
  font-weight: 700;
  margin-bottom: 0.2rem;
  color: #18181b;
}
.tamanhos-list-loja {
  display: flex;
  gap: 1.1rem;
  margin-top: 0.2rem;
}
.btn-tamanho-loja {
  background: #fff;
  border: 2.5px solid #18181b;
  color: #18181b;
  font-weight: 800;
  border-radius: 14px;
  padding: 0.7rem 1.7rem;
  font-size: 1.18rem;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, border 0.18s;
  box-shadow: 0 1px 4px rgba(24,24,27,0.04);
}
.btn-tamanho-loja.active, .btn-tamanho-loja:hover {
  background: #18181b;
  color: #fff;
  border-color: #18181b;
}
.btn-comprar-loja {
  background: #18181b;
  color: #FFD600;
  font-size: 1.35rem;
  font-weight: 900;
  border: none;
  border-radius: 18px;
  padding: 1.2rem 2.7rem;
  margin-top: 0.7rem;
  box-shadow: 0 2px 8px rgba(24,24,27,0.10);
  transition: background 0.18s, color 0.18s;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.01em;
}
.btn-comprar-loja:hover {
  background: #18181b;
  color: #FFD600;
}
.visual-box {
  border: 2.5px solid #ececec;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(24,24,27,0.07);
  background: #fff;
  margin-bottom: 1.2rem;
  padding: 1.2rem 1rem;
}
.garantia-loja {
  color: #18181b;
  font-size: 1.13rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.pagamento-loja {
  font-size: 1.13rem;
  color: #18181b;
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.pagamento-label-loja {
  font-weight: 700;
  margin-right: 0.5rem;
}
.pix-badge-loja {
  background: #18181b;
  color: #FFD600;
  border-radius: 8px;
  padding: 2px 10px;
  font-size: 1.05rem;
  margin-left: 0.3rem;
  font-weight: 700;
}
.boleto-badge-loja {
  background: #FFD600;
  color: #18181b;
  border-radius: 8px;
  padding: 2px 10px;
  font-size: 1.05rem;
  margin-left: 0.3rem;
  font-weight: 700;
}
.entrega-loja {
  color: #18181b;
  font-size: 1.13rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.order-bump-box {
  background: #fffbe6;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(255,214,0,0.08);
  padding: 1.2rem 1rem 1.2rem 1rem;
  margin-top: 1.2rem;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.order-bump-title {
  font-size: 1.13rem;
  color: #18181b;
  letter-spacing: 0.01em;
}
.order-bump-list {
  width: 100%;
  overflow-x: auto;
  gap: 1.2rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.order-bump-box-similar {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px rgba(24,24,27,0.07);
  padding: 2rem 1.2rem 1.2rem 1.2rem;
  margin-top: 1.2rem;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
}
.order-bump-title-similar {
  font-size: 1.25rem;
  color: #18181b;
  letter-spacing: 0.01em;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.order-bump-list-similar {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  justify-content: center;
  align-items: stretch;
}
.order-bump-carousel {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
}
.order-bump-card-wrapper {
  min-width: 240px;
  max-width: 320px;
  width: 100%;
  display: flex;
  align-items: stretch;
  justify-content: center;
}
.carousel-arrow-similar {
  background: transparent;
  border: none;
  color: #18181b;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: none;
  cursor: pointer;
  padding: 0 0.2rem;
}
.carousel-arrow-similar:disabled {
  color: #ececec;
  cursor: not-allowed;
}
.carousel-arrow-similar:hover,
.carousel-arrow-similar:focus {
  color: #18181b;
  background: transparent;
}
.btn-tamanho-pequeno {
  padding: 0.35rem 0.9rem;
  font-size: 0.98rem;
  border-radius: 10px;
}
.product-detail-row-wide {
  max-width: 1400px !important;
  margin-left: auto;
  margin-right: auto;
}
@media (min-width: 1200px) {
  .img-box-loja {
    max-width: 520px;
    height: 520px;
  }
  .info-box-loja {
    max-width: 540px;
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
}
@media (max-width: 900px) {
  .product-detail-row-wide {
    max-width: 100vw !important;
  }
  .img-box-loja {
    max-width: 320px;
    height: 260px;
  }
  .info-box-loja {
    max-width: 100vw;
    padding-left: 0.7rem;
    padding-right: 0.7rem;
  }
  .product-detail-loja {
    padding: 18px 4px;
    border-radius: 1.2rem;
  }
  .img-box-loja {
    height: 260px;
    max-width: 100vw;
    max-width: 320px;
    margin-bottom: 0;
  }
  .product-image-loja {
    height: 260px;
  }
  .info-box-loja {
    padding: 1.2rem 0.7rem 1.2rem 0.7rem;
    max-width: 100vw;
    align-items: center;
    justify-content: flex-start;
  }
  .nome-produto-loja {
    font-size: 1.3rem;
  }
  .btn-comprar-loja {
    font-size: 1rem;
    padding: 0.8rem 1.2rem;
  }
  .order-bump-box {
    max-width: 100vw;
    padding: 0.7rem 0.2rem;
  }
  .order-bump-list {
    flex-direction: row;
    gap: 0.7rem;
    overflow-x: auto;
    justify-content: flex-start;
  }
  .order-bump-box-similar {
    padding: 1rem 0.2rem;
  }
  .order-bump-list-similar {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .order-bump-card-wrapper {
    min-width: 90vw;
    max-width: 98vw;
  }
  .order-bump-carousel {
    gap: 0.5rem;
  }
}
@media (max-width: 600px) {
  .img-box-loja {
    height: 180px;
    max-width: 100vw;
    max-width: 220px;
  }
  .product-image-loja {
    height: 180px;
  }
  .info-box-loja {
    padding: 0.7rem 0.2rem 0.7rem 0.2rem;
  }
}
/* Adicionar alinhamento do título com a imagem no desktop */
@media (min-width: 992px) {
  .row.justify-content-center.align-items-start.gx-5.gy-4.w-100 {
    align-items: flex-start !important;
  }
  .nome-produto-loja.align-title-desktop {
    margin-top: 0;
    margin-bottom: 1.2rem;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    min-height: 60px;
    /* Ajuste fino para alinhar com a imagem */
    position: relative;
    top: -60px;
  }
  .info-box-loja {
    margin-top: 60px;
  }
}
</style> 