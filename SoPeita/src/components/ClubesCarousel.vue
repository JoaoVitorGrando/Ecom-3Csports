<template>
  <div class="clubes-carousel-section py-4 mb-5">
    <div class="clubes-carousel-wrapper position-relative">
      <button class="carousel-arrow left arrow-no-bg" @click="scrollLeft" aria-label="Anterior"><i class="bi bi-arrow-left-circle"></i></button>
      <div class="clubes-carousel" ref="carousel">
        <div class="clube-item text-center" v-for="clube in clubesToShow" :key="clube.nome" @click="goToClube(clube)" style="cursor:pointer;">
          <img :src="clube.escudo" :alt="clube.nome" class="clube-escudo-only" />
        </div>
      </div>
      <button class="carousel-arrow right arrow-no-bg" @click="scrollRight" aria-label="Próximo"><i class="bi bi-arrow-right-circle"></i></button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import bahia from '../assets/bahia.png'
import corinthians from '../assets/corinthians.png'
import atleticoMineiro from '../assets/atletico-mineiro.png'
import saoPaulo from '../assets/sao-paulo.png'
import flamengo from '../assets/flamengo.png'
import gremio from '../assets/gremio.png'
import fluminense from '../assets/fluminense.png'
import cruzeiro from '../assets/cruzeiro.png'
import internacional from '../assets/internacional.png'
import vasco from '../assets/vasco-da-gama.png'
import palmeiras from '../assets/palmeiras.png'
import santos from '../assets/santos.png'
import botafogo from '../assets/botafogo.png'
const props = defineProps({ clubes: { type: Array, default: undefined } })
const clubesMock = [
  { nome: 'Flamengo', escudo: flamengo },
  { nome: 'Corinthians', escudo: corinthians },
  { nome: 'Palmeiras', escudo: palmeiras },
  { nome: 'São Paulo', escudo: saoPaulo },
  { nome: 'Santos', escudo: santos },
  { nome: 'Vasco', escudo: vasco },
  { nome: 'Grêmio', escudo: gremio },
  { nome: 'Internacional', escudo: internacional },
  { nome: 'Cruzeiro', escudo: cruzeiro },
  { nome: 'Atlético Mineiro', escudo: atleticoMineiro },
  { nome: 'Bahia', escudo: bahia },
  { nome: 'Botafogo', escudo: botafogo },
  { nome: 'Fluminense', escudo: fluminense },
]
const clubesToShow = computed(() => Array.isArray(props.clubes) && props.clubes.length > 0 ? props.clubes : clubesMock)
const carousel = ref(null)
function scrollRight() {
  if (carousel.value) carousel.value.scrollLeft += 260
}
function scrollLeft() {
  if (carousel.value) carousel.value.scrollLeft -= 260
}
function goToClube(clube) {
  router.push({ name: 'produtos', query: { categoria: clube.nome } })
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
  scrollbar-width: none; /* Firefox */
}
.clubes-carousel::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
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
  width: 90px;
  height: 90px;
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
/* Nova classe para seta sem fundo */
.arrow-no-bg {
  background: transparent !important;
  color: #18181b !important;
  border: none !important;
  box-shadow: none !important;
  transition: color 0.2s;
}
.arrow-no-bg:hover {
  color: #FFD600 !important;
  background: transparent !important;
}
@media (max-width: 700px) {
  .clube-item { min-width: 60px; max-width: 70px; }
  .clubes-carousel-wrapper { padding: 0 8px; }
  .clube-escudo-only { width: 60px; height: 60px; }
}
</style> 