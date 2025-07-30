<template>
  <section class="vantagens py-5">
    <div class="container">
      <div class="row justify-content-center gap-4">
        <div class="col-12 col-md-3 text-center" v-for="vant in vantagens" :key="vant.titulo">
          <div class="vant-card p-4 rounded-4 shadow-sm h-100">
            <div class="vant-icon mb-2">
              <i :class="vant.icone" style="font-size:2.2rem;color:#FFD600;"></i>
            </div>
            <div class="vant-titulo fw-bold mb-1">{{ vant.titulo }}</div>
            <div class="vant-desc text-muted">{{ vant.desc }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const vantagens = [
  { titulo: 'Entrega Garantida', desc: 'Loja referência no mercado.', icone: 'bi bi-truck' },
  { titulo: 'Pagamento Seguro', desc: 'Aceitamos Cartão ou PIX.', icone: 'bi bi-shield-lock' },
  { titulo: 'Suporte ao Cliente', desc: 'Atendimento Seg. a Sex. 9:00h às 18:00h', icone: 'bi bi-headset' },
  { titulo: 'Cliente Satisfeito', desc: 'Garantia de compra ou seu dinheiro de volta!', icone: 'bi bi-emoji-smile' },
]
</script>

<style scoped>
.vant-card {
  background: #fff;
  border: 1px solid #ffe082;
  color: #18181b;
  min-height: 180px;
}
.vant-titulo {
  font-size: 1.1rem;
}
.vant-desc {
  font-size: 0.98rem;
}
</style> 