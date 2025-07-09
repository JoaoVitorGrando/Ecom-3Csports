<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h1 class="fw-bold display-4 text-success">Painel do Administrador</h1>
      <p class="lead">Gerencie produtos e usuários do marketplace.</p>
    </div>
    <div class="row g-4">
      <!-- Produtos -->
      <div class="col-12 col-lg-7">
        <div class="card p-4 border-0 shadow-sm mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="fw-bold mb-0">Produtos</h4>
            <button class="btn btn-success btn-sm fw-bold" @click="openProdutoModal()">
              <i class="bi bi-plus-circle me-1"></i> Novo Produto
            </button>
          </div>
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-success">
                <tr>
                  <th>Imagem</th>
                  <th>Nome</th>
                  <th>Time</th>
                  <th>Preço</th>
                  <th>Categoria</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="produtosLoading">
                  <td colspan="6" class="text-center">Carregando produtos...</td>
                </tr>
                <tr v-else-if="produtosError">
                  <td colspan="6" class="alert alert-danger text-center">{{ produtosError }}</td>
                </tr>
                <tr v-else v-for="produto in produtos" :key="produto.id">
                  <td>
                    <img :src="produto.imagem" alt="img" style="width:48px;height:48px;object-fit:cover;border-radius:8px;">
                  </td>
                  <td>{{ produto.nome }}</td>
                  <td>{{ produto.time }}</td>
                  <td>R$ {{ produto.preco?.toFixed(2) }}</td>
                  <td>{{ produto.categoria }}</td>
                  <td>
                    <button class="btn btn-outline-primary btn-sm me-2" @click="openProdutoModal(produto)" title="Editar">
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" @click="confirmDeleteProduto(produto)" title="Remover">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- Usuários -->
      <div class="col-12 col-lg-5">
        <div class="card p-4 border-0 shadow-sm mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="fw-bold mb-0">Usuários</h4>
            <button class="btn btn-success btn-sm fw-bold" @click="openUsuarioModal()">
              <i class="bi bi-person-plus me-1"></i> Novo Usuário
            </button>
          </div>
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-success">
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Perfil</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="usuariosLoading">
                  <td colspan="4" class="text-center">Carregando usuários...</td>
                </tr>
                <tr v-else-if="usuariosError">
                  <td colspan="4" class="alert alert-danger text-center">{{ usuariosError }}</td>
                </tr>
                <tr v-else v-for="usuario in usuarios" :key="usuario.id">
                  <td>{{ usuario.nome }}</td>
                  <td>{{ usuario.email }}</td>
                  <td>{{ usuario.role }}</td>
                  <td>
                    <button class="btn btn-outline-primary btn-sm me-2" @click="openUsuarioModal(usuario)" title="Editar">
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" @click="confirmDeleteUsuario(usuario)" title="Remover">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Produto -->
    <div v-if="showProdutoModal" class="modal-backdrop">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ produtoEditando.id ? 'Editar Produto' : 'Novo Produto' }}</h5>
            <button type="button" class="btn-close" @click="closeProdutoModal"></button>
          </div>
          <form @submit.prevent="salvarProduto">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12">
                  <div class="mb-2">
                    <label class="form-label">Nome</label>
                    <input v-model="produtoEditando.name" class="form-control" required />
                  </div>
                  <div class="mb-2">
                    <label class="form-label">Descrição</label>
                    <textarea v-model="produtoEditando.description" class="form-control" rows="2" required></textarea>
                  </div>
                  <div class="mb-2">
                    <label class="form-label">Preço</label>
                    <input v-model.number="produtoEditando.price" type="number" step="0.01" class="form-control" required />
                  </div>
                  <div class="mb-2">
                    <label class="form-label">Estoque</label>
                    <input v-model.number="produtoEditando.stock" type="number" min="0" class="form-control" required />
                  </div>
                  <div class="mb-2">
                    <label class="form-label">Categoria</label>
                    <select v-model="produtoEditando.category_id" class="form-select" required>
                      <option disabled value="">Selecione a categoria</option>
                      <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                    </select>
                  </div>
                  <div class="mb-2">
                    <label class="form-label">Imagem (URL)</label>
                    <input v-model="produtoEditando.image_path" class="form-control" required />
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeProdutoModal">Cancelar</button>
              <button type="submit" class="btn btn-success">Salvar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- Modal Usuário -->
    <div v-if="showUsuarioModal" class="modal-backdrop">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ usuarioEditando.id ? 'Editar Usuário' : 'Novo Usuário' }}</h5>
            <button type="button" class="btn-close" @click="closeUsuarioModal"></button>
          </div>
          <form @submit.prevent="salvarUsuario">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Nome</label>
                <input v-model="usuarioEditando.nome" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="usuarioEditando.email" type="email" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Senha</label>
                <input v-model="usuarioEditando.senha" type="password" class="form-control" :required="!usuarioEditando.id" />
              </div>
              <div class="mb-3">
                <label class="form-label">Perfil</label>
                <select v-model="usuarioEditando.role" class="form-select" required>
                  <option value="ADMIN">Admin</option>
                  <option value="MODERATOR">Moderator</option>
                  <option value="CLIENT">Client</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeUsuarioModal">Cancelar</button>
              <button type="submit" class="btn btn-success">Salvar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- Confirmação Remover Produto -->
    <div v-if="produtoRemover" class="modal-backdrop">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Remover Produto</h5>
            <button type="button" class="btn-close" @click="produtoRemover = null"></button>
          </div>
          <div class="modal-body">
            Tem certeza que deseja remover o produto <b>{{ produtoRemover.nome }}</b>?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="produtoRemover = null">Cancelar</button>
            <button type="button" class="btn btn-danger" @click="removerProduto">Remover</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Confirmação Remover Usuário -->
    <div v-if="usuarioRemover" class="modal-backdrop">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Remover Usuário</h5>
            <button type="button" class="btn-close" @click="usuarioRemover = null"></button>
          </div>
          <div class="modal-body">
            Tem certeza que deseja remover o usuário <b>{{ usuarioRemover.nome }}</b>?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="usuarioRemover = null">Cancelar</button>
            <button type="button" class="btn btn-danger" @click="removerUsuario">Remover</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Mensagens de feedback -->
    <div v-if="mensagem" class="alert alert-success position-fixed bottom-0 end-0 m-4" style="z-index:9999; min-width:300px;">{{ mensagem }}</div>
    <div v-if="erroMensagem" class="alert alert-danger position-fixed bottom-0 end-0 m-4" style="z-index:9999; min-width:300px;">{{ erroMensagem }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProdutos, createProduto, updateProduto, deleteProduto } from '../services/productService'
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../services/userService'

// Produtos
const produtos = ref([])
const produtosLoading = ref(true)
const produtosError = ref('')
const showProdutoModal = ref(false)
const produtoEditando = ref({})
const produtoRemover = ref(null)
const categorias = ref([])

// Usuários
const usuarios = ref([])
const usuariosLoading = ref(true)
const usuariosError = ref('')
const showUsuarioModal = ref(false)
const usuarioEditando = ref({})
const usuarioRemover = ref(null)

// Feedback
const mensagem = ref('')
const erroMensagem = ref('')

onMounted(async () => {
  carregarProdutos()
  carregarUsuarios()
  // Carregar categorias da API
  try {
    const res = await fetch('http://35.196.79.227:8000/categories/')
    categorias.value = await res.json()
  } catch {}
})

async function carregarProdutos() {
  produtosLoading.value = true
  try {
    produtos.value = await getProdutos()
    produtosError.value = ''
  } catch (e) {
    produtosError.value = 'Erro ao carregar produtos.'
  } finally {
    produtosLoading.value = false
  }
}

function openProdutoModal(produto = null) {
  if (produto) {
    produtoEditando.value = { ...produto }
  } else {
    produtoEditando.value = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category_id: '',
      image_path: ''
    }
  }
  showProdutoModal.value = true
}
function closeProdutoModal() {
  showProdutoModal.value = false
  produtoEditando.value = {}
}
async function salvarProduto() {
  try {
    if (produtoEditando.value.id) {
      await updateProduto(produtoEditando.value.id, produtoEditando.value)
    } else {
      await createProduto(produtoEditando.value)
    }
    mensagem.value = 'Produto salvo com sucesso!'
    showProdutoModal.value = false
    await carregarProdutos()
  } catch (e) {
    erroMensagem.value = 'Erro ao salvar produto.'
  }
}
function confirmDeleteProduto(produto) {
  produtoRemover.value = produto
}
async function removerProduto() {
  try {
    await deleteProduto(produtoRemover.value.id)
    mensagem.value = 'Produto removido com sucesso!'
    carregarProdutos()
  } catch (e) {
    erroMensagem.value = 'Erro ao remover produto.'
  } finally {
    produtoRemover.value = null
    setTimeout(() => { mensagem.value = ''; erroMensagem.value = '' }, 2500)
  }
}

// Usuários
async function carregarUsuarios() {
  usuariosLoading.value = true
  try {
    usuarios.value = await getUsuarios()
    usuariosError.value = ''
  } catch (e) {
    usuariosError.value = 'Erro ao carregar usuários.'
  } finally {
    usuariosLoading.value = false
  }
}
function openUsuarioModal(usuario = null) {
  usuarioEditando.value = usuario ? { ...usuario, senha: '' } : { nome: '', email: '', senha: '', role: 'CLIENT' }
  showUsuarioModal.value = true
}
function closeUsuarioModal() {
  showUsuarioModal.value = false
  usuarioEditando.value = {}
}
async function salvarUsuario() {
  try {
    if (usuarioEditando.value.id) {
      const usuarioData = { ...usuarioEditando.value }
      if (!usuarioData.senha) delete usuarioData.senha
      await updateUsuario(usuarioEditando.value.id, usuarioData)
      mensagem.value = 'Usuário atualizado com sucesso!'
    } else {
      await createUsuario(usuarioEditando.value)
      mensagem.value = 'Usuário criado com sucesso!'
    }
    closeUsuarioModal()
    carregarUsuarios()
  } catch (e) {
    erroMensagem.value = 'Erro ao salvar usuário.'
  } finally {
    setTimeout(() => { mensagem.value = ''; erroMensagem.value = '' }, 2500)
  }
}
function confirmDeleteUsuario(usuario) {
  usuarioRemover.value = usuario
}
async function removerUsuario() {
  try {
    await deleteUsuario(usuarioRemover.value.id)
    mensagem.value = 'Usuário removido com sucesso!'
    carregarUsuarios()
  } catch (e) {
    erroMensagem.value = 'Erro ao remover usuário.'
  } finally {
    usuarioRemover.value = null
    setTimeout(() => { mensagem.value = ''; erroMensagem.value = '' }, 2500)
  }
}
</script> 

<style scoped>
.table-responsive { border-radius: 1.2rem; overflow: hidden; }
.card { border-radius: 1.2rem; }
.table th, .table td { vertical-align: middle; }

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(30,30,30,0.25);
  z-index: 4000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-dialog {
  max-width: 480px;
  width: 100%;
}
.modal-content {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 24px rgba(0,0,0,0.13);
  border: none;
}
.modal-header {
  border-bottom: 1px solid #eee;
  border-radius: 1.2rem 1.2rem 0 0;
  background: #f8f9fa;
}
.modal-footer {
  border-top: 1px solid #eee;
  border-radius: 0 0 1.2rem 1.2rem;
  background: #f8f9fa;
}
.modal-body {
  padding: 2rem 1.5rem 1.5rem 1.5rem;
}
.modal-body .form-label {
  font-weight: 600;
  margin-bottom: 0.3rem;
}
.modal-body .form-control {
  margin-bottom: 1.1rem;
  padding: 0.7rem 1rem;
  font-size: 1.08rem;
  border-radius: 0.7rem;
}
</style> 