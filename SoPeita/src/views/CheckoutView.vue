<template>
  <div class="checkout container py-5">
    <div class="row g-5 justify-content-center">
      <div class="col-12 col-lg-7">
        <div class="card border-0 p-4 shadow-sm mb-4">
          <h2 class="fw-bold mb-4 text-success">Dados para entrega</h2>
          <form @submit.prevent="finalizarCompra" autocomplete="off">
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label class="form-label">Nome completo</label>
                <input v-model="nome" class="form-control form-control-lg" required />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">E-mail</label>
                <input v-model="email" type="email" class="form-control form-control-lg" required />
              </div>
              <div class="col-12">
                <label class="form-label">Endereço</label>
                <input v-model="endereco" class="form-control form-control-lg" required />
              </div>
              <div class="col-6 col-md-4">
                <label class="form-label">CEP</label>
                <input v-model="cep" class="form-control form-control-lg" required />
              </div>
              <div class="col-6 col-md-4">
                <label class="form-label">Cidade</label>
                <input v-model="cidade" class="form-control form-control-lg" required />
              </div>
              <div class="col-6 col-md-2">
                <label class="form-label">UF</label>
                <input v-model="uf" class="form-control form-control-lg" maxlength="2" required />
              </div>
              <div class="col-6 col-md-2">
                <label class="form-label">Telefone</label>
                <input v-model="telefone" class="form-control form-control-lg" required />
              </div>
            </div>
            <div class="mt-4">
              <h4 class="fw-bold mb-3">Pagamento</h4>
              <div class="d-flex gap-3 mb-3">
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
                <div class="alert alert-success">Chave Pix: <b>contato@sopeita.com</b></div>
              </div>
              <div v-if="pagamento==='boleto'" class="mt-2 animate-fadein">
                <div class="alert alert-secondary">O boleto será gerado após finalizar a compra.</div>
              </div>
            </div>
            <button type="submit" class="btn btn-success btn-lg w-100 fw-bold rounded-pill py-3 mt-4 position-relative">
              <span v-if="!compraFinalizada">Finalizar Compra</span>
              <span v-else class="fadein">Compra realizada! <i class="bi bi-check-circle ms-2"></i></span>
            </button>
          </form>
        </div>
      </div>
      <div class="col-12 col-lg-5">
        <div class="card border-0 p-4 shadow-sm sticky-top resumo-pedido">
          <h4 class="fw-bold mb-4">Resumo do Pedido</h4>
          <div v-if="loading">Carregando...</div>
          <div v-else-if="erro">{{ erro }}</div>
          <div v-else>
            <div v-for="item in items" :key="item.id" class="d-flex align-items-center mb-3">
              <img :src="item.product?.image || ''" :alt="item.product?.name || ''" class="resumo-img me-3" />
              <div class="flex-grow-1">
                <div class="fw-semibold">{{ item.product?.name }}</div>
                <div class="small">R$ {{ Number(item.product?.price).toFixed(2) }} x {{ item.quantity }}</div>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center border-top pt-3 mt-4">
              <span class="fw-bold">Total</span>
              <span class="fs-5 fw-bold text-success">R$ {{ total.toFixed(2) }}</span>
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
import { useOrdersStore } from '@/stores/orders'
import { useAddressesStore } from '@/stores/addresses'
import { showToast } from '@/utils/toast'

const nome = ref('')
const email = ref('')
const endereco = ref('')
const cep = ref('')
const cidade = ref('')
const uf = ref('')
const telefone = ref('')
const pagamento = ref('cartao')
const cartao = ref({ numero: '', validade: '', cvv: '', nome: '' })
const compraFinalizada = ref(false)

const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const addressesStore = useAddressesStore()

const loading = computed(() => cartStore.loading)
const erro = computed(() => cartStore.error)
const items = computed(() => cartStore.items)

onMounted(async () => {
  await cartStore.fetchItems()
})

const total = computed(() => {
  return items.value.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
})

async function finalizarCompra() {
  try {
    await ordersStore.createOrder({
      items: items.value.map(item => ({ product_id: item.product.id, quantity: item.quantity })),
      address: { nome: nome.value, email: email.value, endereco: endereco.value, cep: cep.value, cidade: cidade.value, uf: uf.value, telefone: telefone.value },
      payment: pagamento.value
    })
    showToast('Compra finalizada com sucesso!', 'success')
    await cartStore.clearItems()
    compraFinalizada.value = true
  } catch (e) {
    showToast('Erro ao finalizar compra: ' + (e?.detail || e?.message || 'Erro interno'), 'error')
  }
}
</script>

<style scoped>
.checkout {
  max-width: 1200px;
  margin: 0 auto;
}
.card {
  border-radius: 2rem;
}
.form-label {
  font-weight: 600;
}
input.form-control-lg {
  font-size: 1.1rem;
  padding: 0.9rem 1.2rem;
  border-radius: 1.2rem;
}
.btn-lg {
  font-size: 1.15rem;
  padding: 0.9rem 1.2rem;
  border-radius: 1.2rem;
}
.btn.active, .btn:focus {
  background: #21ba45 !important;
  color: #fff !important;
  border-color: #21ba45 !important;
}
.animate-fadein {
  animation: fadeInCheckout 0.7s cubic-bezier(.4,1.6,.3,1);
}
@keyframes fadeInCheckout {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: none; }
}
.resumo-pedido {
  top: 32px;
}
.resumo-img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 1rem;
  background: #f5f5f5;
}
@media (max-width: 991px) {
  .resumo-pedido {
    position: static !important;
    margin-bottom: 32px;
  }
}
</style> 