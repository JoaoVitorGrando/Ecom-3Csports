<template>
  <div class="checkout-bg">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-7">
          <div class="checkout-card shadow-lg p-5">
            <div class="steps mb-4">
              <span :class="{active: etapa === 1}">1. Entrega</span>
              <span :class="{active: etapa === 2}">2. Pagamento</span>
              <span :class="{active: etapa === 3}">3. Revisão</span>
            </div>
            <div class="text-center mb-4">
              <i class="bi bi-shield-lock-fill fs-2 icon-amarelo"></i>
              <div class="fw-bold text-amarelo mt-2">Pagamento 100% seguro</div>
              <div class="text-muted small text-preto">Ambiente criptografado. Seus dados estão protegidos.</div>
            </div>
            <div v-if="etapa === 1">
              <h4 class="mb-2 text-center">Endereço de entrega</h4>
              <div v-if="enderecos.length" class="d-flex flex-column align-items-center gap-2 mb-2">
                <div v-for="end in enderecos" :key="end.id" class="w-100" style="max-width: 420px;">
                  <div class="d-flex flex-column align-items-center justify-content-center py-2 px-3 border rounded mb-1" :class="{'border-success bg-success bg-opacity-10': enderecoSelecionado === end.id}">
                    <div class="fw-semibold">{{ end.street }}, {{ end.number }}</div>
                    <div class="small text-muted">{{ end.city }} - {{ end.state }}</div>
                    <div class="small text-muted">CEP: {{ end.zip }}</div>
                  </div>
                </div>
              </div>
              <!-- Botão adicionar novo endereço -->
              <div class="d-flex justify-content-center">
                <button class="btn btn-outline-primary rounded-pill mt-2 py-2 btn-sm btn-adc-endereco" style="max-width:220px;width:100%;" @click="showNovoEndereco = !showNovoEndereco">
                  <span v-if="!showNovoEndereco">Adicionar novo endereço</span>
                  <span v-else>Cancelar</span>
                </button>
              </div>
              <form v-if="showNovoEndereco" @submit.prevent="adicionarEndereco" class="mt-2 animate-fadein">
                <input v-model="novoEndereco.street" class="form-control mb-1" placeholder="Rua" required />
                <input v-model="novoEndereco.number" class="form-control mb-1" placeholder="Número" required />
                <input v-model="novoEndereco.zip" class="form-control mb-1" placeholder="CEP" required />
                <input v-model="novoEndereco.city" class="form-control mb-1" placeholder="Cidade" required />
                <input v-model="novoEndereco.state" class="form-control mb-1" placeholder="Estado" required />
                <input v-model="novoEndereco.country" class="form-control mb-1" placeholder="País" required />
                <!-- Botão salvar endereço -->
                <button class="btn btn-primary rounded-pill w-100 mt-1 py-2 btn-sm" type="submit">Salvar endereço</button>
              </form>
              <!-- Botão continuar para pagamento -->
              <button class="btn btn-primary rounded-pill w-100 mt-3 btn-lg py-2" :disabled="!enderecos.length" @click="etapa = 2">
                Continuar para pagamento
              </button>
            </div>
            <div v-else-if="etapa === 2">
              <h4 class="mb-3">Pagamento</h4>
              <div class="d-flex gap-3 mb-3 justify-content-center">
                <button type="button" class="btn btn-outline-success rounded-pill px-4 d-flex align-items-center gap-2" :class="{active: pagamento==='cartao'}" @click="pagamento='cartao'">
                  <i class="bi bi-credit-card-2-front"></i> Cartão
                </button>
                <button type="button" class="btn btn-outline-success rounded-pill px-4 d-flex align-items-center gap-2" :class="{active: pagamento==='pix'}" @click="pagamento='pix'">
                  <i class="bi bi-qr-code"></i> Pix
                </button>
                <button type="button" class="btn btn-outline-success rounded-pill px-4 d-flex align-items-center gap-2" :class="{active: pagamento==='boleto'}" @click="pagamento='boleto'">
                  <i class="bi bi-upc"></i> Boleto
                </button>
              </div>
              <div class="alert alert-light border d-flex align-items-center gap-2 mb-3">
                <i class="bi bi-lock-fill text-success fs-5"></i>
                <span class="small">Seus dados de pagamento são protegidos com criptografia de ponta a ponta.</span>
              </div>
              <div v-if="pagamento==='cartao'" class="row g-3 mt-2 animate-fadein">
                <div class="col-12 col-md-6">
                  <label class="form-label">Número do cartão</label>
                  <input v-model="cartao.numero" class="form-control form-control-lg" maxlength="19" placeholder="0000 0000 0000 0000" required />
                </div>
                <div class="col-6 col-md-3">
                  <label class="form-label">Validade</label>
                  <input v-model="cartao.validade" class="form-control form-control-lg" maxlength="5" placeholder="MM/AA" required />
                </div>
                <div class="col-6 col-md-3">
                  <label class="form-label">CVV</label>
                  <input v-model="cartao.cvv" class="form-control form-control-lg" maxlength="4" placeholder="123" required />
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">Nome no cartão</label>
                  <input v-model="cartao.nome" class="form-control form-control-lg" required />
                </div>
              </div>
              <div v-if="pagamento==='pix'" class="mt-2 animate-fadein">
                <div class="alert alert-success d-flex align-items-center gap-2">
                  <i class="bi bi-qr-code fs-5"></i>
                  <span>Chave Pix: <b>contato@sopeita.com</b></span>
                </div>
              </div>
              <div v-if="pagamento==='boleto'" class="mt-2 animate-fadein">
                <div class="alert alert-secondary d-flex align-items-center gap-2">
                  <i class="bi bi-upc fs-5"></i>
                  <span>O boleto será gerado após finalizar a compra.</span>
                </div>
              </div>
              <!-- Botão voltar -->
              <button class="btn btn-outline-primary rounded-pill w-100 mt-3 btn-lg py-2" @click="etapa = 1">Voltar</button>
              <!-- Botão revisar pedido -->
              <button class="btn btn-primary rounded-pill w-100 mt-2 btn-lg py-2" @click="etapa = 3">
                Revisar pedido
              </button>
            </div>
            <div v-else-if="etapa === 3">
              <h4 class="mb-3">Revisão do pedido</h4>
              <div class="alert alert-info d-flex align-items-center gap-2 mb-3">
                <i class="bi bi-shield-check fs-5 text-success"></i>
                <span class="small">Você está em um ambiente seguro. Todas as informações são confidenciais.</span>
              </div>
              <div v-for="item in items" :key="item.id" class="d-flex align-items-center mb-3">
                <img :src="getImage(item.image_path || item.image)" :alt="item.name" class="resumo-img me-3" />
                <div class="flex-grow-1">
                  <div class="fw-semibold">{{ item.name }}</div>
                  <div class="small">R$ {{ Number(item.unit_price).toFixed(2) }} x {{ item.quantity }}</div>
                </div>
                <div class="fw-bold ms-2">R$ {{ (Number(item.unit_price) * item.quantity).toFixed(2) }}</div>
              </div>
              <div class="d-flex justify-content-between align-items-center border-top pt-3 mt-4">
                <span class="fw-bold">Subtotal</span>
                <span>R$ {{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span>Frete</span>
                <span>R$ {{ frete.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span>Descontos</span>
                <span>- R$ {{ desconto.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center border-top pt-3 mt-2">
                <span class="fs-5 fw-bold text-success">Total</span>
                <span class="fs-5 fw-bold text-success">R$ {{ total.toFixed(2) }}</span>
              </div>
              <!-- Botão voltar -->
              <button class="btn btn-outline-primary rounded-pill w-100 mt-3 btn-lg py-2" @click="etapa = 2">Voltar</button>
              <!-- Botão pagar -->
              <button class="btn btn-primary rounded-pill w-100 mt-2 btn-lg py-2 d-flex align-items-center justify-content-center gap-2" @click="finalizarCompra" :disabled="compraFinalizada">
                <i class="bi bi-lock-fill"></i>
                <span v-if="!compraFinalizada">Pagar com segurança</span>
                <span v-else>Compra realizada! <i class="bi bi-check-circle ms-2"></i></span>
              </button>
              <div v-if="compraFinalizada" class="alert alert-success mt-4 animate-fadein text-center">
                <h5 class="fw-bold">Pedido realizado com sucesso!</h5>
                <p>Obrigado por comprar conosco.<br>Você pode acompanhar seus pedidos em <router-link to="/perfil">Meus Pedidos</router-link>.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-5 mt-4 mt-lg-0">
          <div class="checkout-summary shadow-sm p-4">
            <h5 class="fw-bold mb-3">Resumo do pedido</h5>
            <!-- Campo para aplicar cupom -->
            <form class="mb-3 d-flex gap-2" @submit.prevent="aplicarCupom">
              <input v-model="codigoCupom" class="form-control rounded-pill" placeholder="Cupom de desconto" style="max-width:180px;" />
              <button class="btn btn-outline-primary rounded-pill px-3" type="submit">Aplicar</button>
            </form>
            <div v-if="cupomMensagem" :class="['mb-2', cupomValido ? 'text-success' : 'text-danger']" style="font-size:0.97rem;">{{ cupomMensagem }}</div>
            <div v-for="item in items" :key="item.id" class="d-flex align-items-center mb-2">
              <img :src="getImage(item.image_path || item.image)" :alt="item.name" class="resumo-img me-2" />
              <div class="flex-grow-1">
                <div class="fw-semibold small">{{ item.name }}</div>
                <div class="small">R$ {{ Number(item.unit_price).toFixed(2) }} x {{ item.quantity }}</div>
              </div>
              <div class="fw-bold ms-2 small">R$ {{ (Number(item.unit_price) * item.quantity).toFixed(2) }}</div>
            </div>
            <div class="d-flex justify-content-between mt-3">
              <span>Total</span>
              <span class="fw-bold text-success fs-5">R$ {{ total.toFixed(2) }}</span>
            </div>
            <div class="text-center mt-4">
              <i class="bi bi-shield-lock text-success fs-4"></i>
              <div class="small text-muted mt-1">Compra protegida por tecnologia de segurança avançada.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAddressesStore } from '@/stores/addresses'
import { showToast } from '@/utils/toast'
import { newOrder } from '@/services/HttpService'
import { getCoupons } from '@/services/HttpService'

const etapa = ref(1)
const pagamento = ref('cartao')
const cartao = ref({ numero: '', validade: '', cvv: '', nome: '' })
const compraFinalizada = ref(false)
const showNovoEndereco = ref(false)
const enderecoSelecionado = ref(null)
const novoEndereco = ref({ street: '', number: '', zip: '', city: '', state: '', country: '' })
const codigoCupom = ref('')
const cupomValido = ref(false)
const cupomMensagem = ref('')
const descontoCupom = ref(0)

const cartStore = useCartStore()
const addressesStore = useAddressesStore()

const loading = computed(() => cartStore.loading)
const erro = computed(() => cartStore.error)
const items = computed(() => cartStore.items)
const enderecos = computed(() => addressesStore.addresses)

onMounted(async () => {
  await cartStore.fetchItems()
  await addressesStore.fetchAddresses()
  if (enderecos.value.length) enderecoSelecionado.value = enderecos.value[0].id
})

const subtotal = computed(() => {
  return items.value.reduce((sum, item) => sum + (Number(item.unit_price) || 0) * item.quantity, 0)
})
const frete = computed(() => (subtotal.value > 200 ? 0 : 19.9))
const desconto = computed(() => descontoCupom.value)
const total = computed(() => subtotal.value + frete.value - desconto.value)

async function adicionarEndereco() {
  try {
    await addressesStore.createAddress({ ...novoEndereco.value })
    showToast('Endereço adicionado!', 'success')
    showNovoEndereco.value = false
    await addressesStore.fetchAddresses()
    if (enderecos.value.length) enderecoSelecionado.value = enderecos.value[enderecos.value.length - 1].id
    Object.assign(novoEndereco.value, { street: '', number: '', zip: '', city: '', state: '', country: '' })
  } catch (e) {
    showToast('Erro ao adicionar endereço: ' + (e?.detail || e?.message || 'Erro interno'), 'error')
  }
}

async function finalizarCompra() {
  if (!enderecoSelecionado.value) {
    showToast('Selecione um endereço de entrega!', 'error')
    return
  }
  try {
    await newOrder({
      items: items.value.map(item => ({ product_id: item.product.id, quantity: item.quantity })),
      address_id: enderecoSelecionado.value,
      payment: pagamento.value
    })
    showToast('Compra finalizada com sucesso!', 'success')
    await cartStore.clearItems()
    compraFinalizada.value = true
  } catch (e) {
    showToast('Erro ao finalizar compra: ' + (e?.detail || e?.message || 'Erro interno'), 'error')
  }
}

async function aplicarCupom() {
  try {
    const cupons = await getCoupons()
    const cupom = cupons.find(c => c.code.toLowerCase() === codigoCupom.value.trim().toLowerCase())
    if (cupom && new Date(cupom.start_date) <= new Date() && new Date() <= new Date(cupom.end_date)) {
      descontoCupom.value = (subtotal.value * (cupom.discount_percentage / 100))
      cupomValido.value = true
      cupomMensagem.value = `Cupom aplicado: -${cupom.discount_percentage}%`;
    } else {
      descontoCupom.value = 0
      cupomValido.value = false
      cupomMensagem.value = 'Cupom inválido ou expirado.'
    }
  } catch (e) {
    descontoCupom.value = 0
    cupomValido.value = false
    cupomMensagem.value = 'Erro ao validar cupom.'
  }
}

function getImage(path) {
  if (!path) return '/default-product.png'
  if (path.startsWith('http')) return path
  return 'http://35.196.79.227:8000' + path
}
</script>

<style scoped>
.checkout-bg {
  background: #f5f6fa;
  min-height: 100vh;
}
.checkout-card {
  background: #fff;
  border-radius: 1.5rem;
}
.steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}
.steps span {
  font-weight: 600;
  color: #bbb;
  padding: 0.5rem 1.2rem;
  border-radius: 2rem;
  background: #f0f0f0;
  transition: all 0.2s;
}
.steps .active {
  background: #21ba45;
  color: #fff;
}
.checkout-summary {
  background: #fff;
  border-radius: 1.2rem;
}
.resumo-img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 1rem;
  background: #f5f5f5;
}
.btn-lg {
  font-size: 1.15rem;
  padding: 0.9rem 1.2rem;
  border-radius: 1.2rem;
  font-weight: 600;
}
.endereco-card, .endereco-card:hover, .endereco-card.bg-success {
  box-shadow: none !important;
  border: none !important;
  background: none !important;
  transition: none !important;
  cursor: default;
}
.btn-adc-endereco {
  transition: background 0.18s, border-color 0.18s, color 0.18s;
}
.btn-adc-endereco:hover, .btn-adc-endereco:focus {
  background: #eaf3fb;
  border-color: #1976d2;
  color: #1976d2;
}
</style> 