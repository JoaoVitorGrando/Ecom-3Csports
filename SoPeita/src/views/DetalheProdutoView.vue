<template>
  <div class="product-detail-loja container-fluid py-5">
    <div class="row justify-content-center align-items-stretch gx-5 gy-4">
      <div class="col-12 col-lg-6 d-flex align-items-center justify-content-center mb-4 mb-lg-0">
        <div class="img-box-loja position-relative w-100">
          <img :src="product.image || product.image_path" :alt="product.name" class="product-image-loja shadow-sm" />
          <img v-if="product.escudo" :src="product.escudo" alt="Escudo" class="escudo-loja position-absolute top-0 start-0 m-3 bg-white rounded-circle border border-success p-1" />
          <span v-if="product.oficial" class="badge bg-success position-absolute top-0 end-0 m-3 fs-6 py-2 px-3 rounded-pill">Oficial</span>
        </div>
      </div>
      <div class="col-12 col-lg-6 d-flex align-items-center">
        <div class="info-box-loja w-100">
          <h1 class="fw-bold mb-2 nome-produto-loja">{{ product.name }}</h1>
          <div class="precos-loja mb-3">
            <span class="preco-antigo-loja" v-if="precoAntigo">R$ {{ Number(precoAntigo).toFixed(2) }}</span>
            <span class="preco-promocional-loja">R$ {{ Number(product.price).toFixed(2) }}</span>
            <span class="parcela-loja">ou 12x de <b>R$ {{ parcela12x }}</b> sem juros</span>
          </div>
          <div class="divider-loja mb-3"></div>
          <div class="tamanhos-loja mb-4">
            <div class="tamanhos-label-loja">Tamanho:</div>
            <div class="tamanhos-list-loja">
              <button v-for="size in sizes" :key="size" type="button" class="btn-tamanho-loja" :class="{ active: selectedSize === size }" @click="selectedSize = size">{{ size }}</button>
            </div>
          </div>
          <button @click="addToCart" class="btn btn-comprar-loja w-100 mb-4">
            <span v-if="!showMsg"><i class="bi bi-cart-plus me-2"></i>Comprar agora</span>
            <span v-else class="fadein">Adicionado! <i class="bi bi-check-circle ms-2"></i></span>
          </button>
          <div class="divider-loja mb-3"></div>
          <div class="garantia-loja mb-2">
            <i class="bi bi-shield-lock me-2"></i> <b>Compra Garantida</b> | Satisfação ou dinheiro de volta!
          </div>
          <div class="pagamento-loja mb-2">
            <span class="pagamento-label-loja">Formas de pagamento:</span>
            <i class="bi bi-credit-card"></i>
            <i class="bi bi-cash-coin"></i>
            <i class="bi bi-bank"></i>
            <span class="pix-badge-loja">PIX</span>
            <span class="boleto-badge-loja">Boleto</span>
          </div>
          <div class="entrega-loja mb-2">
            <i class="bi bi-truck me-2"></i> <span>Entrega rápida para todo o Brasil</span>
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
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/utils/toast'

const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const auth = useAuthStore()

const product = ref({})
const sizes = ['P', 'M', 'G', 'GG', '2XL']
const selectedSize = ref('M')
const showMsg = ref(false)

onMounted(async () => {
  try {
    product.value = await productsStore.fetchProduct(route.params.id)
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
    await cartStore.addItem(product.value.id, 1, selectedSize.value)
    // Se o método addItem não aceita size, use:
    // await addItems({ product_id: product.value.id, quantity: 1, unit_price: product.value.price, size: selectedSize.value })
    showMsg.value = true
    showToast('Produto adicionado ao carrinho!', 'success')
    setTimeout(() => showMsg.value = false, 1500)
  } catch (e) {
    showToast('Erro ao adicionar ao carrinho.', 'error')
  }
}
</script>

<style scoped>
.product-detail-loja {
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  max-width: 1200px;
  margin: 40px auto;
  padding: 48px 32px;
}
.img-box-loja {
  background: #f7f7f7;
  border-radius: 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  padding: 0;
  width: 100%;
  max-width: 440px;
  height: 440px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
}
.product-image-loja {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1.5rem;
  transition: transform 0.4s cubic-bezier(.4,1.6,.3,1);
  background: #fff;
}
.img-box-loja:hover .product-image-loja {
  transform: scale(1.045) rotate(-1deg);
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
  align-items: flex-start;
  justify-content: center;
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
  color: #888;
  text-decoration: line-through;
  font-size: 1.1rem;
  margin-right: 0.7rem;
}
.preco-promocional-loja {
  color: #18181b;
  font-size: 2.1rem;
  font-weight: 900;
  margin-right: 0.7rem;
}
.parcela-loja {
  color: #18181b;
  font-size: 1.05rem;
  font-weight: 600;
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
  background: #FFD600;
  color: #18181b;
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
@media (max-width: 900px) {
  .product-detail-loja {
    padding: 18px 4px;
    border-radius: 1.2rem;
  }
  .img-box-loja {
    height: 260px;
    max-width: 100vw;
  }
  .product-image-loja {
    height: 260px;
  }
  .info-box-loja {
    padding: 1.2rem 0.7rem 1.2rem 0.7rem;
    max-width: 100vw;
  }
  .nome-produto-loja {
    font-size: 1.3rem;
  }
  .btn-comprar-loja {
    font-size: 1rem;
    padding: 0.8rem 1.2rem;
  }
}
@media (max-width: 600px) {
  .img-box-loja {
    height: 180px;
    max-width: 100vw;
  }
  .product-image-loja {
    height: 180px;
  }
  .info-box-loja {
    padding: 0.7rem 0.2rem 0.7rem 0.2rem;
  }
}
</style> 