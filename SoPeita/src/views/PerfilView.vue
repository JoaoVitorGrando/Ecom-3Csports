<template>
  <div class="perfil-container">
    <div class="perfil-card">
      
      <h2 class="perfil-title">Meu Perfil</h2>
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
        <button type="submit" class="btn-perfil">Salvar alterações</button>
        <div v-if="sucesso" class="perfil-success mt-3">Dados atualizados com sucesso!</div>
      </form>
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

<style scoped>
.perfil-container {
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
.perfil-card {
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
.perfil-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #18181b;
  margin-bottom: 1.5rem;
  letter-spacing: 1px;
  text-align: center;
}
.perfil-logo {
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: 2px;
  margin-bottom: 1.2rem;
  color: #18181b;
}
.perfil-logo .amarelo {
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
.btn-perfil {
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
.btn-perfil:hover, .btn-perfil:focus {
  background: #18181b;
  color: #FFD600;
}
.perfil-success {
  background: #fff3cd;
  color: #856404;
  border-radius: 1rem;
  padding: 0.7rem 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  text-align: center;
  border: 1px solid #FFD600;
}
</style> 