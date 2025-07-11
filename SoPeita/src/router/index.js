import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProdutosView from '../views/ProdutosView.vue'
import AdminView from '../views/AdminView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import PerfilView from '../views/PerfilView.vue'
import CartView from '../views/CartView.vue'
// Componente para página não encontrada (crie depois)
const NotFoundView = { template: '<div>Página não encontrada</div>' }

// Função utilitária para obter usuário do localStorage
function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user'))
  } catch {
    return null
  }
}

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/produtos', name: 'produtos', component: ProdutosView },
  { path: '/admin', name: 'admin', component: AdminView, meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/checkout', name: 'checkout', component: CheckoutView, meta: { requiresAuth: true } },
  { path: '/perfil', name: 'perfil', component: PerfilView, meta: { requiresAuth: true } },
  { path: '/carrinho', name: 'carrinho', component: CartView },
  // Rota para página não encontrada
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guarda global de navegação
router.beforeEach((to, from, next) => {
  const user = getUser()

  // Verifica se a rota exige autenticação
  if (to.meta.requiresAuth && !user) {
    return next({ name: 'login' })
  }

  // Verifica se a rota exige um papel específico
  if (to.meta.role && user?.role !== to.meta.role) {
    // Opcional: redirecionar para uma página de acesso negado
    return next({ name: 'home' })
  }

  next()
})

export default router
