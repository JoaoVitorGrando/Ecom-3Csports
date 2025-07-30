<template>
  <div>
    <Header v-if="!isAuthPage" />
    <router-view />
    <Footer v-if="!isAuthPage" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
const isAuthPage = computed(() => route.path === '/login' || route.path === '/register')
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