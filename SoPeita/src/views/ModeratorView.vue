<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar d-flex flex-column align-items-center py-4 px-2">
      <div class="admin-ola mb-3 w-100 text-center ola-minimalista">
        Olá, {{ moderatorName }}
      </div>
      <nav class="nav flex-column w-100 gap-2">
        <button class="nav-link sidebar-btn" :class="{active: tab==='dashboard'}" @click="tab='dashboard'">
          <i class="bi bi-speedometer2 me-2"></i> Dashboard
        </button>
        <button class="nav-link sidebar-btn" :class="{active: tab==='produtos'}" @click="tab='produtos'">
          <i class="bi bi-box-seam me-2"></i> Produtos
        </button>
        <button class="nav-link sidebar-btn" :class="{active: tab==='pedidos'}" @click="tab='pedidos'">
          <i class="bi bi-bag-check me-2"></i> Pedidos
        </button>
        <button class="nav-link sidebar-btn" :class="{active: tab==='tags'}" @click="tab='tags'">
          <i class="bi bi-tag me-2"></i> Tags
        </button>
      </nav>
    </aside>
    <!-- Main -->
    <main class="admin-main">
      <header class="admin-header text-center p-0 m-0" style="box-shadow:none;background:none;border:none;"></header>
      <!-- Dashboard -->
      <section v-if="tab==='dashboard'">
        <div class="dashboard-header text-center mt-0 mb-3">
          <h2 class="dashboard-title dashboard-title-custom mb-1">Dashboard</h2>
          <p class="dashboard-desc mb-0">Visão geral do seu e-commerce</p>
        </div>
        <div class="dashboard-top row g-4 align-items-stretch justify-content-center">
          <div class="col-12 col-md-6 col-lg-3">
            <div class="kpi-block-minimal text-center p-4 mb-2">
              <i class="bi bi-box-seam kpi-icon mb-2" style="color:#18181b !important;"></i>
              <div class="kpi-value mb-1">{{ produtos.length }}</div>
              <div class="kpi-label">Produtos</div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <div class="kpi-block-minimal text-center p-4 mb-2">
              <i class="bi bi-bag-check kpi-icon mb-2" style="color:#18181b !important;"></i>
              <div class="kpi-value mb-1">{{ pedidos.length }}</div>
              <div class="kpi-label">Pedidos</div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <div class="kpi-block-minimal text-center p-4 mb-2">
              <i class="bi bi-cash-coin kpi-icon mb-2" style="color:#18181b !important;"></i>
              <div class="kpi-value mb-1">R$ {{ totalVendas.toFixed(2) }}</div>
              <div class="kpi-label">Vendas</div>
            </div>
          </div>
        </div>
        <div class="row mt-4 justify-content-center">
          <div class="col-12 col-md-8 col-lg-6">
            <div class="dashboard-summary-minimal p-4 text-center">
              <div class="summary-title mb-2">Resumo rápido</div>
              <ul class="summary-list list-unstyled mb-0">
                <li v-if="produtos.filter(p => p.stock < 5).length > 0" class="mb-1">
                  <i class="bi bi-exclamation-triangle-fill me-1 text-warning"></i>
                  {{ produtos.filter(p => p.stock < 5).length }} produto(s) com estoque baixo
                </li>
                <li v-else class="mb-1">
                  <i class="bi bi-check-circle-fill me-1 text-success"></i>
                  Todos os produtos com estoque adequado
                </li>
                <li v-if="pedidos.filter(p => p.status !== 'ENTREGUE').length > 0" class="mb-1">
                  <i class="bi bi-clock-history me-1 text-primary"></i>
                  {{ pedidos.filter(p => p.status !== 'ENTREGUE').length }} pedido(s) pendente(s)
                </li>
                <li v-else class="mb-1">
                  <i class="bi bi-check-circle-fill me-1 text-success"></i>
                  Nenhum pedido pendente
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <!-- Produtos -->
      <section v-else-if="tab==='produtos'">
        <div class="text-center mt-0 mb-1 position-relative">
          <h4 class="fw-bold mb-0 dashboard-title-custom">Produtos</h4>
          <button class="btn btn-success btn-sm fw-bold position-absolute end-0 top-50 translate-middle-y me-2" style="right:0;" @click="openProdutoModal()">
            <i class="bi bi-plus-circle me-1"></i> Novo Produto
          </button>
        </div>
        <div class="card border-0 shadow-sm rounded-4 p-0 mb-4" style="background:#fff;">
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead class="table-success">
                <tr>
                  <th class="ps-4">Imagem</th>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Desconto</th>
                  <th>Estoque</th>
                  <th>Categoria</th>
                  <th class="d-none d-md-table-cell">Descrição</th>
                  <th class="text-end pe-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="produtosLoading">
                  <td colspan="8" class="text-center py-4">Carregando produtos...</td>
                </tr>
                <tr v-else-if="produtosError">
                  <td colspan="8" class="alert alert-danger text-center">{{ produtosError }}</td>
                </tr>
                <tr v-else-if="!produtos.length">
                  <td colspan="8" class="text-center text-muted py-4">Nenhum produto cadastrado ainda.</td>
                </tr>
                <tr v-else v-for="produto in produtos" :key="produto.id">
                  <td class="ps-4">
                    <img :src="getImage(produto.image_path)" alt="img" style="width:48px;height:48px;object-fit:cover;border-radius:12px;background:#f5f5f5;">
                  </td>
                  <td class="fw-semibold">{{ produto.name }}</td>
                  <td>R$ {{ Number(produto.price).toFixed(2) }}</td>
                  <td>
                    <span v-if="getActiveDiscount(produto)" class="badge bg-danger bg-opacity-10 text-danger fs-6">
                      -{{ Number(getActiveDiscount(produto).discount_percentage).toFixed(0) }}%
                    </span>
                  </td>
                  <td>{{ produto.stock }}</td>
                  <td>{{ produto.category?.name || '-' }}</td>
                  <td class="d-none d-md-table-cell text-truncate" style="max-width:220px;">{{ produto.description }}</td>
                  <td class="text-end pe-4">
                    <button class="btn btn-outline-primary btn-sm me-2" @click="openProdutoModal(produto)" title="Editar"><i class="bi bi-pencil-square"></i></button>
                    <button class="btn btn-outline-danger btn-sm" @click="confirmDeleteProduto(produto)" title="Remover"><i class="bi bi-trash"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Modal Produto -->
        <div v-if="showProdutoModal" class="modal-backdrop d-flex align-items-center justify-content-center" style="background:rgba(0,0,0,0.15);z-index:1050;">
          <div class="modal-dialog modal-dialog-centered w-100" style="max-width:520px;">
            <div class="modal-content border-0 shadow-lg rounded-4" style="background:#fff; padding: 0 2rem; max-height:90vh; overflow-y:auto;">
              <div class="modal-header border-0 rounded-top-4" style="background:#f8fafc; padding-top:2rem; padding-bottom:1rem; padding-left:0; padding-right:0;">
                <h5 class="modal-title fw-semibold text-secondary-emphasis">{{ produtoEditando.id ? 'Editar Produto' : 'Novo Produto' }}</h5>
                <button type="button" class="btn-close" @click="closeProdutoModal"></button>
              </div>
              <form @submit.prevent="salvarProduto">
                <div class="modal-body py-4 px-0" style="padding-left:0; padding-right:0;">
                  <div v-if="produtoError" class="alert alert-danger py-2 small mb-3">{{ produtoError }}</div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Nome</label>
                    <input v-model="produtoEditando.name" class="form-control bg-light border-0 rounded-3 form-control-lg" required placeholder="Nome do produto" />
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Descrição</label>
                    <textarea v-model="produtoEditando.description" class="form-control bg-light border-0 rounded-3 form-control-lg" rows="2" required placeholder="Descrição do produto"></textarea>
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Preço</label>
                    <input v-model.number="produtoEditando.price" type="number" min="0" step="0.01" class="form-control bg-light border-0 rounded-3 form-control-lg" required placeholder="0,00" />
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Estoque</label>
                    <input v-model.number="produtoEditando.stock" type="number" min="0" class="form-control bg-light border-0 rounded-3 form-control-lg" required placeholder="0" />
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Categoria</label>
                    <select v-model="produtoEditando.category_id" class="form-select bg-light border-0 rounded-3 form-control-lg" required>
                      <option value="" disabled>Selecione...</option>
                      <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                    </select>
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Imagem</label>
                    <input type="file" accept="image/*" class="form-control bg-light border-0 rounded-3 form-control-lg" @change="handleImageChange" :required="!produtoEditando.id" />
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Tags</label>
                    <div class="d-flex flex-wrap gap-2">
                      <label v-for="tag in tagsStore.tags" :key="tag.id" class="form-check-label d-flex align-items-center gap-1" style="cursor:pointer;">
                        <input type="checkbox" class="form-check-input" v-model="tagsSelecionadas" :value="tag.id" />
                        <span :style="{background: tag.color_hex, color: '#222', padding: '2px 10px', borderRadius: '8px', fontSize: '0.9em'}">{{ tag.code }}</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="modal-footer border-0 pb-4 px-0 pt-0 d-flex justify-content-between" style="padding-left:0; padding-right:0;">
                  <button type="button" class="btn btn-light border px-4 py-2 rounded-3" @click="closeProdutoModal">Cancelar</button>
                  <button type="submit" class="btn btn-success px-4 py-2 rounded-3 fw-bold" :disabled="produtoLoading" style="background:#4ade80;border:none;">
                    <span v-if="produtoLoading" class="spinner-border spinner-border-sm me-2"></span>
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <!-- Pedidos -->
      <section v-else-if="tab==='pedidos'">
        <div class="text-center mt-0 mb-1 position-relative">
          <h4 class="fw-bold mb-0 dashboard-title-custom">Pedidos</h4>
        </div>
        <div class="card border-0 shadow-sm rounded-4 p-0 mb-4" style="background:#fff;">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-success">
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Status</th>
                  <th>Valor</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pedido in pedidos" :key="pedido.id">
                  <td>{{ pedido.id }}</td>
                  <td>{{ pedido.cliente }}</td>
                  <td><span class="badge" :class="pedido.status === 'ENTREGUE' ? 'bg-success' : 'bg-warning'">{{ pedido.status }}</span></td>
                  <td>R$ {{ Number(pedido.valor).toFixed(2) }}</td>
                  <td>{{ pedido.data }}</td>
                  <td>
                    <button class="btn btn-outline-primary btn-sm" @click="verPedido(pedido)"><i class="bi bi-eye"></i></button>
                    <button class="btn btn-outline-success btn-sm" @click="alterarStatusPedido(pedido)"><i class="bi bi-arrow-repeat"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <!-- Tags -->
      <section v-else-if="tab==='tags'" class="admin-section mt-4">
        <h3 class="mb-3">Gerenciar Tags</h3>
        <form @submit.prevent="salvarTag" class="d-flex gap-2 mb-3 align-items-center">
          <input v-model="novaTag.code" class="form-control" placeholder="Código" required style="max-width:120px" />
          <div class="d-flex align-items-center gap-1">
            <input v-model="novaTag.color_hex" class="form-control" placeholder="#HEX cor" required style="max-width:120px" />
            <span v-for="cor in coresPredefinidas" :key="cor" @click="novaTag.color_hex = cor" :style="{background: cor, border: novaTag.color_hex === cor ? '2px solid #18181b' : '1px solid #ccc', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', display: 'inline-block', marginLeft: '4px'}"></span>
          </div>
          <input v-model="novaTag.description" class="form-control" placeholder="Descrição" required style="max-width:220px" />
          <button class="btn btn-secondary" type="submit">{{ editandoTag ? 'Salvar' : 'Adicionar' }}</button>
          <button v-if="editandoTag" class="btn btn-outline-secondary" type="button" @click="() => { editandoTag = null; novaTag = { code: '', color_hex: '', description: '' } }">Cancelar</button>
        </form>
        <table class="table table-bordered table-sm">
          <thead>
            <tr>
              <th>Código</th>
              <th>Cor</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tag in tagsStore.tags" :key="tag.id">
              <td>{{ tag.code }}</td>
              <td><span :style="{background: tag.color_hex, color: '#222', padding: '2px 10px', borderRadius: '8px'}">{{ tag.color_hex }}</span></td>
              <td>{{ tag.description }}</td>
              <td>
                <button class="btn btn-sm btn-outline-secondary me-1" @click="editarTag(tag)">Editar</button>
                <button class="btn btn-sm btn-outline-danger" @click="removerTag(tag.id)">Remover</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'
import { useTagsStore } from '@/stores/tags'
import { showToast } from '@/utils/toast'
import { getCategories } from '@/services/HttpService'

const tab = ref('dashboard')
const productsStore = useProductsStore()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const tagsStore = useTagsStore()

const produtos = computed(() => productsStore.products)
const produtosLoading = computed(() => productsStore.loading)
const produtosError = computed(() => productsStore.error)

const pedidos = computed(() => ordersStore.orders)
const totalVendas = computed(() => pedidos.value.reduce((acc, p) => acc + (p.valor || 0), 0))
const moderatorName = computed(() => authStore.user?.name || authStore.user?.email || 'Moderador')

const categorias = ref([])
async function fetchCategorias() {
  try {
    categorias.value = await getCategories()
  } catch (e) {
    showToast('Erro ao carregar categorias', 'error')
  }
}
onMounted(() => {
  productsStore.fetchProducts()
  ordersStore.fetchOrders()
  fetchCategorias()
  tagsStore.fetchTags()
})

// Produtos
const showProdutoModal = ref(false)
const produtoEditando = ref({})
const produtoLoading = ref(false)
const produtoError = ref('')

function openProdutoModal(produto = {}) { produtoEditando.value = { ...produto }; showProdutoModal.value = true }
function closeProdutoModal() { showProdutoModal.value = false; produtoEditando.value = {} }

async function salvarProduto() {
  produtoLoading.value = true
  produtoError.value = ''
  try {
    if (!produtoEditando.value.name || !produtoEditando.value.price || !produtoEditando.value.stock || !produtoEditando.value.category_id) {
      produtoError.value = 'Preencha todos os campos obrigatórios.'
      produtoLoading.value = false
      return
    }
    // Montar FormData para envio multipart
    const formData = new FormData()
    formData.append('name', produtoEditando.value.name)
    formData.append('description', produtoEditando.value.description || '')
    formData.append('price', produtoEditando.value.price)
    formData.append('stock', produtoEditando.value.stock)
    formData.append('category_id', produtoEditando.value.category_id)
    if (produtoEditando.value.image) {
      formData.append('image', produtoEditando.value.image)
    }
    if (produtoEditando.value.id) {
      await productsStore.updateProduct(produtoEditando.value.id, produtoEditando.value)
      showToast('Produto atualizado com sucesso!', 'success')
    } else {
      await productsStore.createProduct(formData)
      showToast('Produto criado com sucesso!', 'success')
    }
    closeProdutoModal()
    productsStore.fetchProducts()
    // Após criar/editar produto, associar tags
    if (produtoEditando.value.id) {
      for (const tag of tagsStore.tags) {
        if ((tag.products || []).some(p => p.id === produtoEditando.value.id) && !tagsSelecionadas.value.includes(tag.id)) {
          await tagsStore.removeProductFromTag(tag.id, produtoEditando.value.id)
        }
      }
      for (const tagId of tagsSelecionadas.value) {
        if (!(tagsStore.tags.find(t => t.id === tagId).products || []).some(p => p.id === produtoEditando.value.id)) {
          await tagsStore.addProductToTag(tagId, produtoEditando.value.id)
        }
      }
    }
  } catch (e) {
    produtoError.value = e?.response?.data?.detail || e?.message || 'Erro ao salvar produto.'
    showToast(produtoError.value, 'error')
  } finally {
    produtoLoading.value = false
  }
}

function handleImageChange(e) {
  const file = e.target.files[0]
  if (file) produtoEditando.value.image = file
}
function confirmDeleteProduto(produto) {
  if (confirm('Tem certeza que deseja remover este produto?')) {
    productsStore.deleteProduct(produto.id).then(() => {
      showToast('Produto removido com sucesso!', 'success')
      productsStore.fetchProducts()
    }).catch(() => showToast('Erro ao remover produto', 'error'))
  }
}
function getImage(path) {
  if (!path) return '/default-product.png'
  if (path.startsWith('http')) return path
  return 'http://35.196.79.227:8000' + path
}
function getActiveDiscount(produto) {
  if (!produto.discounts || !produto.discounts.length) return null
  const now = new Date()
  return produto.discounts.find(d => {
    const start = new Date(d.start_date)
    const end = new Date(d.end_date)
    return start <= now && now <= end
  })
}
// Pedidos
function verPedido(pedido) { showToast('Função de visualizar pedido não implementada', 'info') }
function alterarStatusPedido(pedido) { showToast('Função de alterar status não implementada', 'info') }

const novaTag = ref({ code: '', color_hex: '', description: '' })
const editandoTag = ref(null)
const coresPredefinidas = ['#4ADE80', '#FFD600', '#EF4444'] // verde, amarelo, vermelho
// Seleção de tags no modal de produto
const tagsSelecionadas = ref([])
watchEffect(() => {
  if (showProdutoModal.value && produtoEditando.value.id) {
    tagsSelecionadas.value = tagsStore.tags.filter(tag => (tag.products || []).some(p => p.id === produtoEditando.value.id)).map(tag => tag.id)
  } else if (showProdutoModal.value) {
    tagsSelecionadas.value = []
  }
})

function salvarTag() {
  if (editandoTag.value) {
    tagsStore.updateTag(editandoTag.value.id, { ...novaTag.value }).then(() => {
      tagsStore.fetchTags()
      editandoTag.value = null
      novaTag.value = { code: '', color_hex: '', description: '' }
    })
  } else {
    tagsStore.createTag({ ...novaTag.value }).then(() => {
      tagsStore.fetchTags()
      novaTag.value = { code: '', color_hex: '', description: '' }
    })
  }
}
function editarTag(tag) {
  editandoTag.value = tag
  novaTag.value = { code: tag.code, color_hex: tag.color_hex, description: tag.description }
}
function removerTag(id) {
  if (confirm('Tem certeza que deseja remover esta tag?')) {
    tagsStore.deleteTag(id).then(() => tagsStore.fetchTags())
  }
}
</script>

<style scoped>
:root {
  --admin-sidebar-bg: #fffbe6;
  --admin-sidebar-active: #fff9c4;
  --admin-sidebar-text: #18181b;
  --admin-main-bg: #fffde7;
  --admin-card-bg: #fff;
  --admin-card-shadow: 0 2px 8px rgba(0,0,0,0.04);
  --admin-header-bg: #fffbe6;
  --admin-header-shadow: 0 1px 4px rgba(0,0,0,0.03);
  --primary-yellow: #ffd600;
  --primary-black: #18181b;
}
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--admin-main-bg);
}
.admin-sidebar {
  width: 220px;
  background: var(--admin-sidebar-bg);
  color: var(--admin-sidebar-text);
  min-height: 100vh;
  border-right: 1px solid #ffe082;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: none;
}
.admin-ola {
  color: var(--primary-black);
  background: var(--primary-yellow);
  border-radius: 8px;
  padding: 0.5rem 0.7rem;
  margin-bottom: 1rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  background-clip: padding-box;
}
.ola-minimalista {
  font-size: 0.98rem;
  color: var(--primary-black);
  background: none !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0.2rem 0 0.2rem 0;
  margin-bottom: 1.2rem;
}
.nav {
  width: 100%;
}
.sidebar-btn {
  color: var(--admin-sidebar-text);
  background: none;
  border: none;
  text-align: left;
  font-size: 1rem;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  transition: background 0.2s, color 0.2s;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-weight: 500;
  margin-bottom: 2px;
}
.sidebar-btn.active, .sidebar-btn:hover {
  background: var(--admin-sidebar-active);
  color: var(--primary-black);
  font-weight: 600;
}
.admin-main {
  flex: 1;
  padding: 2.2rem 2.2rem 2.2rem 2.2rem;
  min-height: 100vh;
  background: var(--admin-main-bg);
  box-sizing: border-box;
}
.admin-header {
  background: var(--admin-header-bg);
  border-radius: 0 0 1rem 1rem;
  box-shadow: var(--admin-header-shadow);
  border-bottom: none;
  margin-bottom: 0.5rem;
}
.dashboard-title-custom {
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  font-weight: 700;
  letter-spacing: 0.02em;
  font-size: 2.4rem;
  margin-top: 0.3rem;
  margin-bottom: 0.2rem;
  color: var(--primary-black);
  line-height: 1.08;
  text-shadow: 0 1px 0 #fff, 0 2px 8px rgba(0,0,0,0.03);
}
.dashboard-header {
  min-height: 32px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.kpi-block-minimal {
  background: #fffde7;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(255,214,0,0.04);
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.18s;
}
.kpi-block-minimal:hover {
  box-shadow: 0 4px 24px rgba(255,214,0,0.10);
}
.kpi-icon {
  font-size: 2.1rem;
  color: var(--primary-yellow) !important;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.kpi-value {
  font-size: 2.1rem;
  font-weight: 700;
  color: var(--primary-black);
}
.kpi-label {
  font-size: 1.05rem;
  color: var(--primary-black);
  font-weight: 500;
  letter-spacing: 0.5px;
}
.dashboard-summary-minimal {
  background: #fffbe6;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(255,214,0,0.04);
  font-size: 1.08rem;
}
.summary-title {
  font-size: 1.13rem;
  font-weight: 600;
  color: var(--primary-yellow);
  margin-bottom: 0.5rem;
}
.summary-list li i {
  font-size: 1rem;
  margin-right: 0.5rem;
  color: var(--primary-yellow);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn-success, .btn-outline-primary, .btn-outline-success {
  background: var(--primary-yellow) !important;
  color: var(--primary-black) !important;
  border: none !important;
}
.btn-success:hover, .btn-outline-primary:hover, .btn-outline-success:hover {
  background: #ffe082 !important;
  color: var(--primary-black) !important;
}
.btn-outline-danger {
  border-radius: 6px;
  font-weight: 500;
  padding: 0.35rem 0.8rem;
  font-size: 0.98rem;
  transition: all 0.2s;
  color: #fff;
  background: #18181b;
  border: none;
}
.btn-outline-danger:hover {
  background: #ffd600;
  color: #18181b;
}
.table-success {
  background: #fff9c4 !important;
  color: #18181b !important;
}
.table th {
  background: #fff9c4 !important;
  color: #18181b !important;
  font-weight: 700;
  border: none;
}
.table td {
  border-top: 1px solid #ffe082;
  background: var(--admin-card-bg);
}
.table tr:hover {
  background: #fffde7;
}
@media (max-width: 991px) {
  .admin-layout {
    flex-direction: column;
  }
  .admin-sidebar {
    width: 100vw;
    min-height: unset;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    border-right: none;
    border-bottom: 1px solid #ffe082;
    box-shadow: none;
    position: static;
    padding: 0.7rem 0.5rem;
    z-index: 20;
  }
  .admin-ola {
    display: none;
  }
  .nav {
    flex-direction: row;
    gap: 0.5rem;
    width: 100vw;
  }
  .sidebar-btn {
    font-size: 0.95rem;
    padding: 0.5rem 0.7rem;
    border-radius: 6px;
    margin-bottom: 0;
  }
  .admin-main {
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
  }
}
@media (max-width: 700px) {
  .admin-main {
    padding: 0;
  }
}
</style> 