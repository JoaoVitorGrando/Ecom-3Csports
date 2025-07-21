<template>
  <div class="perfil-wrapper-novo">
    <div class="perfil-menu-novo">
      <button :class="['perfil-menu-btn', abaAtiva === 'perfil' ? 'ativo' : '']" @click="abaAtiva = 'perfil'">
        <i class="bi bi-person-circle me-2"></i> Editar Perfil
      </button>
      <button :class="['perfil-menu-btn', abaAtiva === 'pedidos' ? 'ativo' : '']" @click="abaAtiva = 'pedidos'">
        <i class="bi bi-bag-check me-2"></i> Meus Pedidos
      </button>
    </div>
    <div class="perfil-content-novo">
      <div v-if="abaAtiva === 'perfil'" class="perfil-card-novo">
        <h2 class="perfil-title-novo mb-3"><i class="bi bi-person-circle me-2"></i>Meu Perfil</h2>
        <form @submit.prevent="salvar" class="perfil-form-novo">
        <div class="mb-3">
          <label class="form-label">Nome</label>
          <input v-model="nome" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">E-mail</label>
          <input v-model="email" type="email" class="form-control" required />
        </div>
        <div class="mb-3">
            <label class="form-label">Nova senha <span class="form-label-optional">(opcional)</span></label>
            <input v-model="senha" type="password" class="form-control" placeholder="Deixe em branco para não alterar" autocomplete="new-password" />
        </div>
          <button type="submit" class="btn-perfil-novo">Salvar alterações</button>
        <div v-if="sucesso" class="perfil-success mt-3">Dados atualizados com sucesso!</div>
      </form>
      </div>
      <div v-else-if="abaAtiva === 'pedidos'" class="pedidos-container-novo">
        <h3 class="pedidos-title-novo mb-4"><i class="bi bi-bag-check me-2"></i>Meus Pedidos</h3>
        <div v-if="ordersLoading" class="text-center py-4">Carregando pedidos...</div>
        <div v-else-if="ordersError" class="alert alert-danger text-center">{{ ordersError }}</div>
        <div v-else-if="orders.length === 0" class="text-center py-4 text-muted">Você ainda não fez nenhum pedido.</div>
        <div v-else class="pedidos-list-novo">
          <div v-for="order in orders" :key="order.id" class="pedido-card pedido-card-novo">
            <div class="pedido-header-novo d-flex flex-wrap align-items-center justify-content-between mb-2">
              <div class="d-flex flex-column flex-md-row align-items-md-center gap-2">
                <span class="pedido-id-novo">#{{ order.id }}</span>
                <span class="pedido-date-novo">{{ formatDate(order.created_at) }}</span>
                <span class="pedido-status-novo" :class="'status-' + (order.status || 'pendente').toLowerCase()">
                {{ statusLabel(order.status) }}
              </span>
              </div>
              <div class="d-flex align-items-center gap-2 mt-2 mt-md-0">
                <button class="btn btn-outline-dark btn-sm px-3 py-1 rounded-pill" @click="rastrear(order)"><i class="bi bi-truck"></i> Rastrear</button>
                <button class="btn btn-outline-secondary btn-sm px-3 py-1 rounded-pill" @click="abrirDetalhesPedido(order)">
                  <i class="bi bi-info-circle"></i> Detalhes
                </button>
              </div>
            </div>
            <div v-if="order.showDetails" class="pedido-detalhes-tabela mt-2 mb-2">
              <table class="table table-sm table-borderless mb-0">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd</th>
                    <th>Tam.</th>
                    <th>Unitário</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in order.products" :key="item.id || item.name">
                    <td class="d-flex align-items-center gap-2">
                      <img :src="getImage(item.image || item.image_path)" class="pedido-product-img-novo" alt="Produto" />
                      <span>{{ item.name }}</span>
                    </td>
                    <td>{{ item.quantity || 1 }}</td>
                    <td>{{ item.size || '-' }}</td>
                    <td>R$ {{ Number(item.price).toFixed(2) }}</td>
                    <td>R$ {{ (Number(item.price) * (item.quantity || 1)).toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
                  </div>
            <div class="pedido-footer-novo d-flex flex-wrap align-items-center justify-content-between mt-2 pt-2 border-top">
              <div>
                <div class="small text-muted">Subtotal: R$ {{
                  order.products.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0).toFixed(2)
                }}</div>
                <div v-if="order.coupon_id && cupons.length" class="small text-success">
                  Cupom aplicado: -{{ getCupomDesconto(order) }}%
                </div>
                <span class="pedido-total-novo">
                  Total: <b>R$ {{
                    getTotalComDesconto(order)
                  }}</b>
                </span>
              </div>
              <span class="pedido-status-novo badge px-3 py-2 ms-2" :class="'status-' + (order.status || 'pendente').toLowerCase()">
                {{ statusLabel(order.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="pedidoSelecionado" class="pedido-detalhes-modal">
        <div class="pedido-detalhes-header d-flex justify-content-between align-items-center mb-3">
          <h5>Detalhes do Pedido #{{ pedidoSelecionado.id }}</h5>
          <button class="btn-close" @click="fecharDetalhesPedido()"></button>
    </div>
        <div class="pedido-detalhes-menu mb-3 d-flex gap-2">
          <button :class="['pedido-detalhes-tab', abaPedido==='resumo' ? 'ativo' : '']" @click="abaPedido='resumo'">Resumo</button>
          <button :class="['pedido-detalhes-tab', abaPedido==='produtos' ? 'ativo' : '']" @click="abaPedido='produtos'">Produtos</button>
          <button :class="['pedido-detalhes-tab', abaPedido==='comprador' ? 'ativo' : '']" @click="abaPedido='comprador'">Comprador</button>
          <button :class="['pedido-detalhes-tab', abaPedido==='endereco' ? 'ativo' : '']" @click="abaPedido='endereco'">Entrega</button>
        </div>
        <div v-if="abaPedido==='resumo'">
          <div><b>Status:</b> {{ statusLabel(pedidoSelecionado.status) }}</div>
          <div><b>Data:</b> {{ formatDate(pedidoSelecionado.created_at) }}</div>
          <div><b>ID do Pedido:</b> {{ pedidoSelecionado.id }}</div>
          <div><b>Forma de Pagamento:</b> {{ pedidoSelecionado.payment_method || '-' }}</div>
          <div><b>Cupom:</b> <span v-if="pedidoSelecionado.coupon_id && cupons.length">-{{ getCupomDesconto(pedidoSelecionado) }}%</span><span v-else>-</span></div>
          <div><b>Subtotal:</b> R$ {{ pedidoSelecionado.products.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0).toFixed(2) }}</div>
          <div v-if="pedidoSelecionado.coupon_id && cupons.length"><b>Desconto:</b> -R$ {{ (pedidoSelecionado.products.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0) * (getCupomDesconto(pedidoSelecionado)/100)).toFixed(2) }}</div>
          <div><b>Total:</b> R$ {{ getTotalComDesconto(pedidoSelecionado) }}</div>
        </div>
        <div v-else-if="abaPedido==='produtos'">
          <table class="table table-sm">
            <thead><tr><th>Produto</th><th>Qtd</th><th>Tam.</th><th>Unitário</th><th>Total</th></tr></thead>
            <tbody>
              <tr v-for="item in pedidoSelecionado.products" :key="item.id || item.name">
                <td class="d-flex align-items-center gap-2">
                  <img :src="getImage(item.image || item.image_path)" class="pedido-product-img-novo" alt="Produto" />
                  <span>{{ item.name }}</span>
                </td>
                <td>{{ item.quantity || 1 }}</td>
                <td>{{ item.size || '-' }}</td>
                <td>R$ {{ Number(item.price).toFixed(2) }}</td>
                <td>R$ {{ (Number(item.price) * (item.quantity || 1)).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else-if="abaPedido==='comprador'">
          <div><b>Nome:</b> {{ pedidoSelecionado.client_name || auth.user?.name || '-' }}</div>
          <div><b>Email:</b> {{ pedidoSelecionado.client_email || auth.user?.email || '-' }}</div>
          <div><b>Telefone:</b> {{ pedidoSelecionado.client_phone || '-' }}</div>
        </div>
        <div v-else-if="abaPedido==='endereco'">
          <div><b>Endereço:</b> {{ pedidoSelecionado.address?.street || '-' }}, {{ pedidoSelecionado.address?.number || '' }}</div>
          <div><b>Bairro:</b> {{ pedidoSelecionado.address?.neighborhood || '-' }}</div>
          <div><b>Cidade:</b> {{ pedidoSelecionado.address?.city || '-' }} - {{ pedidoSelecionado.address?.state || '-' }}</div>
          <div><b>CEP:</b> {{ pedidoSelecionado.address?.zip_code || '-' }}</div>
          <div><b>Complemento:</b> {{ pedidoSelecionado.address?.complement || '-' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/utils/toast'
import { useOrdersStore } from '@/stores/orders'
import { getCoupons, getCouponsByID } from '@/services/HttpService'

const abaAtiva = ref('perfil')
const nome = ref('')
const email = ref('')
const role = ref('')
const sucesso = ref(false)
const auth = useAuthStore()
const ordersStore = useOrdersStore()
const orders = ref([])
const ordersLoading = ref(false)
const ordersError = ref('')
const senha = ref('')
const cupons = ref([])

// Adicionar refs para controle de pedido selecionado e aba interna
const pedidoSelecionado = ref(null)
const abaPedido = ref('resumo')

function getImage(path) {
  if (!path) return '/default-product.png'
  if (path.startsWith('http')) return path
  return 'http://35.196.79.227:8000' + path
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function statusLabel(status) {
  switch ((status || '').toLowerCase()) {
    case 'delivered': return 'Entregue'
    case 'shipped': return 'Enviado'
    case 'processing': return 'Processando'
    case 'cancelled': return 'Cancelado'
    case 'pending':
    default: return 'Pendente'
  }
}

async function fetchOrders() {
  if (!auth.user?.id) {
    ordersError.value = 'Você precisa estar logado para visualizar seus pedidos.'
    orders.value = []
    return
  }
  console.log('Buscando pedidos SÓ do usuário logado, ID:', auth.user.id)
  ordersLoading.value = true
  try {
    orders.value = await ordersStore.fetchClientOrders(auth.user.id) || []
    cupons.value = await getCoupons() || []
    ordersError.value = ''
    if (orders.value.length === 0) {
      ordersError.value = 'Você ainda não fez nenhum pedido.'
    }
  } catch (e) {
    if (e?.response?.status === 403) {
      ordersError.value = 'Você não tem permissão para visualizar esses pedidos. Faça login novamente.'
    } else if (e?.response?.status === 401) {
      ordersError.value = 'Sessão expirada. Faça login novamente.'
    } else {
    ordersError.value = e?.response?.data?.detail || 'Erro ao buscar pedidos.'
    }
    orders.value = []
  } finally {
    ordersLoading.value = false
  }
}

function rastrear(order) {
  showToast('Funcionalidade de rastreamento em breve!', 'info')
}

function abrirDetalhesPedido(order) {
  if (!order) return
  pedidoSelecionado.value = order
  abaPedido.value = 'resumo'
}
function fecharDetalhesPedido() {
  pedidoSelecionado.value = null
}

onMounted(async () => {
  try {
    await auth.fetchProfile()
    nome.value = auth.user?.name || ''
    email.value = auth.user?.email || ''
    role.value = auth.user?.role || ''
    await fetchOrders()
    await nextTick()
    if (window.location.hash === '#pedidos') {
      abaAtiva.value = 'pedidos'
    }
  } catch (e) {
    showToast('Erro ao carregar dados do perfil.', 'error')
  }
})

async function salvar() {
  try {
    await auth.fetchProfile()
    const patchUser = { ...auth.user, name: nome.value, email: email.value }
    if (senha.value && senha.value.length > 0) {
      patchUser.password = senha.value
    }
    await auth.$patch({ user: patchUser })
    sucesso.value = true
    showToast('Dados atualizados com sucesso!', 'success')
    senha.value = ''
    setTimeout(() => sucesso.value = false, 2000)
  } catch (e) {
    showToast('Erro ao atualizar perfil.', 'error')
  }
}

function getCupomDesconto(order) {
  if (!order.coupon_id || !cupons.value.length) return 0
  const cupom = cupons.value.find(c => c.id === order.coupon_id)
  return cupom ? cupom.discount_percentage : 0
}
function getTotalComDesconto(order) {
  const subtotal = order.products.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0)
  const desconto = getCupomDesconto(order)
  if (desconto > 0) {
    return (subtotal * (1 - desconto / 100)).toFixed(2)
  }
  return isNaN(Number(order.total)) ? subtotal.toFixed(2) : Number(order.total).toFixed(2)
}
</script>

<style scoped>
.perfil-wrapper-novo {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  min-height: 100vh;
  background: #f6f7f9;
  padding: 24px 8px 8px 8px;
}
@media (min-width: 900px) {
  .perfil-wrapper-novo {
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    gap: 2rem;
    padding: 32px 16px 16px 16px;
  }
}
.perfil-menu-novo {
  display: flex;
  flex-direction: row;
  gap: 1.2rem;
  margin-bottom: 2.2rem;
  align-items: flex-start;
}
@media (min-width: 900px) {
  .perfil-menu-novo {
    flex-direction: column;
    gap: 1.2rem;
    min-width: 200px;
    margin-bottom: 0;
  }
}
.perfil-menu-btn {
  background: #FFD600;
  border: 1.5px solid #FFD600;
  border-radius: 1.2rem;
  padding: 0.9rem 1.5rem;
  font-size: 1.08rem;
  font-weight: 700;
  color: #232323;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, border 0.18s;
  box-shadow: 0 1px 8px rgba(24,24,27,0.04);
  text-align: left;
  width: 200px;
  min-width: 180px;
  max-width: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.perfil-menu-btn.ativo, .perfil-menu-btn:hover, .perfil-menu-btn:focus {
  background: #232323;
  color: #FFD600;
  border-color: #232323;
}
.perfil-content-novo {
  flex: 1 1 600px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.perfil-card-novo {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px rgba(24,24,27,0.07);
  padding: 1.5rem 1rem 1rem 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border: 1px solid #ececec;
  margin-bottom: 0.2rem;
}
.perfil-title-novo {
  font-size: 2.2rem;
  font-weight: 900;
  color: #232323;
  letter-spacing: 0.5px;
  text-align: left;
}
.perfil-form-novo {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.btn-perfil-novo {
  background: #232323;
  color: #fff;
  font-weight: 700;
  border: none;
  border-radius: 1.2rem;
  padding: 0.8rem 0;
  width: 100%;
  font-size: 1.08rem;
  box-shadow: 0 1px 8px rgba(24,24,27,0.06);
  transition: background 0.2s, color 0.2s;
}
.btn-perfil-novo:hover, .btn-perfil-novo:focus {
  background: #FFD600;
  color: #232323;
}
.benefits-bar-novo {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 2.2rem;
  justify-content: center;
}
.benefit-card-novo {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(24,24,27,0.06);
  border: 1px solid #ececec;
  min-width: 180px;
  max-width: 220px;
  flex: 1 1 180px;
  align-items: center;
  text-align: center;
  transition: box-shadow 0.2s, transform 0.2s;
}
.benefit-card-novo:hover {
  box-shadow: 0 4px 24px rgba(24,24,27,0.10);
  transform: translateY(-4px) scale(1.03);
}
.benefit-title-novo {
  font-size: 1.13rem;
  color: #232323;
  margin-bottom: 0.2rem;
}
.benefit-desc-novo {
  font-size: 0.98rem;
  color: #888;
}
.pedidos-container-novo {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px rgba(24,24,27,0.07);
  padding: 2.5rem 2rem 2rem 2rem;
  width: 100%;
  border: 1px solid #ececec;
  min-width: 0;
}
.pedidos-title-novo {
  font-size: 1.5rem;
  font-weight: 800;
  color: #232323;
  margin-bottom: 1.2rem;
  letter-spacing: 0.5px;
  text-align: left;
}
.pedidos-list-novo {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.pedido-card-novo {
  border: 1.5px solid #e3e3e3;
  border-radius: 1.2rem;
  padding: 1.2rem 1.1rem 1.1rem 1.1rem;
  background: #f9f9fa;
  box-shadow: 0 1px 6px rgba(24,24,27,0.03);
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-bottom: 1.2rem;
}
.pedido-header-novo {
  border-bottom: 1px solid #ececec;
  padding-bottom: 0.4rem;
}
.pedido-id-novo {
  font-size: 1.05rem;
  color: #888;
  font-weight: 600;
}
.pedido-date-novo {
  font-size: 0.97rem;
  color: #bbb;
}
.pedido-status-novo {
  font-weight: 700;
  font-size: 0.98rem;
  padding: 0.25rem 0.9rem;
  border-radius: 1rem;
  background: #f3f3f3;
  color: #232323;
  text-transform: capitalize;
  min-width: 90px;
  text-align: center;
}
.status-entregue { background: #e6ffe6; color: #1a7f37; }
.status-enviado { background: #e6f0ff; color: #1a4d7f; }
.status-processando { background: #fffbe6; color: #7f6a1a; }
.status-cancelado { background: #ffe6e6; color: #7f1a1a; }
.status-pendente { background: #f3f3f3; color: #232323; }
.pedido-product-img-novo {
  width: 38px;
  height: 38px;
  object-fit: contain;
  border-radius: 0.5rem;
  background: #f8fafc;
  border: 1px solid #eee;
}
.pedido-detalhes-tabela {
  background: #fff;
  border-radius: 0.7rem;
  box-shadow: 0 1px 4px rgba(24,24,27,0.03);
  padding: 0.7rem 0.5rem;
  margin-bottom: 0.5rem;
}
.pedido-footer-novo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.3rem;
  border-top: 1px solid #ececec;
  padding-top: 0.4rem;
}
.pedido-total-novo {
  font-size: 1.08rem;
  color: #232323;
  font-weight: 700;
}
.pedido-detalhes-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pedido-detalhes-modal > div {
  background: #fff;
  border-radius: 1.2rem;
  padding: 2rem 2.5rem;
  min-width: 350px;
  max-width: 95vw;
  box-shadow: 0 2px 32px rgba(0,0,0,0.13);
}
.pedido-detalhes-header { border-bottom: 1px solid #eee; }
.pedido-detalhes-menu { gap: 0.5rem; }
.pedido-detalhes-tab {
  background: #f5f5f5;
  border: none;
  border-radius: 1rem 1rem 0 0;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  color: #232323;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.pedido-detalhes-tab.ativo, .pedido-detalhes-tab:hover {
  background: #FFD600;
  color: #232323;
}
</style> 