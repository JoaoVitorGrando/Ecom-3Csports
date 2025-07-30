import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

export function showToast(message, type = 'success') {
  let background = '#22c55e' // verde padrão para sucesso
  if (type === 'error') background = '#dc2626' // vermelho para erro/acesso negado
  else if (type === 'warning') background = '#FFD600' // amarelo para aviso

  Toastify({
    text: message,
    duration: 3200,
    gravity: 'bottom',
    position: 'right',
    className: `sop-toasty sop-toasty-${type}`,
    style: {
      background,
      color: type === 'warning' ? '#18181b' : '#fff',
      border: 'none',
      borderRadius: '14px',
      fontSize: '1rem',
      fontWeight: 600,
      padding: '0.7rem 1.5rem',
      boxShadow: '0 4px 24px rgba(37,99,235,0.10)',
      minWidth: '180px',
      maxWidth: '90vw',
      textAlign: 'center',
      letterSpacing: '0.01em',
      zIndex: 9999
    },
    stopOnFocus: true
  }).showToast()
} 