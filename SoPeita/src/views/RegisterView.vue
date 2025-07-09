<template>
  <div class="container d-flex align-items-center justify-content-center min-vh-100">
    <div class="card shadow p-4" style="max-width: 400px; width: 100%;">
      <h2 class="mb-4 text-center fw-bold text-success">Registrar</h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label for="nome" class="form-label">Nome</label>
          <input v-model="nome" type="text" class="form-control" id="nome" required />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">E-mail</label>
          <input v-model="email" type="email" class="form-control" id="email" required />
        </div>
        <div class="mb-3">
          <label for="senha" class="form-label">Senha</label>
          <input v-model="senha" type="password" class="form-control" id="senha" required />
        </div>
        <button type="submit" class="btn btn-success w-100 fw-bold">Registrar</button>
        <div v-if="error" class="alert alert-danger mt-3 py-2 text-center">{{ error }}</div>
        <div v-if="success" class="alert alert-success mt-3 py-2 text-center">Usuário registrado com sucesso! Faça login.</div>
      </form>
      <div class="text-center mt-3">
        <router-link to="/login" class="text-success">Já tem conta? Entrar</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { login } from '../services/authService'

const nome = ref('')
const email = ref('')
const senha = ref('')
const error = ref('')
const success = ref(false)
const router = useRouter()

async function handleRegister() {
  error.value = ''
  success.value = false
  try {
    await axios.post('http://35.196.79.227:8000/register', {
      name: nome.value,
      email: email.value,
      password: senha.value
    }, {
      headers: { 'Content-Type': 'application/json' }
    })
    await login(email.value, senha.value)
    success.value = true
    setTimeout(() => router.push('/'), 1500)
  } catch (e) {
    error.value = e.response?.data?.detail || 'Erro ao registrar usuário.'
  }
}
</script> 