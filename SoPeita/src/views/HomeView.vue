<template>
  <div class="home container-fluid p-0">
    <MenuCategorias />
    <!-- Carrossel/banner principal -->
    <div class="row justify-content-center my-5">
      <div class="col-12 col-lg-10">
        <div class="banner-principal-destaque">
          <BootstrapCarousel />
        </div>
      </div>
    </div>
    <!-- Banner promocional extra 1 -->
    <div class="banner-extra mb-5 d-flex align-items-center justify-content-center">
      <img src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80" alt="Promoção" class="banner-img rounded-4 shadow" style="max-width:100%;height:180px;object-fit:cover;" />
    </div>
    <div class="content-home px-3 py-5">
      <!-- Lançamentos -->
      <section class="products" id="produtos">
        <h2 class="mb-5 text-center fw-bold display-4 text-dark">Lançamentos</h2>
        <div class="produtos-grid">
          <div v-for="product in produtosFiltrados" :key="product.id" class="produto-card-wrapper">
            <ProductCard
              :product="product"
              :show-cart-btn="true"
              @add-to-cart="handleAddToCart"
            />
          </div>
        </div>
      </section>
      <!-- Carrossel de clubes -->
      <ClubesCarousel :clubes="clubes" />
      <!-- Banner promocional extra 2 -->
      <div class="banner-extra mb-5 d-flex align-items-center justify-content-center">
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" alt="Promoção 2" class="banner-img rounded-4 shadow" style="max-width:100%;height:180px;object-fit:cover;" />
      </div>
      <!-- Vantagens -->
      <Vantagens />
      <!-- Depoimentos -->
      <section class="feedback-section py-5">
        <Depoimentos />
      </section>
      <!-- Institucional -->
      <section class="institucional py-5">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-12 col-md-6 mb-4 mb-md-0">
              <h3 class="fw-bold mb-3">Sobre a 3C Sports</h3>
              <p>Somos apaixonados por esportes e qualidade! Aqui você encontra camisetas, acessórios e produtos oficiais dos maiores clubes nacionais e internacionais, além de lançamentos exclusivos e ofertas imperdíveis. Garantimos entrega rápida, atendimento humanizado e total segurança na sua compra.</p>
            </div>
            <div class="col-12 col-md-5">
              <h4 class="fw-bold mb-2">Fale Conosco</h4>
              <ul class="list-unstyled mb-2">
                <li><i class="bi bi-whatsapp text-success me-2"></i> (33) 99986-8943</li>
                <li><i class="bi bi-envelope text-warning me-2"></i> suporte@3csports.com</li>
                <li><i class="bi bi-clock me-2"></i> Seg. a Sex. 9h às 18h</li>
              </ul>
              <div class="mt-3">
                <a href="#" class="btn btn-amarelo fw-bold px-4 py-2 me-2 mb-2"><i class="bi bi-whatsapp me-1"></i> WhatsApp</a>
                <a href="#" class="btn btn-outline-secondary fw-bold px-4 py-2 mb-2"><i class="bi bi-envelope me-1"></i> E-mail</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import MenuCategorias from '../components/MenuCategorias.vue'
import ClubesCarousel from '../components/ClubesCarousel.vue'
import BootstrapCarousel from '../components/BootstrapCarousel.vue'
import ProductCard from '../components/ProductCard.vue'
import Vantagens from '../components/Vantagens.vue'
import Depoimentos from '../components/Depoimentos.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAllProducts, addItems, createCart } from '@/services/HttpService'
import { showToast } from '@/utils/toast'
import { useAuthStore } from '@/stores/auth'
import { useCartDrawerStore } from '@/stores/cartDrawer'

const products = ref([])
const loading = ref(true)
const error = ref('')
const auth = useAuthStore()
const router = useRouter()
const cartDrawer = useCartDrawerStore()

onMounted(async () => {
  try {
    products.value = await getAllProducts()
  } catch (e) {
    error.value = 'Erro ao carregar produtos.'
    showToast(error.value, 'error')
  } finally {
    loading.value = false
  }
})

const isAuth = computed(() => !!auth.token)
const user = computed(() => auth.user?.name || '')

const categoriasPermitidas = ['Futebol', 'Corrida', 'Academia']
const produtosFiltrados = computed(() =>
  products.value.filter(produto =>
    categoriasPermitidas.includes(produto.category?.name)
  )
)

// Removido: produtoSelecionado, mostrarModal, abrirModal, fecharModal

async function handleAddToCart(product) {
  if (!isAuth.value) {
    showToast('Faça login para adicionar produtos ao carrinho.', 'warning')
    router.push({ name: 'login' })
    return
  }
  try {
    await createCart()
    await addItems({ product_id: Number(product.id), quantity: 1, unit_price: Number(product.price), size: 'M' })
    showToast('Produto adicionado ao carrinho!', 'success')
    cartDrawer.openDrawer()
  } catch (e) {
    showToast('Erro ao adicionar ao carrinho.', 'error')
  }
}

function handleDetails(product) {
  router.push({ name: 'detalhe-produto', params: { id: product.id } })
}

// Mock de clubes para a seção "Escolha por Clubes"
const clubes = [
  { nome: 'Flamengo', escudo: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Clube_de_Regatas_do_Flamengo_logo.svg' },
  { nome: 'Corinthians', escudo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Corinthians_logo.svg' },
  { nome: 'Palmeiras', escudo: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg' },
  { nome: 'São Paulo', escudo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Sao_Paulo_FC_crest.svg' },
  { nome: 'Santos', escudo: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Santos_logo.svg' },
  { nome: 'Vasco', escudo: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/CR_Vasco_da_Gama_logo.svg' },
  { nome: 'Grêmio', escudo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Gremio_logo.svg' },
  { nome: 'Internacional', escudo: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/SC_Internacional_logo.svg' },
  { nome: 'Cruzeiro', escudo: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Cruzeiro_Esporte_Clube_%28logo%29.svg' },
  { nome: 'Atlético Mineiro', escudo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Clube_Atl%C3%A9tico_Mineiro_logo.svg' },
  { nome: 'Bahia', escudo: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Esporte_Clube_Bahia_logo.svg' },
  { nome: 'Botafogo', escudo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Botafogo_de_Futebol_e_Regatas_logo.svg' },
]
</script>

<style scoped>
.home {
  background: var(--color-bg);
}
.produtos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  justify-content: center;
  align-items: stretch;
}
.produto-card-wrapper {
  display: flex;
  align-items: stretch;
  height: 100%;
}
.produto-card {
  width: 100%;
  min-width: 240px;
  max-width: 320px;
  min-height: 410px;
  max-height: 470px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-radius: 16px;
  border: 1px solid var(--color-border);
  overflow: hidden;
  background: var(--color-bg-card);
  transition: all 0.3s cubic-bezier(.4,2,.3,1);
}
.card-img-top {
  object-fit: cover;
  width: 100%;
  height: 200px !important;
  border-radius: 16px 16px 0 0;
  transition: transform 0.3s ease;
}
.produto-card:hover .card-img-top {
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
  text-align: center;
}
.card-text {
  font-size: 1.08rem;
  margin-bottom: 0.7rem;
  text-align: center;
}
.fw-bold.text-gradient.mb-1 {
  font-size: 1.15rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.clubes-section {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px rgba(24,24,27,0.04);
}
.clube-card {
  background: #18181b;
  color: #fff;
  border: none;
  box-shadow: 0 2px 12px rgba(24,24,27,0.08);
  transition: transform 0.18s, box-shadow 0.18s;
  cursor: pointer;
}
.clube-card:hover {
  transform: translateY(-6px) scale(1.04);
  box-shadow: 0 6px 24px rgba(24,24,27,0.16);
  background: #232323;
}
.clube-escudo {
  width: 54px;
  height: 54px;
  object-fit: contain;
  margin-bottom: 0.5rem;
  background: #fff;
  border-radius: 50%;
  border: 2px solid #FFD600;
  padding: 6px;
}
.clube-nome {
  font-size: 1.08rem;
  margin-top: 0.2rem;
}
@media (max-width: 1200px) {
  .produtos-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 900px) {
  .produtos-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .produtos-grid {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
  .produto-card {
    min-width: 100%;
    max-width: 100%;
    min-height: 320px;
    max-height: 370px;
    padding: 0.7rem;
  }
  .card-img-top {
    height: 120px !important;
  }
  .card-title {
    font-size: 1rem;
    min-height: 36px;
  }
}
</style>
