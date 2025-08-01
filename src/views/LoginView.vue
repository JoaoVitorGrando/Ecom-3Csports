<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-logo">
        <span>3C </span><span class="amarelo">sports</span>
      </div>
      
      <h1 class="login-title">Entrar na sua conta</h1>
      <p class="login-subtitle">Faça login para continuar</p>
      
      <form @submit.prevent="handleLogin" class="login-form" novalidate>
        <div class="form-group">
          <label for="email" class="form-label">
            E-mail <span class="required">*</span>
          </label>
          <div class="input-wrapper">
            <input 
              v-model="email" 
              type="email" 
              class="form-input" 
              :class="{ 'error': emailError, 'success': emailValid }"
              id="email" 
              name="email"
              placeholder="Digite seu e-mail"
              autocomplete="email"
              :disabled="isLoading"
              @blur="validateEmail"
              @input="clearEmailError"
              required 
            />
            <i class="bi bi-envelope input-icon"></i>
            <div v-if="emailError" class="error-message">{{ emailError }}</div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">
            Senha <span class="required">*</span>
          </label>
          <div class="input-wrapper">
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              class="form-input" 
              :class="{ 'error': passwordError, 'success': passwordValid }"
              id="password" 
              name="password"
              placeholder="Digite sua senha"
              autocomplete="current-password"
              :disabled="isLoading"
              @blur="validatePassword"
              @input="clearPasswordError"
              required 
            />
            <i class="bi bi-lock input-icon"></i>
            <button 
              type="button" 
              class="password-toggle" 
              @click="togglePassword"
              :disabled="isLoading"
              aria-label="Mostrar/ocultar senha"
            >
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
            <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
          </div>
        </div>
        
        <div class="form-options">
          <label class="checkbox-wrapper">
            <input 
              type="checkbox" 
              v-model="rememberMe"
              :disabled="isLoading"
            />
            <span class="checkmark"></span>
            Lembrar de mim
          </label>
          <a href="#" class="forgot-password" @click.prevent="showForgotPassword">
            Esqueceu a senha?
          </a>
        </div>
        
        <button 
          type="submit" 
          class="btn-login" 
          :class="{ 'loading': isLoading }"
          :disabled="isLoading || !isFormValid"
        >
          <span v-if="!isLoading">
            <i class="bi bi-box-arrow-in-right"></i>
            Entrar
          </span>
          <span v-else class="loading-text">
            <i class="bi bi-arrow-clockwise spin"></i>
            Entrando...
          </span>
        </button>
        
        <div v-if="error" class="login-error" role="alert">
          <i class="bi bi-exclamation-triangle"></i>
          {{ error }}
        </div>
      </form>
      
      <div class="login-links">
        <p>Não tem uma conta? 
          <router-link to="/register" class="register-link">
            Registre-se aqui
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/utils/toast'

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)
const emailError = ref('')
const passwordError = ref('')
const emailValid = ref(false)
const passwordValid = ref(false)

const router = useRouter()
const auth = useAuthStore()

const isFormValid = computed(() => {
  return email.value && password.value && !emailError.value && !passwordError.value
})

onMounted(() => {
  // Focar no primeiro campo automaticamente
  document.getElementById('email')?.focus()
})

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value) {
    emailError.value = 'E-mail é obrigatório'
    emailValid.value = false
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Digite um e-mail válido'
    emailValid.value = false
  } else {
    emailError.value = ''
    emailValid.value = true
  }
}

function validatePassword() {
  if (!password.value) {
    passwordError.value = 'Senha é obrigatória'
    passwordValid.value = false
  } else if (password.value.length < 6) {
    passwordError.value = 'Senha deve ter pelo menos 6 caracteres'
    passwordValid.value = false
  } else {
    passwordError.value = ''
    passwordValid.value = true
  }
}

function clearEmailError() {
  if (emailError.value) {
    emailError.value = ''
    emailValid.value = false
  }
}

function clearPasswordError() {
  if (passwordError.value) {
    passwordError.value = ''
    passwordValid.value = false
  }
}

function togglePassword() {
  showPassword.value = !showPassword.value
}

function showForgotPassword() {
  showToast('Funcionalidade em desenvolvimento', 'info')
}

async function handleLogin() {
  if (!isFormValid.value) {
    showToast('Por favor, corrija os erros no formulário', 'warning')
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    await auth.login(email.value, password.value)
    
    if (rememberMe.value) {
      localStorage.setItem('rememberEmail', email.value)
    } else {
      localStorage.removeItem('rememberEmail')
    }

    showToast('Login realizado com sucesso!', 'success')
    
    // Redirecionamento baseado no papel do usuário
    if (auth.role === 'ADMIN') {
      router.push('/admin')
    } else if (auth.role === 'MODERATOR') {
      router.push('/moderador')
    } else {
      router.push('/')
    }
  } catch (e) {
    let msg = 'Erro ao fazer login'
    
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
    showToast(`Erro ao fazer login: ${msg}`, 'error')
  } finally {
    isLoading.value = false
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
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
}

.login-card {
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 8px 40px rgba(24,24,27,0.15);
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 380px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  position: relative;
  overflow: hidden;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #FFD600, #18181b);
}

.login-logo {
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: 2px;
  margin-bottom: 0.8rem;
  color: #18181b;
}

.login-logo .amarelo {
  color: #FFD600;
}

.login-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #18181b;
  margin-bottom: 0.3rem;
  letter-spacing: 1px;
  text-align: center;
}

.login-subtitle {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-label {
  color: #18181b;
  font-weight: 600;
  margin-bottom: 0.4rem;
  display: block;
  font-size: 0.9rem;
}

.required {
  color: #dc3545;
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  border-radius: 0.8rem;
  border: 2px solid #e1e5e9;
  padding: 0.8rem 0.8rem 0.8rem 2.5rem;
  font-size: 0.95rem;
  background: #f8fafc;
  color: #18181b;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #FFD600;
  background: #fff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 214, 0, 0.1);
}

.form-input.error {
  border-color: #dc3545;
  background: #fff5f5;
}

.form-input.success {
  border-color: #28a745;
  background: #f8fff9;
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-icon {
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 1rem;
}

.password-toggle {
  position: absolute;
  right: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
  transition: color 0.2s;
}

.password-toggle:hover {
  color: #18181b;
}

.password-toggle:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
  font-size: 0.85rem;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  color: #666;
}

.checkbox-wrapper input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 16px;
  height: 16px;
  border: 2px solid #ddd;
  border-radius: 3px;
  position: relative;
  transition: all 0.2s;
}

.checkbox-wrapper input[type="checkbox"]:checked + .checkmark {
  background: #FFD600;
  border-color: #FFD600;
}

.checkbox-wrapper input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #18181b;
  font-size: 10px;
  font-weight: bold;
}

.forgot-password {
  color: #FFD600;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
  font-size: 0.85rem;
}

.forgot-password:hover {
  color: #18181b;
}

.btn-login {
  background: #FFD600;
  color: #18181b;
  font-weight: 700;
  border: none;
  border-radius: 0.8rem;
  padding: 0.9rem 0;
  width: 100%;
  font-size: 1rem;
  box-shadow: 0 4px 16px rgba(255,214,0,0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.btn-login:hover:not(:disabled) {
  background: #18181b;
  color: #FFD600;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(24,24,27,0.2);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-login.loading {
  background: #18181b;
  color: #FFD600;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.login-error {
  background: #fff3cd;
  color: #856404;
  border-radius: 0.8rem;
  padding: 0.8rem;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid #FFD600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.login-links {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.register-link {
  color: #FFD600;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.register-link:hover {
  color: #18181b;
}

@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }
  
  .login-card {
    padding: 2rem 1.5rem 1.5rem 1.5rem;
  }
  
  .login-title {
    font-size: 1.6rem;
  }
  
  .form-options {
    flex-direction: column;
    gap: 0.8rem;
    align-items: flex-start;
  }
}
</style> 