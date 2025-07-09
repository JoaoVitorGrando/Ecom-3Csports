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
import axios from 'axios'

const nome = ref('')
const email = ref('')
const role = ref('')
const sucesso = ref(false)

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://35.196.79.227:8000/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const user = response.data
    nome.value = user.nome || user.name || ''
    email.value = user.email || ''
    role.value = user.role || ''
  } catch (e) {
    alert('Erro ao carregar dados do perfil.')
  }
})

async function salvar() {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.put('http://35.196.79.227:8000/users/me', {
      name: nome.value,
      email: email.value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const user = response.data
    localStorage.setItem('user', JSON.stringify(user))
    window.dispatchEvent(new Event('storage'))
    sucesso.value = true
    setTimeout(() => sucesso.value = false, 2000)
  } catch (e) {
    alert('Erro ao atualizar perfil.')
  }
}
</script> 