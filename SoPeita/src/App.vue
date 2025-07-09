<template>
  <div class="app-container">
    <Header />
    <main class="w-100 p-0 m-0">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  padding: 0;
}
main {
  flex: 1;
  padding: 0;
  background: #fafafa;
  width: 100%;
  margin: 0;
}
</style>