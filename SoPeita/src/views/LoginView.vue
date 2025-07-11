<template>
  <div class="container d-flex align-items-center justify-content-center min-vh-100">
    <div class="card shadow p-4" style="max-width: 400px; width: 100%;">
      <h2 class="mb-4 text-center fw-bold text-success">Entrar</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">E-mail</label>
          <input v-model="email" type="email" class="form-control" id="email" required />
        </div>
        <div class="mb-3">
          <label for="senha" class="form-label">Senha</label>
          <input v-model="senha" type="password" class="form-control" id="senha" required />
        </div>
        <button type="submit" class="btn btn-success w-100 fw-bold">Entrar</button>
        <div v-if="error" class="alert alert-danger mt-3 py-2 text-center">{{ error }}</div>
      </form>
      <div class="text-center mt-3">
        <router-link to="/register" class="text-success">Não tem uma conta? Registre-se</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/utils/toast'

const email = ref('')
const senha = ref('')
const error = ref('')
const router = useRouter()
const auth = useAuthStore()

async function handleLogin() {
  try {
    await auth.login(email.value, senha.value)
    showToast('Login realizado com sucesso!', 'success')
    router.push('/')
  } catch (e) {
    error.value = 'Login inválido!'
    showToast('Erro ao fazer login: ' + (e?.detail || e?.message || 'Erro interno'), 'error')
  }
}
</script> 