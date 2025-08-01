<template>
  <section class="clubes-carousel-section">
    <h2 class="clubes-title">Qual o seu time do coração?</h2>
    <div class="clubes-carousel-wrapper">
      <button class="carousel-arrow left" @click="scrollLeft" aria-label="Anterior">
        <span>&#10094;</span>
      </button>
      <div class="clubes-carousel" ref="carousel">
        <div class="clube-item" v-for="clube in clubesToShow" :key="clube.nome" @click="goToClube(clube)">
          <img :src="clube.escudo" :alt="clube.nome" class="clube-escudo-only" />
        </div>
      </div>
      <button class="carousel-arrow right" @click="scrollRight" aria-label="Próximo">
        <span>&#10095;</span>
      </button>
    </div>
  </section>
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
const router = useRouter()
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
  margin-top: 3.5rem;
  margin-bottom: 2.5rem;
  padding: 0 0 0.5rem 0;
}
.clubes-title {
  font-size: 1.45rem;
  font-weight: 700;
  color: #18181b;
  text-align: center;
  margin-bottom: 2.2rem;
  letter-spacing: -0.01em;
}
.clubes-carousel-wrapper {
  position: relative;
  width: 100%;
  padding: 0 36px;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
}
.clubes-carousel {
  display: flex;
  overflow-x: auto;
  overflow-y: visible;
  scroll-behavior: smooth;
  gap: 1.2rem;
  padding-bottom: 8px;
  min-width: 900px;
  scrollbar-width: none;
}
.clubes-carousel::-webkit-scrollbar {
  display: none;
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
  cursor: pointer;
  transition: transform 0.18s cubic-bezier(.4,2,.3,1);
}
.clube-item:hover .clube-escudo-only {
  transform: scale(1.12);
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
  padding: 0;
  margin: 0 auto;
  display: block;
}
.carousel-arrow {
  background: #fff;
  color: #18181b;
  border: 2px solid #e1e5e9;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.7rem;
  cursor: pointer;
  z-index: 2;
  transition: background 0.2s, color 0.2s, border 0.2s;
  box-shadow: 0 2px 8px rgba(24,24,27,0.08);
  outline: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.carousel-arrow.left { left: 0; }
.carousel-arrow.right { right: 0; }
.carousel-arrow:hover, .carousel-arrow:focus {
  background: #f5f5f5;
  color: #18181b;
  border-color: #bdbdbd;
}
@media (max-width: 1100px) {
  .clubes-carousel {
    min-width: 100%;
  }
}
@media (max-width: 700px) {
  .clubes-title {
    font-size: 1.1rem;
    margin-bottom: 1.2rem;
  }
  .clubes-carousel-wrapper { padding: 0 8px; }
  .clube-item { min-width: 60px; max-width: 70px; }
  .clube-escudo-only { width: 60px; height: 60px; }
  .carousel-arrow {
    width: 32px;
    height: 32px;
    font-size: 1.2rem;
  }
}
</style> 