<template>
  <section class="depoimentos">
    <h2 class="fw-bold text-center mb-4">O que falam sobre nós</h2>
    <div class="container">
      <div class="row justify-content-center gap-4">
        <div class="col-12 col-md-4" v-for="depo in depoimentos" :key="depo.nome">
          <div class="depo-card p-4 rounded-4 shadow-lg h-100 bg-white border border-warning-subtle position-relative">
            <div class="depo-stars text-warning mb-2 d-flex align-items-center justify-content-center" style="font-size:1.35rem;">
              <i class="bi bi-star-fill me-1" v-for="n in 5" :key="n"></i>
            </div>
            <div class="depo-text mb-3 text-center fs-5 fst-italic">"{{ depo.texto }}"</div>
            <div class="depo-nome fw-bold mb-1 text-center">{{ depo.nome }}</div>
            <div class="depo-data text-muted mb-0 text-center small">{{ depo.data }}</div>
            <span class="badge bg-warning text-dark position-absolute top-0 end-0 mt-2 me-2">Avaliação verificada</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const depoimentos = [
  { nome: 'Chrystian Lima', data: '5 de Novembro de 2024', texto: 'Comprei na BlackFriday e demorou muito chegar, porém tudo perfeito, a personalização com meu nome e número ficaram ótimas.' },
  { nome: 'João Pereira', data: '15 de Outubro de 2024', texto: 'Já comprei em várias vezes na BlackHype, a loja se destaca pelo compromisso com o cliente. Sempre recebi muita atenção no Suporte, Recomendo demais, Equipe Nota 10' },
  { nome: 'Amanda Valeriano', data: '28 de janeiro de 2025', texto: 'Camiseta de ótima qualidade! Pedi do Santos NEYMAR PRIME, Chegou em torno de 22 dias e bem embalada. Comprarei novamente!' },
  { nome: 'Thiago Soares', data: '10 de abril de 2025', texto: 'Comprei Recente e me Pediram para Avaliar, enfim Loja confiável, preços justos e qualidade top, chegou em 16 dias ÚTEIS' },
  { nome: 'Tadeu Fernandes', data: '22 de abril de 2025', texto: 'Rapaz, me surpreendi com a Beleza do Site e Anúncios. Os preços também são imbatíveis, Qualidade nem se fala, são tudo isso que divulgam mesmo, Estão de parabéns!' },
]
</script>

<style scoped>
.depoimentos {
  background: linear-gradient(120deg, #fffbe6 60%, #fff 100%);
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px rgba(24,24,27,0.06);
  padding: 2.5rem 0 2rem 0;
}
.depo-card {
  background: #fff;
  border: 2px solid #FFD60033;
  color: #18181b;
  min-height: 240px;
  box-shadow: 0 4px 24px rgba(24,24,27,0.08);
  transition: box-shadow 0.2s, border 0.2s;
  position: relative;
}
.depo-card:hover {
  box-shadow: 0 8px 32px rgba(24,24,27,0.14);
  border: 2px solid #FFD600;
}
.depo-nome {
  font-size: 1.1rem;
}
.depo-data {
  font-size: 0.95rem;
}
.depo-text {
  font-size: 1.15rem;
  font-style: italic;
}
.depo-stars i {
  font-size: 1.35rem;
}
.badge.bg-warning {
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 0.7rem;
  box-shadow: 0 1px 4px rgba(255,214,0,0.10);
}
</style> 