<template>
  <footer class="footer-minimal">
    <div class="footer-container">
      <div class="footer-brand-minimal">3C <span class="text-amarelo">sports</span> &copy; 2024</div>
      <div class="footer-links-minimal">
        <a href="#produtos" class="footer-link-minimal">Times</a>
        <a href="#" class="footer-link-minimal">Promoções</a>
        <a href="#" class="footer-link-minimal">Contato</a>
      </div>
      <div class="footer-social-minimal">
        <a href="#" class="social-link-minimal" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
        <a href="#" class="social-link-minimal" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
        <a href="#" class="social-link-minimal" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer-minimal {
  background: #fff;
  color: #18181b;
  border-top: 1px solid #ececec;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  font-size: 0.98rem;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.02);
  padding: 24px 0 18px 0;
}
.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 0 1.5rem;
}
.footer-brand-minimal {
  font-size: 1.08rem;
  letter-spacing: -0.01em;
  color: #18181b;
  font-weight: 700;
}
.footer-links-minimal {
  display: flex;
  gap: 18px;
}
.footer-link-minimal {
  color: #18181b;
  text-decoration: none;
  font-weight: 500;
  opacity: 0.85;
  transition: color 0.2s, opacity 0.2s;
  font-size: 0.97rem;
}
.footer-link-minimal:hover {
  color: #FFD600;
  opacity: 1;
}
.footer-social-minimal {
  display: flex;
  gap: 10px;
}
.social-link-minimal {
  color: #18181b;
  text-decoration: none;
  font-size: 1.13rem;
  opacity: 0.8;
  transition: color 0.2s, opacity 0.2s;
  padding: 4px;
  border-radius: 50%;
}
.social-link-minimal:hover {
  color: #FFD600;
  opacity: 1;
  background: #18181b08;
}
.text-amarelo {
  color: #FFD600;
}
@media (max-width: 700px) {
  .footer-minimal {
    font-size: 0.93rem;
    padding: 18px 0 !important;
  }
  .footer-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 0 0.7rem;
  }
  .footer-brand-minimal {
    font-size: 0.97rem;
  }
  .footer-links-minimal {
    gap: 10px;
  }
  .footer-link-minimal {
    font-size: 0.91rem;
  }
  .footer-social-minimal {
    gap: 6px;
  }
  .social-link-minimal {
    font-size: 1rem;
    padding: 2px;
  }
}
</style> 