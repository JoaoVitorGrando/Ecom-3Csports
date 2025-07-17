<template>
  <nav :class="['navbar header-fixed py-3', isDark ? 'navbar-dark' : 'navbar-light']">
    <div class="container-fluid d-flex align-items-center position-relative flex-wrap" style="min-height:64px;">
      <!-- Remover botão menu lateral mobile -->
      <!-- <button class="btn btn-outline-success me-2 position-relative z-2 d-lg-none" @click="openSideMenu" aria-label="Abrir menu lateral">
        <i class="bi bi-list fs-3"></i>
      </button> -->
      <router-link class="navbar-brand fw-bold fs-3 d-flex align-items-center gap-2 mx-0 site-title-link" to="/" style="pointer-events:auto;">
        <span class="fw-bold text-preto">3C</span> <span class="fw-bold text-amarelo">sports</span>
      </router-link>
      <!-- Mobile: busca ao lado da logo -->
      <form class="search-bar d-flex d-md-none align-items-center ms-2 flex-shrink-1" @submit.prevent="onSearch" style="max-width: 140px; min-width: 0; height: 36px;">
        <input v-model="searchQuery" class="form-control rounded-pill px-2 py-1" placeholder="Buscar..." aria-label="Buscar produtos" style="font-size:0.98rem; height:32px;" />
        <button type="submit" class="btn bg-amarelo rounded-pill ms-1 px-2 py-1 d-flex align-items-center justify-content-center" style="height:32px; font-size:1.1rem;"><i class="bi bi-search icon-preto"></i></button>
      </form>
      <!-- Itens desktop -->
      <ul class="nav nav-categories d-none d-lg-flex ms-4">
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'produtos', query: { categoria: 'Futebol' } }">Futebol</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'produtos', query: { categoria: 'Corrida' } }">Corrida</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'produtos', query: { categoria: 'Academia' } }">Academia</router-link>
        </li>
      </ul>
      <!-- Carrinho -->
      <!-- Remover carrinho duplicado fora do bloco de botões -->
      <!-- O carrinho deve ficar apenas dentro do <div class="d-flex align-items-center gap-2 ms-auto ..."> -->
      <!-- Lupa busca desktop -->
      <form class="search-bar mx-auto flex-grow-1 d-none d-md-flex" @submit.prevent="onSearch" style="max-width: 340px; min-width: 180px;">
        <input v-model="searchQuery" type="text" class="form-control rounded-pill px-3" placeholder="Buscar produtos..." aria-label="Buscar produtos" />
        <button type="submit" class="btn bg-amarelo rounded-pill ms-2 px-3 d-flex align-items-center justify-content-center"><i class="bi bi-search icon-preto"></i></button>
      </form>
      <!-- Lupa busca mobile -->
      <div class="d-flex align-items-center gap-2 ms-auto position-relative z-2">
        <button @click="toggleTheme" class="btn btn-outline-secondary btn-sm rounded-pill d-none d-md-flex" :title="isDark ? 'Tema claro' : 'Tema escuro'">
          <i :class="isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill'"></i>
        </button>
        <button v-if="user?.role === 'CLIENT' || user?.role === 'ADMIN'" @click="openCartDrawer" class="btn bg-amarelo position-relative d-flex align-items-center justify-content-center rounded-pill px-3" style="min-width:48px; height:44px;">
          <i class="bi bi-cart3 icon-preto" style="font-size:1.5rem;"></i>
          <span v-if="cartCount > 0" class="position-absolute badge rounded-pill bg-danger cart-badge-count">{{ cartCount }}</span>
        </button>
        <template v-if="isAuth">
          <div class="dropdown profile-dropdown">
            <button class="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center profile-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="width:44px; height:44px;">
              <i class="bi bi-person-circle" style="font-size:1.5rem;"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end mt-2 shadow profile-menu profile-dropdown-custom">
              <li class="profile-header px-3 py-3 text-center">
                <div class="profile-name fw-bold mb-1">{{ user?.name || user?.email }}</div>
                <div class="profile-email small text-muted mb-2">{{ user?.email }}</div>
                <div class="badge bg-success profile-role">{{ user?.role === 'ADMIN' ? 'Administrador' : user?.role === 'MODERATOR' ? 'Moderador' : 'Cliente' }}</div>
              </li>
              <!-- Removido divider para visual mais limpo -->
              <li v-if="user?.role === 'ADMIN'">
                <router-link class="dropdown-item profile-dropdown-item" to="/admin"><i class="bi bi-speedometer2 me-2"></i> Painel Admin</router-link>
              </li>
              <li v-if="user?.role === 'MODERATOR'">
                <router-link class="dropdown-item profile-dropdown-item" to="/moderador"><i class="bi bi-speedometer2 me-2"></i> Painel Moderador</router-link>
              </li>
              <li><router-link class="dropdown-item profile-dropdown-item" to="/perfil"><i class="bi bi-person-lines-fill me-2"></i> Meu Perfil</router-link></li>
              <li><button class="dropdown-item profile-dropdown-item no-hover" @click="logout"><i class="bi bi-box-arrow-right me-2"></i> Sair</button></li>
            </ul>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="btn btn-outline-amarelo rounded-pill px-3">Entrar</router-link>
        </template>
      </div>
      <CartDrawer :open="cartDrawer.isOpen" @close="cartDrawer.closeDrawer" />
      <!-- Remover SideMenu -->
      <!-- <SideMenu :open="showSideMenu" @close="closeSideMenu" /> -->
    </div>
    <!-- Mobile: só busca -->
    <!-- Remover busca duplicada mobile -->
    <!-- <form class="search-bar d-flex d-md-none px-2 mt-2" @submit.prevent="onSearch">
      <input v-model="searchQuery" type="text" class="form-control rounded-pill px-3" placeholder="Buscar produtos..." aria-label="Buscar produtos" />
      <button type="submit" class="btn btn-success rounded-pill ms-2 px-3"><i class="bi bi-search"></i></button>
    </form> -->
    <!-- Mobile: categorias escondidas -->
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CartDrawer from './CartDrawer.vue'
import { useCartDrawerStore } from '@/stores/cartDrawer'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
// Remover imports e lógica do SideMenu
// import SideMenu from './SideMenu.vue'
// const showSideMenu = ref(false)
// function openSideMenu() { showSideMenu.value = true }
// function closeSideMenu() { showSideMenu.value = false }

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

// Barra de pesquisa
const searchQuery = ref('')
function onSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'produtos', query: { q: searchQuery.value.trim() } })
    searchQuery.value = ''
  }
}

// Remover o bloco de categories/subcategories e o mock de categories do script.

onMounted(() => {
  cartStore.fetchItems()
  // Aqui você pode buscar categorias reais da API e atualizar categories.value
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.header-fixed {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--color-bg-header);
  backdrop-filter: blur(16px);
  box-shadow: var(--color-shadow) !important;
  transition: all 0.3s ease;
  border-bottom: 1px solid var(--color-border);
  color: #18181b !important;
}

[data-theme="dark"] .header-fixed {
  background: var(--color-bg-header);
  color: var(--color-text-light);
  border-bottom: 1px solid var(--color-border);
}
.navbar {
  padding-left: 0 !important;
  padding-right: 0 !important;
  color: #18181b !important;
}
.site-title-link {
  text-decoration: none !important;
  color: #18181b;
}
.site-title {
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  font-weight: 800;
  letter-spacing: -0.025em;
  font-size: 1.8rem;
  transition: color 0.3s ease;
  color: #18181b !important;
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
  color: #18181b !important;
}
.nav-categories {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 1.2rem;
}
.nav-categories-mobile {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 1.2rem;
}
.nav-categories .nav-link,
.nav-categories-mobile .nav-link {
  color: #18181b;
  font-weight: 600;
  font-size: 1.08rem;
  transition: color 0.2s;
}
.nav-categories .nav-link:hover,
.nav-categories-mobile .nav-link:hover {
  color: #222 !important;
}
.header-fixed .btn,
.header-fixed .profile-btn,
.header-fixed .dropdown-menu,
.header-fixed .dropdown-item,
.header-fixed .badge,
.header-fixed .form-control,
.header-fixed .navbar-brand {
  color: #18181b !important;
}
@media (max-width: 991px) {
  .nav-categories, .nav-categories-mobile {
    display: none !important;
  }
  .search-bar {
    margin-top: 0.5rem;
  }
  .header-fixed .navbar-brand {
    font-size: 1.3rem !important;
    padding-left: 0.2rem;
  }
  .header-fixed .btn, .header-fixed .profile-btn {
    font-size: 1.1rem !important;
    padding: 0.3rem 0.7rem !important;
  }
  .header-fixed .site-title {
    font-size: 1.3rem !important;
  }
  .header-fixed .d-flex.align-items-center {
    gap: 0.5rem !important;
  }
  .search-bar.d-md-none {
    max-width: 140px !important;
    min-width: 0 !important;
    height: 36px !important;
  }
  .search-bar.d-md-none input {
    font-size: 0.98rem !important;
    height: 32px !important;
    padding: 0.2rem 0.7rem !important;
  }
  .search-bar.d-md-none button {
    height: 32px !important;
    font-size: 1.1rem !important;
    padding: 0.2rem 0.7rem !important;
  }
  .navbar-brand {
    margin-right: 0.3rem !important;
  }
}
@media (max-width: 600px) {
  .header-fixed .navbar-brand {
    font-size: 1.1rem !important;
    padding-left: 0.1rem;
  }
  .header-fixed .site-title {
    font-size: 1.1rem !important;
  }
  .header-fixed .btn, .header-fixed .profile-btn {
    font-size: 1rem !important;
    padding: 0.2rem 0.5rem !important;
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
.profile-btn:focus, .profile-btn:active, .profile-btn:hover {
  box-shadow: none !important;
  outline: none !important;
  background: transparent !important;
}
.profile-dropdown .dropdown-menu {
  min-width: 220px;
  border-radius: 1rem;
  border: none;
  box-shadow: 0 4px 24px rgba(0,0,0,0.13);
  padding: 0.5rem 0;
}
.profile-menu .badge {
  background: #FFD600 !important;
  color: #18181b !important;
  font-weight: 700;
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
.btn-outline-amarelo {
  border: 2px solid #FFD600;
  color: #18181b !important;
  background: transparent;
  transition: background 0.2s, color 0.2s;
}
.btn-outline-amarelo:hover, .btn-outline-amarelo:focus {
  background: #FFD600 !important;
  color: #18181b !important;
  border-color: #FFD600 !important;
}
/* Badge de contagem do carrinho */
.cart-badge-count {
  font-size: 0.78rem;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 36px !important;
  top: 2px !important;
  z-index: 2;
  border: 1.5px solid #ecae27;
  box-shadow: 0 1px 4px rgba(0,0,0,0.10);
  padding: 0 2px;
  margin: 0 !important;
}
/* Mini modal de perfil mais bonito */
.profile-dropdown-custom {
  min-width: 220px;
  border-radius: 16px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  background: #fff;
}
.profile-header {
  margin-bottom: 0.2rem;
  border-bottom: none;
}
.profile-name {
  font-size: 1.13rem;
  color: #222;
  font-weight: 700;
  letter-spacing: 0.01em;
}
.profile-email {
  color: #888;
  font-size: 0.97rem;
}
.profile-role {
  font-size: 0.92rem;
  margin-top: 0.2rem;
}
/* Itens do dropdown de perfil com hover igual */
.profile-dropdown-item {
  transition: background 0.18s, color 0.18s;
}
.profile-dropdown-item:hover, .profile-dropdown-item:focus {
  background: #f7f7f7 !important;
  color: #f5aa1e !important;
}
/* Botão 'Sair' com mesmo hover dos outros itens, sem movimento */
.no-hover:hover, .no-hover:focus {
  background: #f7f7f7 !important;
  color: #f5aa1e !important;
  transition: background 0.18s, color 0.18s;
  outline: none !important;
  box-shadow: none !important;
  transform: none !important;
}
</style> 