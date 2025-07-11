<template>
  <div class="container py-5">
    <h2 class="fw-bold text-success mb-4 text-center">Carrinho</h2>
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-success" role="status"></div>
    </div>
    <div v-else>
      <div v-if="items.length === 0" class="text-center">
        <p>Seu carrinho está vazio :(</p>
      </div>
      <div v-else>
        <table class="table align-middle">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.product?.name }}</td>
              <td>{{ item.quantity }}</td>
              <td>R$ {{ Number(item.product?.price).toFixed(2) }}</td>
              <td>R$ {{ Number(item.product?.price * item.quantity).toFixed(2) }}</td>
              <td>
                <button class="btn btn-outline-danger btn-sm" @click="removerItem(item)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="d-flex justify-content-between align-items-center mt-4">
          <button class="btn btn-outline-danger" @click="limparCarrinho">
            Limpar carrinho
          </button>
          <button class="btn btn-success px-4" @click="irParaCheckout">
            Finalizar compra
          </button>
        </div>
      </div>
    </div>
    <div v-if="erro" class="alert alert-danger mt-3">{{ erro }}</div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { showToast } from '@/utils/toast'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const auth = useAuthStore()
const router = useRouter()

const items = computed(() => cartStore.items)
const loading = computed(() => cartStore.loading)
const erro = computed(() => cartStore.error)

onMounted(async () => {
  if (!auth.token) {
    showToast('Faça login para acessar o carrinho.', 'error')
    return
  }
  await cartStore.fetchItems()
})

async function removerItem(item) {
  try {
    await cartStore.removeItem(item.product_id || item.id)
    await cartStore.fetchItems()
    showToast('Item removido do carrinho!', 'success')
  } catch (e) {
    showToast('Erro ao remover item: ' + (e?.detail || e?.message || 'Erro interno'), 'error')
  }
}

async function limparCarrinho() {
  try {
    await cartStore.clearItems()
    await cartStore.fetchItems()
    showToast('Carrinho limpo!', 'success')
  } catch (e) {
    showToast('Erro ao limpar carrinho: ' + (e?.detail || e?.message || 'Erro interno'), 'error')
  }
}

function irParaCheckout() {
  router.push('/checkout')
}
</script> 