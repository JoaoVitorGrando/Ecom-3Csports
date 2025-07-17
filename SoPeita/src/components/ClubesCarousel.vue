<template>
  <div class="clubes-carousel-section py-4 mb-5">
    <div class="clubes-carousel-wrapper position-relative">
      <div class="clubes-carousel" ref="carousel">
        <div class="clube-item text-center" v-for="clube in clubesToShow" :key="clube.nome">
          <img :src="clube.escudo" :alt="clube.nome" class="clube-escudo-only" />
        </div>
      </div>
      <button class="carousel-arrow right" @click="scrollRight" aria-label="Próximo"><i class="bi bi-chevron-right"></i></button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ clubes: { type: Array, default: undefined } })
const clubesMock = [
  // Brasileiros
  { nome: 'Flamengo', escudo: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Clube_de_Regatas_do_Flamengo_logo.svg' },
  { nome: 'Corinthians', escudo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Corinthians_logo.svg' },
  { nome: 'Palmeiras', escudo: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg' },
  { nome: 'São Paulo', escudo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Sao_Paulo_FC_crest.svg' },
  { nome: 'Santos', escudo: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Santos_logo.svg' },
  { nome: 'Vasco', escudo: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/CR_Vasco_da_Gama_logo.svg' },
  { nome: 'Grêmio', escudo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Gremio_logo.svg' },
  { nome: 'Internacional', escudo: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/SC_Internacional_logo.svg' },
  { nome: 'Cruzeiro', escudo: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Cruzeiro_Esporte_Clube_%28logo%29.svg' },
  { nome: 'Atlético Mineiro', escudo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Clube_Atl%C3%A9tico_Mineiro_logo.svg' },
  { nome: 'Bahia', escudo: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Esporte_Clube_Bahia_logo.svg' },
  { nome: 'Botafogo', escudo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Botafogo_de_Futebol_e_Regatas_logo.svg' },
  { nome: 'Fortaleza', escudo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Escudo_Fortaleza_EC.png' },
  { nome: 'Athletico Paranaense', escudo: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Club_Athletico_Paranaense_2019.png' },
  { nome: 'Fluminense', escudo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Fluminense_FC_escudo.png' },
  // Europeus famosos
  { nome: 'Real Madrid', escudo: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Real_Madrid_CF.svg' },
  { nome: 'Barcelona', escudo: 'https://upload.wikimedia.org/wikipedia/commons/4/47/FC_Barcelona_%28crest%29.svg' },
  { nome: 'Manchester United', escudo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Manchester_United_FC_crest.svg' },
  { nome: 'Liverpool', escudo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg' },
  { nome: 'Chelsea', escudo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg' },
  { nome: 'Bayern de Munique', escudo: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/FC_Bayern_München_logo_%282017%29.svg' },
  { nome: 'Borussia Dortmund', escudo: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg' },
  { nome: 'Juventus', escudo: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_logo.svg' },
  { nome: 'PSG', escudo: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg' },
  { nome: 'Milan', escudo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg' },
  { nome: 'Inter de Milão', escudo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg' },
  { nome: 'Manchester City', escudo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg' },
  { nome: 'Arsenal', escudo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg' },
  { nome: 'Tottenham', escudo: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg' },
  { nome: 'Ajax', escudo: 'https://upload.wikimedia.org/wikipedia/en/7/79/Ajax_Amsterdam.svg' },
  { nome: 'Porto', escudo: 'https://upload.wikimedia.org/wikipedia/en/f/f1/FC_Porto.svg' },
  { nome: 'Benfica', escudo: 'https://upload.wikimedia.org/wikipedia/en/8/81/SL_Benfica_logo.svg' },
  { nome: 'Sporting', escudo: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Sporting_CP_logo.svg' },
  { nome: 'PSV', escudo: 'https://upload.wikimedia.org/wikipedia/en/8/81/PSV_Eindhoven.svg' },
  { nome: 'Roma', escudo: 'https://upload.wikimedia.org/wikipedia/en/f/f7/AS_Roma_logo.svg' },
  { nome: 'Napoli', escudo: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/SSC_Napoli.svg' },
  { nome: 'Lazio', escudo: 'https://upload.wikimedia.org/wikipedia/en/5/5c/SS_Lazio_badge.svg' },
  { nome: 'Sevilla', escudo: 'https://upload.wikimedia.org/wikipedia/en/3/3c/Sevilla_FC_logo.svg' },
  { nome: 'Valencia', escudo: 'https://upload.wikimedia.org/wikipedia/en/c/ce/Valenciacf.svg' },
  { nome: 'Villarreal', escudo: 'https://upload.wikimedia.org/wikipedia/en/7/70/Villarreal_CF_logo.svg' },
]
const clubesToShow = computed(() => Array.isArray(props.clubes) && props.clubes.length > 0 ? props.clubes : clubesMock)
const carousel = ref(null)
function scrollRight() {
  if (carousel.value) carousel.value.scrollLeft += 260
}
</script>

<style scoped>
.clubes-carousel-section {
  background: transparent;
  border-radius: 0;
  box-shadow: none;
}
.clubes-carousel-wrapper {
  position: relative;
  width: 100%;
  padding: 0 36px;
  overflow: visible;
}
.clubes-carousel {
  display: flex;
  overflow-x: auto;
  overflow-y: visible;
  scroll-behavior: smooth;
  gap: 1.2rem;
  padding-bottom: 8px;
  min-width: 900px;
}
.clube-item {
  min-width: 90px;
  max-width: 110px;
  height: 90px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  padding: 10px 0;
  position: relative;
}
.clube-escudo-only {
  width: 64px;
  height: 64px;
  object-fit: contain;
  background: transparent;
  border-radius: 0;
  border: none;
  box-shadow: none;
  transition: transform 0.18s cubic-bezier(.4,2,.3,1);
  cursor: pointer;
  padding: 0;
  margin: 0 auto;
  display: block;
}
.clube-escudo-only:hover {
  transform: scale(1.12);
}
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #18181b;
  color: #FFD600;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  z-index: 2;
  transition: background 0.2s, color 0.2s;
  box-shadow: 0 2px 8px rgba(24,24,27,0.10);
}
.carousel-arrow.left { left: 0; }
.carousel-arrow.right { right: 0; }
.carousel-arrow:hover {
  background: #FFD600;
  color: #18181b;
}
@media (max-width: 700px) {
  .clube-item { min-width: 60px; max-width: 70px; }
  .clubes-carousel-wrapper { padding: 0 8px; }
  .clube-escudo-only { width: 40px; height: 40px; }
}
</style> 