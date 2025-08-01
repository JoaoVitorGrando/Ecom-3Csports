<template>
  <div class="custom-carousel">
    <div class="carousel-inner">
      <div
        v-for="(banner, idx) in banners"
        :key="idx"
        class="carousel-item"
        :class="{ active: idx === current }"
      >
        <img :src="banner" class="banner-img" :alt="'Banner ' + (idx+1)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import banner1 from '../assets/banner1.png'
import banner2 from '../assets/banner2.png'
import banner4carrose from '../assets/banner4carrose.png'

const banners = [banner1, banner2, banner4carrose]
const current = ref(0)
let interval = null

function nextSlide() {
  current.value = (current.value + 1) % banners.length
}
function startAuto() {
  interval = setInterval(() => {
    nextSlide()
  }, 5000)
}
function stopAuto() {
  if (interval) clearInterval(interval)
}
onMounted(() => {
  startAuto()
})
onUnmounted(() => {
  stopAuto()
})
</script>

<style scoped>
.custom-carousel {
  width: 100%;
  position: relative;
  overflow: hidden;
}
.carousel-inner {
  position: relative;
  width: 100%;
  height: 340px;
}
.carousel-item {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  opacity: 0;
  transition: opacity 0.7s cubic-bezier(.4,2,.3,1);
  z-index: 1;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.carousel-item.active {
  opacity: 1;
  z-index: 2;
  pointer-events: auto;
}
.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  display: block;
}
@media (max-width: 700px) {
  .carousel-inner {
    height: 160px;
  }
  .carousel-item {
    height: 160px;
  }
  .banner-img {
    border-radius: 10px;
  }
}
</style> 