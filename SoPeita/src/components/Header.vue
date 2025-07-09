<template>
  <nav :class="['navbar header-fixed py-3', isDark ? 'navbar-dark' : 'navbar-light']">
    <div class="container-fluid d-flex align-items-center position-relative flex-wrap" style="min-height:64px;">
      <button class="btn btn-outline-success me-2 position-relative z-2 d-lg-none" @click="openSideMenu" aria-label="Abrir menu lateral">
        <i class="bi bi-list fs-3"></i>
      </button>
      <router-link class="navbar-brand fw-bold fs-3 d-flex align-items-center gap-2 mx-0 site-title-link" to="/" style="pointer-events:auto;">
        <img :src="logo" alt="Logo" class="logo-img" />
        <span class="site-title">soPeita</span>
      </router-link>
      <ul class="nav nav-categories d-none d-lg-flex ms-4">
        <li v-for="cat in categories" :key="cat.id" class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">{{ cat.name }}</a>
          <ul class="dropdown-menu">
            <li v-for="sub in cat.subcategories" :key="sub.id">
              <router-link class="dropdown-item" :to="{ name: 'produtos', query: { categoria: cat.id, subcategoria: sub.id } }">{{ sub.name }}</router-link>
            </li>
          </ul>
        </li>
      </ul>
      <form class="search-bar mx-auto flex-grow-1 d-none d-md-flex" @submit.prevent="onSearch" style="max-width: 340px; min-width: 180px;">
        <input v-model="searchQuery" type="text" class="form-control rounded-pill px-3" placeholder="Buscar produtos..." aria-label="Buscar produtos" />
        <button type="submit" class="btn btn-success rounded-pill ms-2 px-3"><i class="bi bi-search"></i></button>
      </form>
      <div class="d-flex align-items-center gap-2 ms-auto position-relative z-2">
        <button @click="toggleTheme" class="btn btn-outline-secondary btn-sm rounded-pill" :title="isDark ? 'Tema claro' : 'Tema escuro'">
          <i :class="isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill'"></i>
        </button>
        <button @click="openCartDrawer" class="btn btn-success position-relative d-flex align-items-center justify-content-center rounded-pill px-3" style="min-width:48px;">
          <i class="bi bi-cart3 fs-4"></i>
          <span v-if="cartCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size:0.85rem; min-width:22px;">{{ cartCount }}</span>
        </button>
        <template v-if="isAuth">
          <div class="dropdown profile-dropdown">
            <button class="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center profile-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-person-circle fs-3"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end mt-2 shadow profile-menu">
              <li class="px-3 py-2">
                <div class="fw-bold">{{ user?.name || user?.email }}</div>
                <div class="small text-muted">{{ user?.email }}</div>
                <div class="badge bg-success mt-2">{{ user?.role === 'ADMIN' ? 'Administrador' : user?.role === 'MODERATOR' ? 'Moderador' : 'Cliente' }}</div>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li v-if="user?.role === 'ADMIN'">
                <router-link class="dropdown-item" to="/admin"><i class="bi bi-speedometer2 me-2"></i> Painel Admin</router-link>
              </li>
              <li><router-link class="dropdown-item" to="/perfil"><i class="bi bi-person-lines-fill me-2"></i> Meu Perfil</router-link></li>
              <li><button class="dropdown-item text-danger" @click="logout"><i class="bi bi-box-arrow-right me-2"></i> Sair</button></li>
            </ul>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="btn btn-outline-success rounded-pill px-3">Entrar</router-link>
        </template>
      </div>
      <CartDrawer :open="cartDrawer.isOpen" @close="cartDrawer.closeDrawer" />
      <SideMenu :open="showSideMenu" @close="closeSideMenu" />
    </div>
    <form class="search-bar d-flex d-md-none px-2 mt-2" @submit.prevent="onSearch">
      <input v-model="searchQuery" type="text" class="form-control rounded-pill px-3" placeholder="Buscar produtos..." aria-label="Buscar produtos" />
      <button type="submit" class="btn btn-success rounded-pill ms-2 px-3"><i class="bi bi-search"></i></button>
    </form>
    <ul class="nav nav-categories-mobile d-lg-none px-2 mt-2">
      <li v-for="cat in categories" :key="cat.id" class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">{{ cat.name }}</a>
        <ul class="dropdown-menu">
          <li v-for="sub in cat.subcategories" :key="sub.id">
            <router-link class="dropdown-item" :to="{ name: 'produtos', query: { categoria: cat.id, subcategoria: sub.id } }">{{ sub.name }}</router-link>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CartDrawer from './CartDrawer.vue'
import { useCartDrawerStore } from '@/stores/cartDrawer'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import SideMenu from './SideMenu.vue'
import logo from '../assets/logo.png'

const auth = useAuthStore()
const router = useRouter()
const cartDrawer = useCartDrawerStore()
const cartStore = useCartStore()

const user = computed(() => auth.user)
const isAdmin = computed(() => auth.role === 'ADMIN')
const isAuth = computed(() => !!auth.token)

const cartCount = computed(() => {
  return Array.isArray(cartStore.items)
    ? cartStore.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : 0
})

function logout() {
  auth.logout()
  router.push('/login')
}

const isDark = ref(localStorage.getItem('theme') === 'dark')
function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function openCartDrawer() { cartDrawer.openDrawer() }
function closeCartDrawer() { cartDrawer.closeDrawer() }

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

// Mock de categorias/subcategorias (substituir por chamada à API futuramente)
const categories = ref([
  { id: 1, name: 'Futebol', subcategories: [ { id: 11, name: 'Chuteiras' }, { id: 12, name: 'Bolas' } ] },
  { id: 2, name: 'Corrida', subcategories: [ { id: 21, name: 'Tênis' }, { id: 22, name: 'Acessórios' } ] },
  { id: 3, name: 'Academia', subcategories: [ { id: 31, name: 'Roupas' }, { id: 32, name: 'Equipamentos' } ] }
])

onMounted(() => {
  cartStore.fetchItems()
  // Aqui você pode buscar categorias reais da API e atualizar categories.value
})
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
  color: #1a1a1a;
}
.logo-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  display: block;
}
.ms-auto { margin-left: auto !important; }
.search-bar input[type="text"] {
  min-width: 0;
  width: 100%;
}
.nav-categories {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 1.5rem;
}
.nav-categories-mobile {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 1rem;
  overflow-x: auto;
}
@media (max-width: 991px) {
  .nav-categories { display: none !important; }
  .nav-categories-mobile { display: flex !important; }
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
.profile-btn {
  width: 44px;
  height: 44px;
  font-size: 1.7rem;
  padding: 0;
  border-radius: 50%;
  background: #f8f9fa;
  border: 1.5px solid #d1d5db;
  transition: box-shadow 0.2s, border 0.2s;
}
.profile-btn:focus, .profile-btn:hover {
  box-shadow: 0 0 0 2px #21ba4533;
  border-color: #21ba45;
}
.profile-dropdown .dropdown-menu {
  min-width: 220px;
  border-radius: 1rem;
  border: none;
  box-shadow: 0 4px 24px rgba(0,0,0,0.13);
  padding: 0.5rem 0;
}
.profile-menu .badge {
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.4em 0.8em;
}
.profile-menu .dropdown-item {
  font-size: 1.08rem;
  border-radius: 0.7rem;
  transition: background 0.2s;
}
.profile-menu .dropdown-item:active, .profile-menu .dropdown-item:focus {
  background: #e9fbe7;
  color: #21ba45;
}
</style> 