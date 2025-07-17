<template>
  <div class="perfil-pedidos-wrapper">
    <div class="perfil-card-area">
      <div class="perfil-card">
        <h2 class="perfil-title">Meu Perfil</h2>
        <div class="perfil-subtitle">Editar perfil:</div>
        <form @submit.prevent="salvar">
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
          <button type="submit" class="btn-perfil">Salvar alterações</button>
          <div v-if="sucesso" class="perfil-success mt-3">Dados atualizados com sucesso!</div>
        </form>
      </div>
    </div>
    <div class="pedidos-card-area">
      <div class="benefits-bar">
        <div class="benefit-mini-card">
          <i class="bi bi-truck"></i>
          <div>
            <div class="benefit-title">Entrega Garantida</div>
            <div class="benefit-desc">Loja referência no mercado.</div>
          </div>
        </div>
        <div class="benefit-mini-card">
          <i class="bi bi-shield-lock"></i>
          <div>
            <div class="benefit-title">Pagamento Seguro</div>
            <div class="benefit-desc">Aceitamos Cartão ou PIX.</div>
          </div>
        </div>
        <div class="benefit-mini-card">
          <i class="bi bi-headset"></i>
          <div>
            <div class="benefit-title">Suporte ao Cliente</div>
            <div class="benefit-desc">Seg. a Sex. 9h às 18h</div>
          </div>
        </div>
        <div class="benefit-mini-card">
          <i class="bi bi-emoji-smile"></i>
          <div>
            <div class="benefit-title">Cliente Satisfeito</div>
            <div class="benefit-desc">Garantia de compra ou seu dinheiro de volta!</div>
          </div>
        </div>
      </div>
      <div class="pedidos-container" id="pedidos">
        <h3 class="pedidos-title">Meus Pedidos</h3>
        <div v-if="ordersLoading" class="text-center py-4">Carregando pedidos...</div>
        <div v-else-if="ordersError" class="alert alert-danger text-center">{{ ordersError }}</div>
        <div v-else-if="orders.length === 0" class="text-center py-4 text-muted">Você ainda não fez nenhum pedido.</div>
        <div v-else class="pedidos-list">
          <div v-for="order in orders" :key="order.id" class="pedido-card">
            <div class="pedido-header">
              <span class="pedido-id">Pedido #{{ order.id }}</span>
              <span class="pedido-date">{{ formatDate(order.created_at) }}</span>
              <span class="pedido-status" :class="'status-' + (order.status || 'pendente').toLowerCase()">
                {{ statusLabel(order.status) }}
              </span>
            </div>
            <div class="pedido-products">
              <div v-for="item in order.items" :key="item.id" class="pedido-product">
                <img :src="getImage(item.product?.image || item.image || item.product?.image_path)" class="pedido-product-img" alt="Produto" />
                <div class="pedido-product-info">
                  <div class="pedido-product-title">{{ item.product?.name || item.name }}</div>
                  <div class="pedido-product-qtd">
                    Qtd: {{ item.quantity }}
                    <span v-if="item.size" class="pedido-product-size">&nbsp;|&nbsp;Tamanho: {{ item.size }}</span>
                  </div>
                  <div class="pedido-product-price">Unitário: R$ {{ Number(item.unit_price).toFixed(2) }}</div>
                  <div class="pedido-product-total">Total: <b>R$ {{ (Number(item.unit_price) * item.quantity).toFixed(2) }}</b></div>
                </div>
              </div>
            </div>
            <div class="pedido-footer">
              <span class="pedido-total">Total: <b>R$ {{ Number(order.total).toFixed(2) }}</b></span>
              <button class="btn-rastrear" @click="rastrear(order)">
                <i class="bi bi-truck"></i> Rastrear pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Seção de Depoimentos e Institucional -->
  <div class="depoimentos-section">
    <h3 class="depoimentos-title">O que falam sobre nós</h3>
    <div class="depoimentos-list">
      <div class="depoimento-card">
        <div class="depoimento-text">"Comprei na BlackFriday e demorou muito chegar, porém tudo perfeito, a personalização com meu nome e número ficaram ótimas."</div>
        <div class="depoimento-info">
          <span class="depoimento-nome">Chrystian Lima</span>
          <span class="depoimento-data">5 de Novembro de 2024</span>
          <span class="depoimento-verificado">Avaliação verificada</span>
        </div>
      </div>
      <div class="depoimento-card">
        <div class="depoimento-text">"Já comprei em várias vezes na BlackHype, a loja se destaca pelo compromisso com o cliente. Sempre recebi muita atenção no Suporte, Recomendo demais, Equipe Nota 10"</div>
        <div class="depoimento-info">
          <span class="depoimento-nome">João Pereira</span>
          <span class="depoimento-data">15 de Outubro de 2024</span>
          <span class="depoimento-verificado">Avaliação verificada</span>
        </div>
      </div>
      <div class="depoimento-card">
        <div class="depoimento-text">"Camiseta de ótima qualidade! Pedi do Santos NEYMAR PRIME, Chegou em torno de 22 dias e bem embalada. Comprarei novamente!"</div>
        <div class="depoimento-info">
          <span class="depoimento-nome">Amanda Valeriano</span>
          <span class="depoimento-data">28 de janeiro de 2025</span>
          <span class="depoimento-verificado">Avaliação verificada</span>
        </div>
      </div>
      <div class="depoimento-card">
        <div class="depoimento-text">"Comprei Recente e me Pediram para Avaliar, enfim Loja confiável, preços justos e qualidade top, chegou em 16 dias ÚTEIS"</div>
        <div class="depoimento-info">
          <span class="depoimento-nome">Thiago Soares</span>
          <span class="depoimento-data">10 de abril de 2025</span>
          <span class="depoimento-verificado">Avaliação verificada</span>
        </div>
      </div>
      <div class="depoimento-card">
        <div class="depoimento-text">"Rapaz, me surpreendi com a Beleza do Site e Anúncios. Os preços também são imbatíveis, Qualidade nem se fala, são tudo isso que divulgam mesmo, Estão de parabéns!"</div>
        <div class="depoimento-info">
          <span class="depoimento-nome">Tadeu Fernandes</span>
          <span class="depoimento-data">22 de abril de 2025</span>
          <span class="depoimento-verificado">Avaliação verificada</span>
        </div>
      </div>
    </div>
    <div class="institucional-bloco">
      <div class="institucional-sobre">
        <h4>Sobre a 3C Sports</h4>
        <p>Somos apaixonados por esportes e qualidade! Aqui você encontra camisetas, acessórios e produtos oficiais dos maiores clubes nacionais e internacionais, além de lançamentos exclusivos e ofertas imperdíveis. Garantimos entrega rápida, atendimento humanizado e total segurança na sua compra.</p>
      </div>
      <div class="institucional-contato">
        <h4>Fale Conosco</h4>
        <p><b>Telefone:</b> (33) 99986-8943<br>
        <b>Email:</b> suporte@3csports.com<br>
        <b>Atendimento:</b> Seg. a Sex. 9h às 18h.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/utils/toast'
import { useOrdersStore } from '@/stores/orders'

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
  if (!auth.user?.id) return
  ordersLoading.value = true
  try {
    orders.value = await ordersStore.fetchClientOrders(auth.user.id) || []
    ordersError.value = ''
  } catch (e) {
    ordersError.value = e?.response?.data?.detail || 'Erro ao buscar pedidos.'
  } finally {
    ordersLoading.value = false
  }
}

function rastrear(order) {
  // Exemplo: abrir modal ou redirecionar para página de rastreamento
  showToast('Funcionalidade de rastreamento em breve!', 'info')
}

onMounted(async () => {
  try {
    await auth.fetchProfile()
    nome.value = auth.user?.name || ''
    email.value = auth.user?.email || ''
    role.value = auth.user?.role || ''
    await fetchOrders()
    // Scroll suave para pedidos se hash estiver presente
    await nextTick()
    if (window.location.hash === '#pedidos') {
      const pedidosSection = document.getElementById('pedidos')
      if (pedidosSection) {
        pedidosSection.scrollIntoView({ behavior: 'smooth' })
      }
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
</script>

<style scoped>
.perfil-pedidos-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  min-height: 100vh;
  background: #f6f7f9;
  padding: 40px 16px 60px 16px;
}
@media (min-width: 900px) {
  .perfil-pedidos-wrapper {
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    gap: 3.5rem;
    padding: 60px 32px 80px 32px;
  }
}
.perfil-card-area {
  flex: 1 1 340px;
  max-width: 400px;
  display: flex;
  justify-content: flex-end;
}
.pedidos-card-area {
  flex: 2 1 600px;
  min-width: 0;
  display: flex;
  justify-content: flex-start;
}
.perfil-card {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px rgba(24,24,27,0.07);
  padding: 2.5rem 2rem 2rem 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border: 1px solid #ececec;
}
.perfil-title {
  font-size: 2.2rem;
  font-weight: 900;
  color: #232323;
  margin-bottom: 0.5rem;
  letter-spacing: 0.5px;
  text-align: left;
}
.perfil-subtitle {
  font-size: 1.08rem;
  color: #888;
  font-weight: 600;
  margin-bottom: 1.5rem;
  margin-top: 0.2rem;
  letter-spacing: 0.2px;
}
.form-label {
  color: #232323;
  font-weight: 600;
  margin-bottom: 0.3rem;
}
.form-control {
  border-radius: 1.2rem;
  border: 1.5px solid #e3e3e3;
  padding: 0.8rem 1.1rem;
  font-size: 1.05rem;
  margin-bottom: 1.1rem;
  background: #f8fafc;
  color: #232323;
  transition: border 0.2s;
  box-shadow: none;
}
.form-control:focus {
  border-color: #232323;
  background: #fff;
  outline: none;
}
.btn-perfil {
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
.btn-perfil:hover, .btn-perfil:focus {
  background: #FFD600;
  color: #232323;
}
.perfil-success {
  background: #f6f7f9;
  color: #232323;
  border-radius: 1rem;
  padding: 0.7rem 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  text-align: center;
  border: 1px solid #ececec;
}
.perfil-card form {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.perfil-card .mb-3 {
  margin-bottom: 1.1rem !important;
}
.form-label-optional {
  color: #bbb;
  font-size: 0.98em;
  font-weight: 400;
}
.pedidos-container {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px rgba(24,24,27,0.07);
  padding: 2.5rem 2rem 2rem 2rem;
  width: 100%;
  border: 1px solid #ececec;
  min-width: 0;
}
.pedidos-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #232323;
  margin-bottom: 1.2rem;
  letter-spacing: 0.5px;
  text-align: left;
}
.pedidos-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.pedido-card {
  border: 1.5px solid #e3e3e3;
  border-radius: 1.2rem;
  padding: 1.2rem 1.1rem 1.1rem 1.1rem;
  background: #f9f9fa;
  box-shadow: 0 1px 6px rgba(24,24,27,0.03);
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.pedido-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  gap: 0.7rem;
  border-bottom: 1px solid #ececec;
  padding-bottom: 0.4rem;
}
.pedido-status {
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
.pedido-date {
  font-size: 0.97rem;
  color: #888;
  min-width: 110px;
  text-align: right;
}
.pedido-id {
  font-size: 0.97rem;
  color: #bbb;
  min-width: 110px;
  text-align: left;
}
.pedido-products {
  display: flex;
  gap: 1.1rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}
.pedido-product {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: #fff;
  border-radius: 0.8rem;
  padding: 0.4rem 0.9rem;
  box-shadow: 0 1px 4px rgba(24,24,27,0.03);
  border: 1px solid #ececec;
}
.pedido-product-img {
  width: 46px;
  height: 46px;
  object-fit: contain;
  border-radius: 0.5rem;
  background: #f8fafc;
  border: 1px solid #eee;
}
.pedido-product-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.pedido-product-title {
  font-size: 1rem;
  font-weight: 600;
  color: #232323;
}
.pedido-product-qtd {
  font-size: 0.93rem;
  color: #888;
}
.pedido-product-size {
  color: #bbb;
  font-size: 0.93rem;
}
.pedido-product-price {
  font-size: 0.98rem;
  color: #232323;
  font-weight: 500;
}
.pedido-product-total {
  font-size: 1.01rem;
  color: #232323;
  font-weight: 600;
}
.pedido-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.3rem;
  border-top: 1px solid #ececec;
  padding-top: 0.4rem;
}
.pedido-total {
  font-size: 1.05rem;
  color: #232323;
}
.btn-rastrear {
  background: #232323;
  color: #fff;
  border: none;
  border-radius: 1.1rem;
  padding: 0.45rem 1.1rem;
  font-size: 0.98rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s, color 0.2s;
}
.btn-rastrear:hover, .btn-rastrear:focus {
  background: #FFD600;
  color: #232323;
}
/* Benefits bar */
.benefits-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
  justify-content: flex-start;
  flex-wrap: nowrap;
  overflow-x: auto;
}
@media (max-width: 900px) {
  .benefits-bar {
    flex-wrap: wrap;
    gap: 0.6rem;
  }
  .benefit-mini-card {
    min-width: 140px;
    flex: 1 1 140px;
  }
}
.benefit-mini-card {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #fff;
  border: none;
  border-radius: 0.7rem;
  padding: 0.22rem 0.6rem 0.22rem 0.5rem;
  min-width: 120px;
  max-width: 160px;
  min-height: 32px;
  box-shadow: none;
  flex: 1 1 120px;
}
.benefit-mini-card i {
  font-size: 0.95rem;
  color: #bdbdbd;
  opacity: 1;
}
.benefit-title {
  font-size: 0.91rem;
  font-weight: 600;
  color: #232323;
  margin-bottom: 0.02rem;
}
.benefit-desc {
  font-size: 0.82rem;
  color: #bdbdbd;
  font-weight: 400;
  line-height: 1.05;
}
.depoimentos-section {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px rgba(24,24,27,0.04);
  margin: 48px auto 0 auto;
  padding: 2.5rem 2rem 2.2rem 2rem;
  max-width: 1100px;
}
.depoimentos-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #232323;
  margin-bottom: 1.2rem;
  letter-spacing: 0.5px;
  text-align: left;
}
.depoimentos-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin-bottom: 2.2rem;
}
.depoimento-card {
  background: #fafbfc;
  border-radius: 1.1rem;
  box-shadow: 0 1px 6px rgba(24,24,27,0.03);
  border: 1px solid #ececec;
  padding: 1.1rem 1.2rem 0.9rem 1.2rem;
  min-width: 220px;
  max-width: 320px;
  flex: 1 1 220px;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.depoimento-text {
  font-size: 1.01rem;
  color: #232323;
  font-weight: 500;
  margin-bottom: 0.3rem;
}
.depoimento-info {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  align-items: center;
  font-size: 0.93rem;
  color: #888;
}
.depoimento-nome {
  font-weight: 700;
  color: #232323;
}
.depoimento-data {
  color: #bbb;
}
.depoimento-verificado {
  color: #1a7f37;
  font-weight: 600;
  font-size: 0.92em;
  background: #e6ffe6;
  border-radius: 0.7em;
  padding: 0.1em 0.7em;
}
.institucional-bloco {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  margin-top: 2.2rem;
  border-top: 1px solid #ececec;
  padding-top: 2.2rem;
}
.institucional-sobre, .institucional-contato {
  flex: 1 1 320px;
}
.institucional-sobre h4, .institucional-contato h4 {
  font-size: 1.08rem;
  font-weight: 800;
  color: #232323;
  margin-bottom: 0.7rem;
}
.institucional-sobre p, .institucional-contato p {
  color: #232323;
  font-size: 0.98rem;
  margin-bottom: 0;
}
</style> 