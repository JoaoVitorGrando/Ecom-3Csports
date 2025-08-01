<template>
  <nav :class="['header-navbar', isDark ? 'header-dark' : 'header-light']">
    <div class="header-container">
      <router-link class="header-brand" to="/">
        <span class="brand-text brand-preto">3C</span> 
        <span class="brand-text brand-amarelo">sports</span>
      </router-link>
      
      <form class="search-bar search-mobile" @submit.prevent="onSearch">
        <input 
          v-model="searchQuery" 
          class="search-input" 
          placeholder="Buscar..." 
          aria-label="Buscar produtos" 
        />
        <button type="submit" class="search-btn">
          <i class="bi bi-search search-icon"></i>
        </button>
      </form>
      
      <ul class="nav-categories">
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'produtos', query: { categoria: 'Futebol' } }">
            Futebol
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'produtos', query: { categoria: 'Corrida' } }">
            Corrida
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'produtos', query: { categoria: 'Academia' } }">
            Academia
          </router-link>
        </li>
      </ul>
      
      <form class="search-bar search-desktop" @submit.prevent="onSearch">
        <input 
          v-model="searchQuery" 
          type="text" 
          class="search-input" 
          placeholder="Buscar produtos..." 
          aria-label="Buscar produtos" 
        />
        <button type="submit" class="search-btn">
          <i class="bi bi-search search-icon"></i>
        </button>
      </form>
      
      <div class="header-actions">
        <button 
          @click="toggleTheme" 
          class="theme-btn" 
          :title="isDark ? 'Tema claro' : 'Tema escuro'"
        >
          <i :class="isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill'"></i>
        </button>
        
        <button 
          v-if="user?.role === 'CLIENT' || user?.role === 'ADMIN'" 
          @click="openCartDrawer" 
          class="cart-btn"
        >
          <i class="bi bi-cart3 cart-icon"></i>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </button>
        
        <template v-if="isAuth">
          <div class="profile-dropdown">
            <button 
              class="profile-btn" 
              @click="toggleProfileMenu"
              :class="{ 'active': showProfileMenu }"
            >
              <i class="bi bi-person-circle"></i>
            </button>
            <ul v-if="showProfileMenu" class="profile-menu">
              <li class="profile-header">
                <div class="profile-name">{{ user?.name || user?.email }}</div>
                <div class="profile-email">{{ user?.email }}</div>
                <div class="profile-role">
                  {{ user?.role === 'ADMIN' ? 'Administrador' : user?.role === 'MODERATOR' ? 'Moderador' : 'Cliente' }}
                </div>
              </li>
              <li v-if="user?.role === 'ADMIN'">
                <router-link class="profile-item" to="/admin">
                  <i class="bi bi-speedometer2"></i> Painel Admin
                </router-link>
              </li>
              <li v-if="user?.role === 'MODERATOR'">
                <router-link class="profile-item" to="/moderador">
                  <i class="bi bi-speedometer2"></i> Painel Moderador
                </router-link>
              </li>
              <li>
                <router-link class="profile-item" to="/perfil">
                  <i class="bi bi-person-lines-fill"></i> Meu Perfil
                </router-link>
              </li>
              <li>
                <a class="profile-item" href="#" @click.prevent="goToPerfil">
                  <i class="bi bi-box-seam"></i> Pedidos
                </a>
              </li>
              <li>
                <button class="profile-item logout-item" @click="logout">
                  <i class="bi bi-box-arrow-right"></i> Sair
                </button>
              </li>
            </ul>
          </div>
        </template>
        
        <template v-else>
          <router-link to="/login" class="login-btn">Entrar</router-link>
        </template>
      </div>
      
      <CartDrawer :open="cartDrawer.isOpen" @close="cartDrawer.closeDrawer" />
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import CartDrawer from './CartDrawer.vue'
import { useCartDrawerStore } from '@/stores/cartDrawer'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const auth = useAuthStore()
const router = useRouter()
const cartDrawer = useCartDrawerStore()
const cartStore = useCartStore()

const user = computed(() => auth.user)
const isAdmin = computed(() => auth.role === 'ADMIN')
const isAuth = computed(() => !!auth.token)
const showProfileMenu = ref(false)

const cartCount = computed(() => {
  return Array.isArray(cartStore.items)
    ? cartStore.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : 0
})

function logout() {
  auth.logout()
  router.push('/login')
}

function goToPerfil() {
  router.push({ path: '/perfil', hash: '#pedidos' })
}

const isDark = ref(localStorage.getItem('theme') === 'dark')
function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function openCartDrawer() { 
  cartDrawer.openDrawer() 
}

function closeCartDrawer() { 
  cartDrawer.closeDrawer() 
}

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
}

function closeProfileMenu() {
  showProfileMenu.value = false
}

const searchQuery = ref('')
function onSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'produtos', query: { q: searchQuery.value.trim() } })
    searchQuery.value = ''
  }
}

onMounted(() => {
  cartStore.fetchItems()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleClickOutside(event) {
  const dropdown = document.querySelector('.profile-dropdown')
  if (dropdown && !dropdown.contains(event.target)) {
    showProfileMenu.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.header-navbar {
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
  padding: 0.75rem 0;
}

.header-dark {
  background: var(--color-bg-header);
  color: var(--color-text-light);
  border-bottom: 1px solid var(--color-border);
}

.header-container {
  display: flex;
  align-items: center;
  position: relative;
  flex-wrap: wrap;
  min-height: 64px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-brand {
  text-decoration: none !important;
  color: #18181b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 1rem;
  font-weight: 800;
  font-size: 1.8rem;
  letter-spacing: -0.025em;
  transition: color 0.3s ease;
}

.brand-text {
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}

.brand-preto {
  color: #18181b !important;
}

.brand-amarelo {
  color: #FFD600 !important;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-mobile {
  display: flex;
  margin-left: 0.5rem;
  flex-shrink: 1;
  max-width: 140px;
  min-width: 0;
  height: 36px;
}

.search-desktop {
  display: none;
  margin: 0 auto;
  flex-grow: 1;
  max-width: 340px;
  min-width: 180px;
}

.search-input {
  flex: 1;
  border: 2px solid #e1e5e9;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  background: #f8fafc;
  color: #18181b;
  transition: all 0.3s ease;
  min-width: 0;
}

.search-input:focus {
  outline: none;
  border-color: #FFD600;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255, 214, 0, 0.1);
}

.search-btn {
  background: #fff;
  border: 2px solid #e1e5e9;
  color: #18181b;
  border-radius: 50px;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.1rem;
  width: 44px;
  height: 44px;
}

.search-btn:hover {
  background: #f8f9fa;
  border-color: #d1d5db;
  color: #18181b;
}

.search-icon {
  color: #18181b;
}

.nav-categories {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 1.2rem;
  margin-left: 1rem;
}

.nav-item {
  list-style: none;
}

.nav-link {
  color: #18181b;
  font-weight: 600;
  font-size: 1.08rem;
  text-decoration: none;
  transition: all 0.2s ease;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  position: relative;
}

.nav-link:hover {
  color:rgb(0, 0, 0) !important;
  background: rgba(150, 149, 149, 0.1);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: auto;
  position: relative;
  z-index: 2;
  padding-right: 0.5rem;
}

.theme-btn {
  background: #fff;
  border: 2px solid #e1e5e9;
  color: #6c757d;
  border-radius: 50px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: none;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-btn:hover {
  background: #f8f9fa;
  border-color: #d1d5db;
  color: #6c757d;
}

.cart-btn {
  background: #fff;
  border: 2px solid #e1e5e9;
  color: #18181b;
  border-radius: 50px;
  padding: 0.5rem 0.75rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.cart-btn:hover {
  background: #f8f9fa;
  border-color: #d1d5db;
  color: #18181b;
}

.cart-icon {
  font-size: 1.5rem;
  color: #18181b;
}

.cart-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #dc3545;
  color: #fff;
  font-size: 0.78rem;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1.5px solid #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  padding: 0 2px;
}

.profile-dropdown {
  position: relative;
}

.profile-btn {
  width: 44px;
  height: 44px;
  background: #fff;
  border: 2px solid #e1e5e9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, border 0.2s, color 0.2s;
  font-size: 1.5rem;
  color: #18181b;
  outline: none;
}

.profile-btn:hover,
.profile-btn.active,
.profile-btn:focus {
  background: #f5f5f5;
  border-color: #bdbdbd;
  color: #18181b;
}

.profile-menu {
  position: absolute;
  top: 110%;
  right: 0;
  margin-top: 0.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 0.5rem 0;
  min-width: 210px;
  list-style: none;
  z-index: 1000;
  border: 1px solid #e1e5e9;
}

.profile-header {
  padding: 0.9rem 1rem 0.7rem 1rem;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 0.2rem;
  background: #fafafa;
  border-radius: 12px 12px 0 0;
}

.profile-name {
  font-size: 1.08rem;
  color: #18181b;
  font-weight: 600;
  margin-bottom: 0.15rem;
}

.profile-email {
  color: #888;
  font-size: 0.97rem;
  margin-bottom: 0.3rem;
}

.profile-role {
  color: #888;
  font-size: 0.92rem;
  font-weight: 400;
  margin-top: 0.1rem;
}

.profile-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1rem;
  color: #18181b;
  text-decoration: none;
  font-size: 1.04rem;
  border-radius: 6px;
  transition: background 0.18s, color 0.18s;
  cursor: pointer;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
}

.profile-item:hover,
.profile-item:focus {
  background: #f5f5f5;
  color: #18181b;
}

.logout-item {
  color: #888;
}

.logout-item:hover {
  background: #f5f5f5;
  color: #18181b;
}

.login-btn {
  background: #fff;
  border: 2px solid #e1e5e9;
  color: #18181b;
  border-radius: 50px;
  padding: 0.5rem 0.75rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  width: 44px;
  height: 44px;
  justify-content: center;
}

.login-btn:hover {
  background: #f8f9fa;
  border-color: #d1d5db;
  color: #18181b;
}

@media (min-width: 768px) {
  .theme-btn {
    display: flex;
  }
  
  .search-desktop {
    display: flex;
  }
  
  .search-mobile {
    display: none;
  }
}

@media (max-width: 991px) {
  .nav-categories {
    display: none !important;
  }
  
  .header-brand {
    font-size: 1.3rem !important;
    padding-left: 0.2rem;
  }
  
  .header-actions {
    gap: 0.15rem !important;
  }
  
  .search-mobile {
    max-width: 140px !important;
    min-width: 0 !important;
    height: 36px !important;
  }
  
  .search-mobile .search-input {
    font-size: 0.98rem !important;
    height: 32px !important;
    padding: 0.2rem 0.7rem !important;
  }
  
  .search-mobile .search-btn {
    height: 32px !important;
    font-size: 1.1rem !important;
    padding: 0.2rem 0.7rem !important;
  }
  
  .header-brand {
    margin-right: 0.3rem !important;
  }
}

@media (max-width: 600px) {
  .header-brand {
    font-size: 1.1rem !important;
    padding-left: 0.1rem;
  }
  
  .header-actions {
    gap: 0.1rem !important;
    padding-right: 0.25rem;
  }
  
  .cart-btn,
  .profile-btn,
  .theme-btn,
  .login-btn {
    width: 40px;
    height: 40px;
    font-size: 1.1rem !important;
  }
  
  .cart-icon {
    font-size: 1.3rem;
  }
}
</style> 