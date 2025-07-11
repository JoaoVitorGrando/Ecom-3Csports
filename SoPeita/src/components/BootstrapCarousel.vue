<template>
  <div id="mainCarousel" class="carousel slide carousel-fade mb-5" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
    </div>
    <div class="carousel-inner rounded-4 shadow">
      <div class="carousel-item active">
        <img :src="banner1" class="d-block w-100 img-fluid banner-img" alt="Nova Coleção 2024">
        <div class="carousel-caption custom-caption">
          <div class="caption-content">
            <h2 class="caption-title">Nova Coleção</h2>
            <p class="caption-desc">2024 chegou!</p>
          </div>
        </div>
      </div>
      <div class="carousel-item">
        <img :src="banner2" class="d-block w-100 img-fluid banner-img" alt="Frete grátis nas compras acima de R$199">
        <div class="carousel-caption custom-caption">
          <div class="caption-content">
            <h2 class="caption-title">Frete Grátis</h2>
            <p class="caption-desc">Acima de R$ 199</p>
          </div>
        </div>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide-to="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Anterior</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide-to="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Próximo</span>
    </button>
  </div>
</template>

<script setup>
import banner1 from '../assets/banner1.png'
import banner2 from '../assets/banner2.png'
// Nenhuma lógica JS necessária, Bootstrap faz tudo
</script>

<style scoped>
.banner-img {
  width: 100%;
  max-width: 100%;
  height: 340px;
  object-fit: cover;
  background: var(--color-bg);
  transition: background 0.1s;
  display: block;
  margin: 0 auto;
}
.custom-caption {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(34,34,34,0.18);
  border-radius: 2rem;
  color: #fff;
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
  transition: background 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0.7rem 2.2rem 0 2.2rem;
}
.caption-content {
  margin-top: 0.2rem;
  margin-left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.caption-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
  text-align: center;
}
.caption-desc {
  font-size: 1rem;
  font-weight: 400;
  opacity: 0.85;
  margin-bottom: 0;
  text-shadow: 0 2px 8px rgba(0,0,0,0.13);
  text-align: center;
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
@media (max-width: 700px) {
  .banner-img {
    height: 160px;
  }
  .custom-caption {
    padding: 0.2rem 0.2rem 0 0.2rem;
    border-radius: 1rem;
  }
  .caption-title {
    font-size: 1rem;
    margin-bottom: 0.1rem;
  }
  .caption-desc {
    font-size: 0.8rem;
    margin-bottom: 0.2rem;
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