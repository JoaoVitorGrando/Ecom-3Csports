<template>
  <div v-if="show" class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">&times;</button>
      <div class="modal-body">
        <div class="modal-img">
          <img :src="getImage(produto.image_path)" :alt="produto.name" />
        </div>
        <div class="modal-info">
          <h2 class="modal-title">{{ produto.name }}</h2>
          <p class="modal-desc">{{ produto.description }}</p>
          <p class="modal-price">R$ {{ Number(produto.price).toFixed(2) }}</p>
          <p class="modal-stock">Estoque: <span>{{ produto.stock }}</span></p>
          <p class="modal-category">Categoria: <span>{{ produto.category?.name }}</span></p>
          <div class="modal-actions">
            <button class="btn btn-success" @click="$emit('add-to-cart', produto)"><i class="bi bi-cart-plus"></i> Adicionar ao carrinho</button>
            <button class="btn btn-outline-secondary" @click="close">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  produto: { type: Object, required: true },
  show: { type: Boolean, default: false }
})
const emit = defineEmits(['close', 'add-to-cart'])
function close() {
  emit('close')
}
function getImage(path) {
  if (!path) return '/default-product.png'
  if (path.startsWith('http')) return path
  return 'http://35.196.79.227:8000' + path
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.45);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.modal-content {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  max-width: 700px;
  width: 95vw;
  padding: 2.2rem 2rem 1.5rem 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.2s;
}
@keyframes slideIn {
  from { transform: translateY(40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.close-btn {
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  font-size: 2.1rem;
  color: #888;
  cursor: pointer;
  z-index: 2;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #d00;
}
.modal-body {
  display: flex;
  gap: 2.2rem;
  align-items: flex-start;
}
.modal-img img {
  width: 220px;
  height: 220px;
  object-fit: cover;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  background: #f8f8f8;
}
.modal-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.modal-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
}
.modal-desc {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 0.7rem;
}
.modal-price {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--color-primary, #198754);
  margin-bottom: 0.5rem;
}
.modal-stock, .modal-category {
  font-size: 1.05rem;
  color: #666;
}
.modal-stock span, .modal-category span {
  font-weight: 600;
  color: #222;
}
.modal-actions {
  margin-top: 1.2rem;
  display: flex;
  gap: 1.1rem;
}
@media (max-width: 700px) {
  .modal-content {
    padding: 1.1rem 0.5rem 1rem 0.5rem;
    max-width: 98vw;
  }
  .modal-body {
    flex-direction: column;
    gap: 1.1rem;
    align-items: center;
  }
  .modal-img img {
    width: 100%;
    height: 180px;
  }
  .modal-title {
    font-size: 1.3rem;
  }
}
</style> 