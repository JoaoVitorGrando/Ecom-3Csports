<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-logo"><span>3C </span><span class="amarelo">sports</span></div>
      <h2 class="login-title">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">E-mail</label>
          <input v-model="email" type="email" class="form-control" id="email" required />
        </div>
        <div class="mb-3">
          <label for="senha" class="form-label">Senha</label>
          <input v-model="senha" type="password" class="form-control" id="senha" required />
        </div>
        <button type="submit" class="btn-login">Entrar</button>
        <div v-if="error" class="login-error mt-3">{{ error }}</div>
      </form>
      <div class="login-links">
        <router-link to="/register">Não tem uma conta? Registre-se</router-link>
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
    if (auth.role === 'ADMIN') {
      router.push('/admin')
    } else if (auth.role === 'MODERATOR') {
      router.push('/moderador')
    } else {
      router.push('/')
    }
  } catch (e) {
    let msg = 'Login inválido!'
    if (e?.response?.data?.detail) {
      msg = Array.isArray(e.response.data.detail)
        ? e.response.data.detail.map(d => d.msg || d).join(' | ')
        : e.response.data.detail
    } else if (e?.detail) {
      msg = e.detail
    } else if (e?.message) {
      msg = e.message
    }
    error.value = msg
    showToast('Erro ao fazer login: ' + msg, 'error')
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #18181b 60%, #FFD600 100%);
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box;
}
.login-card {
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 4px 32px rgba(24,24,27,0.10);
  padding: 3rem 2.5rem 2.5rem 2.5rem;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 !important;
}
.login-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #18181b;
  margin-bottom: 1.5rem;
  letter-spacing: 1px;
  text-align: center;
}
.login-logo {
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: 2px;
  margin-bottom: 1.2rem;
  color: #18181b;
}
.login-logo .amarelo {
  color: #FFD600;
}
.form-label {
  color: #18181b;
  font-weight: 600;
  margin-bottom: 0.3rem;
}
.form-control {
  border-radius: 1.5rem;
  border: 1.5px solid #FFD600;
  padding: 0.9rem 1.2rem;
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
  background: #f8fafc;
  color: #18181b;
  transition: border 0.2s;
}
.form-control:focus {
  border-color: #18181b;
  background: #fffbe6;
  outline: none;
}
.btn-login {
  background: #FFD600;
  color: #18181b;
  font-weight: 700;
  border: none;
  border-radius: 1.5rem;
  padding: 0.9rem 0;
  width: 100%;
  font-size: 1.15rem;
  box-shadow: 0 2px 12px rgba(255,214,0,0.10);
  transition: background 0.2s, color 0.2s;
}
.btn-login:hover, .btn-login:focus {
  background: #18181b;
  color: #FFD600;
}
.login-links {
  margin-top: 1.2rem;
  text-align: center;
}
.login-links a {
  color: #000000;
  font-weight: 600;
  text-decoration: none;
  margin: 0 0.5rem;
  transition: color 0.2s;
}
.login-links a:hover {
  color: #18181b;
}
.login-error {
  background: #fff3cd;
  color: #856404;
  border-radius: 1rem;
  padding: 0.7rem 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  text-align: center;
  border: 1px solid #FFD600;
}
body, html {
  height: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style> 