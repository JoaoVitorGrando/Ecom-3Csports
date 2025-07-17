<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar d-flex flex-column align-items-center py-4 px-2">
      <!-- Remover logo/texto acima do Olá -->
      <div class="admin-ola mb-3 w-100 text-center ola-minimalista">
        Olá, {{ adminName }}
      </div>
      <nav class="nav flex-column w-100 gap-2">
        <button class="nav-link sidebar-btn" :class="{active: tab==='dashboard'}" @click="tab='dashboard'">
          <i class="bi bi-speedometer2 me-2"></i> Dashboard
        </button>
        <button class="nav-link sidebar-btn" :class="{active: tab==='produtos'}" @click="tab='produtos'">
          <i class="bi bi-box-seam me-2"></i> Produtos
        </button>
        <button v-if="userRole==='ADMIN' || userRole==='MODERATOR'" class="nav-link sidebar-btn" :class="{active: tab==='pedidos'}" @click="tab='pedidos'">
          <i class="bi bi-bag-check me-2"></i> Pedidos
        </button>
        <button v-if="userRole==='ADMIN'" class="nav-link sidebar-btn" :class="{active: tab==='usuarios'}" @click="tab='usuarios'">
          <i class="bi bi-people me-2"></i> Usuários
        </button>
        <button v-if="userRole==='ADMIN'" class="nav-link sidebar-btn" :class="{active: tab==='cupons'}" @click="tab='cupons'">
          <i class="bi bi-ticket-perforated me-2"></i> Cupons
        </button>
        <button v-if="userRole==='ADMIN'" class="nav-link sidebar-btn" :class="{active: tab==='categorias'}" @click="tab='categorias'">
          <i class="bi bi-tags me-2"></i> Categorias
        </button>
        <button v-if="userRole==='ADMIN' || userRole==='MODERATOR'" class="nav-link sidebar-btn" :class="{active: tab==='tags'}" @click="tab='tags'">
          <i class="bi bi-tag me-2"></i> Tags
        </button>
      </nav>
    </aside>
    <!-- Main -->
    <main class="admin-main">
      <header class="admin-header text-center p-0 m-0" style="box-shadow:none;background:none;border:none;"></header>
      <section v-if="tab==='dashboard'">
        <div class="dashboard-header text-center mt-0 mb-3">
          <h2 class="dashboard-title dashboard-title-custom mb-1">Dashboard</h2>
          <p class="dashboard-desc mb-0">Visão geral do seu e-commerce</p>
        </div>
        <div class="dashboard-top row g-4 align-items-stretch justify-content-center">
          <div class="col-12 col-md-6 col-lg-3">
            <div class="kpi-block-minimal text-center p-4 mb-2">
              <i class="bi bi-box-seam kpi-icon mb-2" style="color:#18181b !important;"></i>
              <div class="kpi-value mb-1">{{ produtos.length }}</div>
                <div class="kpi-label">Produtos</div>
              </div>
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <div class="kpi-block-minimal text-center p-4 mb-2">
              <i class="bi bi-people kpi-icon mb-2" style="color:#18181b !important;"></i>
              <div class="kpi-value mb-1">{{ usuarios.length }}</div>
                <div class="kpi-label">Usuários</div>
              </div>
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <div class="kpi-block-minimal text-center p-4 mb-2">
              <i class="bi bi-bag-check kpi-icon mb-2" style="color:#18181b !important;"></i>
              <div class="kpi-value mb-1">{{ pedidos.length }}</div>
                <div class="kpi-label">Pedidos</div>
              </div>
          </div>
          <div class="col-12 col-md-6 col-lg-3">
            <div class="kpi-block-minimal text-center p-4 mb-2">
              <i class="bi bi-cash-coin kpi-icon mb-2" style="color:#18181b !important;"></i>
              <div class="kpi-value mb-1">R$ {{ totalVendas.toFixed(2) }}</div>
                <div class="kpi-label">Vendas</div>
              </div>
            </div>
          </div>
        <div class="row mt-4 justify-content-center">
          <div class="col-12 col-md-8 col-lg-6">
            <div class="dashboard-summary-minimal p-4 text-center">
              <div class="summary-title mb-2">Resumo rápido</div>
              <ul class="summary-list list-unstyled mb-0">
                <li v-if="produtos.filter(p => p.stock < 5).length > 0" class="mb-1">
                  <i class="bi bi-exclamation-triangle-fill me-1 text-warning"></i>
                  {{ produtos.filter(p => p.stock < 5).length }} produto(s) com estoque baixo
                </li>
                <li v-else class="mb-1">
                  <i class="bi bi-check-circle-fill me-1 text-success"></i>
                  Todos os produtos com estoque adequado
                </li>
                <li v-if="pedidos.filter(p => p.status !== 'ENTREGUE').length > 0" class="mb-1">
                  <i class="bi bi-clock-history me-1 text-primary"></i>
                  {{ pedidos.filter(p => p.status !== 'ENTREGUE').length }} pedido(s) pendente(s)
                </li>
                <li v-else class="mb-1">
                  <i class="bi bi-check-circle-fill me-1 text-success"></i>
                  Nenhum pedido pendente
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <!-- Produtos -->
      <section v-else-if="tab==='produtos'">
        <div class="text-center mt-0 mb-1 position-relative">
          <h4 class="fw-bold mb-0 dashboard-title-custom">Produtos</h4>
          <button class="btn btn-success btn-sm fw-bold position-absolute end-0 top-50 translate-middle-y me-2" style="right:0;" @click="openProdutoModal()">
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
            <div class="modal-content border-0 shadow-lg rounded-4" style="background:#fff; padding: 0 2rem; max-height:90vh; overflow-y:auto;">
              <div class="modal-header border-0 rounded-top-4" style="background:#f8fafc; padding-top:2rem; padding-bottom:1rem; padding-left:0; padding-right:0;">
                <h5 class="modal-title fw-semibold text-secondary-emphasis">{{ produtoEditando.id ? 'Editar Produto' : 'Novo Produto' }}</h5>
                <button type="button" class="btn-close" @click="closeProdutoModal"></button>
              </div>
              <form @submit.prevent="salvarProduto">
                <div class="modal-body py-4 px-0" style="padding-left:0; padding-right:0;">
                  <div v-if="produtoError" class="alert alert-danger py-2 small mb-3">{{ produtoError }}</div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Nome</label>
                    <input v-model="produtoEditando.name" class="form-control bg-light border-0 rounded-3 form-control-lg" required placeholder="Nome do produto" />
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Descrição</label>
                    <textarea v-model="produtoEditando.description" class="form-control bg-light border-0 rounded-3 form-control-lg" rows="2" required placeholder="Descrição do produto"></textarea>
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Preço</label>
                    <input v-model.number="produtoEditando.price" type="number" min="0" step="0.01" class="form-control bg-light border-0 rounded-3 form-control-lg" required placeholder="0,00" />
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Estoque</label>
                    <input v-model.number="produtoEditando.stock" type="number" min="0" class="form-control bg-light border-0 rounded-3 form-control-lg" required placeholder="0" />
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Categoria</label>
                    <select v-model="produtoEditando.category_id" class="form-select bg-light border-0 rounded-3 form-control-lg" required>
                      <option value="" disabled>Selecione...</option>
                      <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                    </select>
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Imagem</label>
                    <input type="file" accept="image/*" class="form-control bg-light border-0 rounded-3 form-control-lg" @change="handleImageChange" :required="!produtoEditando.id" />
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Tags</label>
                    <div class="d-flex flex-wrap gap-2">
                      <label v-for="tag in tagsStore.tags" :key="tag.id" class="form-check-label d-flex align-items-center gap-1" style="cursor:pointer;">
                        <input type="checkbox" class="form-check-input" v-model="tagsSelecionadas" :value="tag.id" />
                        <span :style="{background: tag.color_hex, color: '#222', padding: '2px 10px', borderRadius: '8px', fontSize: '0.9em'}">{{ tag.code }}</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="modal-footer border-0 pb-4 px-0 pt-0 d-flex justify-content-between" style="padding-left:0; padding-right:0;">
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
      <section v-else-if="tab==='usuarios' && userRole==='ADMIN'">
        <div class="text-center mt-0 mb-1 position-relative">
          <h4 class="fw-bold mb-0 dashboard-title-custom text-preto">Usuários do Sistema</h4>
          <button class="btn btn-success btn-sm fw-bold position-absolute end-0 top-50 translate-middle-y me-2" style="right:0;" @click="openUserModal()">
            <i class="bi bi-person-plus me-1 icon-amarelo"></i> Criar Moderador
          </button>
        </div>
        <div class="card border-0 shadow-sm rounded-4 p-0 mb-4" style="background:#fff;">
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead class="table-success">
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Papel</th>
                  <th class="text-end pe-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="usuariosLoading">
                  <td colspan="4" class="text-center py-4">Carregando usuários...</td>
                </tr>
                <tr v-else-if="usuariosError">
                  <td colspan="4" class="alert alert-danger text-center">{{ usuariosError }}</td>
                </tr>
                <tr v-else-if="!usuarios.length">
                  <td colspan="4" class="text-center text-muted py-4">Nenhum usuário cadastrado ainda.</td>
                </tr>
                <tr v-else v-for="usuario in usuarios" :key="usuario.id">
                  <td class="fw-semibold">{{ usuario.name }}</td>
                  <td>{{ usuario.email }}</td>
                  <td>
                    <span class="badge" :class="{
                      'bg-dark text-warning': usuario.role === 'ADMIN',
                      'bg-warning text-dark': usuario.role === 'MODERATOR',
                      'bg-light text-dark': usuario.role === 'CLIENT'
                    }">{{ usuario.role }}</span>
                  </td>
                  <td class="text-end pe-4">
                    <button class="btn btn-outline-primary btn-sm me-2" @click="openUserModal(usuario)" title="Editar"><i class="bi bi-pencil-square"></i></button>
                    <button class="btn btn-outline-danger btn-sm me-2" @click="removeUser(usuario)" title="Remover"><i class="bi bi-trash"></i></button>
                    <button v-if="usuario.role !== 'ADMIN'" class="btn btn-outline-warning btn-sm" @click="toggleUserRole(usuario)" title="Alterar papel">
                      <i class="bi bi-arrow-left-right"></i> Alterar Papel
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Modal Criar/Editar Moderador -->
        <div v-if="showUserModal" class="modal-backdrop d-flex align-items-center justify-content-center" style="background:rgba(0,0,0,0.15);z-index:1050;">
          <div class="modal-dialog modal-dialog-centered w-100" style="max-width:440px;">
            <div class="modal-content border-0 shadow-lg rounded-4" style="background:#fff; padding: 0 2rem; max-height:90vh; overflow-y:auto;">
              <div class="modal-header border-0 rounded-top-4" style="background:#f8fafc; padding-top:2rem; padding-bottom:1rem; padding-left:0; padding-right:0;">
                <h5 class="modal-title fw-semibold text-secondary-emphasis">{{ userEditando.id ? 'Editar Usuário' : 'Novo Moderador' }}</h5>
                <button type="button" class="btn-close" @click="closeUserModal"></button>
              </div>
              <form @submit.prevent="salvarUser">
                <div class="modal-body py-4 px-0">
                  <div v-if="userError" class="alert alert-danger py-2 small mb-3">{{ userError }}</div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Nome</label>
                    <input v-model="userEditando.name" class="form-control bg-light border-0 rounded-3 form-control-lg" required placeholder="Nome do usuário" />
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Email</label>
                    <input v-model="userEditando.email" type="email" class="form-control bg-light border-0 rounded-3 form-control-lg" required placeholder="Email" />
                  </div>
                  <div class="mb-4" v-if="!userEditando.id">
                    <label class="form-label mb-1 text-secondary">Senha</label>
                    <input v-model="userEditando.password" type="password" class="form-control bg-light border-0 rounded-3 form-control-lg" required placeholder="Senha" />
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Papel</label>
                    <select v-model="userEditando.role" class="form-select bg-light border-0 rounded-3 form-control-lg" required>
                      <option value="MODERATOR">Moderador</option>
                      <option value="CLIENT">Cliente</option>
                    </select>
                  </div>
                  <div class="d-flex justify-content-end">
                    <button class="btn btn-primary rounded-pill px-4" type="submit">Salvar</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <!-- Pedidos -->
      <section v-else-if="tab==='pedidos'">
        <div class="text-center mt-0 mb-1 position-relative">
          <h4 class="fw-bold mb-0 dashboard-title-custom">Pedidos</h4>
        </div>
        <div class="card border-0 shadow-sm rounded-4 p-0 mb-4" style="background:#fff;">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
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
        </div>
      </section>
      <!-- Cupons -->
      <section v-else-if="tab==='cupons'">
        <div class="text-center mt-0 mb-1 position-relative">
          <h4 class="fw-bold mb-0 dashboard-title-custom">Cupons</h4>
          <button class="btn btn-success btn-sm fw-bold position-absolute end-0 top-50 translate-middle-y me-2" style="right:0;" @click="openCupomModal()">
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
                  <td><span class="badge fs-6 text-dark">{{ Number(cupom.discount_percentage).toFixed(0) }}%</span></td>
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
        <div class="text-center mt-0 mb-1 position-relative">
          <h4 class="fw-bold mb-0 dashboard-title-custom">Categorias</h4>
          <button class="btn btn-success btn-sm fw-bold position-absolute end-0 top-50 translate-middle-y me-2" style="right:0;" @click="openCategoriaModal()">
            <i class="bi bi-plus-circle me-1"></i> Nova Categoria
          </button>
        </div>
        <div class="card border-0 shadow-sm rounded-4 p-0 mb-4" style="background:#fff;">
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead class="table-success">
                <tr>
                  <th class="ps-4">Nome</th>
                  <th>Descrição</th>
                  <th>Imagem</th>
                  <th class="text-end pe-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!categorias.length">
                  <td colspan="4" class="text-center text-muted py-4">Nenhuma categoria cadastrada ainda.</td>
                </tr>
                <tr v-else v-for="categoria in categorias" :key="categoria.id">
                  <td class="ps-4 fw-semibold align-middle">{{ categoria.name }}</td>
                  <td class="align-middle">{{ categoria.description || '-' }}</td>
                  <td class="align-middle">
                    <img :src="getImage(categoria.image_path)" alt="img" style="width:48px;height:48px;object-fit:cover;border-radius:12px;background:#f5f5f5;">
                  </td>
                  <td class="text-end pe-4 align-middle">
                    <div class="d-flex justify-content-end align-items-center gap-2">
                      <button class="btn btn-outline-primary btn-sm" @click="openCategoriaModal(categoria)" title="Editar">
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button class="btn btn-outline-danger btn-sm" :disabled="deletingCategoryId === categoria.id" @click="removerCategoria(categoria)">
                        <span v-if="deletingCategoryId === categoria.id" class="spinner-border spinner-border-sm me-1"></span>
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Modal Categoria -->
        <div v-if="showCategoriaModal" class="modal-backdrop d-flex align-items-center justify-content-center" style="background:rgba(0,0,0,0.15);z-index:1050;">
          <div class="modal-dialog modal-dialog-centered w-100" style="max-width:440px;">
            <div class="modal-content border-0 shadow-lg rounded-4" style="background:#fff; padding: 0 2rem;">
              <div class="modal-header border-0 rounded-top-4" style="background:#f8fafc; padding-top:2rem; padding-bottom:1rem; padding-left:0; padding-right:0;">
                <h5 class="modal-title fw-semibold text-secondary-emphasis">{{ categoriaEditando.id ? 'Editar Categoria' : 'Nova Categoria' }}</h5>
                <button type="button" class="btn-close" @click="closeCategoriaModal"></button>
              </div>
              <form @submit.prevent="salvarCategoria">
                <div class="modal-body py-4 px-0" style="padding-left:0; padding-right:0;">
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Nome</label>
                    <input v-model="categoriaEditando.name" class="form-control bg-light border-0 rounded-3 form-control-lg" required placeholder="Nome da categoria" />
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Descrição</label>
                    <textarea v-model="categoriaEditando.description" class="form-control bg-light border-0 rounded-3 form-control-lg" rows="2" placeholder="Descrição da categoria"></textarea>
                  </div>
                  <div class="mb-4">
                    <label class="form-label mb-1 text-secondary">Imagem</label>
                    <input type="file" accept="image/*" class="form-control bg-light border-0 rounded-3 form-control-lg" @change="handleCategoriaImageChange" />
                  </div>
                </div>
                <div class="modal-footer border-0 pb-4 px-0 pt-0 d-flex justify-content-between" style="padding-left:0; padding-right:0;">
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
      <!-- Tags -->
      <section v-else-if="tab==='tags'" class="admin-section mt-4">
        <h3 class="mb-3">Gerenciar Tags</h3>
        <form @submit.prevent="salvarTag" class="d-flex gap-2 mb-3 align-items-center">
          <input v-model="novaTag.code" class="form-control" placeholder="Código" required style="max-width:120px" />
          <div class="d-flex align-items-center gap-1">
            <input v-model="novaTag.color_hex" class="form-control" placeholder="#HEX cor" required style="max-width:120px" />
            <span v-for="cor in coresPredefinidas" :key="cor" @click="novaTag.color_hex = cor" :style="{background: cor, border: novaTag.color_hex === cor ? '2px solid #18181b' : '1px solid #ccc', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', display: 'inline-block', marginLeft: '4px'}"></span>
          </div>
          <input v-model="novaTag.description" class="form-control" placeholder="Descrição" required style="max-width:220px" />
          <button class="btn btn-secondary" type="submit">{{ editandoTag ? 'Salvar' : 'Adicionar' }}</button>
          <button v-if="editandoTag" class="btn btn-outline-secondary" type="button" @click="() => { editandoTag = null; novaTag = { code: '', color_hex: '', description: '' } }">Cancelar</button>
        </form>
        <table class="table table-bordered table-sm">
          <thead>
            <tr>
              <th>Código</th>
              <th>Cor</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tag in tagsStore.tags" :key="tag.id">
              <td>{{ tag.code }}</td>
              <td><span :style="{background: tag.color_hex, color: '#222', padding: '2px 10px', borderRadius: '8px'}">{{ tag.color_hex }}</span></td>
              <td>{{ tag.description }}</td>
              <td>
                <button class="btn btn-sm btn-outline-secondary me-1" @click="editarTag(tag)">Editar</button>
                <button class="btn btn-sm btn-outline-danger" @click="removerTag(tag.id)">Remover</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, watchEffect } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'
import { useCouponsStore } from '@/stores/coupons'
import { useAddressesStore } from '@/stores/addresses'
import { useTagsStore } from '@/stores/tags'
import { getCategories, registerCategories, updateCategories, deleteCategorie } from '@/services/HttpService'
import { showToast } from '@/utils/toast'
import { register, registerModerator, changeUserInfos, deleteUser, getUser } from '@/services/HttpService'
const usuarios = ref([])
const usuariosLoading = ref(false)
const usuariosError = ref('')
const showUserModal = ref(false)
const userEditando = ref({})
const userError = ref('')

async function fetchUsuarios() {
  usuariosLoading.value = true
  try {
    // Chamada real para buscar todos os usuários
    const usersResponse = await getUser() // GET /users/
    usuarios.value = Array.isArray(usersResponse) ? usersResponse : (usersResponse.results || [])
    usuariosError.value = ''
  } catch (e) {
    usuariosError.value = e?.response?.data?.detail || e?.message || 'Erro ao carregar usuários.'
  } finally {
    usuariosLoading.value = false
  }
}
function openUserModal(usuario = null) {
  userEditando.value = usuario ? { ...usuario } : { name: '', email: '', password: '', role: 'CLIENT' }
  showUserModal.value = true
  userError.value = ''
}
function closeUserModal() {
  showUserModal.value = false
  userEditando.value = {}
}
async function salvarUser() {
  try {
    // Payload conforme Swagger
    const payload = {
      name: userEditando.value.name,
      email: userEditando.value.email,
      password: userEditando.value.password,
      role: 'MODERATOR'
    }
    await registerModerator(payload)
    showToast('Moderador criado com sucesso!', 'success')
    closeUserModal()
  } catch (e) {
    userError.value = 'Erro ao salvar moderador.'
  }
}

onMounted(fetchUsuarios)

const tab = ref('dashboard')
const productsStore = useProductsStore()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const couponsStore = useCouponsStore()
const addressesStore = useAddressesStore()
const tagsStore = useTagsStore()

const produtos = computed(() => productsStore.products)
const produtosLoading = computed(() => productsStore.loading)
const produtosError = computed(() => productsStore.error)

const pedidos = computed(() => ordersStore.orders)
const cupons = computed(() => couponsStore.coupons)
const categorias = ref([])
const totalVendas = computed(() => pedidos.value.reduce((acc, p) => acc + (p.valor || 0), 0))
const adminName = computed(() => authStore.user?.name || authStore.user?.email || 'Administrador')
const auth = useAuthStore()
const userRole = auth.role

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
  tagsStore.fetchTags()
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
    // Após criar/editar produto, associar tags
    if (produtoEditando.value.id) {
      // Remover todas as tags antigas
      for (const tag of tagsStore.tags) {
        if ((tag.products || []).some(p => p.id === produtoEditando.value.id) && !tagsSelecionadas.value.includes(tag.id)) {
          await tagsStore.removeProductFromTag(tag.id, produtoEditando.value.id)
        }
      }
      // Adicionar as novas
      for (const tagId of tagsSelecionadas.value) {
        if (!(tagsStore.tags.find(t => t.id === tagId).products || []).some(p => p.id === produtoEditando.value.id)) {
          await tagsStore.addProductToTag(tagId, produtoEditando.value.id)
        }
      }
    }
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

const userLogado = ref({})
const userLogadoEdit = ref({})
const showEditModal = ref(false)
const editError = ref('')

async function fetchUserLogado() {
  try {
    userLogado.value = await getUser()
    userLogadoEdit.value = { ...userLogado.value }
  } catch (e) {
    userLogado.value = {}
  }
}
function openEditModal() {
  userLogadoEdit.value = { ...userLogado.value }
  showEditModal.value = true
  editError.value = ''
}
function closeEditModal() {
  showEditModal.value = false
  userLogadoEdit.value = {}
}
async function salvarEdicaoPerfil() {
  try {
    await changeUserInfos(userLogadoEdit.value)
    await fetchUserLogado()
    closeEditModal()
  } catch (e) {
    editError.value = e?.response?.data?.detail || e?.message || 'Erro ao editar perfil.'
  }
}
async function confirmDeleteUser() {
  if (confirm('Tem certeza que deseja excluir sua conta?')) {
    try {
      await deleteUser()
      window.location.href = '/login'
    } catch (e) {
      editError.value = 'Erro ao excluir conta.'
    }
  }
}
onMounted(fetchUserLogado)

async function updateUserRole(usuario) {
  try {
    await changeUserInfos({ ...usuario, role: usuario.role, id: usuario.id })
    showToast('Nível de acesso atualizado!', 'success')
    await fetchUsuarios()
  } catch (e) {
    showToast('Erro ao atualizar nível de acesso', 'error')
  }
}
async function removeUser(usuario) {
  if (confirm('Tem certeza que deseja remover este usuário?')) {
    try {
      await deleteUser(usuario.id)
      showToast('Usuário removido com sucesso!', 'success')
      await fetchUsuarios()
    } catch (e) {
      showToast('Erro ao remover o usuário', 'error')
    }
  }
}

// Tags
const novaTag = ref({ code: '', color_hex: '', description: '' })
const editandoTag = ref(null)
const coresPredefinidas = ['#4ADE80', '#FFD600', '#EF4444'] // verde, amarelo, vermelho

function salvarTag() {
  if (editandoTag.value) {
    tagsStore.updateTag(editandoTag.value.id, { ...novaTag.value }).then(() => {
      tagsStore.fetchTags()
      editandoTag.value = null
      novaTag.value = { code: '', color_hex: '', description: '' }
    })
  } else {
    tagsStore.createTag({ ...novaTag.value }).then(() => {
      tagsStore.fetchTags()
      novaTag.value = { code: '', color_hex: '', description: '' }
    })
  }
}

function editarTag(tag) {
  editandoTag.value = tag
  novaTag.value = { code: tag.code, color_hex: tag.color_hex, description: tag.description }
}

function removerTag(id) {
  if (confirm('Tem certeza que deseja remover esta tag?')) {
    tagsStore.deleteTag(id).then(() => tagsStore.fetchTags())
  }
}

// Seleção de tags no modal de produto
const tagsSelecionadas = ref([])
watchEffect(() => {
  if (showProdutoModal.value && produtoEditando.value.id) {
    // Ao editar, marcar as tags já associadas
    tagsSelecionadas.value = tagsStore.tags.filter(tag => (tag.products || []).some(p => p.id === produtoEditando.value.id)).map(tag => tag.id)
  } else if (showProdutoModal.value) {
    tagsSelecionadas.value = []
  }
})

// Redirecionar moderador para produtos se tentar acessar aba não permitida
watch(tab, (newTab) => {
  if (userRole === 'MODERATOR' && !['dashboard','produtos','pedidos'].includes(newTab)) {
    tab.value = 'produtos'
  }
})
</script> 

<style scoped>
:root {
  --admin-sidebar-bg: #fffbe6;
  --admin-sidebar-active: #fff9c4;
  --admin-sidebar-text: #18181b;
  --admin-main-bg: #fffde7;
  --admin-card-bg: #fff;
  --admin-card-shadow: 0 2px 8px rgba(0,0,0,0.04);
  --admin-header-bg: #fffbe6;
  --admin-header-shadow: 0 1px 4px rgba(0,0,0,0.03);
  --primary-yellow: #ffd600;
  --primary-black: #18181b;
}
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--admin-main-bg);
}
.admin-sidebar {
  width: 220px;
  background: var(--admin-sidebar-bg);
  color: var(--admin-sidebar-text);
  min-height: 100vh;
  border-right: 1px solid #ffe082;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: none;
}
.sidebar-logo-text {
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  font-size: 2.1rem;
  font-weight: 600;
  color: #2563eb;
  letter-spacing: 0.03em;
  text-align: center;
  margin-bottom: 1.2rem;
  user-select: none;
}
.admin-ola {
  color: var(--primary-black);
  background: var(--primary-yellow);
  border-radius: 8px;
  padding: 0.5rem 0.7rem;
  margin-bottom: 1rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  background-clip: padding-box;
}
.ola-minimalista {
  font-size: 0.98rem;
  color: var(--primary-black);
  background: none !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0.2rem 0 0.2rem 0;
  margin-bottom: 1.2rem;
}
.nav {
  width: 100%;
}
.sidebar-btn {
  color: var(--admin-sidebar-text);
  background: none;
  border: none;
  text-align: left;
  font-size: 1rem;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  transition: background 0.2s, color 0.2s;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-weight: 500;
  margin-bottom: 2px;
}
.sidebar-btn.active, .sidebar-btn:hover {
  background: var(--admin-sidebar-active);
  color: var(--primary-black);
  font-weight: 600;
}
.admin-main {
  flex: 1;
  padding: 2.2rem 2.2rem 2.2rem 2.2rem;
  min-height: 100vh;
  background: var(--admin-main-bg);
  box-sizing: border-box;
}
.admin-header {
  background: var(--admin-header-bg);
  border-radius: 0 0 1rem 1rem;
  box-shadow: var(--admin-header-shadow);
  border-bottom: none;
  margin-bottom: 0.5rem;
}
.divider-h {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 0 0 1.5rem 0;
}
.dashboard-minimal {
  padding: 2rem;
  background: var(--admin-card-bg);
  border-radius: 1rem;
  box-shadow: var(--admin-card-shadow);
  border: none;
  text-align: center;
}
.dashboard-kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.2rem;
  margin-bottom: 2rem;
}
.kpi-block {
  background: #f1f5f9;
  border-radius: 10px;
  padding: 1.2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #222;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: none;
}
.kpi-block i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #6366f1;
}
.kpi-value {
  font-size: 2rem;
  line-height: 1;
  margin-bottom: 0.3rem;
}
.kpi-label {
  font-size: 0.9rem;
  opacity: 0.7;
}
.dashboard-summary {
  background: #f1f5f9;
  border-radius: 10px;
  padding: 1.2rem;
  color: #222;
  font-size: 0.95rem;
  font-weight: 500;
}
.summary-title {
  margin-bottom: 1rem;
  font-size: 1.05rem;
}
.summary-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.summary-list li {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}
.summary-list li i {
  font-size: 1rem;
  margin-right: 0.5rem;
  color: #6366f1;
}
.dashboard-card {
  border-radius: 1rem;
  box-shadow: var(--admin-card-shadow);
  border: none;
  background: var(--admin-card-bg);
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dashboard-card .card-body {
  padding: 1rem 0.5rem 1rem 0.5rem;
}
.dashboard-card h5 {
  font-size: 1rem;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 0.2rem;
}
.dashboard-card .display-6 {
  font-size: 1.7rem;
  font-weight: 700;
  color: #6366f1;
  margin-top: 0.2rem;
}
.dashboard-card i {
  margin-bottom: 0.2rem;
  font-size: 1.7rem;
  color: #6366f1;
}
.dashboard-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  transform: translateY(-2px) scale(1.02);
}
.admin-main h4, .admin-main h5, .admin-main h2 {
  color: #222;
  font-weight: 700;
  background: none;
  -webkit-background-clip: unset;
  -webkit-text-fill-color: unset;
  background-clip: unset;
}
.table {
  border-radius: 10px;
  overflow: hidden;
  background: var(--admin-card-bg);
  box-shadow: var(--admin-card-shadow);
}
.table th {
  background: #fff9c4 !important;
  color: #18181b !important;
  font-weight: 700;
  border: none;
}
.table td {
  border-top: 1px solid #ffe082;
  background: var(--admin-card-bg);
}
.table tr {
  transition: background 0.2s;
}
.table tr:hover {
  background: #fffde7;
}
.btn-outline-primary, .btn-outline-danger, .btn-outline-warning {
  border-radius: 6px;
  font-weight: 500;
  padding: 0.35rem 0.8rem;
  font-size: 0.98rem;
  transition: all 0.2s;
}
.btn-outline-primary:hover {
  background: #6366f1;
  color: #fff;
}
.btn-outline-danger:hover {
  background: #dc2626;
  color: #fff;
}
.btn-outline-warning:hover {
  background: #f59e42;
  color: #fff;
}
.modal-content {
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
}
.kpi-icon {
  color: #6366f1 !important;
  font-size: 2.2rem !important;
  margin-bottom: 0.5rem;
}
.dashboard-header {
  min-height: 32px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.dashboard-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 0;
  text-align: center;
}
.dashboard-top {
  margin-bottom: 2rem;
}
@media (max-width: 991px) {
  .dashboard-top {
    flex-direction: column;
  }
  .dashboard-kpis {
    flex-direction: row;
    gap: 1rem;
  }
  .dashboard-summary {
    margin-top: 1.5rem;
  }
}
@media (max-width: 991px) {
  .admin-layout {
    flex-direction: column;
  }
  .admin-sidebar {
    width: 100vw;
    min-height: unset;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    border-right: none;
    border-bottom: 1px solid #ffe082;
    box-shadow: none;
    position: static;
    padding: 0.7rem 0.5rem;
    z-index: 20;
  }
  .sidebar-logo, .admin-ola {
    display: none;
  }
  .nav {
    flex-direction: row;
    gap: 0.5rem;
    width: 100vw;
  }
  .sidebar-btn {
    font-size: 0.95rem;
    padding: 0.5rem 0.7rem;
    border-radius: 6px;
    margin-bottom: 0;
  }
  .admin-main {
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
  }
}
@media (max-width: 700px) {
  .admin-main {
    padding: 0;
  }
  .dashboard-card {
    min-height: 100px;
  }
  .table th, .table td {
    font-size: 0.93rem;
    padding: 0.4rem 0.4rem;
  }
}
.dashboard-title-custom {
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  font-weight: 700;
  letter-spacing: 0.02em;
  font-size: 2.4rem;
  margin-top: 0.3rem;
  margin-bottom: 0.2rem;
  color: var(--primary-black);
  line-height: 1.08;
  text-shadow: 0 1px 0 #fff, 0 2px 8px rgba(0,0,0,0.03);
}
.dashboard-desc {
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  font-size: 1.08rem;
  color: #52525b;
  margin-bottom: 0.7rem;
  margin-top: 0.1rem;
  font-weight: 400;
  letter-spacing: 0.01em;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
@media (max-width: 700px) {
  .dashboard-title-custom {
    font-size: 1.2rem;
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
  }
  .dashboard-desc {
    font-size: 0.97rem;
    margin-bottom: 0.5rem;
  }
}
.kpi-block-minimal {
  background: #fffde7;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(255,214,0,0.04);
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.18s;
}
.kpi-block-minimal:hover {
  box-shadow: 0 4px 24px rgba(255,214,0,0.10);
}
.kpi-icon {
  font-size: 2.1rem;
  color: var(--primary-yellow) !important;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.kpi-value {
  font-size: 2.1rem;
  font-weight: 700;
  color: var(--primary-black);
}
.kpi-label {
  font-size: 1.05rem;
  color: var(--primary-black);
  font-weight: 500;
  letter-spacing: 0.5px;
}
.dashboard-summary-minimal {
  background: #fffbe6;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(255,214,0,0.04);
  font-size: 1.08rem;
}
.summary-title {
  font-size: 1.13rem;
  font-weight: 600;
  color: var(--primary-yellow);
  margin-bottom: 0.5rem;
}
.summary-list li i {
  font-size: 1rem;
  margin-right: 0.5rem;
  color: var(--primary-yellow);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn-success, .btn-outline-primary, .btn-outline-success {
  background: var(--primary-yellow) !important;
  color: var(--primary-black) !important;
  border: none !important;
}
.btn-success:hover, .btn-outline-primary:hover, .btn-outline-success:hover {
  background: #ffe082 !important;
  color: var(--primary-black) !important;
}
.btn-outline-danger {
  border-radius: 6px;
  font-weight: 500;
  padding: 0.35rem 0.8rem;
  font-size: 0.98rem;
  transition: all 0.2s;
  color: #fff;
  background: #18181b;
  border: none;
}
.btn-outline-danger:hover {
  background: #ffd600;
  color: #18181b;
}
.table-success {
  background: #fff9c4 !important;
  color: #18181b !important;
}
</style> 