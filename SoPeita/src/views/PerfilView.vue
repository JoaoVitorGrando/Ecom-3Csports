<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-7 col-lg-5">
        <div class="card p-4 shadow-sm border-0">
          <h2 class="fw-bold text-success mb-4 text-center">Meu Perfil</h2>
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
              <label class="form-label">Nível de acesso</label>
              <input v-model="role" type="text" class="form-control" disabled />
            </div>
            <button type="submit" class="btn btn-success w-100 fw-bold">Salvar alterações</button>
            <div v-if="sucesso" class="alert alert-success mt-3 text-center py-2">Dados atualizados com sucesso!</div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/utils/toast'

const nome = ref('')
const email = ref('')
const role = ref('')
const sucesso = ref(false)
const auth = useAuthStore()

onMounted(async () => {
  try {
    await auth.fetchProfile()
    nome.value = auth.user?.name || ''
    email.value = auth.user?.email || ''
    role.value = auth.user?.role || ''
  } catch (e) {
    showToast('Erro ao carregar dados do perfil.', 'error')
  }
})

async function salvar() {
  try {
    await auth.fetchProfile()
    await auth.$patch({ user: { ...auth.user, name: nome.value, email: email.value } })
    sucesso.value = true
    showToast('Dados atualizados com sucesso!', 'success')
    setTimeout(() => sucesso.value = false, 2000)
  } catch (e) {
    showToast('Erro ao atualizar perfil.', 'error')
  }
}
</script> 