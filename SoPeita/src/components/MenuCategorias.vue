<template>
  <nav class="menu-categorias d-none d-lg-flex justify-content-center mb-4">
    <ul class="nav gap-3 w-100 justify-content-center">
      <li class="nav-item dropdown" v-for="cat in categorias" :key="cat.nome">
        <a class="nav-link dropdown-toggle fw-bold" href="#" data-bs-toggle="dropdown">{{ cat.nome }}</a>
        <ul class="dropdown-menu">
          <li v-for="sub in cat.subcategorias" :key="sub" class="dropdown-item">
            <a href="#" class="text-dark">{{ sub }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const categorias = [
  { nome: 'Brasileirão', subcategorias: ['Rio de Janeiro', 'São Paulo', 'Minas Gerais', 'Rio Grande do Sul', 'Nordeste'] },
  { nome: 'Europeus', subcategorias: ['Bundesliga', 'La Liga', 'Ligue 1', 'Liga de Portugal', 'Premier League', 'Serie A', 'Mais Ligas'] },
  { nome: 'Seleções', subcategorias: [] },
  { nome: 'Feminino', subcategorias: [] },
  { nome: 'Retro', subcategorias: [] },
  { nome: 'Infantil', subcategorias: [] },
  { nome: 'Inverno', subcategorias: [] },
]
</script>

<style scoped>
.menu-categorias {
  background: #18181b;
  border-radius: 0 0 1.2rem 1.2rem;
  box-shadow: 0 4px 24px rgba(24,24,27,0.10);
  padding: 0.7rem 0.5rem;
  width: 100vw;
  left: 50%;
  right: 50%;
  transform: translateX(-50%);
  position: relative;
  z-index: 10;
  margin: 0 !important;
  border: none !important;
}
.nav-link {
  color: #fff;
  font-size: 1.13rem;
  letter-spacing: 0.01em;
  transition: color 0.2s, background 0.2s;
  border-radius: 0.7rem 0.7rem 1.2rem 1.2rem;
  padding: 0.6rem 1.2rem;
}
.nav-link:hover, .dropdown-toggle:focus {
  color: #FFD600;
  background: #232323;
}
.dropdown-menu {
  min-width: 180px;
  border-radius: 0.7rem;
  box-shadow: 0 2px 12px rgba(24,24,27,0.12);
  background: #232323;
  border: none;
  margin-top: 0.5rem;
}
.dropdown-item {
  color: #fff;
  font-size: 1rem;
  transition: background 0.2s, color 0.2s;
  border-radius: 0.5rem;
}
.dropdown-item:hover {
  background: #FFD600;
  color: #18181b;
}
@media (max-width: 991px) {
  .menu-categorias {
    display: none !important;
  }
}
</style> 