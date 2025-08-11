<template>
  <section class="depoimentos">
    <h2 class="depo-title">O que falam sobre nós</h2>
    <div class="depoimentos-grid">
      <!-- Loop de depoimentos -->
      <div class="depo-card" v-for="depo in depoimentos" :key="depo.nome">
        <div class="depo-stars">
          <i class="bi bi-star-fill" v-for="n in 5" :key="n"></i>
        </div>
        <div class="depo-text">"{{ depo.texto }}"</div>
        <div class="depo-nome">{{ depo.nome }}</div>
        <div class="depo-data">{{ depo.data }}</div>
        <span class="depo-badge">Avaliação verificada</span>
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
.depo-title {
  font-weight: 700;
  font-size: 3rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #18181b;
}
.depoimentos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  justify-content: center;
  align-items: stretch;
  padding: 0 1.5rem;
}
.depo-card {
  background: #fff;
  border: 2px solid #FFD60033;
  color: #18181b;
  min-height: 240px;
  box-shadow: 0 4px 24px rgba(24,24,27,0.08);
  border-radius: 1rem;
  padding: 2rem 1.2rem 1.2rem 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  transition: box-shadow 0.2s, border 0.2s;
}
.depo-card:hover {
  box-shadow: 0 8px 32px rgba(24,24,27,0.14);
  border: 2px solid #FFD600;
}
.depo-stars {
  color: #FFD600;
  margin-bottom: 0.7rem;
  font-size: 1.35rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}
.depo-text {
  font-size: 1.15rem;
  font-style: italic;
  text-align: center;
  margin-bottom: 1.1rem;
}
.depo-nome {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  text-align: center;
}
.depo-data {
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 0.2rem;
  text-align: center;
}
.depo-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #fffbe6;
  color: #bfa900;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 0.7rem;
  box-shadow: 0 1px 4px rgba(255,214,0,0.10);
  padding: 4px 12px;
  border: 1px solid #FFD60033;
}
@media (max-width: 700px) {
  .depo-title {
    font-size: 1.3rem;
  }
  .depoimentos-grid {
    grid-template-columns: 1fr;
    gap: 1.2rem;
    padding: 0 0.5rem;
  }
  .depo-card {
    padding: 1.2rem 0.7rem 0.7rem 0.7rem;
  }
}
</style> 