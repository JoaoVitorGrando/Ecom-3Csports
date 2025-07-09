<template>
  <nav :class="['navbar header-fixed py-3', isDark ? 'navbar-dark' : 'navbar-light']">
    <div class="container-fluid d-flex align-items-center position-relative" style="min-height:64px;">
      <button class="btn btn-outline-success me-2 position-relative z-2" @click="openSideMenu" aria-label="Abrir menu lateral">
        <i class="bi bi-list fs-3"></i>
      </button>
      <div class="flex-grow-1 d-flex justify-content-center align-items-center position-absolute top-0 start-0 end-0 h-100" style="pointer-events:none;">
        <router-link class="navbar-brand fw-bold fs-3 d-flex align-items-center gap-2 mx-auto site-title-link" to="/" style="pointer-events:auto;">
          <img :src="logo" alt="Logo" style="width:150px;height:150px;object-fit:contain;display:block;" />
        </router-link>
      </div>
      <!-- Barra de pesquisa -->
      <form class="search-bar mx-auto d-none d-md-flex" @submit.prevent="onSearch" style="max-width: 340px; min-width: 180px;">
        <input v-model="searchQuery" type="text" class="form-control rounded-pill px-3" placeholder="Buscar produtos..." aria-label="Buscar produtos" />
        <button type="submit" class="btn btn-success rounded-pill ms-2 px-3"><i class="bi bi-search"></i></button>
      </form>
      <div class="d-flex align-items-center gap-2 ms-auto position-relative z-2">
        <button @click="toggleTheme" class="btn btn-outline-secondary btn-sm rounded-pill" :title="isDark ? 'Tema claro' : 'Tema escuro'">
          <i :class="isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill'"></i>
        </button>
        <button @click="openCartDrawer" class="btn btn-success position-relative d-flex align-items-center justify-content-center rounded-pill px-3" style="min-width:48px;">
          <i class="bi bi-cart3 fs-4"></i>
        </button>
        <!-- Opções para usuários logados -->
        <template v-if="isAuth">
          <router-link v-if="isAdmin" to="/admin" class="btn btn-outline-primary rounded-pill px-3">Admin</router-link>
          <router-link to="/perfil" class="btn btn-outline-secondary rounded-pill px-3">Perfil</router-link>
          <span class="fw-bold mx-2">{{ user }}</span>
          <button @click="logout" class="btn btn-outline-danger btn-sm rounded-pill px-3">Sair</button>
        </template>
        <!-- Opção para não logados -->
        <template v-else>
          <router-link to="/login" class="btn btn-outline-success rounded-pill px-3">Entrar</router-link>
        </template>
      </div>
      <CartDrawer :open="showCartDrawer" @close="closeCartDrawer" />
      <SideMenu :open="showSideMenu" @close="closeSideMenu" />
    </div>
    <!-- Barra de pesquisa mobile -->
    <form class="search-bar d-flex d-md-none px-2 mt-2" @submit.prevent="onSearch">
      <input v-model="searchQuery" type="text" class="form-control rounded-pill px-3" placeholder="Buscar produtos..." aria-label="Buscar produtos" />
      <button type="submit" class="btn btn-success rounded-pill ms-2 px-3"><i class="bi bi-search"></i></button>
    </form>
  </nav>
</template>

<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import CartDrawer from './CartDrawer.vue'
import { getUser, getToken, logout as authLogout, setAuth } from '../services/authService'
import SideMenu from './SideMenu.vue'
import logo from '../assets/logo.png'

const router = useRouter()

const isAuth = ref(!!getToken())
const user = ref('')
const isAdmin = ref(false)

function updateAuth() {
  const token = getToken()
  isAuth.value = !!token
  const userData = getUser()
  user.value = userData?.name || ''
  isAdmin.value = userData?.role === 'ADMIN'
}

onMounted(() => {
  updateAuth()
  window.addEventListener('storage', updateAuth)
  if (!document.querySelector('link[href*="bootstrap-icons"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css'
    document.head.appendChild(link)
  }
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
})

watchEffect(() => {
  updateAuth()
})

function logout() {
  authLogout()
  window.dispatchEvent(new Event('storage'))
  isAuth.value = false
  user.value = ''
  router.push('/')
}

const isDark = ref(localStorage.getItem('theme') === 'dark')
function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const showMobileMenu = ref(false)
function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
  document.body.style.overflow = showMobileMenu.value ? 'hidden' : ''
}

const showCartDrawer = ref(false)
function openCartDrawer() { showCartDrawer.value = true }
function closeCartDrawer() { showCartDrawer.value = false }

const showSideMenu = ref(false)
function openSideMenu() { showSideMenu.value = true }
function closeSideMenu() { showSideMenu.value = false }

// Barra de pesquisa
const searchQuery = ref('')
function onSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'produtos', query: { q: searchQuery.value.trim() } })
    searchQuery.value = ''
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap');

.header-fixed {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(12px);
  box-shadow: none !important;
  transition: background 0.3s, box-shadow 0.3s;
}
[data-theme="dark"] .header-fixed {
  background: rgba(24,24,24,0.55);
  color: #fff;
}
.navbar {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.site-title-link {
  text-decoration: none !important;
}
.site-title {
  font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
  font-weight: 900;
  letter-spacing: 2px;
  font-size: 1.7rem;
  transition: color 0.2s;
}
.ms-auto { margin-left: auto !important; }
.search-bar input[type="text"] {
  min-width: 0;
  width: 100%;
}
@media (max-width: 700px) {
  .search-bar {
    width: 100%;
    max-width: 100%;
    margin: 0 auto 8px auto;
  }
  .container-fluid {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 0.5rem !important;
    padding: 0.5rem 0.2rem !important;
  }
  .d-flex.align-items-center.gap-2.ms-auto.position-relative.z-2 {
    flex-direction: row !important;
    justify-content: flex-start !important;
    gap: 0.5rem !important;
    margin-left: 0 !important;
    margin-top: 0.5rem !important;
  }
  .navbar {
    flex-direction: column !important;
    align-items: stretch !important;
    padding: 0.2rem 0 !important;
  }
}
</style> 