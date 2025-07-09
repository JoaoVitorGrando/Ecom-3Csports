<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar d-flex flex-column align-items-center py-4 px-2">
      <div class="sidebar-logo mb-4">
        <i class="bi bi-shop-window fs-2 text-success"></i>
      </div>
      <nav class="nav flex-column w-100 gap-2">
        <button class="nav-link sidebar-btn" :class="{active: tab==='dashboard'}" @click="tab='dashboard'">
          <i class="bi bi-speedometer2 me-2"></i> Dashboard
        </button>
        <button class="nav-link sidebar-btn" :class="{active: tab==='produtos'}" @click="tab='produtos'">
          <i class="bi bi-box-seam me-2"></i> Produtos
        </button>
        <button class="nav-link sidebar-btn" :class="{active: tab==='usuarios'}" @click="tab='usuarios'">
          <i class="bi bi-people me-2"></i> Usuários
        </button>
        <button class="nav-link sidebar-btn" :class="{active: tab==='pedidos'}" @click="tab='pedidos'">
          <i class="bi bi-bag-check me-2"></i> Pedidos
        </button>
        <button class="nav-link sidebar-btn" :class="{active: tab==='cupons'}" @click="tab='cupons'">
          <i class="bi bi-ticket-perforated me-2"></i> Cupons
        </button>
        <button class="nav-link sidebar-btn" :class="{active: tab==='categorias'}" @click="tab='categorias'">
          <i class="bi bi-tags me-2"></i> Categorias
        </button>
      </nav>
    </aside>
    <!-- Main -->
    <main class="admin-main">
      <header class="admin-header d-flex align-items-center justify-content-between px-4 py-3 mb-4">
        <div>
          <h2 class="fw-bold mb-1">Bem-vindo, {{ adminName }}!</h2>
          <span class="badge bg-success">Administrador</span>
        </div>
        <i class="bi bi-person-circle fs-2 text-secondary"></i>
      </header>
      <hr class="divider-h mb-4">
      <!-- Dashboard -->
      <section v-if="tab==='dashboard'">
        <div class="row g-4 mb-4">
          <div class="col-12 col-md-6 col-lg-3">
            <div class="card dashboard-card">
              <div class="card-body text-center">
                <i class="bi bi-box-seam fs-2 text-success mb-2"></i>
                <h5 class="fw-bold">Produtos</h5>
                <div class="display-6 fw-bold">{{ produtos.length }}</div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <div class="card dashboard-card">
              <div class="card-body text-center">
                <i class="bi bi-people fs-2 text-primary mb-2"></i>
                <h5 class="fw-bold">Usuários</h5>
                <div class="display-6 fw-bold">{{ usuarios.length }}</div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <div class="card dashboard-card">
              <div class="card-body text-center">
                <i class="bi bi-bag-check fs-2 text-warning mb-2"></i>
                <h5 class="fw-bold">Pedidos</h5>
                <div class="display-6 fw-bold">{{ pedidos.length }}</div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <div class="card dashboard-card">
              <div class="card-body text-center">
                <i class="bi bi-cash-coin fs-2 text-info mb-2"></i>
                <h5 class="fw-bold">Vendas</h5>
                <div class="display-6 fw-bold">R$ {{ totalVendas.toFixed(2) }}</div>
              </div>
            </div>
          </div>
    </div>
        <hr class="divider-h my-4">
        <div class="text-center text-muted">Selecione uma função no menu lateral para gerenciar o marketplace.</div>
      </section>
      <!-- Produtos -->
      <section v-else-if="tab==='produtos'">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="fw-bold mb-0">Produtos</h4>
            <button class="btn btn-success btn-sm fw-bold" @click="openProdutoModal()">
              <i class="bi bi-plus-circle me-1"></i> Novo Produto
            </button>
          </div>
        <div class="card border-0 shadow-sm rounded-4 p-0 mb-4" style="background:#fff;">
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead class="table-success">
                <tr>
                  <th class="ps-4">Imagem</th>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Desconto</th>
                  <th>Estoque</th>
                  <th>Categoria</th>
                  <th class="d-none d-md-table-cell">Descrição</th>
                  <th class="text-end pe-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="produtosLoading">
                  <td colspan="8" class="text-center py-4">Carregando produtos...</td>
                </tr>
                <tr v-else-if="produtosError">
                  <td colspan="8" class="alert alert-danger text-center">{{ produtosError }}</td>
                </tr>
                <tr v-else-if="!produtos.length">
                  <td colspan="8" class="text-center text-muted py-4">Nenhum produto cadastrado ainda.</td>
                </tr>
                <tr v-else v-for="produto in produtos" :key="produto.id">
                  <td class="ps-4">
                    <img :src="getImage(produto.image_path)" alt="img" style="width:48px;height:48px;object-fit:cover;border-radius:12px;background:#f5f5f5;">
                  </td>
                  <td class="fw-semibold">{{ produto.name }}</td>
                  <td>R$ {{ Number(produto.price).toFixed(2) }}</td>
                  <td>
                    <span v-if="getActiveDiscount(produto)" class="badge bg-danger bg-opacity-10 text-danger fs-6">
                      -{{ Number(getActiveDiscount(produto).discount_percentage).toFixed(0) }}%
                    </span>
                  </td>
                  <td>{{ produto.stock }}</td>
                  <td>{{ produto.category?.name || '-' }}</td>
                  <td class="d-none d-md-table-cell text-truncate" style="max-width:220px;">{{ produto.description }}</td>
                  <td class="text-end pe-4">
                    <button class="btn btn-outline-primary btn-sm me-2" @click="openProdutoModal(produto)" title="Editar"><i class="bi bi-pencil-square"></i></button>
                    <button class="btn btn-outline-danger btn-sm" @click="confirmDeleteProduto(produto)" title="Remover"><i class="bi bi-trash"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Modal Produto -->
        <div v-if="showProdutoModal" class="modal-backdrop d-flex align-items-center justify-content-center" style="background:rgba(0,0,0,0.15);z-index:1050;">
          <div class="modal-dialog modal-dialog-centered w-100" style="max-width:520px;">
            <div class="modal-content border-0 shadow-lg rounded-4" style="background:#fff; padding: 0 1.5rem; max-height:90vh; overflow-y:auto;">
              <div class="modal-header border-0 rounded-top-4" style="background:#f8fafc; padding-top:1.2rem; padding-bottom:0.7rem; padding-left:0; padding-right:0;">
                <h5 class="modal-title fw-semibold text-secondary-emphasis">{{ produtoEditando.id ? 'Editar Produto' : 'Novo Produto' }}</h5>
                <button type="button" class="btn-close" @click="closeProdutoModal"></button>
              </div>
              <form @submit.prevent="salvarProduto">
                <div class="modal-body py-3 px-0" style="padding-left:0; padding-right:0;">
                  <div v-if="produtoError" class="alert alert-danger py-2 small mb-3">{{ produtoError }}</div>
                  <div class="mb-3">
                    <label class="form-label mb-1 text-secondary">Nome</label>
                    <input v-model="produtoEditando.name" class="form-control bg-light border-0 rounded-3 form-control-lg" required placeholder="Nome do produto" />
                  </div>
                  <div class="mb-3">
                    <label class="form-label mb-1 text-secondary">Descrição</label>
                    <textarea v-model="produtoEditando.description" class="form-control bg-light border-0 rounded-3 form-control-lg" rows="2" required placeholder="Descrição do produto"></textarea>
                  </div>
                  <div class="mb-3">
                    <label class="form-label mb-1 text-secondary">Preço</label>
                    <input v-model.number="produtoEditando.price" type="number" min="0" step="0.01" class="form-control bg-light border-0 rounded-3 form-control-lg" required placeholder="0,00" />
                  </div>
                  <div class="mb-3">
                    <label class="form-label mb-1 text-secondary">Estoque</label>
                    <input v-model.number="produtoEditando.stock" type="number" min="0" class="form-control bg-light border-0 rounded-3 form-control-lg" required placeholder="0" />
                  </div>
                  <div class="mb-3">
                    <label class="form-label mb-1 text-secondary">Categoria</label>
                    <select v-model="produtoEditando.category_id" class="form-select bg-light border-0 rounded-3 form-control-lg" required>
                      <option value="" disabled>Selecione...</option>
                      <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-label mb-1 text-secondary">Imagem</label>
                    <input type="file" accept="image/*" class="form-control bg-light border-0 rounded-3 form-control-lg" @change="handleImageChange" :required="!produtoEditando.id" />
                  </div>
                </div>
                <div class="modal-footer border-0 pb-3 px-0 pt-0 d-flex justify-content-between" style="padding-left:0; padding-right:0;">
                  <button type="button" class="btn btn-light border px-4 py-2 rounded-3" @click="closeProdutoModal">Cancelar</button>
                  <button type="submit" class="btn btn-success px-4 py-2 rounded-3 fw-bold" :disabled="produtoLoading" style="background:#4ade80;border:none;">
                    <span v-if="produtoLoading" class="spinner-border spinner-border-sm me-2"></span>
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <!-- Usuários -->
      <section v-else-if="tab==='usuarios'">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="fw-bold mb-0">Usuários</h4>
            <button class="btn btn-success btn-sm fw-bold" @click="openUsuarioModal()">
              <i class="bi bi-person-plus me-1"></i> Novo Usuário
            </button>
          </div>
        <div class="table-responsive mb-4">
            <table class="table table-hover align-middle">
              <thead class="table-success">
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Perfil</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in usuarios" :key="usuario.id">
                <td>{{ usuario.name }}</td>
                <td>{{ usuario.email }}</td>
                <td><span class="badge" :class="usuario.role === 'ADMIN' ? 'bg-success' : usuario.role === 'MODERATOR' ? 'bg-primary' : 'bg-secondary'">{{ usuario.role }}</span></td>
                <td><span class="badge" :class="usuario.active ? 'bg-success' : 'bg-danger'">{{ usuario.active ? 'Ativo' : 'Bloqueado' }}</span></td>
                <td>
                  <button class="btn btn-outline-primary btn-sm me-2" @click="openUsuarioModal(usuario)" title="Editar"><i class="bi bi-pencil-square"></i></button>
                  <button class="btn btn-outline-warning btn-sm me-2" @click="toggleUserRole(usuario)" title="Promover/Demover"><i class="bi bi-arrow-repeat"></i></button>
                  <button class="btn btn-outline-danger btn-sm" @click="toggleUserStatus(usuario)" title="Bloquear/Desbloquear"><i class="bi bi-lock"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Modal Usuário -->
        <div v-if="showUsuarioModal" class="modal-backdrop d-flex align-items-center justify-content-center" style="background:rgba(0,0,0,0.15);z-index:1050;">
          <div class="modal-dialog modal-dialog-centered w-100" style="max-width:440px;">
            <div class="modal-content border-0 shadow-lg rounded-4" style="background:#fff; padding: 0 2rem;">
              <div class="modal-header border-0 rounded-top-4" style="background:#f8fafc; padding-top:2rem; padding-bottom:1rem; padding-left:0; padding-right:0;">
                <h5 class="modal-title fw-semibold text-secondary-emphasis">{{ usuarioEditando.id ? 'Editar Usuário' : 'Novo Usuário' }}</h5>
                <button type="button" class="btn-close" @click="closeUsuarioModal"></button>
              </div>
              <form @submit.prevent="salvarUsuario">
                <div class="modal-body py-4 px-0" style="padding-left:0; padding-right:0;">
                  <!-- Campos do usuário -->
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Nome</label>
                    <input v-model="usuarioEditando.nome" class="form-control bg-light border-0 rounded-3 form-control-lg" required placeholder="Nome do usuário" />
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">E-mail</label>
                    <input v-model="usuarioEditando.email" type="email" class="form-control bg-light border-0 rounded-3 form-control-lg" required placeholder="email@exemplo.com" />
                  </div>
                  <!-- Adicione outros campos conforme necessário -->
                </div>
                <div class="modal-footer border-0 pb-4 px-0 pt-0 d-flex justify-content-between" style="padding-left:0; padding-right:0;">
                  <button type="button" class="btn btn-light border px-4 py-2 rounded-3" @click="closeUsuarioModal">Cancelar</button>
                  <button type="submit" class="btn btn-success px-4 py-2 rounded-3 fw-bold" :disabled="usuarioLoading" style="background:#4ade80;border:none;">
                    <span v-if="usuarioLoading" class="spinner-border spinner-border-sm me-2"></span>
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <!-- Pedidos -->
      <section v-else-if="tab==='pedidos'">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="fw-bold mb-0">Pedidos</h4>
        </div>
        <div class="table-responsive mb-4">
          <table class="table table-hover align-middle">
            <thead class="table-success">
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Status</th>
                <th>Valor</th>
                <th>Data</th>
                  <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pedido in pedidos" :key="pedido.id">
                <td>{{ pedido.id }}</td>
                <td>{{ pedido.cliente }}</td>
                <td><span class="badge" :class="pedido.status === 'ENTREGUE' ? 'bg-success' : 'bg-warning'">{{ pedido.status }}</span></td>
                <td>R$ {{ Number(pedido.valor).toFixed(2) }}</td>
                <td>{{ pedido.data }}</td>
                <td>
                  <button class="btn btn-outline-primary btn-sm" @click="verPedido(pedido)"><i class="bi bi-eye"></i></button>
                  <button class="btn btn-outline-success btn-sm" @click="alterarStatusPedido(pedido)"><i class="bi bi-arrow-repeat"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <!-- Cupons -->
      <section v-else-if="tab==='cupons'">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="fw-bold mb-0">Cupons</h4>
          <button class="btn btn-success btn-sm fw-bold" @click="openCupomModal()">
            <i class="bi bi-plus-circle me-1"></i> Novo Cupom
          </button>
        </div>
        <div class="card border-0 shadow-sm rounded-4 p-0 mb-4" style="background:#fff;">
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead class="table-success">
                <tr>
                  <th class="ps-4">Código</th>
                  <th>Desconto</th>
                  <th>Início</th>
                  <th>Validade</th>
                  <th class="text-end pe-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="couponsStore.loading">
                  <td colspan="5" class="text-center py-4">Carregando cupons...</td>
                </tr>
                <tr v-else-if="couponsStore.error">
                  <td colspan="5" class="alert alert-danger text-center">{{ couponsStore.error }}</td>
                </tr>
                <tr v-else-if="!cupons.length">
                  <td colspan="5" class="text-center text-muted py-4">Nenhum cupom cadastrado ainda.</td>
                </tr>
                <tr v-else v-for="cupom in cupons" :key="cupom.id">
                  <td class="ps-4 fw-semibold">{{ cupom.code }}</td>
                  <td><span class="badge bg-success bg-opacity-10 text-success fs-6">{{ Number(cupom.discount_percentage).toFixed(0) }}%</span></td>
                  <td>{{ formatDate(cupom.start_date) }}</td>
                  <td>{{ formatDate(cupom.end_date) }}</td>
                  <td class="text-end pe-4">
                    <button class="btn btn-outline-primary btn-sm me-2" @click="openCupomModal(cupom)" title="Editar"><i class="bi bi-pencil-square"></i></button>
                    <button class="btn btn-outline-danger btn-sm" @click="removerCupom(cupom)" title="Remover"><i class="bi bi-trash"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Modal Cupom -->
        <div v-if="showCupomModal" class="modal-backdrop d-flex align-items-center justify-content-center" style="background:rgba(0,0,0,0.15);z-index:1050;">
          <div class="modal-dialog modal-dialog-centered w-100" style="max-width:440px;">
            <div class="modal-content border-0 shadow-lg rounded-4" style="background:#fff; padding: 0 2rem;">
              <div class="modal-header border-0 rounded-top-4" style="background:#f8fafc; padding-top:2rem; padding-bottom:1rem; padding-left:0; padding-right:0;">
                <h5 class="modal-title fw-semibold text-secondary-emphasis">{{ cupomEditando.id ? 'Editar Cupom' : 'Novo Cupom' }}</h5>
                <button type="button" class="btn-close" @click="closeCupomModal"></button>
      </div>
              <form @submit.prevent="salvarCupom">
                <div class="modal-body py-4 px-0" style="padding-left:0; padding-right:0;">
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Código</label>
                    <div class="input-group input-group-lg">
                      <span class="input-group-text bg-light border-0"><i class="bi bi-ticket-perforated"></i></span>
                      <input v-model="cupomEditando.code" class="form-control bg-light border-0 rounded-end" required placeholder="EX: DESCONTO10" maxlength="32" />
          </div>
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Desconto (%)</label>
                    <div class="input-group input-group-lg">
                      <span class="input-group-text bg-light border-0"><i class="bi bi-percent"></i></span>
                      <input v-model.number="cupomEditando.discount_percentage" type="number" min="1" max="100" class="form-control bg-light border-0 rounded-end" required placeholder="10" />
                    </div>
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Data de início</label>
                    <div class="input-group input-group-lg">
                      <span class="input-group-text bg-light border-0"><i class="bi bi-calendar-event"></i></span>
                      <input v-model="cupomEditando.start_date" type="datetime-local" class="form-control bg-light border-0 rounded-end" required />
                  </div>
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Data de validade</label>
                    <div class="input-group input-group-lg">
                      <span class="input-group-text bg-light border-0"><i class="bi bi-calendar-event"></i></span>
                      <input v-model="cupomEditando.end_date" type="datetime-local" class="form-control bg-light border-0 rounded-end" required />
                  </div>
                  </div>
                </div>
                <div class="modal-footer border-0 pb-4 px-0 pt-0 d-flex justify-content-between" style="padding-left:0; padding-right:0;">
                  <button type="button" class="btn btn-light border px-4 py-2 rounded-3" @click="closeCupomModal">Cancelar</button>
                  <button type="submit" class="btn btn-success px-4 py-2 rounded-3 fw-bold" :disabled="cupomLoading" style="background:#4ade80;border:none;">
                    <span v-if="cupomLoading" class="spinner-border spinner-border-sm me-2"></span>
                    Salvar
                  </button>
            </div>
          </form>
        </div>
      </div>
    </div>
      </section>
      <!-- Categorias -->
      <section v-else-if="tab==='categorias'">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="fw-bold mb-0">Categorias</h4>
          <button class="btn btn-success btn-sm fw-bold" @click="openCategoriaModal()">
            <i class="bi bi-plus-circle me-1"></i> Nova Categoria
          </button>
          </div>
        <div class="card border-0 shadow-sm rounded-4 p-0 mb-4" style="background:#fff;">
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead class="table-success">
                <tr>
                  <th class="ps-4">Nome</th>
                  <th class="d-none d-md-table-cell">Descrição</th>
                  <th class="d-none d-md-table-cell">Imagem</th>
                  <th class="text-end pe-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!categorias.length">
                  <td colspan="4" class="text-center text-muted py-4">Nenhuma categoria cadastrada ainda.</td>
                </tr>
                <tr v-else v-for="categoria in categorias" :key="categoria.id">
                  <td class="ps-4 fw-semibold">{{ categoria.name }}</td>
                  <td class="d-none d-md-table-cell">{{ categoria.description || '-' }}</td>
                  <td class="d-none d-md-table-cell">
                    <img :src="getImage(categoria.image_path)" alt="img" style="width:40px;height:40px;object-fit:cover;border-radius:8px;background:#f5f5f5;">
                  </td>
                  <td class="text-end pe-4">
                    <button class="btn btn-outline-primary btn-sm me-2" @click="openCategoriaModal(categoria)" title="Editar"><i class="bi bi-pencil-square"></i></button>
                    <button class="btn btn-outline-danger btn-sm" :disabled="deletingCategoryId === categoria.id" @click="removerCategoria(categoria)">
                      <span v-if="deletingCategoryId === categoria.id" class="spinner-border spinner-border-sm me-1"></span>
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Modal Categoria -->
        <div v-if="showCategoriaModal" class="modal-backdrop d-flex align-items-center justify-content-center" style="background:rgba(0,0,0,0.15);z-index:1050;">
          <div class="modal-dialog modal-dialog-centered w-100" style="max-width:420px;">
            <div class="modal-content border-0 shadow-lg rounded-4" style="background:#fff; padding: 0 1.5rem; max-height:90vh; overflow-y:auto;">
              <div class="modal-header border-0 rounded-top-4" style="background:#f8fafc; padding-top:1.2rem; padding-bottom:0.7rem; padding-left:0; padding-right:0;">
                <h5 class="modal-title fw-semibold text-secondary-emphasis">{{ categoriaEditando.id ? 'Editar Categoria' : 'Nova Categoria' }}</h5>
                <button type="button" class="btn-close" @click="closeCategoriaModal"></button>
              </div>
              <form @submit.prevent="salvarCategoria">
                <div class="modal-body py-3 px-0" style="padding-left:0; padding-right:0;">
                  <div class="mb-3">
                    <label class="form-label mb-1 text-secondary">Nome</label>
                    <input v-model="categoriaEditando.name" class="form-control bg-light border-0 rounded-3 form-control-lg" required placeholder="Nome da categoria" />
                  </div>
                  <div class="mb-3">
                    <label class="form-label mb-1 text-secondary">Descrição</label>
                    <textarea v-model="categoriaEditando.description" class="form-control bg-light border-0 rounded-3 form-control-lg" rows="2" placeholder="Descrição da categoria"></textarea>
                  </div>
                  <div class="mb-3">
                    <label class="form-label mb-1 text-secondary">Imagem</label>
                    <input type="file" accept="image/*" class="form-control bg-light border-0 rounded-3 form-control-lg" @change="handleCategoriaImageChange" />
                  </div>
                </div>
                <div class="modal-footer border-0 pb-3 px-0 pt-0 d-flex justify-content-between" style="padding-left:0; padding-right:0;">
                  <button type="button" class="btn btn-light border px-4 py-2 rounded-3" @click="closeCategoriaModal">Cancelar</button>
                  <button type="submit" class="btn btn-success px-4 py-2 rounded-3 fw-bold" :disabled="categoriaLoading" style="background:#4ade80;border:none;">
                    <span v-if="categoriaLoading" class="spinner-border spinner-border-sm me-2"></span>
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'
import { useCouponsStore } from '@/stores/coupons'
import { useAddressesStore } from '@/stores/addresses'
import { getCategories, registerCategories, updateCategories, deleteCategorie } from '@/services/HttpService'
import { showToast } from '@/utils/toast'

const tab = ref('dashboard')
const productsStore = useProductsStore()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const couponsStore = useCouponsStore()
const addressesStore = useAddressesStore()

const produtos = computed(() => productsStore.products)
const produtosLoading = computed(() => productsStore.loading)
const produtosError = computed(() => productsStore.error)
const usuarios = ref([{ id: 1, name: 'Admin', email: 'admin@sopeita.com', role: 'ADMIN', active: true }]) // Substitua por store real se houver
const pedidos = computed(() => ordersStore.orders)
const cupons = computed(() => couponsStore.coupons)
const categorias = ref([])
const totalVendas = computed(() => pedidos.value.reduce((acc, p) => acc + (p.valor || 0), 0))
const adminName = computed(() => authStore.user?.name || authStore.user?.email || 'Administrador')

  // Carregar categorias da API
async function fetchCategorias() {
  try {
    categorias.value = await getCategories()
  } catch (e) {
    showToast('Erro ao carregar categorias', 'error')
  }
}

function formatDate(date) {
  if (!date) return '-'
  // Garante que aceita string ISO e formata corretamente
  const d = typeof date === 'string' ? new Date(date.replace(' ', 'T')) : new Date(date)
  if (isNaN(d)) return '-'
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

onMounted(() => {
  productsStore.fetchProducts()
  ordersStore.fetchOrders()
  couponsStore.fetchCoupons() // Garante que sempre busca cupons ao montar
  fetchCategorias()
})

// Produtos
const showProdutoModal = ref(false)
const produtoEditando = ref({})
function openProdutoModal(produto = {}) { produtoEditando.value = { ...produto }; showProdutoModal.value = true }
function closeProdutoModal() { showProdutoModal.value = false; produtoEditando.value = {} }
const produtoLoading = ref(false)
const produtoError = ref('')

async function salvarProduto() {
  produtoLoading.value = true
  produtoError.value = ''
  try {
    // Validação básica
    if (!produtoEditando.value.name || !produtoEditando.value.price || !produtoEditando.value.stock || !produtoEditando.value.category_id || !produtoEditando.value.image) {
      produtoError.value = 'Preencha todos os campos obrigatórios.'
      produtoLoading.value = false
      return
    }
    // Montar FormData para envio multipart
    const formData = new FormData()
    formData.append('name', produtoEditando.value.name)
    formData.append('description', produtoEditando.value.description || '')
    formData.append('price', produtoEditando.value.price)
    formData.append('stock', produtoEditando.value.stock)
    formData.append('category_id', produtoEditando.value.category_id)
    formData.append('image', produtoEditando.value.image)
    if (produtoEditando.value.id) {
      // Atualização pode ser JSON, mas se quiser permitir troca de imagem, adapte para multipart
      await productsStore.updateProduct(produtoEditando.value.id, produtoEditando.value)
      showToast('Produto atualizado com sucesso!', 'success')
    } else {
      await productsStore.createProduct(formData)
      showToast('Produto criado com sucesso!', 'success')
    }
    closeProdutoModal()
    productsStore.fetchProducts()
  } catch (e) {
    produtoError.value = e?.response?.data?.detail || e?.message || 'Erro ao salvar produto.'
    showToast(produtoError.value, 'error')
  } finally {
    produtoLoading.value = false
  }
}

function handleImageChange(e) {
  const file = e.target.files[0]
  if (file) produtoEditando.value.image = file
}
function confirmDeleteProduto(produto) {
  if (confirm('Tem certeza que deseja remover este produto?')) {
    productsStore.deleteProduct(produto.id).then(() => {
      showToast('Produto removido com sucesso!', 'success')
      productsStore.fetchProducts()
    }).catch(() => showToast('Erro ao remover produto', 'error'))
  }
}

function getImage(path) {
  if (!path) return '/default-product.png'
  if (path.startsWith('http')) return path
  return 'http://35.196.79.227:8000' + path
}
function getActiveDiscount(produto) {
  if (!produto.discounts || !produto.discounts.length) return null
  const now = new Date()
  return produto.discounts.find(d => {
    const start = new Date(d.start_date)
    const end = new Date(d.end_date)
    return start <= now && now <= end
  })
}

// Usuários (mock, pois não há endpoint de usuários na store)
const showUsuarioModal = ref(false)
const usuarioEditando = ref({})
function openUsuarioModal(usuario = {}) { usuarioEditando.value = { ...usuario }; showUsuarioModal.value = true }
function closeUsuarioModal() { showUsuarioModal.value = false; usuarioEditando.value = {} }
function salvarUsuario() { showToast('Função de usuário não implementada', 'info'); closeUsuarioModal() }
function toggleUserRole(usuario) { showToast('Função de usuário não implementada', 'info') }
function toggleUserStatus(usuario) { showToast('Função de usuário não implementada', 'info') }

// Pedidos
function verPedido(pedido) { showToast('Função de visualizar pedido não implementada', 'info') }
function alterarStatusPedido(pedido) { showToast('Função de alterar status não implementada', 'info') }

// Cupons
const showCupomModal = ref(false)
const cupomEditando = ref({})
const cupomLoading = ref(false)
function openCupomModal(cupom = {}) {
  // Mapear campos para o payload correto da API
  cupomEditando.value = {
    id: cupom.id,
    code: cupom.code || cupom.codigo || '',
    discount_percentage: cupom.discount_percentage || cupom.desconto || 0,
    start_date: cupom.start_date ? cupom.start_date.slice(0, 16) : '',
    end_date: cupom.end_date ? cupom.end_date.slice(0, 16) : ''
  }
  showCupomModal.value = true
}
function closeCupomModal() { showCupomModal.value = false; cupomEditando.value = {} }
async function salvarCupom() {
  cupomLoading.value = true
  try {
    // Converter datetime-local para ISO
    const payload = {
      code: cupomEditando.value.code,
      discount_percentage: Number(cupomEditando.value.discount_percentage),
      start_date: new Date(cupomEditando.value.start_date).toISOString(),
      end_date: new Date(cupomEditando.value.end_date).toISOString()
    }
    if (cupomEditando.value.id) {
      await couponsStore.updateCoupon(cupomEditando.value.id, payload)
      showToast('Cupom atualizado com sucesso!', 'success')
    } else {
      await couponsStore.createCoupon(payload)
      showToast('Cupom criado com sucesso!', 'success')
    }
    closeCupomModal()
    couponsStore.fetchCoupons()
  } catch (e) {
    showToast('Erro ao salvar cupom: ' + (e?.response?.data?.detail || e?.message || 'Erro desconhecido'), 'error')
  } finally {
    cupomLoading.value = false
  }
}
function removerCupom(cupom) {
  if (confirm('Tem certeza que deseja remover este cupom?')) {
    couponsStore.deleteCoupon(cupom.id).then(() => {
      showToast('Cupom removido com sucesso!', 'success')
      couponsStore.fetchCoupons()
    }).catch(() => showToast('Erro ao remover cupom', 'error'))
  }
}

// Categorias
const showCategoriaModal = ref(false)
const categoriaEditando = ref({})
function openCategoriaModal(categoria = {}) { categoriaEditando.value = { ...categoria }; showCategoriaModal.value = true }
function closeCategoriaModal() { showCategoriaModal.value = false; categoriaEditando.value = {} }
async function salvarCategoria() {
  try {
    if (categoriaEditando.value.id) {
      await updateCategories(categoriaEditando.value.id, categoriaEditando.value)
      showToast('Categoria atualizada com sucesso!', 'success')
    } else {
      await registerCategories(categoriaEditando.value)
      showToast('Categoria criada com sucesso!', 'success')
    }
    closeCategoriaModal()
    fetchCategorias()
  } catch (e) {
    showToast('Erro ao salvar categoria', 'error')
  }
}
const deletingCategoryId = ref(null)
function removerCategoria(categoria) {
  if (confirm('Tem certeza que deseja remover esta categoria?')) {
    deletingCategoryId.value = categoria.id
    deleteCategorie(categoria.id)
      .then(() => {
        showToast('Categoria removida com sucesso!', 'success')
        fetchCategorias()
      })
      .catch((e) => {
        showToast('Erro ao remover categoria: ' + (e?.response?.data?.detail || e?.message || 'Erro desconhecido'), 'error')
      })
      .finally(() => {
        deletingCategoryId.value = null
      })
  }
}
function handleCategoriaImageChange(e) {
  const file = e.target.files[0]
  if (file) categoriaEditando.value.image = file
}
</script> 

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f7f9fa;
}
.admin-sidebar {
  width: 220px;
  background: #212529;
  color: #fff;
  min-height: 100vh;
  border-right: 2px solid #e9ecef;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 10;
}
.sidebar-logo {
  font-size: 2.2rem;
  color: #21ba45;
}
.sidebar-btn {
  color: #fff;
  background: none;
  border: none;
  text-align: left;
  font-size: 1.1rem;
  padding: 0.7rem 1.2rem;
  border-radius: 0.7rem;
  transition: background 0.2s, color 0.2s;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.sidebar-btn.active, .sidebar-btn:hover {
  background: #21ba45;
  color: #fff;
}
.admin-main {
  flex: 1;
  padding: 0 0 0 0;
  min-height: 100vh;
}
.admin-header {
  background: #fff;
  border-radius: 0 0 1.2rem 1.2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  border-bottom: 2px solid #e9ecef;
}
.divider-h {
  border: none;
  border-top: 2px solid #e9ecef;
  margin: 0;
}
.dashboard-card {
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: none;
  background: #fff;
  transition: box-shadow 0.2s, transform 0.2s;
}
.dashboard-card:hover {
  box-shadow: 0 4px 24px rgba(33,186,69,0.13);
  transform: translateY(-2px) scale(1.03);
}
</style> 