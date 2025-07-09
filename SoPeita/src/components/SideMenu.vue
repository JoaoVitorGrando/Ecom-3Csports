<template>
  <transition name="slide">
    <div v-if="open" class="side-menu-overlay" @click="close"></div>
  </transition>
  <transition name="slide">
    <aside v-if="open" class="side-menu shadow-lg">
      <button class="close-btn" @click="close" aria-label="Fechar menu">×</button>
      <nav class="mt-4">
        <ul class="nav flex-column gap-3">
          <li class="nav-item">
            <a class="nav-link fw-bold fs-5" href="#" @click.prevent="navigate('/')">
              <i class="bi bi-house-door me-2"></i> Home
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-bold fs-5" href="#" @click.prevent="navigate('/produtos')">
              <i class="bi bi-bag me-2"></i> Produtos
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-bold fs-5" href="#" @click.prevent="navigate('/carrinho')">
              <i class="bi bi-cart3 me-2"></i> Carrinho
            </a>
          </li>
          <li v-if="isAuth" class="nav-item">
            <a class="nav-link fw-bold fs-5" href="#" @click.prevent="navigate('/perfil')">
              <i class="bi bi-person-circle me-2"></i> Perfil
            </a>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <a class="nav-link fw-bold fs-5 text-warning" href="#" @click.prevent="navigate('/admin')">
              <i class="bi bi-shield-lock me-2"></i> Admin
            </a>
          </li>
          <li class="nav-item mt-3">
            <button v-if="isAuth" @click="logout" class="btn btn-outline-danger w-100 rounded-pill">
              <i class="bi bi-box-arrow-right me-2"></i> Sair
            </button>
            <a v-else href="#" class="btn btn-success w-100 rounded-pill" @click.prevent="navigate('/login')">
              <i class="bi bi-box-arrow-in-right me-2"></i> Entrar
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])

const auth = useAuthStore()
const router = useRouter()

const user = computed(() => auth.user)
const isAdmin = computed(() => auth.role === 'ADMIN')
const isAuth = computed(() => !!auth.token)

function close() {
  emit('close')
}
function navigate(path) {
  if (router.currentRoute.value.path !== path) {
    router.push(path).then(() => close())
  } else {
    // Força reload da rota se já estiver nela
    router.replace('/_reload').then(() => {
      router.replace(path).then(() => close())
    })
  }
}
function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s, opacity 0.3s;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.side-menu-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3); z-index: 1000;
}
.side-menu {
  position: fixed; top: 0; left: 0; width: 290px; height: 100vh;
  background: #fff; z-index: 1100; box-shadow: 2px 0 16px rgba(0,0,0,0.12);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  display: flex; flex-direction: column;
  border-top-right-radius: 18px;
  border-bottom-right-radius: 18px;
}
.close-btn {
  background: none; border: none; font-size: 2.2rem; align-self: flex-end; color: #888;
  transition: color 0.2s;
}
.close-btn:hover { color: #e74c3c; }
.nav-link {
  display: flex; align-items: center;
  border-radius: 1.5rem;
  transition: background 0.2s, color 0.2s;
  padding: 0.7rem 1.2rem;
}
.nav-link:hover {
  background: #f0f0f0;
  color: #198754 !important;
}
[data-theme="dark"] .side-menu {
  background: #232323;
  color: #fff;
}
[data-theme="dark"] .nav-link:hover {
  background: #232323;
  color: #fff !important;
}
</style> 