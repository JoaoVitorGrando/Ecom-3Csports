<template>
  <div id="mainCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
    <div class="carousel-indicators">
      <button v-for="(banner, idx) in banners" :key="idx" type="button" :data-bs-target="'#mainCarousel'" :data-bs-slide-to="idx" :class="{active: idx === 0}" :aria-current="idx === 0 ? 'true' : undefined" :aria-label="'Slide ' + (idx+1)"></button>
    </div>
    <div class="carousel-inner rounded-4 shadow banner-carousel-fixed">
      <div v-for="(banner, idx) in banners" :key="idx" class="carousel-item" :class="{active: idx === 0}">
        <img :src="banner" class="d-block w-100 img-fluid banner-img" :alt="'Banner ' + (idx+1)">
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Anterior</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Próximo</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import banner1 from '../assets/banner1.png'
import banner2 from '../assets/banner2.png'
import banner4carrose from '../assets/banner4carrose.png'
import { Carousel } from 'bootstrap'

const banners = [banner1, banner2, banner4carrose]

onMounted(() => {
  const el = document.getElementById('mainCarousel')
  if (el) {
    new Carousel(el, {
      interval: 5000,
      ride: 'carousel',
      wrap: true,
      pause: false
    })
  }
})
function logSeta(tipo) {
  console.log('Seta clicada:', tipo)
}
// Nenhuma lógica JS necessária, Bootstrap faz tudo
</script>

<style scoped>
.carousel-inner.banner-carousel-fixed {
  height: 340px;
}
.carousel-item {
  height: 340px;
  position: relative;
}
.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  margin: 0 auto;
  transition: none !important;
}
.carousel-btn-fixed {
  position: absolute;
  left: 50%;
  bottom: 2.2rem;
  transform: translateX(-50%);
  z-index: 10;
  min-width: 150px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0,0,0,0.13);
  font-size: 1.1rem;
  padding: 0.7rem 1.6rem;
}
.carousel-control-prev, .carousel-control-next {
  width: 60px;
  height: 100%;
  top: 0;
  bottom: 0;
  opacity: 0.85;
  transition: opacity 0.18s;
  z-index: 20;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.carousel-control-prev:hover, .carousel-control-next:hover {
  opacity: 1;
  background: rgba(34,34,34,0.08);
}
.carousel-control-prev-icon, .carousel-control-next-icon {
  width: 2.5rem;
  height: 2.5rem;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.13));
}
@media (max-width: 700px) {
  .carousel-inner.banner-carousel-fixed {
    height: 160px;
  }
  .carousel-item {
    height: 160px;
  }
  .banner-img {
    height: 100%;
  }
  .carousel-btn-fixed {
    bottom: 0.4rem;
    left: 50%;
    transform: translateX(-50%);
    min-width: 90px;
    font-size: 0.85rem;
    padding: 0.4rem 0.7rem;
    max-width: 90vw;
    white-space: normal;
  }
}
</style> 